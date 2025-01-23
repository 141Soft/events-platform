import React, { useEffect, useState } from "react";
import { EventThumb } from "./EventThumb";
import { getEvents } from "../../api";

export const EventList = ({ searchParams, setSearchParams, setError }) => {

    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    useEffect(()=> {
        const loadData = async() => {
            try {
                const data = await getEvents(searchParams);
                setEvents(data.events);
                setIsLoading(false);
                setTotalPages(data.pagination.totalPages);
            } catch (err) {
                console.error(err)
                throw err;
            }
        }
        loadData();
    }, [searchParams]);

    const pageNavigate = (e) => {
        e.preventDefault();
        if(e.currentTarget.getAttribute('data-operation') === 'decrement' && searchParams.page !== 1){
            const newParams = {...searchParams};
            newParams.page--;
            setSearchParams({...newParams});
        } else if(e.currentTarget.getAttribute('data-operation') === 'increment' && searchParams.page < totalPages){
            const newParams = {...searchParams};
            newParams.page++;
            setSearchParams({...newParams});
        }
    }

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
                <button aria-label="Previous Page" data-operation='decrement' onClick={pageNavigate}>{'<'}</button>
                <button aria-label="Next Page" data-operation='increment' onClick={pageNavigate}>{'>'}</button>
                <p>{searchParams.page} of {totalPages}</p>
            </div>
        )
    }
}