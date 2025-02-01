import React, { useEffect, useState, useRef, useCallback } from "react";
import { MemoEventThumb } from "./EventThumb";
import { getEvents } from "../api";
import debounce from "lodash.debounce";
import { EventView } from "./EventView";

export const EventList = ({ searchParams, setSearchParams, setEventCount, setError }) => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [pageRef, setPageRef] = useState(1);
    const [middleIndex, setMiddleIndex] = useState(-1);
    const [eventView, setEventView] = useState(null);
    const [hasJoined, setHasJoined] = useState([]);
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
        listRef.current.scrollLeft = 0;
    },[]);

    useEffect(() => {
        //ensures re-render on scrolling event-list
        if(listRef.current) {
            listRef.current.addEventListener('scroll', debounceScrollHandler);
            return () => listRef.current.removeEventListener('scroll', debounceScrollHandler);
        }

    }, [debounceScrollHandler]);
    

    useEffect(() => {
        if(listRef.current){
            const handleWheel = (e) => {
                if(!eventView){
                    e.preventDefault();
                    listRef.current.scrollLeft += e.deltaY/4;
                };
            };
            const options = { passive: false };

            listRef.current.addEventListener('wheel', handleWheel, options);

            return () => {
                listRef.current.removeEventListener('wheel', handleWheel, options)
            };
        };
    }, [eventView]);
    
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

    useEffect(() => {
        //infinite scroll
        if (middleIndex === events.length - 1 && pageRef !== totalPages && events.length !== 0 && !isLoading) {
            console.log("hit")
            const loadNextPage = async() => {
                try {
                    const newSearchParams = {...searchParams};
                    newSearchParams.page = pageRef + 1;
                    const data = await getEvents(newSearchParams);
                    setEvents(prev => [...prev, ...data.events]);
                    setTotalPages(data.pagination?.totalPages);
                    setPageRef(data.pagination?.page);
                    setEventCount(data.pagination?.count);
                } catch (err) {
                    console.error(err)
                    throw err;
                }
            }
            loadNextPage();
        }
    }, [middleIndex, pageRef, totalPages, isLoading]);

    const handleClick = (e) => {
        e.preventDefault();
        //Check if this is the current card
        const i = Number(e.currentTarget.getAttribute('index'));
        if(i === middleIndex){
            setEventView(events[i]);
            console.log(eventView, events[i]);
        }

    }



    //Conditional on events array and fetched status
    return (
        <>
        <div className="event-list-container" >
            <ul className="event-list" ref={listRef}>
                {
                    events.map((event, index) => 
                        <li className={`event-list-entry ${index === middleIndex ? 'middle-item' : ''} ${index === middleIndex - 1 ? 'left-middle': ''} ${index === middleIndex + 1 ? 'right-middle': ''} ${index < middleIndex - 1 ? 'left': ''} ${index > middleIndex + 1 ? 'right': ''}`}                 
                                        key={ event.id }
                                        index={index}
                                        onClick={handleClick}
                                        >
                            <MemoEventThumb event={event} index={index} middleIndex={middleIndex} setEventView={setEventView}/>
                        </li>
                    )
                }
            </ul>
        </div>
        { eventView ? <EventView eventView={eventView} setEventView={setEventView} listRef={listRef} setHasJoined={setHasJoined} hasJoined={hasJoined} /> : '' }
        </>
        )
    }