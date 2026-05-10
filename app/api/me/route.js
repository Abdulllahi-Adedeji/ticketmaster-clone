import { cookies } from "next/headers";
import pool from "../../lib/db";

export async function GET() {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    if (!session) {
        return Response.json({ loggedIn: false });
    }

    const [rows] = await pool.execute(
        "SELECT username, email, usertype FROM Users WHERE userID = ?",
        [session.value]
    );

    if (!rows.length) return Response.json({ loggedIn: false });

    return Response.json({
        loggedIn: true,
        userID: session.value,
        name: rows[0].username,
        email: rows[0].email,
        usertype: rows[0].usertype,
    });
}