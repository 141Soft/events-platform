import React, { useEffect, useState } from "react";
import { EventThumb } from "./EventThumb";
import { getEvents } from "../api";

export const EventList = ({ searchParams, setSearchParams, setEventCount, setError }) => {

    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [pageRef, setPageRef] = useState(1);
    useEffect(()=> {
        const loadData = async() => {
            try {
                const data = await getEvents(searchParams);
                setEvents(data.events);
                setIsLoading(false);
                setTotalPages(data.pagination?.totalPages);
                setPageRef(data.pagination.page);
                setEventCount(data.pagination.count);
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
            setSearchParams(prev => (
                {
                ...prev,
                page: prev.page - 1
                }
            ));
        } else if(e.currentTarget.getAttribute('data-operation') === 'increment' && searchParams.page < totalPages){
            setSearchParams(prev => (
                {
                    ...prev,
                    page: prev.page + 1
                }
            ))
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
                <p>{pageRef} of {totalPages}</p>
                <ul className="event-list">
                    {events.length <= 1 ? '' : <li className={"event-list-entry item0"}></li>}
                    {
                        events.map((event, index) => 
                            <li className={`event-list-entry item${index + 1}`} key={ event.id }>
                                <EventThumb event={event}/>
                            </li>
                        )
                    }
                </ul>
                <div className="event-list-nav">
                    <button aria-label="Previous Page" data-operation='decrement' onClick={pageNavigate}>{'<'}</button>
                    <button aria-label="Next Page" data-operation='increment' onClick={pageNavigate}>{'>'}</button>
                </div>
                
            </div>
        )
    }
}