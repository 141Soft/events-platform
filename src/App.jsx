import './App.css'
import { EventList } from './components/EventList'
import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { UserProvider } from './contexts/UserProvider';
import { EventManager } from './components/EventManager';
import { Header } from './components/Header';
import { EventCounter } from './components/EventCounter';

export const App = () => {

  //For displaying errors in UI
  const [error, setError] = useState()
  const [displayAddEvent, setDisplayAddEvent] = useState(false);
  const [displayUserEvents, setDisplayUserEvents] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventView, setEventView] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCalendar, setHasCalendar] = useState(false);
  
  //params: id, name, tag, paginate, page, limit
  //pagination parameters are placed here for now
  const [searchParams, setSearchParams] = useState({paginate:true, limit:10, page: 1});
  const [eventCount, setEventCount] = useState(0);

  return (
    <UserProvider>
      <Header setEvents={setEvents} displayUserEvents={displayUserEvents} setDisplayUserEvents={setDisplayUserEvents} setSearchParams={setSearchParams} setEventView={setEventView} setIsLoading={setIsLoading} setHasCalendar={setHasCalendar}/>
      { error ? <p className='error-message'>{error}</p> : '' }
      <div className='main-content'>
        <EventCounter events={events} eventCount={eventCount} displayUserEvents={displayUserEvents} setDisplayUserEvents={setDisplayUserEvents} setSearchParams={setSearchParams} isLoading={isLoading}/>
        <SearchBar setSearchParams={setSearchParams} setError={setError} setDisplayAddEvent={setDisplayAddEvent} displayUserEvents={displayUserEvents}/>
        {displayAddEvent ? <EventManager setDisplayAddEvent={setDisplayAddEvent} setEvents={setEvents}/> : ''}
        <EventList searchParams={searchParams} setError={setError} events={events} setEvents={setEvents} eventView={eventView} setEventView={setEventView} isLoading={isLoading} setIsLoading={setIsLoading} setDisplayUserEvents={setDisplayUserEvents} displayUserEvents={displayUserEvents} setEventCount={setEventCount} hasCalendar={hasCalendar} setHasCalendar={setHasCalendar}/>
      </div>
    </UserProvider>
  )
}
