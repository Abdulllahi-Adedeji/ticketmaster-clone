"use client";
import {useState, useEffect } from "react";
import{validateEventUpdate} from "../../lib/validation";
import '../../styles/dashboard.css'


//Converts a dtae string from the data base into html date inputs
function toInputDate(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toISOString().split("T")[0];
}

export default function OrganiserDashboard(){
    const [view, setView] = useState("events");
    const [events, setEvents] = useState([]);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [confirmDeleteID, setConfirmDeleteID] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);
    const [organiserID, setOrganiserID] = useState(null);

    //form data used for edit and create
    const[formData, setFormData] = useState({
        name: "",
        description: "",
        location : "",
        venue : "",
        genre : "",
        imgURL :"",
        date :"",
        capacity : "",
        price : "",
    });

    // When the page loads it fetches the logged-in user's info and then load their events
    useEffect(() =>{
        async function loadEvents() {
            const me = await fetch("/api/me");
            const meData = await me.json();
            setOrganiserID(meData.userID)
            const res = await fetch (`/api/event/organiser/${meData.userID}`);
            const data =await res.json();
            setEvents(data.events || []);
        }
            loadEvents();
    },
    []);

    // Updates the  form field as the user types, and clears its error
    function handleFormChange(e){
        const { name, value } = e.target;
        setFormData((prev => ({...prev, [name]: value})));
        setErrors((prev) => ({ ...prev, [name]: ""}));
    }

    // Sends a POST request to create a new event, then adds it to the list
    async function handleCreate() {
        setApiError(null);
        const validateCheck = validateEventUpdate(formData);
        if(!validateCheck.isValid){
            setErrors(validateCheck.errors);
            return;
        }

        const res = await fetch("/api/event/add", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({...formData, organiserID}),
        });
        const data = await res.json();
        if(data.success) {
            // Add the new event to the list
            setEvents((prev) => [...prev, {
                EventID: data.eventID,
                Name: formData.name,
                Description: formData.description,
                Location: formData.location,
                Venue: formData.venue,
                Genre: formData.genre,
                ImgURL: formData.imgURL,
                Date: formData.date,
                Capacity: formData.capacity,
                Price: formData.price,
                attendeeCount: 0,
            }]);
            setView("events");
            setFormData({ name: "", description: "", location: "", venue: "", genre: "", imgURL: "", date: "", capacity: "", price: ""});
        } else {
            setApiError(data.message || data.error || "Failed to create event. Please try again.");
        }
    }

    // Fills the form with the chosen event's current details and switches to the edit tab
    function handleEditStart(event) {
        setFormData({
            name: event.Name || "",
            description: event.Description || "",
            location: event.Location || "",
            venue: event.Venue || "",
            genre: event.Genre || "",
            imgURL: event.ImgURL || "",
            date: toInputDate(event.Date),
            capacity: event.Capacity || "",
            price: event.Price || "",
        });
        setEditingEvent(event.EventID);
        setErrors({});
        setApiError(null);
        setView("edit");
    }

    // Sends a PUT request to save the edited event, then updates the list
    async function handleEditSave() {
        setApiError(null);
        const validateCheck = validateEventUpdate(formData);
        if(!validateCheck.isValid){
            setErrors(validateCheck.errors);
            return;
        }
        const res = await fetch(`/api/event/update/${editingEvent}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        if(data.success) {
            // Replace the old event data in state with the updated values
            setEvents((prev) => prev.map((e) => e.EventID === editingEvent ? {
                ...e,
                Name: formData.name,
                Description: formData.description,
                Location: formData.location,
                Venue: formData.venue,
                Genre: formData.genre,
                ImgURL: formData.imgURL,
                Date: formData.date,
                Capacity: formData.capacity,
                Price: formData.price,
            } : e));
            setEditingEvent(null);
            setView("events");
            setFormData({ name: "", description: "", location: "", venue: "", genre: "", imgURL: "", date: "", capacity: "", price: ""});
        } else {
            setApiError(data.message || data.error || "Failed to update event. Please try again.");
        }
    }

    // Sends a DELETE request and removes the event from list
    async function handleDelete(eventID){
        setDeleteError(null);
        const res = await fetch(`/api/event/${eventID}`,{method: "DELETE" });
        const data = await res.json();
        if(data.success){
            setEvents((prev) => prev.filter((e) => e.EventID !== eventID));
        } else {
            setDeleteError(data.message || data.error || "Failed to delete event. Please try again.");
        }
        setConfirmDeleteID(null);
    }

    // Reusable form used for both creating and editing an event
    function EventForm({ onSubmit, submitLabel }) {
        return (
            <>
                <label> Event Name</label>
                <input name="name" value={formData.name} onChange={handleFormChange} placeholder=" Event name" />
                {errors.name && <span className="error">{errors.name}</span>}

                <label> Description </label>
                <input name="description" value={formData.description} onChange={handleFormChange} placeholder=" Enter Description" />

                <label> Location </label>
                <input name="location" value={formData.location} onChange={handleFormChange} placeholder="Enter Location" />
                {errors.location && <span className="error">{errors.location}</span>}

                <label> Venue</label>
                <input name="venue" value={formData.venue} onChange={handleFormChange} placeholder=" Enter Venue " />
                {errors.venue && <span className="error">{errors.venue}</span>}

                <label> Genre</label>
                <input name="genre" value={formData.genre} onChange={handleFormChange} placeholder=" Event Genre" />
                {errors.genre && <span className="error">{errors.genre}</span>}

                <label> Image URL</label>
                <input name="imgURL" value={formData.imgURL} onChange={handleFormChange} placeholder=" Enter image URL" />
                {errors.imgURL && <span className="error">{errors.imgURL}</span>}

                <label> Date </label>
                <input name="date" type="date" value={formData.date} onChange={handleFormChange} />
                {errors.date && <span className="error">{errors.date}</span>}

                <label> Capacity</label>
                <input name="capacity" type="number" value={formData.capacity} onChange={handleFormChange} placeholder=" Enter Capacity" />
                {errors.capacity && <span className="error">{errors.capacity}</span>}

                <label> Price (€) </label>
                <input name="price" type="number" value={formData.price} onChange={handleFormChange} placeholder=" Event Price " />
                {errors.price && <span className="error">{errors.price}</span>}

                {apiError && <p className="error">{apiError}</p>}
                <button onClick={onSubmit}>{submitLabel}</button>
            </>
        );
    }

    return (
    <main className="dashboard">
        <h1>Organiser Dashboard</h1>

        {/* Tab buttons to switch between viewing events, creating, or editing */}
        <div className="dashboard-tabs">
            <button
                className={view === "events" ? "tab-active" : "tab"}
                onClick={() => { setView("events"); setEditingEvent(null); }}
            >
                My Events
            </button>
            <button
                className={view === "create" ? "tab-active" : "tab"}
                onClick={() => {
                    setView("create");
                    setEditingEvent(null);
                    setFormData({ name: "", description: "", location: "", venue: "", genre: "", imgURL: "", date: "", capacity: "", price: "" });
                    setErrors({});
                    setApiError(null);
                }}
            >
                Create Event
            </button>
        </div>

        {/* Show all events with edit and delete buttons */}
        {view === "events" && (
            <section className="dashboard-section">
                {deleteError && <p className="error">{deleteError}</p>}
                {events.length === 0 ? (
                    <p> You Have Not Created Any Events Yet.</p>
                ) : (
                    events.map((event) => (
                        <div key={event.EventID} className="dashboard-event-card">
                            <h3>{event.Name}</h3>
                            <p>{event.Venue} - {event.Location}</p>
                            <p>{new Date(event.Date).toLocaleDateString()}</p>
                            <p>€{event.Price}</p>
                            <p>{event.attendeeCount} attendees registered</p>
                            <button onClick={() => handleEditStart(event)} className="cancel-btn">Edit</button>
                            {/* Ask the user to confirm before actually deleting */}
                            {confirmDeleteID === event.EventID ? (
                                <div className="confirm-delete">
                                    <p>Are you sure you want to delete this event?</p>
                                    <button onClick={() => handleDelete(event.EventID)} className="delete-btn">Yes, Delete</button>
                                    <button onClick={() => setConfirmDeleteID(null)} className="cancel-btn">Cancel</button>
                                </div>
                            ) : (
                                <button onClick={() => setConfirmDeleteID(event.EventID)} className="delete-btn">Delete</button>
                            )}
                        </div>
                    ))
                )}
            </section>
        )}

        {/* Show the blank create form */}
        {view === "create" && (
            <section className="dashboard-section">
                <h2>Create New Event</h2>
                <EventForm onSubmit={handleCreate} submitLabel="Create Event" />
            </section>
        )}

        {/* Show the pre-filled edit form */}
        {view === "edit" && (
            <section className="dashboard-section">
                <h2>Edit Event</h2>
                <EventForm onSubmit={handleEditSave} submitLabel="Save Changes" />
            </section>
        )}
    </main>
    )
}
