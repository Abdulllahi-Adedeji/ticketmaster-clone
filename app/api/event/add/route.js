import pool from "../../../lib/db";
import { validateEvent, sanitizeEvent } from "../../../lib/validation";

async function addEvent(cleanData) {
    try {
        // check if organiser exists
        const [organiser] = await pool.execute(
            "SELECT UserID FROM Users WHERE UserID = ? AND UserType = 'organiser'",
            [cleanData.organiserID]
        );

        if (organiser.length === 0) {
            return { success: false, message: "Organiser not found." };
        }

        // check if event already exists
        const [existing] = await pool.execute(
            "SELECT EventID FROM Events WHERE Name = ? AND Date = ? AND Venue = ?",
            [cleanData.name, cleanData.date, cleanData.venue]
        );

        if (existing.length > 0) {
            return { success: false, message: "An event with that name, date and venue already exists.", status: 409 };
        }

        // insert event
        const [newEvent] = await pool.execute(
            `INSERT INTO Events (OrganiserID, Name, Description, Location, Venue, Genre, ImgURL, Date, Capacity, Price, Status, CreatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW())`,
            [
                cleanData.organiserID,
                cleanData.name,
                cleanData.description,
                cleanData.location,
                cleanData.venue,
                cleanData.genre,
                cleanData.imgURL,
                cleanData.date,
                cleanData.capacity,
                cleanData.price,
            ]
        );

        return { success: true, eventID: newEvent.insertId };

    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return {success: false, message: "An event with that name already exists.", status: 409 };
        }
        throw err;
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        const validationCheck = validateEvent(body);
        if (!validationCheck.isValid) {
            return Response.json({
                errors: validationCheck.errors,
                values: body,
            }, { status: 400 });
        }

        const cleanData = sanitizeEvent(body);
        const result = await addEvent(cleanData);

        if (!result.success) {
            return Response.json(
                { message: result.message },
                { status: result.status || 400 }
            );
        }

        return Response.json({
            success: true,
            message: "Event successfully created.",
            eventID: result.eventID,
        }, { status: 201 });

    } catch (err) {
        console.error(err);
        return Response.json(
            { error: "Internal server error occurred, please try again." },
            { status: 500 }
        );
    }
}