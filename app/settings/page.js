"use client";
import Link from "next/link";
import { useState, useEffect } from "react"
import { validateName,validateEmail,validatePassword,validateConfirmPassword } from "../lib/validation";

export default function SettingsPage(){
    const[fields, setFields] = useState({name :"", email :"", password: "", confirmPassword :""});
    const[errors, setErrors] = useState({});
    const[saved, setSaved] = useState(false);

//     useEffect(() =>{
//         async function loadUser() {
//             const res = await fetch ("/api/user/me");
//             const data = await res.json();
//             setFields({name: data.name, email :data.email,  password:"", confirmPassword:""});
//         }
//         loadUser();

//     },
// []);

function handleChange(e){
    const {name , value } = e.target;
    setFields((prev) => ({ ...prev, [name]:value}));
    setErrors((prev) => ({ ...prev, [name]: ""}));
    setSaved(false);
}

function handleSubmit(e){
    e.preventDefault();
    const newErrors = {
        name: validateName(fields.name),
        email: validateEmail(fields.email),
        password: validatePassword (fields.password),
        confirmPassword: fields.password ? validateConfirmPassword (fields.password,fields.confirmPassword) : "",
        };
        setErrors(newErrors);
        if(newErrors.name || newErrors.email || newErrors.password || newErrors.confirmPassword)return;
       
        /*fetch ("/api/user/me",
            {
            method :"PUT",body :JSON.stringify(fields)
      })  */
        setSaved(true);
        
}

return (
    <main className="auth-page">
        <form className="auth-form"  onSubmit={handleSubmit}>
            <h2>Settings </h2>

            <label>Full Name</label>
            <input
                type="text"
                name="name"
                placeholder="Your Full Name"
                value={fields.name}
                onChange={handleChange}
            />
            {errors.name && <span className="error">{errors.name}</span>}

            <label>Email</label>
            <input
                type="email"
                name="email"
                placeholder="Your email"
                value={fields.email}
                onChange={handleChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}

            <label>Password</label>
            <input
                type="password"
                name="password"
                placeholder="Enter your Password(Min. 8 characters)"
                value={fields.password}
                onChange={handleChange}
            />
            {errors.password && <span className="error">{errors.password}</span>}

            <label>Confirm Password</label>
            <input
                type="password"
                name="confirmPassword"
                placeholder="Min. 8 characters"
                value={fields.confirmPassword}
                onChange={handleChange}
            />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}


            <button type="submit">Save Changes</button>
            {saved && <p className="success">Changes saved successfully.</p>}
        </form>
    </main>
);
}
