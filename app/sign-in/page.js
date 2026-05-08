"use client";
import Link from "next/link";
import { useState } from "react"
import {validateEmail,validatePassword} from "../lib/validation";
export default function SignInPage(){
    const[fields, setFields] = useState({email :"", password: ""});
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
            };
            setErrors(newErrors);
            if( newErrors.email || newErrors.password)return;
    }

return(
    <main className="page">
    <form className="form" onSubmit={handleSubmit}> 
        <h1>Master Of Tickets </h1>
        <p> Book concerts, festivals and stadium events.</p>

        <h1> Sign In</h1>

        <label>Email</label>
        <input 
            type="email" 
            name="email"
            placeholder="Enter your email" 
            value={fields.email}
            onChange={handleChange}
            />

        {errors.email && <span className="error">{errors.email}</span>}

        <label>Password</label>
        <input 
            type="password" 
            name="password"
            placeholder="Enter your Password(min. 8 characters)"
            value={fields.password}
            onChange={handleChange}
        />
        {errors.password && <span className="error">{errors.password}</span>}

        {/* Sign in button */}
        <button type="submit">Sign In </button>


        <div className=" bottom-text">
        <p>
            Don't have an account ? 
            <Link href ="/signup" >
            Sign Up
            </Link>
        </p>
        <p>
         <Link href="/reset-password"> Forgot password ?</Link>
        </p>
        </div>

    </form>
    </main>

 );
 }