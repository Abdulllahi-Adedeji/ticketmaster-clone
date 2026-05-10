import pool from "../../../lib/db";

//searches users using query inputs
async function searchUsers(query){
    try{
        //searches users by username, email and usertype fields
        const[rows] = await pool.execute(
            `SELECT userID, username, email, usertype
            FROM Users
            WHERE username LIKE ? 
            OR email LIKE ?
            OR usertype LIKE ? `,
            [
                `%${query}%`,
                `%${query}%`,
                `%${query}%`
            ]
        );
        //returns matching users
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
            //gets query parameter from url
            const {searchParams} = new URL(request.url);

            //stores either a query or empty string
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