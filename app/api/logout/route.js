import { cookies } from "next/headers";

export async function POST() {

    try {

        //gets all stored cookies
        const cookieStore = await cookies();

        //removes session cookie to log user out
        cookieStore.delete("session");

        return Response.json({
            success: true,
            message: "Successfully logged out."
        }, { status: 200 });

    } catch (err) {

        console.error(err);

        return Response.json(
            { error: "Internal server error occurred." },
            { status: 500 }
        );
    }
}