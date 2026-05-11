"use client";
import { useState, useEffect } from "react";
import {validateUserUpdate, validateUser} from "../../lib/validation";
import '../../styles/dashboard.css'

export default function AdminDashboard(){
    const [view, setView] = useState("display");
    const[users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const[errors, setErrors] = useState({});
    const [formData, setFormData] = useState({username :"", email: "", password: "", usertype:""});

    // When the page first loads, fetch all users from the database
    useEffect(() =>{
        async function loadUsers() {
            const res = await fetch("/api/user/search?query=");
            const data =await res.json();
            setUsers(data.users|| []);

        }
            loadUsers();
    },
    []);

    // Updates the relevant form field as the user types, and clears its error
    function handleFormChange(e){
        const { name, value } = e.target;
        // Spread the previous values and only overwrite the field that changed
        setFormData((prev => ({...prev, [name]: value})));
        setErrors((prev) => ({ ...prev, [name]: ""}));
    }

    // Validates the form and sends a POST request to register a new user
    async function  handleAdd() {
        const validationCheck = validateUser(formData);
        if(!validationCheck.isValid){
            setErrors(validationCheck.errors);
            return;
        }
        const res = await fetch("/api/register", {
            method:"POST",
            headers :{"Content-Type": "application/json"},
            body: JSON.stringify(formData),
        })
        const data = await res.json();

        if(data.success){
            // Add the new user to the local list without reloading the page
            setUsers((prev => [...prev, {...formData, userID: data.userID }]));
            setFormData({username : "", email: "", password: "", usertype: "",});
        }

    }

    // Fills the form with the chosen user's current details so the admin can edit them
    function selectedUserToEdit(user){
        setSelectedUser(user);
        setFormData({ username: user.username, email: user.email, usertype:user.usertype});
    }

    // Validates the form and sends a PUT request to update the selected user's details
    async function handleEdit() {
        const validationCheck = validateUserUpdate(formData);
        if(!validationCheck.isValid){
            setErrors(validationCheck.errors);
            return;
        }
        const res =await fetch (`/api/user/update/${selectedUser.userID}`,{
            method: "PUT",
            headers :{"Content-Type": "application/json"},
            body: JSON.stringify(formData),
        });

        const data = await res.json();
        if(data.success){
            // Replace the old user data in state with the updated values
            setUsers((prev) => prev.map((u) => (u.userID === selectedUser.userID ? {...u, ...formData} : u)));
            setSelectedUser(null);
            setFormData({username :"", email : "", usertype: ''});
        }

    }

    // Sends a DELETE request and removes the user from the lisst
    async function handleDelete(userID) {
            const res = await fetch (`/api/user/${userID}`, {method: "DELETE"});
            const data = await res.json();
            if(data.success){
                setUsers((prev) => prev.filter((u) => u.userID !==userID));
            }
    }

    // Filter the user list to only show matched emails
    const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="dashboard">
            <h1> Admin Dashboard </h1>

            {/* Tab buttons to switch between the four admin actions */}
            <div className="dashboard-tabs">
                <button
                className={view === "add" ? "tab-active" : "tab"}
                onClick={() => { setView("add"); setFormData({username: "", email : "", usertype: "", }); setErrors({}); }}
                >
                    Add
                </button>

                <button
                className={view === "edit" ? "tab-active" : "tab"}
                onClick={() => { setView("edit"); setSelectedUser(null); setErrors({}); }}
                >
                    Edit
                </button>

                <button
                className={view === "display" ? "tab-active" : "tab"}
                onClick={() => { setView("display") }}
                >
                    Display
                </button>

                <button
                className={view === "delete" ? "tab-active" : "tab"}
                onClick={() => { setView("delete"); setSearchQuery("");}}
                >
                    Delete
                </button>
            </div>

            {/* List every user in the system */}
            {view === "display" && (
                <section className="dashboard-section">
                    <h2> All Users</h2>
                    {users.length ===0 ? (
                        <p> No users Found</p>
                    ) : (
                        users.map((user) => (
                            <p key={user.userID}>{user.username} - {user.email} - {user.usertype} </p>
                        ))
                    )}
                </section>
            )}

            {/* Form to create a brand new user account */}
            {view === "add" && (
                <section className="dashboard-section">
                    <h2> Add Users</h2>

                    <label>Username</label>
                    <input name="username" value={formData.username} onChange={handleFormChange} placeholder="Username" />
                    {errors.username && <span className="error"> {errors.username}</span>}

                    <label>Email</label>
                    <input name="email" value={formData.email} onChange={handleFormChange} placeholder="Email" />
                    {errors.email && <span className="error"> {errors.email}</span>}

                    <label>Password</label>
                    <input name="password" type="password" value={formData.password} onChange={handleFormChange} placeholder="Password" />
                    {errors.password && <span className="error">{errors.password}</span>}

                    <label>Role</label>
                    <select name="usertype" value={formData.usertype} onChange={handleFormChange}>
                        <option value=""> Select a role</option>
                        <option value="attendee"> Attendee </option>
                        <option value="organiser"> Organiser </option>
                        <option value="admin">Admin</option>
                    </select>
                    {errors.usertype && <span className="error"> {errors.usertype}</span>}
                    <button onClick={handleAdd}>Add User</button>
                </section>
            )}

            {/* First show a list of users to pick from, then show the edit form for the chosen user */}
            {view ===  "edit" && (
                <section className="dashboard-section">
                    <h2>Edit User</h2>
                    {!selectedUser ? (
                        <>
                        <p> Select a user to edit :</p>
                        {users.length === 0 ? (
                            <p> No users found.</p>
                        ) : (
                            users.map((user) => (
                                <p key={user.userID} onClick={() => selectedUserToEdit(user)}>
                                    {user.username} - {user.email} - {user.usertype}
                                </p>
                            ))
                        )}
                        </>
                    ):(
                        <>
                        <label>Username</label>
                        <input name="username" value={formData.username} onChange={handleFormChange} placeholder="Username" />
                        {errors.username && <span className="error"> {errors.username}</span>}

                        <label>Email</label>
                        <input name="email" value={formData.email} onChange={handleFormChange} placeholder="Email" />
                        {errors.email && <span className="error"> {errors.email}</span>}

                        <label>Role</label>
                        <select name="usertype" value={formData.usertype} onChange={handleFormChange}>
                            <option value=""> Select a role</option>
                            <option value="attendee"> Attendee </option>
                            <option value="organiser"> Organiser </option>
                            <option value="admin">Admin</option>
                        </select>
                        {errors.usertype && <span className="error">{errors.usertype}</span>}
                        <button onClick={handleEdit}> Save Changes </button>
                        {/* Cancel goes back to the user selection list */}
                        <button onClick={() => {setSelectedUser(null); setFormData({username: "", email: "", usertype: ""});}}>Cancel</button>
                        </>
                    )}
                </section>
            )}

            {view === "delete" && (
                <section className="dashboard-section">
                    <h2>Delete User </h2>
                    <input
                        placeholder=" Search by email"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)} />

                    {filteredUsers.map((user) => (
                        <div key={user.userID}>
                            <p> {user.username} - {user.email} - {user.usertype} </p>

                            <button className="delete-btn" onClick={() => handleDelete(user.userID)}> Delete </button>
                        </div>
                    ))}
                </section>
            )}
        </main>
    )

}
