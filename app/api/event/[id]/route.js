import pool from "../../../lib/db";

export async function GET(_request, { params }) {
    try {
        const { id } = await params;
        const [rows] = await pool.execute(
            `SELECT e.EventID AS id, e.Name AS name, e.Description AS description,
                    e.Location AS location, e.Venue AS stadium, e.Genre AS genre,
                    e.ImgURL AS imgURL, e.Date AS date, e.Capacity AS capacity,
                    e.Price AS price, e.Status AS status,
                    COUNT(b.BookingID) AS bookedCount
             FROM Events e
             LEFT JOIN Bookings b ON b.EventID = e.EventID AND b.Status = 'confirmed'
             WHERE e.EventID = ?
             GROUP BY e.EventID`,
            [id]
        );
        if (rows.length === 0) {
            return Response.json({ error: "Event not found." }, { status: 404 });
        }
        return Response.json({ success: true, event: rows[0] }, { status: 200 });
    } catch (err) {
        return Response.json({ error: "Internal server error occurred, please try again." }, { status: 500 });
    }
}

async function deleteEvent(eventID) {
    try {
        const [rows] = await pool.execute(
            "SELECT EventID FROM Events WHERE EventID = ?",
            [eventID]
        );

        // event does not exist
        if (rows.length === 0) {
            return { success: false, message: "Event not found." };
        }

        // delete event
        await pool.execute(
            "DELETE FROM Events WHERE EventID = ?",
            [eventID]
        );

        return { success: true };

    } catch (err) {
        throw err;
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        if (!id) {
            return Response.json(
                { error: "Event ID is required." },
                { status: 400 }
            );
        }

        const result = await deleteEvent(id);

        if (!result.success) {
            return Response.json(
                { message: result.message },
                { status: 404 }
            );
        }

        return Response.json({
            success: true,
            message: "Event successfully deleted.",
        }, { status: 200 });

    } catch (err) {
        console.error(err);
        return Response.json(
            { error: "Internal server error occurred, please try again." },
            { status: 500 }
        );
    }
}