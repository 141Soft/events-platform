import './App.css'
import { EventList } from './components/EventList'
import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';

function App() {

  //For displaying errors in UI
  const [error, setError] = useState();
  
  //for testing
  //params: id, name, tag, paginate, page, limit
  const [searchParams, setSearchParams] = useState({paginate:true});

  const [eventCount, setEventCount] = useState(0);
  

  return (
    <>
      <SearchBar searchParams={searchParams} setSearchParams={setSearchParams} setError={setError}/>
      <p>We have {eventCount} events</p>
      <EventList searchParams={searchParams} setSearchParams={setSearchParams} setEventCount={setEventCount} setError={setError}/>
    </>
  )
}

export default App
