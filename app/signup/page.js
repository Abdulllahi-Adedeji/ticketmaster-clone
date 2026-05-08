import Link from "next/link";

export default function SignupPage() {
    return (
        <main className="auth-page">
            <form className="auth-form" action="/api/auth/signup" method="POST">
                <h2>Create an Account</h2>

                <label>Full Name</label>
                <input
                    type="text"
                    name="name"
                    placeholder="Your Full Name"
                    required
                />

                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    placeholder="Your email"
                    required
                />

                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Min. 8 characters"
                    required
                />

                <label>Confirm Password</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Min. 8 characters"
                    required
                />

                <label>I am an...</label>

                <select name="role">
                    <option value="attendee">Attendee</option>
                    <option value="organizer">Organizer</option>
                </select>

                <button type="submit">Create Account</button>

                <p className="auth-footer">
                    Already have an account? <Link href="/login">Sign In</Link>
                </p>
            </form>
        </main>
    );
}