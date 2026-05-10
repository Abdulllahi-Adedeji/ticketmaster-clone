import pool from "../../../lib/db";

async function cancelBooking(bookingID){
    try{
        const [rows] = await pool.execute(
            "SELECT BookingID, Status FROM Bookings WHERE BookingID =?",
            [bookingID]
        );

        if(rows.length === 0 ){
            return {success:false, message :"Booking not found.", status: 404};
        }
        if(rows[0].Status === 'cancelled' ){
            return {success:false, message :"Booking is already cancelled .", status: 400};
        }

        await pool.execute(
            "UPDATE Bookinga SET Status = 'cancelled' WHERE BookingID =?",
            [bookingID]
        );
        return {success : true};
    }
    catch(err){
        throw err;
    }
    }
export async function DELETE (request, {params}){
     try{
        const { id } = await params;

        if(!id){
            return Response.json({error: "Booking ID is required."}, {status :400});
        }
        const result = await cancelBooking(id);

        if(!result.success){
            return Response.json({ message :result.message}, {status :result.status || 400});
        }
        return Response.json({
            success:true,
            message: "Booking successfully cancelled.",},{status:200});
        
     }catch(err){
        return Response.json(
            {error : "Internal server error occured, please try again."},
            {status: 500}
        );
     }
}
