import pool from "../../../../lib/db";

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

        const cleanData = {
            username: body.username?.trim(),
            email: body.email?.trim(),
            userType: body.userType?.trim()
        };

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