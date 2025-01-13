import React from "react";
import { EventThumb } from "./EventThumb";

export const EventList = ({events}) => {

    if(!events.length > 0){
        return (
            <div>
                <p>Oops. Looks like we don't have any events to show.</p>
            </div>
        )
    }

    return (
    <div className="event-list-container">
        <ul className="event-list">
            {
                events.map((event, index) => 
                    <li className="event-list-entry" key={ index }>
                        <EventThumb name={event.name} stub={event.stub}/>
                    </li>
                )
            }
        </ul>
    </div>
    )
}