import './App.css'
import { EventList } from './components/EventList'
import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { UserProvider } from './contexts/UserProvider';
import { EventManager } from './components/EventManager';
import { Header } from './components/Header';

export const App = () => {

  //For displaying errors in UI
  const [error, setError] = useState()
  const [displayAddEvent, setDisplayAddEvent] = useState(false);
  const [events, setEvents] = useState([]);
  
  //params: id, name, tag, paginate, page, limit
  //pagination parameters are placed here for now
  const [searchParams, setSearchParams] = useState({paginate:true, limit:10, page: 1});
  const [eventCount, setEventCount] = useState(0);

  return (
    <UserProvider>
      <Header />
      { error ? <p className='error-message'>{error}</p> : '' }
      <div className='main-content'>
        <p className='event-counter'>Browsing {eventCount} {eventCount === 1 ? 'event' : 'events'}</p>
        <SearchBar setSearchParams={setSearchParams} setError={setError} setDisplayAddEvent={setDisplayAddEvent}/>
        {displayAddEvent ? <EventManager setDisplayAddEvent={setDisplayAddEvent} setEvents={setEvents}/> : ''}
        <EventList searchParams={searchParams} setEventCount={setEventCount} setError={setError} events={events} setEvents={setEvents}/>
      </div>
    </UserProvider>
  )
}
