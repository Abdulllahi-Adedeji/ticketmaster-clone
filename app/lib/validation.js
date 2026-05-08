/* Backend Validation */
// "INSERT INTO Users (Username, Email, Password, UserType, CreatedAt",

export function validateInput(data) {
    // store errors here
    const errors = {};

    if (data.userName.length > 32) {
        errors.userName = "Invalid Username! Must be less than 32 characters.";
    }

    // regex for email (something.something@gmail.com)
    const emailRegex = /[a-zA-Z0-9.]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(data.email)) {
        errors.email = "Invalid email address. Please try again";
    }

    if (data.password.length < 8) {
        errors.password = "Password must be minimum 8 characters.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}

export function sanitizeData(data, type) {

    // helper function
    const clean = (str) => {
        // if data given is not a string, return back the data
        if (typeof str !== 'string') {
            return str;
        }

        // replace opening and closing tags to prevent HTML code
        return str
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    };

    if (type == "user") {
        return {
            userName: clean(data.userName),
            email: clean(data.email),
            password: clean(data.password),
            userType: clean(data.userType),
            createdAt: data.createdAt // no string input
        }
    }
    if (type == "event") {
        return {}
    }
    if (type == "admin") {
        return {}
    }
}

/* Frontend Validation */

function sanitize(text) {
        return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
    
export function validateName(value){
    const clean =sanitize(value.trim());
    if(!clean)
        return "Full name is required.";
    if(clean.length <2) 
        return "Full name must be at least 2 Characters.";

    return "";
}

export function validateEmail(value){
    const clean = value.trim().toLowerCase();
    if(!clean) 
        return "Email is required. ";
    if(! /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(clean)) return "Enter a valid Email address .";
    return "";
}

export function validatePassword(value){
    if(!value) 
        return "Password is required";
    if(value.length < 8) 
    return "Password must be at least 8 characters. ";
    return "";
}

export function validateConfirmPassword(password, confirm){
    if(!confirm) 
        return "Please confirm your password.";
    if(password !== confirm) 
    return "Passwords do not match.";
    return "";
}

export function validateAccountType(value){
    if(!value) 
        return "Please select an account type.";
    return "";
}

