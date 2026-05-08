require('dotenv').config();

//import { validateInput, sanitizeData } from "./validation";
import { validateInput, sanitizeData } from "../utils/validation";
import mysql from 'mysql2/promise';
import bcrypt from "bcryptjs";

const dbConfig = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});


export async function register(cleanData) {
    
    // connect to the db
    const connection = await mysql.createConnection(dbConfig);

    try {

        // check if user already exists
        const [rows] = connection.execute(
            // new users have no ID, just cross check email
            "SELECT UserID FROM Users WHERE email = ?",
            [cleanData.email]
        );

        // table creation

        let userID;
        // user already exists
        if (rows.length > 0) {
            // set userId to pre-existing field
            userID = rows[0].UserID;
        }
        // user does not exist, create a new user
        else {

            // encrypt the passcode
            const hashedPassword = await bcrypt.hash(cleanData.password, 10);

            const [newUser] = connection.execute(
                "INSERT INTO Users (Username, Email, Password, UserType, CreatedAt",
                [
                    cleanData.userName,
                    cleanData.email,
                    hashedPassword,
                    cleanData.userType,
                    cleanData.createdAt,
                ]
            );
            // auto create the id
            userID = newUser.insertId;
        }

        // return status
        return { success: true };

    } catch (err) {
        throw err;
    } finally {
        if (connection) { connection.end(); }
    }
}

export async function POST(request) {

    try {

        const body = await request.json();

        // validate input
        const validationCheck = validateInput(body);
        if (!validationCheck.isValid) {
            return Response.json({
                    errors: validationCheck.errors,
                    values: body,
                    status: 400
                });
        }

        // sanitize data
        const cleanData = sanitizeData(body);

        const result = await register(cleanData);

        if (!result.success) {
            return Response.json({
                message: result.message,
                values: body,
                status: 400
            })
        }

        // data entry worked
        return Response.json({
            success: true,
            message: "Successfully signed up."
        })

    } catch (err) {
        return Response.json(
            { error: "Internal server error occurred, please try again." },
            { status: 500 }
        )
    }
}