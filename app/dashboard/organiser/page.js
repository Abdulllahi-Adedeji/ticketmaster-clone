"use client";
import {useState, useEffect } from "react";
import{validateEventUpdate} from "../../lib/validation";
import '../../styles/dashboard.css'

export default function OrganiserDashboard(){
    //stores what tab is active
    const [view, setView] = useState("events");
    //stores all events for organiser
    const [events, setEvents] = useState([]);
    //stores validation errors
    const [errors, setErrors] = useState({});
    const [organiserID, setOrganiserID] = useState(null);

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

    //runs when th page loads and is logged in organisers events
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

    //handle input changes and clears errors for that field as user types
    function handleFormChange(e){
        const { name, value } = e.target;
        //using spread operator
        setFormData((prev => ({...prev, [name]: value})));
        setErrors((prev) => ({ ...prev, [name]: ""}));
    }

    async function handleCreate() {
        //validates all forms 
        const validateCheck = validateEventUpdate(formData);
        if(!validateCheck.isValid){
            setErrors(validateCheck.errors);
            return;
        }

        const res = await fetch ("/api/event/add",{
            method: "POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({...formData, organiserID}),
        });
        const data = await res.json();
        if(data.success) {
            setEvents((prev) => [...prev, {...formData, EventID: data.eventID, attendeeCount :0}]);
            setView("events");
            setFormData({ name: "", description :"", location: "", venue: "", genre:"", imgURL: "", capacity: "", price: "",});
        }       
    }
    //removes event from the database and updates the list
    async function handleDelete(eventID){
        const res = await fetch(`/api/event/${eventID}`,{method: "DELETE" });
        const data = await res.json();
        if(data.success){
            setEvents((prev) => prev.filter((e) => e.EventID !== eventID));
        }
    }

    return (
    <main className="dashboard">
        <h1>Organiser Dashboard</h1>
        <div className="dashboard-tabs">
            <button
                className={view === "events" ? "tab-active" : "tab"}
                onClick={() => setView("events")}
            >
                My Events
            </button>
            <button
                className={view === "create" ? "tab-active" : "tab"}
                onClick={() => setView("create")}
            >
                Create Event
            </button>
        </div>
            {view ==="events" && (
                <section className="dashboard-section">
                    {events.length === 0 ? (
                        <p> You Have Not Created Any Events Yet.</p>
                    ) : (
                        //loops through each event and creates  an event card with its details
                        events.map((event) => (
                            <div key = {event.EventID} className="dashboard-event-card">
                                <h3>{event.Name}</h3>
                                <p>{event.Venue} - {event.Location}</p>
                                <p> {new Date (event.Date).toLocaleDateString()}</p>
                                <p>€{event.Price}</p>
                                {/* attendee comes from the database when events are fetched */}
                                <p>{event.attendeeCount} attendees registered</p>
                                <button onClick={() => handleDelete(event.EventID)} className="delete-btn">
                                    Delete
                                </button>

                            </div>
                        ))
                    )}
                </section>
            )}
            {view === "create" && (
                <section className="dashboard-section">
                    <h2> Create New Event</h2>

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
                    <input name="capacity"  type ="number" value={formData.capacity} onChange={handleFormChange} placeholder=" Enter Capacity" />
                    {errors.capacity && <span className="error">{errors.capacity}</span>}

                    <label> Price (€) </label>
                    <input name="price"  type="number" value={formData.price} onChange={handleFormChange} placeholder=" Event Price " />
                    {errors.price && <span className="error">{errors.price}</span>}

                    <button onClick={handleCreate}>Create Event </button>
                </section>
            )}

    </main>
    )
}