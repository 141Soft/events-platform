import axios from "axios";

const googleApi = axios.create({
    baseURL:'https://www.googleapis.com'
});

export const updateCalendar = async (accessToken, event) => {
    
    const eventToPost = {
        "start": {
            "dateTime": "2025-02-02T17:00:00",
            "timeZone": "Europe/London"
        },
        "end": {
            "dateTime": "2025-02-02T19:00:00",
            "timeZone": "Europe/London"
        },
        "summary": `${event.eventName}`,
    }

    try {
        const response = await googleApi.post('/calendar/v3/calendars/primary/events', eventToPost, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("Event Created:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating event:', error);
        throw error;
    };
};