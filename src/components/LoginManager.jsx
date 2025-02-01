import React, { useContext, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { UserContext } from '../contexts/UserProvider';
import { updateCalendar } from '../googleApi';

export const LoginManager = () => {

    const { user, setUser } = useContext(UserContext);

    const login = useGoogleLogin({
        onSuccess: (response) => setUser(response),
        onError: (error) => console.error(error),
        scope: 'https://www.googleapis.com/auth/calendar',
    });

    useEffect(() => {
        console.log(user);
    }, [user]);

    return(
        <div>
            <h1>LOGIN</h1>
            <button onClick={login}>GoogleSIGN</button>
        </div>
    )

}