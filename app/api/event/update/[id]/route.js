import pool from "../../../../lib/db";
import { validateEventUpdate, sanitizeEventUpdate } from "../../../../lib/validation";

async function updateEvent(id, cleanData) {

    try {

        //updates selected event using event id
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

        //gets event id from route parameters
        const { id } = params;
        
        const body = await request.json();

        //validates the input fields
        const validationCheck = validateEventUpdate(body);

        if (!validationCheck.isValid) {

            return Response.json({
                errors: validationCheck.errors,
                values: body,
            }, { status: 400 });

        }

        //sanitizes the event input data
        const cleanData = sanitizeEventUpdate(body);

        //updates event in database
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