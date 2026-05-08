import pool from "../../lib/db";
import bcrypt from "bcryptjs";
import { validateLogin, sanitizeLogin } from "../../lib/validation";
import { cookies } from "next/headers";

async function register(cleanData) {
    try {

        // check if user exists
        const [rows] = await pool.execute(
            "SELECT UserID, email, password FROM Users WHERE Email = ?",
            [cleanData.email]
        );

        // no user found
        if (rows.length == 0) {
            return {
                success: false,
                message: "No user found with that email address."
            };
        }

        // compare entered password to user password
        console.log("rows[0]:", rows[0]);
        const passwordMatch = await bcrypt.compare(cleanData.password, rows[0].password)
        if (!passwordMatch) {
            return {
                success: false,
                message: "Incorrect password."
            }
        }

        // setup cookie
        const cookieStore = await cookies();
        cookieStore.set("session", rows[0].UserID, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24,
        });

        return { success: true };

    } catch (err) {
        throw err;
    }
}

export async function POST(request) {

    try {
        const body = await request.json();
    
        const validationCheck = validateLogin(body);

        if (!validationCheck.isValid) {
            return Response.json({
                errors: validationCheck.errors,
                values: body,
            }, { status: 400 });
        }


        const cleanData = sanitizeLogin(body);
        const result = await register(cleanData);

        if (!result.success) {
            return Response.json({
                message: result.message,
            }, { status: 400 });
        }

        return Response.json({
            success: true,
            message: "Successfully logged in.",
        }, { status: 200 });

    } catch (err) {
        console.error(err);
        return Response.json(
            { error: "Internal server error occurred, please try again." },
            { status: 500 }
        );
    }
}