import pool from "../../../lib/db";

async function searchEvents(query){
    
    try{

        const[rows] = await pool.execute(
            `
            SELECT
                organiserID,
                name,
                location,
                venue,
                genre,
                imgURL,
                date,
                capacity,
                price

            FROM Events
            WHERE name LIKE ?
            OR location LIKE ?
            OR venue LIKE ?
            OR genre LIKE ? 
            OR DATE_FORMAT(date, '%Y-%m-%d') LIKE ?
            `,
            [
                `%${query}%`,
                `%${query}%`,
                `%${query}%`,
                `%${query}%`,
                `%${query}%`
            ]
        );

        return {
            success: true,
            events: rows
        };
    } catch(err){
        throw err;
    }
}

export async function GET(request){

    try{
        const {searchParams} = new URL(request.url);
        const query = searchParams.get("query") || "";
        
        const result = await searchEvents(query);

        return Response.json({
            success: true,
            events: result.events
        }, {status: 200});
    }catch(err){

        console.error(err);

        return Response.json(
            {error:  "Internal server error occurred, please try again."},
            {status: 500}
        )
    }
}