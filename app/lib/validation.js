/* Backend Validation */

export function validateUser(data) {
    const errors = {};

    console.log("data to validate:");
    console.log(data);

    if (!data.username || data.username.length > 32) {
        errors.username = "Invalid Username! Must be less than 32 characters.";
    }

    const emailRegex = /[a-zA-Z0-9.]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.email = "Invalid email address. Please try again";
    }

    if (!data.password || data.password.length < 8) {
        errors.password = "Password must be minimum 8 characters.";
    }

    if (!data.usertype) {
        errors.usertype = "Please select an account type.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}

export function validateLogin(data) {
    const errors = {};

    const emailRegex = /[a-zA-Z0-9.]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.email = "Invalid email address. Please try again";
    }

    if (!data.password || data.password.length < 8) {
        errors.password = "Password must be minimum 8 characters.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}

export function sanitizeUser(data) {
    const clean = (str) => {
        if (typeof str !== 'string') return str;
        return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    };

    return {
        username: clean(data.username),
        email: clean(data.email).toLowerCase(),
        password: clean(data.password),
        usertype: clean(data.usertype),
    }
}

export function sanitizeLogin(data) {
    const clean = (str) => {
        if (typeof str !== 'string') return str;
        return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    };

    return {
        email: clean(data.email).toLowerCase(),
        password: clean(data.password),
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

/* UPDATE validation */

export function validateUserUpdate(data){
    const errors = {};

    if (!data.username || data.username.length > 32) {
        errors.username = "Invalid Username! Must be less than 32 characters.";
    }

    const emailRegex = /[a-zA-Z0-9.]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}$/;

    if (!data.email || !emailRegex.test(data.email)) {
        errors.email = "Invalid email address. Please try again";
    }

    if (!data.usertype) {
        errors.usertype = "Please select an account type.";
    }

     return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}

/* UPDATE sanitization */

export function sanitizeUserUpdate(data){
    
    const clean = (str) => {

        if (typeof str !== 'string') return str;

        return str .replace(/</g, "&lt;").replace(/>/g, "&gt;");
    };

    return {
        username: clean(data.username),
        email: clean(data.email).toLowerCase(),
        usertype: clean(data.usertype),
    }
}

