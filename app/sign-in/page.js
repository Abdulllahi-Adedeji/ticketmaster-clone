"use client";
import Link from "next/link";
import { useState } from "react"
import { useRouter } from "next/navigation";
import {validateEmail,validatePassword} from "../lib/validation";
import "../styles/signin.css";

export default function SignInPage(){
    const router = useRouter();
    const[fields, setFields] = useState({email :"", password: ""});
    const[errors, setErrors] = useState({});

    function handleChange(e){
        //using spread operator to keep existing field values and overwrite only the field that is changed
        const {name , value } = e.target;
        setFields((prev) => ({ ...prev, [name]:value}));
        setErrors((prev) => ({ ...prev, [name]: ""}));
    }

    async function handleSubmit(e){
        e.preventDefault();
        const newErrors = {
            email: validateEmail(fields.email),
            password: validatePassword (fields.password),
            };
            setErrors(newErrors);
            if( newErrors.email || newErrors.password)return;

            const res = await fetch("/api/login", {
                method: "POST",
                headers :{ "Content-Type": "application/json"},
                body: JSON.stringify({email:fields.email, password: fields.password}),
            });
            const data = await res.json();

            if(!res.ok){
                setErrors({global :data.message || "An error occured."});
                return;
            }

            router.refresh();

            const me = await fetch("/api/me");
            const meData = await me.json();

            if(meData.usertype === "attendee") router.push("/dashboard/attendee");
            if(meData.usertype === "organiser") router.push("/dashboard/organiser");
            if(meData.usertype === "admin") router.push("/dashboard/admin");
    }

return(
    <main className="page">
    <form className="form" onSubmit={handleSubmit}> 
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
            placeholder="Enter your Password (min. 8 characters)"
            value={fields.password}
            onChange={handleChange}
        />
        {errors.password && <span className="error">{errors.password}</span>}

        {/* Sign in button */}
        <button type="submit">Sign In </button>


        <div className=" bottom-text">
            <p>Don't have an account? <Link href ="/signup/attendee" >Sign Up as Attendee</Link></p>
            <p>Are you staff?{' '}<Link href="/signup/staff">Sign Up as Staff</Link></p>
            <p><Link href="/reset-password"> Forgot password?</Link></p>
        </div>

    </form>
    </main>

 );
 }