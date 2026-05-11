import pool from "../../../../lib/db";
import { validateUserUpdate, sanitizeUserUpdate } from "../../../../lib/validation";

async function updateUser(id, cleanData) {
    try {
        //updates user details using user id
        await pool.execute(
            ` 
            UPDATE users
            SET Username = ?, Email = ?, UserType = ?
            WHERE UserID = ?
            `,
            [
                cleanData.username,
                cleanData.email,
                cleanData.usertype,
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

        //gets user id from route parameters
        const { id } = await params;

        const body = await request.json();

        const validationCheck = validateUserUpdate(body);

        if (!validationCheck.isValid) {
            return Response.json({
                errors: validationCheck.errors,
                values: body,
            }, { status: 400 });
        }

        //sanitizes user input
        const cleanData = sanitizeUserUpdate(body);
        
        //updates user in database
        const result = await updateUser(id, cleanData);

        return Response.json({
            success: result.success,
            message: "Details updated successfully."
        }, { status: 200 });

    } catch (err) {
        console.error(err);

        return Response.json(
            { error: "Internal server error occurred, please try again." },
            { status: 500 }
        );
    }
}