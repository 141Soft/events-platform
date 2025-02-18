import React, { useEffect, useState, useRef, useCallback, useContext } from "react";
import { MemoEventThumb } from "./EventThumb";
import { getEvents, getImage, getUserEvents } from "../api";
import debounce from "lodash.debounce";
import { EventView } from "./EventView";
import { RotatingLines } from "react-loader-spinner";
import { UserContext } from "../contexts/UserProvider";

export const EventList = ({ searchParams, setEventCount, setError, events, setEvents, eventView, setEventView, isLoading, setIsLoading, displayUserEvents, hasCalendar, setHasCalendar }) => {
    const [totalPages, setTotalPages] = useState(1);
    const [pageRef, setPageRef] = useState(1);
    const [middleIndex, setMiddleIndex] = useState(-1);
    const [joinedEvents, setJoinedEvents] = useState([]);
    const [displayInstruction, setDisplayInstruction] = useState(false);
    const listRef = useRef(null);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const loadUserEvents = async() => {
            try{
                const events = await getUserEvents(user?.email);
                if(events.length === 0){
                    return false;
                };
                const eventIDs = events.map((e) => e = e.id);
                setJoinedEvents([...eventIDs]);
            } catch(err) {
                console.error(err);
                setError(err.message);
                setTimeout(()=> setError(false), 3000);
                throw err;
            }
        }
        if(user?.email){
            loadUserEvents();
        } else {
            setJoinedEvents([]);
        };
    }, [user]);
    
    useEffect(()=> {
        const loadData = async() => {
            setIsLoading(true);
            try {
                const data = await getEvents(searchParams);
                if(!data){
                    setError("Error retrieving events");
                    setTimeout(()=> setError(""), 3000);
                    return false;
                }
                for(const event of data.events){
                    const image = await getImage(event.eventThumb);
                    event.image = URL.createObjectURL(image);
                };
                setEvents(data.events);
                setIsLoading(false);
                setTotalPages(data.pagination?.totalPages);
                setPageRef(data.pagination.page);
                setEventCount(data.pagination.count);
            } catch (err) {
                console.error(err)
                setError(err.message);
                throw err;
            } finally {
                setIsLoading(false);
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
        if (middleIndex === events.length - 3 && pageRef !== totalPages && events.length !== 0 && !isLoading && !displayUserEvents) {
            const loadNextPage = async() => {
                try {
                    const newSearchParams = {...searchParams};
                    newSearchParams.page = pageRef + 1;
                    const data = await getEvents(newSearchParams);
                    for(const event of data.events){
                        const image = await getImage(event.eventThumb);
                        event.image = URL.createObjectURL(image);
                    };


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
        }

    }



    //Conditional on events array and fetched status
    return (
        <>
        <div className="event-list-container" >

            { isLoading ? <div className="loader"><RotatingLines
                            strokeColor="#a47864"
                            strokeWidth="5"
                            animationDuration="0.75"
                            width="72"
                            visible={true}/> </div>
                        :''}
            { events.length === 0 && !isLoading ?
                <div className="no-events-status">
                    <p>No events to show!</p>
                </div>
                : '' }
            <ul className="event-list" ref={listRef} onMouseEnter={() => setDisplayInstruction(true)} onMouseLeave={() => setDisplayInstruction(false)}>
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
            { events.length === 0 ? '' : <p className={`scroll-message  ${displayInstruction ? 'visible' : 'hidden'}`}>⟸ Scroll to explore ⟹</p> }
        </div>
        { eventView ? <EventView events={events} setEvents={setEvents} eventView={eventView} setEventView={setEventView} listRef={listRef} joinedEvents={joinedEvents} setJoinedEvents={setJoinedEvents} setEventCount={setEventCount} hasCalendar={hasCalendar} setHasCalendar={setHasCalendar}/> : '' }
        </>
        )
    }