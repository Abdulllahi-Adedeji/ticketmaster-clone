import pool from "../../../../lib/db";

async function searchUsers(query){
    try{
        const[rows] = await pool.execute(
            `SELECT UserID, Username, Email, UserType
            FROM Users
            WHERE Username LIKE ? 
            OR Email LIKE ?
            OR UserType LIKE ? `,
            [
                `%${query}%`,
                `%${query}%`,
                `%${query}%`
            ]
        );
        return {
            success: true,
            users: rows
        }; 
    } catch (err){

        throw err;

    }

}

export async function GET(request){
        try {
            const {searchParams} = new URL(request.url);
            const query = searchParams.get("query") || "";

            const result = await searchUsers(query);
            return Response.json({
                success:true,
                users: result.users
            }, {status: 200});
        } catch(err){
            console.error(err);

            return Response.json(
                {error: "Internal server error occurred, please try again."},
                {status: 500}
            );
        }
    }