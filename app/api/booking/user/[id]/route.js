import pool from "../../../../lib/db";

async function getUserBookings(userID) {
    try{
        const [user] = await pool.execute(
            "SELECT UserID FROM Users WHERE UserID =?",
            [userID]
        );

        if(user.length === 0){
            return {success :false, message: "User not found.", status :404};
        }

        const [bookings] = await pool.execute(
            `SELECT b.BookingID, b.Status, b.BookedAt, 
            e.EventID, e.Name, e.Location, e.Venue, e.Genre,
            e.ImgURL, e.Date, e.price, e.Status AS EventStatus
            FROM Bookings b
            JOIN Events e ON b.EventID = e.EventID
            WHERE b.UserID=?
            ORDER BY b.BookedAt DESC`,
            [userID]

        );
        return {success :true, bookings};

    }
    catch(err){
        throw err;
    }
    
}
export async function GET(request, {params}) {
    try{
        const { id } = await params;
        
        if(!id){
            return Response.json({error: "User ID is required."}, {status: 400});
        }
        const result = await getUserBookings(id);

        if(!result.success){
            return Response.json({message: result.message}, {status : result.status || 400});
        }

        return Response.json({
            success: true,
            bookings:result.bookings,},
            {status : 200}
        );
    } catch(err){
        return Response.json(
            {error: "Internal server error occured, please try again"},
            {status: 500}
        );
    }
}