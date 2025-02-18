import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../contexts/UserProvider";
import { useGoogleLogin } from '@react-oauth/google';
import { getUser } from '../googleApi';
import { postLogin } from "../api";
import { RotatingLines } from "react-loader-spinner";
import { getUserEvents } from "../api";
import { getImage } from "../api";


export const Header = ({ setEvents, displayUserEvents, setDisplayUserEvents, setSearchParams, setEventView, setIsLoading }) => {

    const { user, setUser } = useContext(UserContext);
    const { adminUser, setAdminUser } = useContext(UserContext);
    const [displayOptions, setDisplayOptions] = useState(false);
    const [displayAdminLogin, setDisplayAdminLogin] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if(displayOptions) {
            document.addEventListener('mousedown', closeWindow);
        }
        return () => {
            document.removeEventListener('mousedown', closeWindow);
        }
    }, [displayOptions]);

    const displayUserEvs = async () => {
        setDisplayUserEvents(prev => !prev);
        setEventView(null);
        if(displayUserEvents){
            setSearchParams(prev => ({...prev}));
            return false;
        };
        try{
            setIsLoading(true);
            const events = await getUserEvents(user?.email);
            if(events.length !== 0){
                for(const event of events){
                    const image = await getImage(event.eventThumb);
                    event.image = URL.createObjectURL(image);
                };
            } 
            setEvents(events);
        } catch(err) {
            console.error(err);
            setError(err.message);
            setTimeout(()=> setError(false), 3000);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const generateUser = async(response) => {
        const { data } = await getUser(response.access_token);
        setUser({...response, email: data.email, picture: data.picture});
    };

    const login = useGoogleLogin({
        onSuccess: async (response) => await generateUser(response),
        onError: (error) => console.error(error),
        scope: 'https://www.googleapis.com/auth/calendar',
    });

    const closeWindow = (e) => {
        if(ref.current && !ref.current.contains(e.target)){
            setDisplayOptions(false);
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            setError('');
            setLoggingIn(true)
            const res = await postLogin(email, password);
            if(res?.status !== 'success'){
                throw new Error('Login Failed');
            };
            setAdminUser(res.user);
            setEmail('');
            setPassword('');
        } catch(err) {
            setError(err.message);
            setPassword('');
            console.error(err);
        } finally {
            setLoggingIn(false);
            if(adminUser.isAdmin){
                setDisplayAdminLogin(false);
            };
        };
    };

    return (
        <>
            <header className='main-header'>
                { user?.email ? 
                <div className='google-account'>
                    <img src={user.picture} />
                    <button className="user-link" title="View Options" disabled={displayOptions} onClick={() => setDisplayOptions(true)}>{user.email}</button>
                </div>
                : 
                <div className='google-account'>
                    <button className="user-link" title="Sign-in options" disabled={displayOptions} onClick={() => setDisplayOptions(true)}>Account</button>
                </div>
                }
            </header>
            {displayOptions ? 
                <div className="options-menu" ref={ref}>
                        {user?.email ? <button title="Display your signed up events" style={{textDecoration: displayUserEvents ? 'underline' : ''}} onClick={displayUserEvs}>View my events</button> : ''}
                        {user?.access_token ? 
                            <button title="Disconnect Google Account" onClick={() => setUser(null)}>Google Logout</button> 
                            : 
                            <button title="Connect Google Account" onClick={login}>Google Login</button>
                            }
                            { loggingIn ? <div className="login-loader"><RotatingLines
                            strokeColor="#FFFFFF"
                            strokeWidth="5"
                            animationDuration="0.75"
                            width="48"
                            visible={true}/></div>
                        :''}
                        {adminUser?.userName ?
                            <p>Admin: {adminUser.userName}</p>
                            :
                            ''
                            }
                        {adminUser?.isAdmin ?
                            <button title="Staff Logout" onClick={() => setAdminUser(null)}>Logout</button> 
                            : 
                            <button title="Staff Login" style={{textDecoration: displayAdminLogin ? 'underline' : ''}} onClick={() => setDisplayAdminLogin(prev => !prev)}>Staff Login</button>
                            }
                        
                        {displayAdminLogin && !adminUser?.isAdmin ? 
                            <form onSubmit={handleSubmit}>
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
                                {error ? <p className="login-error">{error}</p> : ''}
                                <button type="submit">Login</button>
                            </form>
                            : 
                            ''
                            }
                </div>
            :''}
        </>
    )
}