import { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const [user, setUser] = useState([]);
    const [adminUser, setAdminUser] = useState({});

    return (
        <UserContext.Provider value={{user, setUser, adminUser, setAdminUser}}>
            {children}
        </UserContext.Provider>
    );
};

