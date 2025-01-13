import './App.css'
import { EventList } from './components/EventList'

function App() {
  
  //for testing
  const events =[{name:"Test1", stub:"Text"}, {name: "Test2", stub:"Text"}, {name: "Test3", stub:"Text"}]
  

  return (
    <>
      <EventList events={events}/>
    </>
  )
}

export default App
