const store = new mongoSessionStore({
    uri : mongoURI,
    collection : "session"
});
const getSessionData = (sessionId)=> {
    store.get(sessionId , (data)=>{
        console.log(data);
        return data;
    })
}

module.exports = {store , getSessionData};