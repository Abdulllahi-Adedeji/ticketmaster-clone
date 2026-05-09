export const EVENTS = [
    {
        id: 1,
        organizerId: 2,
        name: "Artist 1",
        description: "Artist Desc",
        location: "Dublin",
        stadium: "Aviva Stadium",
        date: "2026-08-12T19:30:00",
        capacity: 500,
        bookedCount: 499,
        price: 65.00,
        status: "active",
    },

    {
        id: 2,
        organizerId: 2,
        name: "Artist 2",
        description: "Artist Desc",
        location: "Manchester",
        stadium: "Etihad Stadium",
        date: "2026-08-15T18:30:00",
        capacity: 500,
        bookedCount: 500,
        price: 105.00,
        status: "active",
    }
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
