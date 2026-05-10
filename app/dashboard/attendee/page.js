"use client";
import { useState, useEffect } from "react";
import '../../styles/dashboard.css'

export default function AttendeeDashboard(){

    //this tracks which tab is active
    const [view, setView] = useState("upcoming");
    //stores bookings from database
    const [bookings, setBookings] = useState([]);

    //this it gets all the bookings from database  when the page is loaded 
    useEffect(() =>{
        async function loadBookings() {
            const me = await fetch ("/api/me");
            const meData = await me.json();
            const res = await fetch(`/api/booking/user/${meData.userID}`);
            const data =await res.json();
            setBookings(data.bookings || []);
            
        }
            loadBookings();
    },
    []);

    //this handles removing of a booking from the database
    async function handleUnregister(bookingID) {
        const res = await fetch(`/api/booking/${bookingID}`,{method:"DELETE"});
        const data = await res.json();
        if(data.success){
            setBookings((prev) => prev.filter((b) => b.BookingID !== bookingID));

        }
        
    }


    const now = new Date();
    //splits the bookings into  upcoming and past based on events data
    const upcoming = bookings.filter((b) => new Date(b.Date) >= now);
    const past = bookings.filter((b) => new Date(b.Date) < now);

    //displays the changes based on what tab is active
    const displayed = view ===  "upcoming" ? upcoming :past;


    return(
        <main className="dashboard">
            <h1> My Dashboard</h1>

            <div className="dashboard-tabs">
                {/* the classname switches between tab-active and tab to highlight what tab is selected
                    when the buttons are click it switched the tab and the value of view from upcoimg to past 
                */}

                <button
                    className={view === "upcoming" ? "tab-active" : "tab"}
                    onClick={() => setView("upcoming")}
                >
                    Upcoming Events
                </button>

                <button
                    className={view === "past" ? "tab-active" : "tab"}
                    onClick={() => setView("past")}
                >
                    Past Events
                </button>
            </div>
                
            <section className="dashboard-section">
                {displayed.length === 0 ? (
                    <p> No {view} events found.</p>
                ) : (
                    //.map loops through each booking and creates a booking card with its informations
                    displayed.map((bookings) => (
                        <div key={bookings.BookingID} className="dashboard-booking-card">
                            <h3>{bookings.Name}</h3>
                            <p>{bookings.Venue}- {bookings.Location}</p>
                            {/* to LocalDateString formats the date into a readable string */}
                            <p>{new Date(bookings.Date).toLocaleDateString()}</p>
                            <p>€{bookings.Price}</p>
                            {/*  unregister button only shows on upcoming events, not past ones */}
                            {view === "upcoming" && (   
                                <button
                                    className="delete-btn"
                                    onClick={()=> handleUnregister(bookings.BookingID)}
                                >
                                    Unregister
                                </button>

                            )}
                        </div>
                    ))
                )}
            </section>
        </main>
    );

}
/*references
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString (for to loacal date string)
http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map for mapping  bookings into array
*/
