import pool from "../../../lib/db"

async function deleteUser(userID) {
    try {
        const [rows] = await pool.execute(
            "SELECT UserID FROM Users WHERE UserID = ?",
            [userID]
        );

        // user does not exist
        if (rows.length === 0) {
            return { success: false, message: "User not found." };
        }

        // delete user
        await pool.execute(
            "DELETE FROM Users WHERE UserID = ?",
            [userID]
        );

        return { success: true };

    } catch (err) {
        throw err;
    }
}

export async function DELETE(request, { params }) {
    try {
        // get id from request
        const { id } = await params;

        // id not provided
        if (!id) {
            return Response.json(
                { error: "User ID is required." },
                { status: 400 }
            );
        }

        // delete user
        const result = await deleteUser(id);

        // error occurred
        if (!result.success) {
            console.log(result)
            return Response.json(
                { message: result.message },
                { status: 404 }
            );
        }

        return Response.json({
            success: true,
            message: "User successfully deleted.",
        }, { status: 200 });

    } catch (err) {
        console.error(err);
        return Response.json(
            { error: "Internal server error occurred, please try again." },
            { status: 500 }
        );
    }
}