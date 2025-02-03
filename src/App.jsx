import './App.css'
import { EventList } from './components/EventList'
import React, { useEffect, useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { UserProvider } from './contexts/UserProvider';
import { LoginManager } from './components/LoginManager';
import { postLogin } from './api';
import { EventManager } from './components/EventManager';

export const App = () => {

  //For displaying errors in UI
  const [error, setError] = useState()
  const [display, setDisplay] = useState(false);
  const [displayAddEvent, setDisplayAddEvent] = useState(false);
  
  //params: id, name, tag, paginate, page, limit
  //pagination parameters are placed here for now
  const [searchParams, setSearchParams] = useState({paginate:true, limit:10, page: 1});
  const [eventCount, setEventCount] = useState(0);
  
  // const onClick = async () => {
  //   await postLogin('bob@example.com', 'buildStrong1');
  // }

  return (
    <UserProvider>
      <header className='main-header'>
          <button onClick={() => setDisplay(true)}>Account</button>
      </header>
      <div className='main-content'>
        <p className='event-counter'>Browsing {eventCount} {eventCount === 1 ? 'event' : 'events'}</p>
        {display ? <LoginManager setDisplay={setDisplay} error={error} setError={setError}/> : ''}
        <SearchBar setSearchParams={setSearchParams} setError={setError} setDisplayAddEvent={setDisplayAddEvent}/>
        {displayAddEvent ? <EventManager setDisplayAddEvent={setDisplayAddEvent}/> : ''}
        <EventList searchParams={searchParams} setSearchParams={setSearchParams} setEventCount={setEventCount} setError={setError}/>
      </div>
    </UserProvider>
  )
}
