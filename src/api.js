import axios from 'axios';

const serverApi = axios.create({
    baseURL:import.meta.env.VITE_API_URL
});



serverApi.defaults.withCredentials = true;

export const getEvents = async (searchParams) => {

    let queryParams = [];

    for(const [key, value] of Object.entries(searchParams)){
        queryParams.push(`${key}=${value}`);
    }

    try{
        const res = await serverApi.get('/events?' + queryParams.join('&'));
        return res.data;
    } catch (err) {
        console.error(err);
    }
}

export const postEvent = async (formData) => {
    try{
        const res = await serverApi.post('/events', formData, {
            header: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        });
        return res;
    } catch(err) {
        console.error(err);
    }
}

export const getTags = async () => {
    try{
        const res = await serverApi.get('/events/tags');
        return res.data;
    } catch (err) {
        console.error(err);
    }
};

export const getImage = async (path) => {
    try{
        const res = await serverApi.get('/events/images?'+'path='+path, {
            responseType: 'blob',
        });
        return res.data;
    } catch(err) {
        console.error(err);
    }
}

export const postLogin = async (email, password) => {
    try{
        const res = await serverApi.post('/users/login', {
            withCredentials: true,
            email,
            password
        });
        return res.data;
    } catch (err) {
        console.error(err);
    };
}

export const postEventParticipant = async (eventID, userEmail) => {
    try {
        
        const res = await serverApi.post(`/events/participants?id=${eventID}&email=${userEmail}`);
        console.log(res);
        return res;
    } catch (err) {
        console.error(err);
        throw err
    };
}

export const getUserEvents = async (userEmail) => {
    try {
        const res = await serverApi.get(`/users/events?email=${userEmail}`);
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    };
};

export const removeDBEvent = async (eventID) => {
    try{
        const res = await serverApi.delete(`/events/remove?id=${eventID}`, {
            withCredentials: true,
        });
        return res.data;
    } catch(err) {
        throw err;
    };
};

