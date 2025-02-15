import axios from "axios";
import { incrementDateTime } from "./utils/parsers";

const googleApi = axios.create({
    baseURL:'https://www.googleapis.com'
});

export const updateCalendar = async (accessToken, event) => {

     
    
    const eventToPost = {
        "start": {
            "dateTime": event.eventDate,
            "timeZone": "Europe/London"
        },
        "end": {
            "dateTime": incrementDateTime(event.eventDate, event.eventDuration),
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
        return response;
    } catch (error) {
        throw error;
    };
};

export const getUser = async (accessToken) => {

    try{
        const response = await googleApi.get(`/oauth2/v2/userinfo?access_token="${accessToken}"`);
        return response;
    } catch (error) {
        throw error;
    };
};