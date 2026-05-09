import pool from "../../../lib/db";

async function deleteEvent(eventID) {
    try {
        const [rows] = await pool.execute(
            "SELECT EventID FROM Events WHERE EventID = ?",
            [eventID]
        );

        // event does not exist
        if (rows.length === 0) {
            return { success: false, message: "Event not found." };
        }

        // delete event
        await pool.execute(
            "DELETE FROM Events WHERE EventID = ?",
            [eventID]
        );

        return { success: true };

    } catch (err) {
        throw err;
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        if (!id) {
            return Response.json(
                { error: "Event ID is required." },
                { status: 400 }
            );
        }

        const result = await deleteEvent(id);

        if (!result.success) {
            return Response.json(
                { message: result.message },
                { status: 404 }
            );
        }

        return Response.json({
            success: true,
            message: "Event successfully deleted.",
        }, { status: 200 });

    } catch (err) {
        console.error(err);
        return Response.json(
            { error: "Internal server error occurred, please try again." },
            { status: 500 }
        );
    }
}