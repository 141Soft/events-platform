import React, { useEffect, useState, useRef, useCallback } from "react";
import { EventThumb } from "./EventThumb";
import { getEvents } from "../api";
import debounce from "lodash.debounce";

export const EventList = ({ searchParams, setSearchParams, setEventCount, setError }) => {

    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [pageRef, setPageRef] = useState(1);
    const [middleIndex, setMiddleIndex] = useState(-1);
    const listRef = useRef(null);

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

    const debounceScrollHandler = debounce(() => {
        setEvents([...events]);
    }, 50);

    useEffect(() => {
        //ensures re-render on scrolling event-list
        if(listRef.current) {
            listRef.current.addEventListener('scroll', debounceScrollHandler);
            return () => listRef.current.removeEventListener('scroll', debounceScrollHandler);
        }

    }, [debounceScrollHandler]);

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

    const handleWheel = (e) => {
        e.preventDefault();
        listRef.current.scrollLeft += e.deltaY;

    }

    
    //Finding middle item for effects
    useEffect(() => {
        if (!listRef.current || events.length === 0) return;

        const listRect = listRef.current.getBoundingClientRect();
        const listCenter = listRect.left + listRect.width / 2;
        
        let closestIndex = -1;
        let minDistance = Infinity;

        events.forEach((event, index) => {
            const itemRect = listRef.current.children[index].getBoundingClientRect();
            const itemCenter = itemRect.left + itemRect.width / 2;
            const distance = Math.abs(itemCenter - listCenter);
            
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        });

        if (closestIndex !== middleIndex) {
            setMiddleIndex(closestIndex);
        }
    }, [events]);



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
            <div className="event-list-container" >
                <p>{pageRef} of {totalPages}</p>
                <ul className="event-list" onWheel={handleWheel} ref={listRef}>
                    {/* {events.length <= 1 ? '' : <li className={"event-list-entry item0"}></li>} */}
                    {
                        events.map((event, index) => 
                            <li className={`event-list-entry ${index === middleIndex ? 'middle-item' : ''} ${index === middleIndex - 1 ? 'left-middle': ''} ${index === middleIndex + 1 ? 'right-middle': ''} ${index < middleIndex - 1 ? 'left': ''} ${index > middleIndex + 1 ? 'right': ''}`} 
                                            
                                            key={ event.id }>
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