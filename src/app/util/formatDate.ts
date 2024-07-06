export const covertDateToDMY = (d: Date) => {
    const date = new Date(d);
    const h = date.getHours();
    const m = date.getMinutes()
    const day = date.getDay();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return {
        time: `${h >= 10 ? h : '0' + h}:${m >= 10 ? m : '0' + m}`,
        date: `${day >= 10 ? day : '0' + day}-${month >= 10 ? month + 1 : '0' + (month + 1)}-${year}`
    }
}