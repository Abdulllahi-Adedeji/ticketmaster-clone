import pool from "../../../../lib/db";
import { validateUserUpdate, sanitizeUserUpdate } from "../../../../lib/validation";

async function updateUser(id, cleanData){
    try {
        await pool.execute(
            ` 
            UPDATE Users
            SET Username = ?, Email = ?, UserType =?
            WHERE UserID = ?
            `,
            [
                cleanData.username,
                cleanData.email,
                cleanData.userType,
                id
            ]
        );
        return {
            success: true
        };
    } catch(err){
        throw err;
    }
}

export async function PUT(request, {params}){
    try{

        const body = await request.json();

         const validationCheck = validateUserUpdate(body);

        if (!validationCheck.isValid) {
            return Response.json({
                errors: validationCheck.errors,
                values: body,
            }, { status: 400 });
        }

        const cleanData = sanitizeUserUpdate(body);

        const result = await updateUser(params.id, cleanData);

        return Response.json({
            success: result.success,
            message: "Details updated successfully."
        }, {status: 200});
    } catch(err){
        console.error(err);

        return Response.json(
            {error: "Internal server error occurred, please try again."},
            {status: 500}
        );
    }
}