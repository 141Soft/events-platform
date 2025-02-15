import React, { useContext } from "react";
import { UserContext } from "../contexts/UserProvider";


export const Header = ({setDisplay}) => {

    const { user, setUser } = useContext(UserContext);

    return (
        <header className='main-header'>
            { user ? 
            <div className='google-account'>
                <img src={user.picture} />
                <p>{user.email}</p>
            </div> 
            : ''}
          
          <button onClick={() => setDisplay(true)}>Account</button>
      </header>
    )
}