import pool from "../../lib/db";
async function createBooking(userID, eventID) {
    try{
        const [user] = await pool.execute(
            "SELECT UserID FROM Users WHERE UserID =? AND UserType ='attendee'",
            [userID]
        );
        if(user.length === 0){
            return {success:false, message :"Attendee not found.", status :404};
        }

        const[event] = await pool.execute(
            "SELECT EventID, Capacity, Status FROM Events WHERE EventID = ?",
            [eventID]
        );

        if(event.length ===0){
            return {success:false, message:"Event not found.", status:404};
        }

        if(event[0].Status  !== 'active'){
            return {success:false, message:"Event is not available for booking.", status:400};
        }

        const[[{count}]]= await pool.execute(
            "SELECT COUNT(*) as count FROM Bookings WHERE EventID =? AND Status = 'confirmed'",
            [eventID]
        );

        if(count >= event[0].Capacity){
            return {success: false, message :"Event is fully booked.",status:409};
     
        };

        // if a cancelled booking exists for this user+event, reactivate it
        const [existing] = await pool.execute(
            "SELECT BookingID FROM Bookings WHERE UserID=? AND EventID=? AND Status='cancelled'",
            [userID, eventID]
        );

        if (existing.length > 0) {
            await pool.execute(
                "UPDATE Bookings SET Status='confirmed', BookedAt=NOW() WHERE BookingID=?",
                [existing[0].BookingID]
            );
            return {success: true, bookingID: existing[0].BookingID};
        }

        // check for an existing confirmed booking
        const [confirmed] = await pool.execute(
            "SELECT BookingID FROM Bookings WHERE UserID=? AND EventID=? AND Status='confirmed'",
            [userID, eventID]
        );

        if (confirmed.length > 0) {
            return {success: false, message: "You have already booked this event.", status: 409};
        }

        const [result] = await pool.execute(
            "INSERT INTO Bookings(UserID, EventID, Status, BookedAt) VALUES (?,?, 'confirmed', NOW())",
            [userID, eventID]
        );

        return {success:true, bookingID: result.insertId};

    }
    catch(err){
        throw err;
    }
}
export async function POST(request) {
        try{
            const body = await request.json();

            const userID = parseInt(body.userID);
            const eventID = parseInt(body.eventID);

            if(!userID || !eventID){
                return Response.json(
                    {errors :{...(!userID && { userID: "User ID is required."}), ...(!eventID && { eventID: "Event ID is required "}) }},
                    {status :400}
                );
            }
        
        const result = await createBooking(userID, eventID);
        
        if(!result.success){
            return Response.json ({ message: result.message}, {status : result.status || 400});
        }

        return Response.json({
            success: true,
            message: "Booking confirmed",
            bookingID: result.bookingID,
        }, {status: 201});
    }
    catch(err){
        return Response.json(
            { error: "Internal server error occurred, please try again."},
            {status :500}
        );
    }
}


