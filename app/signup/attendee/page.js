"use client";
import Link from "next/link";
import { useState } from "react"
import { validateName,validateEmail,validatePassword,validateConfirmPassword } from "../../lib/validation";

export default function AtendeeSignupPage() {
       const[fields, setFields] = useState({
                name: "",
                email : "",
                password : "",
                confirmPassword : "",
        })
        const [errors, setErrors] = useState({});

        function handleChange(e){
            //using spread operator to keep existing field values and overwrite only the field that is changed
            const {name , value } = e.target;
            setFields((prev) => ({ ...prev, [name]:value}));

            setErrors((prev) => ({ ...prev, [name]: ""}));
        }

        function handleSubmit(e){
            e.preventDefault();
            const newErrors = {
                name: validateName(fields.name),
                email: validateEmail(fields.email),
                password: validatePassword (fields.password),
                confirmPassword: validateConfirmPassword (fields.password,fields.confirmPassword)
            };
            setErrors(newErrors);
            if(newErrors.name || newErrors.email || newErrors.password || newErrors.confirmPassword)return;
            
        }

    return (
        <main className="auth-page">
            <form className="auth-form"  onSubmit={handleSubmit}>
                <h2>Sign Up as Staff </h2>

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


                <button type="submit">Create Account</button>

                <p className="auth-footer">
                    Already have an account? <Link href="/sign-in">Sign In</Link>
                </p>
            </form>
        </main>
    );
}