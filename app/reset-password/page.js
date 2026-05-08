"use client";
import Link from "next/link";
import { useState } from "react"
import {validateEmail,validatePassword,validateConfirmPassword } from "../lib/validation";

export default function ResetPasswordPage(){
    const[fields, setFields] = useState({email :"", password: "", confirmPassword: ""});
    const[errors, setErrors] = useState({});

    function handleChange(e){
        //using spread operator to keep existing field values and overwrite only the field that is changed
        const {name , value } = e.target;
        setFields((prev) => ({ ...prev, [name]:value}));

        setErrors((prev) => ({ ...prev, [name]: ""}));
    }

    function handleSubmit(e){
        e.preventDefault();
        const newErrors = {
            email: validateEmail(fields.email),
            password: validatePassword (fields.password),
            confirmPassword: validateConfirmPassword (fields.password,fields.confirmPassword),
            };
            setErrors(newErrors);
            if( newErrors.email || newErrors.password || newErrors.confirmPassword)return;
        }
return(
    <main className="auth-page">
         <form className="auth-form" onSubmit={handleSubmit}> 
            <h2> Reset Password</h2>
        
            <label>Email</label>
            <input 
                type="email" 
                name="email"
                placeholder="Enter your email" 
                value={fields.email}
                onChange={handleChange}
                />
        
            {errors.email && <span className="error">{errors.email}</span>}
        
            <label> New Password</label>
                <input 
                    type="password" 
                    name="password"
                    placeholder="Enter your Password(min. 8 characters)"
                    value={fields.password}
                    onChange={handleChange}
                />
                {errors.password && <span className="error">{errors.password}</span>}

            <label> Confirm New Password</label>
            <input 
                type="password" 
                name="confirmPassword"
                placeholder="Confirm your Password"
                value={fields.confirmPassword}
                onChange={handleChange}
            />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}

                <button type="submit">Reset Password </button>

            <p className="auth-footer">
                    Remember your Password ? <Link href="/sign-in">Sign In</Link>
            </p>
        
            </form>
            </main>
        
         );
}