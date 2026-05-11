import pool from "../../lib/db";
import bcrypt from "bcryptjs";
import { validateUser, sanitizeUser } from "../../lib/validation";

async function register(cleanData) {
    try {
        // check if user already exists
        const [rows] = await pool.execute(
            "SELECT UserID FROM Users WHERE Email = ?",
            [cleanData.email]
        );

        // hash password
        const hashedPassword = await bcrypt.hash(cleanData.password, 10);

        // insert new user
        const [newUser] = await pool.execute(
            "INSERT INTO Users (Username, Email, Password, UserType, CreatedAt) VALUES (?, ?, ?, ?, NOW())",
            [
                cleanData.username,
                cleanData.email,
                hashedPassword,
                cleanData.usertype,
            ]
        );

        return { success: true, userID: newUser.insertId };

    } catch (err) {
        // MySQL duplicate entry error code
        if (err.code === 'ER_DUP_ENTRY') {
            if (err.message.includes('Username')) {
                return { success: false, message: "Username already in use.", status: 409 };
            }
            if (err.message.includes('Email')) {
                return { success: false, message: "Email already in use.", status: 409 };
            }
        }
        throw err;
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        const validationCheck = validateUser(body);
        if (!validationCheck.isValid) {
            return Response.json({
                errors: validationCheck.errors,
                values: body,
            }, { status: 400 });
        }

        const cleanData = sanitizeUser(body);
        const result = await register(cleanData);

        if (!result.success) {
            return Response.json(
                { message: result.message },
                { status: result.status || 400 }
            );
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