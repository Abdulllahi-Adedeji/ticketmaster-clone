"use client";
import { useState, useEffect } from "react";
import {validateUserUpdate, validateUser} from "../../lib/validation";

export default function AdminDashboard(){
    const [view, setView] = useState("display");
    const[users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const[errors, setErrors] = useState({});
    const [formData, setFormData] = useState({username :"", email: "", password: "", usertype:""});

     //this it gets  all the users from database when the page is loaded 
     useEffect(() =>{
        async function loadUsers() {
            const res = await fetch("/api/user/search?query=");
            const data =await res.json();
            setUsers(data.users|| []);
            
        }
            loadUsers();
    },
    []);

    //handle input changes and clears errors for that field as user types
    function handleFormChange(e){
        const { name, value } = e.target;
        //using spread operator
        setFormData((prev => ({...prev, [name]: value})));
        setErrors((prev) => ({ ...prev, [name]: ""}));
    }

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
            setUsers((prev => [...prev, {...formData, userID: data.userID }]));
            setFormData({username : "", email: "", password: "", usertype: "",});
        }
        
    }

    function selectedUserToEdit(user){
        setSelectedUser(user);
        setFormData({ username: user.username, email: user.email, usertype:user.usertype});
    }

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
            setUsers((prev) => prev.map((u) => (u.userID === selectedUser.userID ? {...u, ...formData} : u)));
            setSelectedUser(null);
            setFormData({username :"", email : "", usertype: ''});
        }

    }

    async function handleDelete(userID) {
            const res = await fetch (`/api/user/${userID}`, {method: "DELETE"});
            const data = await res.json();
            if(data.success){
                setUsers((prev) => prev.filter((u) => u.userID !==userID));
            }
    }

    const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return (
        <main className="dashboard">
            <h1> AdminDashboard </h1>

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