"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react"
import { validateName, validateEmail, validatePassword, validateConfirmPassword, validateAccountType } from "../../lib/validation";

export default function StaffSignupPage() {
    const router = useRouter();
    const [fields, setFields] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        usertype: "",
    });
    const [errors, setErrors] = useState({});
    const [successMsg, setSuccessMsg] = useState("");

    function handleChange(e) {
        const { name, value } = e.target;
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
            usertype: validateAccountType(fields.usertype),
        };
        setErrors(newErrors);
        if (newErrors.username || newErrors.email || newErrors.password || newErrors.confirmPassword || newErrors.usertype) return;

        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: fields.username,
                email: fields.email,
                password: fields.password,
                usertype: fields.usertype,
            }),
        });

        const result = await res.json();

        if (res.ok) {
            // TODO: redirect to login page
            setSuccessMsg("Successfully signed up!");
            setErrors({});
        } else {
            setErrors(result.errors || { global: result.message || "An error occurred" });
        }
    }

    return (
        <main className="auth-page">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Sign Up as Staff</h2>

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

                <label>I am a...</label>
                <select name="usertype" value={fields.usertype} onChange={handleChange}>
                    <option value="">Select a role</option>
                    <option value="organiser">Organiser</option>
                    <option value="admin">Admin</option>
                </select>
                {errors.usertype && <span className="error">{errors.usertype}</span>}

                <button type="submit">Create Account</button>

                <p className="auth-footer">
                    Already have an account? <Link href="/sign-in">Sign In</Link>
                </p>
            </form>
        </main>
    );
}