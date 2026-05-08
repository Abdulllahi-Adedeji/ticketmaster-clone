import Link from "next/link";
import { useState } from "react"
import { validateName,validateEmail,validatePassword,validateConfirmPassword,validateAccountType } from "../lib/validation";
export default function SignInPage(){
    const[fields, setFields] = useState({
            name: "",
            email : "",
            password : "",
            confirmPassword : "",
            role:" ",
    })
return(
    <main className="page">
    <form className="form"> 
  <h1>Master Of Tickets </h1>
  <p> Book concerts, festivals and stadium events.</p>

    <h1> Sign In</h1>

    <label>Email</label>
    <input type="email" placeholder="Enter your email" />

    <label>Password</label>
    <input type="password" placeholder="Enter your email" />


    {/* Sign in button */}
    <Link href ="/signin">
      <button>Sign In </button>
    </Link>

    <div className=" bottom-text">
      <p>
        Don't have an account ? {" "}
        <Link href ="/signup" >
          Sign Up
        </Link>
      </p>
      </div>

    </form>
    </main>

 );
 }