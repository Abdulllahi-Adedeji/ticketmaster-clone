import { cookies } from "next/headers";

export async function GET() {
    const cookieStore = await cookies();
    const userID = cookieStore.get("session");

    if (!userID) {
        return Response.json({ loggedIn: false });
    }

    return Response.json({ loggedIn: true, userID: userID.value });
}