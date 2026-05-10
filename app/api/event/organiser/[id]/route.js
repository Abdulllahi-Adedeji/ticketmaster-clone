import pool from "../../../../lib/db";
async function getOrganiserEvents(organiserID){
    try{
        const [organiser] = await pool.execute(
            "SELECT UserID FROM Users WHERE UserID =? AND UserType = 'organiser'",
            [organiser]
        );

        if(organiser.length === 0){
            return {success :false, message:"Organiser not found.", status:404};
        }

        const[events] = await pool.execute(
            `SELECT EventID, Name, Description, Location, Venue, Genre, ImgURL, Date, Cpacity, Price, Status, CreatedAt
            FROM Events
            WHERE OrganiserID=?
            ORDER BY Date DESC`,
            [organiserID]
        );
        return {success:true, events};
    } catch(err){
        throw err;
    }
    }
export async function GET(request, {params} ) {
    try{
        const { id } = await params;
        if(!id){
            return Response.json({error: "Organiser ID is required."}, {status: 400});
        }
        const result = await getOrganiserEvents(id);
        if(!result.success){
            return Ressponse.json({ message: result.message}, {status: result.status || 400});
        }
        return Response.json({
            success:true,
            events :result.events,},
            {status: 200});
            
    }catch(err){
        return Response.json(
            {error: "Internal server error occured, please try again."},
            {status:500}
        );
    }
    
}