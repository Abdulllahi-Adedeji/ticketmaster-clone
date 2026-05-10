import { cookies } from "next/headers"

// this handles the DELETE requests for logging out
export async function DELETE() {
    try {

        // this accesses the user's cookies
        const cookieStore = await cookies();

        // this deletes the session cookie which logs out the user
        cookieStore.delete("session");

        return Response.json(
            {
                success: true,
                message: "Successfully logged out."
            }, 
            {status: 200}
        )

    } catch (err) {
        console.error(err)
        return Response.json(
            { error: "Internal server error occured, please try again." },
            { status: 500}
        )
    }
}