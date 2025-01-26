import './App.css'
import { EventList } from './components/EventList'
import React, { useEffect, useState } from 'react';
import { SearchBar } from './components/SearchBar';

export const App = () => {

  //For displaying errors in UI
  const [error, setError] = useState()
  
  //params: id, name, tag, paginate, page, limit
  //pagination parameters are placed here for now
  const [searchParams, setSearchParams] = useState({paginate:true, limit:5, page: 1});
  const [eventCount, setEventCount] = useState(0);

  
  

  return (
    <>
    <div className='main-content'>
      <SearchBar setSearchParams={setSearchParams} setError={setError}/>
      <p>We have {eventCount} events</p>
      <EventList searchParams={searchParams} setSearchParams={setSearchParams} setEventCount={setEventCount} setError={setError}/>
    </div>
    </>
  )
}
