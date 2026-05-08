import pool from "../../lib/db";
import bcrypt from "bcryptjs";
import { validateInput, sanitizeData } from "../../lib/validation";

async function register(cleanData) {
    try {
        // check if user already exists
        const [rows] = await pool.execute(
            "SELECT UserID FROM Users WHERE Email = ?",
            [cleanData.email]
        );

        if (rows.length > 0) {
            return { success: false, message: "Email already in use." };
        }

        // hash password
        const hashedPassword = await bcrypt.hash(cleanData.password, 10);

        // insert new user
        const [newUser] = await pool.execute(
            "INSERT INTO Users (Username, Email, Password, UserType, CreatedAt) VALUES (?, ?, ?, ?, NOW())",
            [
                cleanData.userName,
                cleanData.email,
                hashedPassword,
                cleanData.userType,
            ]
        );

        return { success: true, userID: newUser.insertId };

    } catch (err) {
        throw err;
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        const validationCheck = validateInput(body);
        if (!validationCheck.isValid) {
            return Response.json({
                errors: validationCheck.errors,
                values: body,
            }, { status: 400 });
        }

        const cleanData = sanitizeData(body, "user");
        console.log("body:", body);
        console.log("cleanData:", cleanData);
        const result = await register(cleanData);

        if (!result.success) {
            return Response.json({
                message: result.message,
            }, { status: 400 });
        }

        return Response.json({
            success: true,
            message: "Successfully signed up.",
        }, { status: 201 });

    } catch (err) {
        console.error(err);
        return Response.json(
            { error: "Internal server error occurred, please try again." },
            { status: 500 }
        );
    }
}