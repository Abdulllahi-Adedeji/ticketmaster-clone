"use client";
import { useState, useEffect } from "react";
import { validateEmail, validatePassword, validateConfirmPassword } from "../lib/validation";
import "../styles/auth.css";

export default function SettingsPage() {

    // current user data loaded from the api
    const [user, setUser] = useState({ name: "", email: "", userID: null, usertype: null });
    const [loading, setLoading] = useState(true);

    // email change state
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [emailSaved, setEmailSaved] = useState(false);

    // password change state
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordFields, setPasswordFields] = useState({ password: "", confirmPassword: "" });
    const [passwordErrors, setPasswordErrors] = useState({});
    const [passwordSaved, setPasswordSaved] = useState(false);

    // general error from api
    const [error, setError] = useState("");

    // load the current user from the session on page mount
    useEffect(() => {
        async function loadUser() {
            try {
                const res = await fetch("/api/me");
                const data = await res.json();

                // redirect to login if not logged in
                if (!data.loggedIn) {
                    window.location.href = "/login";
                    return;
                }

                setUser({ name: data.name, email: data.email, userID: data.userID, usertype: data.usertype });
            } catch (err) {
                console.error("Failed to load user:", err);
            } finally {
                setLoading(false);
            }
        }
        loadUser();
    }, []);

    // handle email update submission
    async function handleEmailSubmit(e) {
        e.preventDefault();
        setEmailSaved(false);
        setError("");

        // validate new email before submitting
        const err = validateEmail(newEmail);
        if (err) { setEmailError(err); return; }
        setEmailError("");

        try {
            const res = await fetch(`/api/user/update/${user.userID}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: user.name, email: newEmail, usertype: user.usertype }),
            });

            const text = await res.text();
            const data = text ? JSON.parse(text) : {};

            if (!res.ok) {
                setError(data.errors?.email || "Failed to update email.");
                return;
            }

            // update displayed email and close the form
            setUser((prev) => ({ ...prev, email: newEmail }));
            setNewEmail("");
            setShowEmailForm(false);
            setEmailSaved(true);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    }

    // handle password update submission
    async function handlePasswordSubmit(e) {
        e.preventDefault();
        setPasswordSaved(false);
        setError("");

        // validate both password fields before submitting
        const errs = {
            password: validatePassword(passwordFields.password),
            confirmPassword: validateConfirmPassword(passwordFields.password, passwordFields.confirmPassword),
        };
        setPasswordErrors(errs);
        if (errs.password || errs.confirmPassword) return;

        try {
            const res = await fetch(`/api/user/update/${user.userID}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: user.name, email: user.email, usertype: user.usertype, password: passwordFields.password }),
            });

            const text = await res.text();
            const data = text ? JSON.parse(text) : {};

            if (!res.ok) {
                setError(data.errors?.password || "Failed to update password.");
                return;
            }

            // clear password fields and close the form
            setPasswordFields({ password: "", confirmPassword: "" });
            setShowPasswordForm(false);
            setPasswordSaved(true);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    }

    // show a loading state while fetching user data
    if (loading) return <p>Loading...</p>;

    return (
        <main className="auth-page">
            <div className="auth-form">
                <h2>Settings</h2>

                {/* general api error */}
                {error && <span className="error">{error}</span>}

                <div className="settings-field">
                    <label>Full Name</label>
                    <p className="settings-value">{user.name}</p>
                </div>

                <div className="settings-field">
                    <label>Email</label>
                    <p className="settings-value">{user.email}</p>

                    {emailSaved && <p className="success">Email updated successfully.</p>}

                    {!showEmailForm ? (
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => { setShowEmailForm(true); setEmailSaved(false); }}
                        >
                            Change Email
                        </button>
                    ) : (
                        <form onSubmit={handleEmailSubmit} className="inline-form">
                            <input
                                type="email"
                                placeholder="Enter new email"
                                value={newEmail}
                                onChange={(e) => { setNewEmail(e.target.value); setEmailError(""); }}
                                autoFocus
                            />
                            {emailError && <span className="error">{emailError}</span>}
                            <div className="inline-form-actions">
                                <button type="submit">Save</button>
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => { setShowEmailForm(false); setEmailError(""); setNewEmail(""); }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <div className="settings-field">
                    <label>Password</label>
                    <p className="settings-value">••••••••</p>

                    {passwordSaved && <p className="success">Password updated successfully.</p>}

                    {!showPasswordForm ? (
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => { setShowPasswordForm(true); setPasswordSaved(false); }}
                        >
                            Change Password
                        </button>
                    ) : (
                        <form onSubmit={handlePasswordSubmit} className="inline-form">
                            <input
                                type="password"
                                placeholder="New password (min. 8 characters)"
                                value={passwordFields.password}
                                onChange={(e) => { setPasswordFields((p) => ({ ...p, password: e.target.value })); setPasswordErrors((p) => ({ ...p, password: "" })); }}
                                autoFocus
                            />
                            {passwordErrors.password && <span className="error">{passwordErrors.password}</span>}

                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={passwordFields.confirmPassword}
                                onChange={(e) => { setPasswordFields((p) => ({ ...p, confirmPassword: e.target.value })); setPasswordErrors((p) => ({ ...p, confirmPassword: "" })); }}
                            />
                            {passwordErrors.confirmPassword && <span className="error">{passwordErrors.confirmPassword}</span>}

                            <div className="inline-form-actions">
                                <button type="submit">Save</button>
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => { setShowPasswordForm(false); setPasswordErrors({}); setPasswordFields({ password: "", confirmPassword: "" }); }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </main>
    );
}