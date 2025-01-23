import axios from 'axios';

const serverApi = axios.create({
    baseURL:'http://localhost:3000'
});

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