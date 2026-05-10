"use client";
import Link from "next/link";
import { useState } from "react"
import { validateName, validateEmail, validatePassword, validateConfirmPassword } from "../../lib/validation";
import { useRouter } from "next/navigation"
import "../../styles/auth.css"

export default function AtendeeSignupPage() {

    const router = useRouter();

    const [fields, setFields] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [successMsg, setSuccessMsg] = useState("");

    function handleChange(e) {
        const { name, value } = e.target;
        //using spread operator to keep existing field values and overwrite only the field that is changed
        setFields((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const newErrors = {
            username: validateName(fields.username),
            email: validateEmail(fields.email),
            password: validatePassword(fields.password),
            confirmPassword: validateConfirmPassword(fields.password, fields.confirmPassword),
        };
        setErrors(newErrors);
        if (newErrors.username || newErrors.email || newErrors.password || newErrors.confirmPassword) return;

        // send to register API
        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: fields.username,
                email: fields.email,
                password: fields.password,
                usertype: "attendee", // hardcoded since this is attendee signup
            }),
        });

        const result = await res.json();

        if (res.ok) {
            router.refresh();
            router.push("/sign-in")
            setSuccessMsg("Successfully signed up!");
            setErrors({});
        } else {
            setErrors(result.errors || { global: result.message || "An error occurred" });
        }
    }

    return (
        <main className="auth-page">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Sign Up as Attendee</h2>

                {successMsg && <p className="success">{successMsg}</p>}
                {errors.global && <span className="error">{errors.global}</span>}

                <label>Full Name</label>
                <input
                    type="text"
                    name="username"
                    placeholder="Your Full Name"
                    value={fields.username}
                    onChange={handleChange}
                />
                {errors.username && <span className="error">{errors.username}</span>}

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
                    placeholder="Enter your Password (Min. 8 characters)"
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