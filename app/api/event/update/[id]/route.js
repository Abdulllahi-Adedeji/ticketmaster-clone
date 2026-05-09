import pool from "../../../../lib/db";
import { validateEventUpdate, sanitizeEventUpdate } from "../../../../lib/validation";

async function updateEvent(id, cleanData) {

    try {

        await pool.execute(
            `
            UPDATE Events
            SET name = ?, location = ?, venue = ?, genre = ?, imgURL = ?, date = ?, capacity = ?, price = ?
            WHERE eventID = ?
            `,
            [
                cleanData.name,
                cleanData.location,
                cleanData.venue,
                cleanData.genre,
                cleanData.imgURL,
                cleanData.date,
                cleanData.capacity,
                cleanData.price,
                id
            ]
        );

        return {
            success: true
        };

    } catch (err) {

        throw err;

    }
}

export async function PUT(request, { params }) {

    try {

        const { id } = params;

        const body = await request.json();

        const validationCheck = validateEventUpdate(body);

        if (!validationCheck.isValid) {

            return Response.json({
                errors: validationCheck.errors,
                values: body,
            }, { status: 400 });

        }

        const cleanData = sanitizeEventUpdate(body);

        const result = await updateEvent(id, cleanData);

        return Response.json({
            success: result.success,
            message: "Event updated successfully."
        }, { status: 200 });

    } catch (err) {

        console.error(err);

        return Response.json(
            { error: "Internal server error occurred, please try again." },
            { status: 500 }
        );
    }
}