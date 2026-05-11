import pool from "../../lib/db";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const genre = searchParams.get("genre");

        let query = `
            SELECT e.EventID AS id, e.Name AS name, e.Description AS description,
                   e.Location AS location, e.Venue AS stadium, e.Genre AS genre,
                   e.ImgURL AS imgURL, e.Date AS date, e.Capacity AS capacity,
                   e.Price AS price, e.Status AS status,
                   COUNT(b.BookingID) AS bookedCount
            FROM Events e
            LEFT JOIN Bookings b ON b.EventID = e.EventID AND b.Status = 'confirmed'
        `;
        const params = [];

        if (genre) {
            query += " WHERE LOWER(e.Genre) = LOWER(?)";
            params.push(genre);
        }

        query += " GROUP BY e.EventID ORDER BY e.Date ASC";

        const [rows] = await pool.execute(query, params);
        return Response.json({ success: true, events: rows }, { status: 200 });
    } catch (err) {
        return Response.json({ error: "Internal server error occurred, please try again." }, { status: 500 });
    }
}
