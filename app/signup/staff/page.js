"use client";
import Link from "next/link";
import { useState } from "react"
import { validateName,validateEmail,validatePassword,validateConfirmPassword,validateAccountType } from "../../lib/validation";

export default function StaffSignupPage() {
       const[fields, setFields] = useState({
                userName: "",
                email : "",
                password : "",
                confirmPassword : "",
                userType:" ",
        })
        const [errors, setErrors] = useState({});
        const [successMsg, setSuccessMsg] = useState("");

        function handleChange(e){
            //using spread operator to keep existing field values and overwrite only the field that is changed
            const {name , value } = e.target;
            setFields((prev) => ({ ...prev, [name]:value}));

            setErrors((prev) => ({ ...prev, [name]: ""}));
        }

        async function handleSubmit(e){
            e.preventDefault();
            const newErrors = {
                userName: validateName(fields.userName),
                email: validateEmail(fields.email),
                password: validatePassword (fields.password),
                confirmPassword: validateConfirmPassword (fields.password,fields.confirmPassword),
                userType: validateAccountType(fields.userType),
            };
            setErrors(newErrors);
            if(newErrors.name || newErrors.email || newErrors.password || newErrors.confirmPassword || newErrors.role)return;

            // send data to POST for validation (and user signup)
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fields),
            });

            const result = await res.json();

            if (res.ok) {
                // submission was successful
                setSuccessMsg("Succesfully signed up!");
                setErrors({});
            } else {
                setErrors(result.errors || {global: result.message || "An error occurred" });
            }
        }

    return (
        <main className="auth-page">
            <form className="auth-form"  onSubmit={handleSubmit}>
                <h2>Sign Up as Staff </h2>

                <label>Full Name</label>
                <input
                    type="text"
                    name="userName"
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

            
                <label>I am an...</label>
                <select name="userType" value={fields.role} onChange={handleChange}>
                    <option value=""> Select a role</option>
                    <option value="organizer">Organizer</option>
                    <option value="admin">Admin</option>
                </select>
                {errors.role && <span className="error">{errors.role}</span>}


                <button type="submit">Create Account</button>

                <p className="auth-footer">
                    Already have an account? <Link href="/sign-in">Sign In</Link>
                </p>
            </form>
        </main>
    );
}