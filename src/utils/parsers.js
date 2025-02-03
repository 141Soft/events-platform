
export const incrementDateTime = (dateTime, duration) => {
    const date = new Date(dateTime);
    date.setTime(date.getTime() + (Number(duration)*60*60*1000));
    return date.toISOString().replace(/\.\d{3}Z$/, '')
};

export const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const dateSplit = date.toISOString().replace(/\.\d{3}Z$/, '').split('T');
    return {
        date: dateSplit[0],
        time: dateSplit[1].slice(0,5)
    }
};