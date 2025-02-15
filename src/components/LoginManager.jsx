import React, { useContext, useEffect, useState } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { UserContext } from '../contexts/UserProvider';
import { postLogin } from '../api';

export const LoginManager = ({ setDisplay }) => {

    const { user, setUser } = useContext(UserContext);
    const { adminUser, setAdminUser } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        console.log(user);
    }, [user]);

    const login = useGoogleLogin({
        onSuccess: (response) => setUser(response),
        onError: (error) => console.error(error),
        scope: 'https://www.googleapis.com/auth/calendar',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            setError('');
            const res = await postLogin(email, password);
            if(res?.status !== 'success'){
                throw new Error('Login Failed');
            }
            setAdminUser(res.user);
        } catch(err) {
            setError(err.message);
            console.error(err);
        }
    }

    return(
        <div className='login-window'>
            <button onClick={() => setDisplay(false)}>✕</button>
            <div className='login-container'>
                <div className='user-login'>
                    <h1>Public</h1>
                    <p>{!user?.access_token ?
                        'Connect your google account to register events'
                        :
                        'Google Calendar Connected'
                        }</p>
                    { !user?.access_token ?
                        <button className='google-sign' onClick={login}>GoogleSIGN</button>
                        :
                        <button className='google-signout' onClick={() => setUser(null)}>Logout</button>
                    }
                </div>
                <div className='staff-login'>
                    <h1>Staff</h1>
                    {
                        adminUser?.userName ? 
                        <>
                            <p>{`Welcome, ${adminUser.userName}.`}</p>
                            <button className='admin-logout' onClick={() => setAdminUser({})}>Logout</button>
                        </>
                        :
                        <form className='staff-form' onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email">Email:</label>
                                <input 
                                    type="text" 
                                    id="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div>
                                <label htmlFor="password">Password:</label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                />
                            </div>
                            {error && <p style={{color: 'red'}}>{error}</p>}
                            <button type="submit">Login</button>
                        </form>
                    }
                </div>
            </div>
        </div>
    )

}