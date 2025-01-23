import React, { useEffect, useState } from "react";
import { EventThumb } from "./EventThumb";
import { getEvents } from "../../api";


export const EventList = ({ searchParams, setError }) => {

    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=> {
        const loadData = async() => {
            try {
                const data = await getEvents(searchParams);
                setEvents(data.events);
                setIsLoading(false);
            } catch (err) {
                console.error(err)
                throw err;
            }
        }
        loadData();
    }, [searchParams]);

    //Conditional on events array and fetched status
    if(events.length === 0 && !isLoading){
        return (
            <div>
                <p>Oops. Looks like we don't have any events to show.</p>
            </div>
        )
    } else if (isLoading){
        return (
            <div>
                <p>Placeholder loading status</p>
            </div>
        )
    } else {
        return (
            <div className="event-list-container">
                <ul className="event-list">
                    {
                        events.map((event) => 
                            <li className="event-list-entry" key={ event.id }>
                                <EventThumb event={event}/>
                            </li>
                        )
                    }
                </ul>
            </div>
        )
    }
}