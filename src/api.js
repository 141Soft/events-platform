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

export const postEvent = async (formData) => {
    try{
        const res = await serverApi.post('/events', formData, {
            header: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        });
        return res.data;
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
        console.log(res);
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

