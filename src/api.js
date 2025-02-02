import axios from 'axios';

const serverApi = axios.create({
    baseURL:'http://localhost:3000'
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

export const getTags = async () => {
    try{
        const res = await serverApi.get('/events/tags');
        return res.data;
    } catch (err) {
        console.error(err);
    }
};

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

