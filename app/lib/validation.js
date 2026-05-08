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
    const clean = sanitize(value.trim().toLowerCase());
    if(!clean) 
        return "Email is required. ";
    if( /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(clean)) return "Enter a valid Email address .";
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