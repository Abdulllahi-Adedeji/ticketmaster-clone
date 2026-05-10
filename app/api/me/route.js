import { cookies } from "next/headers";
import pool from "../../lib/db";

export async function GET() {
    const cookieStore = await cookies();
    const userID = cookieStore.get("session");

    if (!userID) {
        return Response.json({ loggedIn: false });
    }

    const [rows] =await pool.execute(
        "SELECT UserID, Username, UserType FROM Users WHERE UserID = ?",
        [userID.value]
    );

    if(rows.length === 0){
        return Response.json({ loggedIn :false});
    }

    return Response.json({ 
        loggedIn: true, 
        userID: rows[0].userID,
        username : rows[0].Username,
        role: rows[0].UserType,
     });
     
}