"use client";
import { useState } from "react";

const mockUsers = [
    { id: 1, name: "Alice Johnson", email: "alice@email.com", role: "attendee" },
    { id: 2, name: "Bob Smith", email: "bob@email.com", role: "organiser" },
    { id: 3, name: "Carol White", email: "carol@email.com", role: "attendee" },
];

export default function AdminDashboard() {
    const [view, setView] = useState("display");
    const [users, setUsers] = useState(mockUsers);
    const [formData, setFormData] = useState({ name: "", email: "", role: "" });
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    function handleFormChange(e) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function handleAdd() {
        if (!formData.name || !formData.email || !formData.role) return;
        setUsers((prev) => [...prev, { ...formData, id: Date.now() }]);
        setFormData({ name: "", email: "", role: "" });
    }

    function handleEdit() {
        setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? { ...formData, id: u.id } : u)));
        setSelectedUser(null);
        setFormData({ name: "", email: "", role: "" });
    }

    function selectUserToEdit(user) {
        setSelectedUser(user);
        setFormData({ name: user.name, email: user.email, role: user.role });
    }

    function deleteUser(id) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
    }

    const filteredUsers = users.filter((u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="dashboard">
            <h1>Admin Dashboard</h1>

            <div className="dashboard-tabs">
                <button className={view === "add" ? "tab active" : "tab"} onClick={() => { setView("add"); setFormData({ name: "", email: "", role: "" }); }}>
                    Add
                </button>
                <button className={view === "edit" ? "tab active" : "tab"} onClick={() => { setView("edit"); setSelectedUser(null); }}>
                    Edit
                </button>
                <button className={view === "display" ? "tab active" : "tab"} onClick={() => setView("display")}>
                    Display
                </button>
                <button className={view === "delete" ? "tab active" : "tab"} onClick={() => { setView("delete"); setSearchQuery(""); }}>
                    Delete
                </button>
            </div>

            {view === "display" && (
                <section className="dashboard-section">
                    <h2>All Users</h2>
                    {users.map((user) => (
                        <p key={user.id}>{user.name} — {user.email} — {user.role}</p>
                    ))}
                </section>
            )}

            {view === "add" && (
                <section className="dashboard-section">
                    <h2>Add User</h2>
                    <label>Name</label>
                    <input name="name" value={formData.name} onChange={handleFormChange} placeholder="Full name" />

                    <label>Email</label>
                    <input name="email" value={formData.email} onChange={handleFormChange} placeholder="Email" />

                    <label>Role</label>
                    <select name="role" value={formData.role} onChange={handleFormChange}>
                        <option value="">Select a role</option>
                        <option value="attendee">Attendee</option>
                        <option value="organiser">Organiser</option>
                        <option value="admin">Admin</option>
                    </select>

                    <button onClick={handleAdd}>Add User</button>
                </section>
            )}

            {view === "edit" && (
                <section className="dashboard-section">
                    <h2>Edit User</h2>
                    {!selectedUser ? (
                        <>
                            <p>Select a user to edit:</p>
                            {users.map((user) => (
                                <p key={user.id} onClick={() => selectUserToEdit(user)} style={{ cursor: "pointer" }}>
                                    {user.name} — {user.email} — {user.role}
                                </p>
                            ))}
                        </>
                    ) : (
                        <>
                            <label>Name</label>
                            <input name="name" value={formData.name} onChange={handleFormChange} />

                            <label>Email</label>
                            <input name="email" value={formData.email} onChange={handleFormChange} />

                            <label>Role</label>
                            <select name="role" value={formData.role} onChange={handleFormChange}>
                                <option value="attendee">Attendee</option>
                                <option value="organiser">Organiser</option>
                                <option value="admin">Admin</option>
                            </select>

                            <button onClick={handleEdit}>Save Changes</button>
                            <button onClick={() => { setSelectedUser(null); setFormData({ name: "", email: "", role: "" }); }}>Cancel</button>
                        </>
                    )}
                </section>
            )}

            {view === "delete" && (
                <section className="dashboard-section">
                    <h2>Delete User</h2>
                    <input
                        placeholder="Search by name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {filteredUsers.map((user) => (
                        <div key={user.id}>
                            <p>{user.name} — {user.email} — {user.role}</p>
                            <button className="delete-btn" onClick={() => deleteUser(user.id)}>Delete</button>
                        </div>
                    ))}
                </section>
            )}
        </main>
    );
}
