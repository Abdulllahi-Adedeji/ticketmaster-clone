export const EVENTS = [
    {
        id: 1,
        organizerId: 2,
        name: "Twenty One Pilots",
        description: "TOP Concert",
        location: "Dublin",
        stadium: "Aviva Stadium",
        date: "2026-08-12T19:30:00",
        capacity: 500,
        bookedCount: 490,
        price: 120.00,
        status: "active",
        genre: "Rock",
        imgURL: "https://prismic-images.tmol.io/ticketmaster-tm-global/ZwfjBoF3NbkBXMix_TourPressPhoto.jpg?auto=format,compress&rect=0,338,4800,2025&w=1024&h=432",
    },
    {
        id: 2,
        organizerId: 2,
        name: "Twenty One Pilots",
        description: "TOP Concert",
        location: "Dublin",
        stadium: "3Arena",
        date: "2026-08-12T19:30:00",
        capacity: 500,
        bookedCount: 495,
        price: 65.00,
        status: "active",
        genre: "Rock",
        imgURL: "https://prismic-images.tmol.io/ticketmaster-tm-global/ZwfjBoF3NbkBXMix_TourPressPhoto.jpg?auto=format,compress&rect=0,338,4800,2025&w=1024&h=432",
    },

    {
        id: 3,
        organizerId: 2,
        name: "Noah Kahan",
        description: "Sad music.",
        location: "Manchester",
        stadium: "Etihad Stadium",
        date: "2026-08-15T18:30:00",
        capacity: 500,
        bookedCount: 499,
        price: 105.00,
        status: "active",
        genre: "Indie",
        imgURL: "https://prismic-images.tmol.io/ticketmaster-tm-global/adfQlp1ZCF7ETCwg_20251117_Noah_Kahan_GREAT-DIVIDE_photo-Patrick-McCormack_rd2_2Z4A1448.JPG?auto=format%2Ccompress&rect=0%2C73%2C5129%2C2164&w=2048&h=864",
    },
]

// this helps find a specific event by id
export function getEventById(id) {
    const event =  EVENTS.find(e => e.id === Number(id));

    if (!event) {
        return null;
    }

    return event;
}

// this calculates the remaining ticket availability
export function getSpotsLeft(event) {
    return event.capacity - event.bookedCount;
}

// this formats each event date for display
export function formatDate(datetimeStr) {
    return new Date(datetimeStr).toLocaleDateString('en-IE', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
}

export function formatTime(datetimeStr) {
    return new Date(datetimeStr).toLocaleTimeString('en-IE', {
        hour: '2-digit', minute: '2-digit'
    });
}

export function formatShortDate(datetimeStr) {
    return new Date(datetimeStr).toLocaleDateString('en-IE', {
        day: 'numeric', month: 'short'
    });
}
