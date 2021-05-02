const session = require('express-session');

const mongoSessionStore = require('connect-mongodb-session')(session);
const mongoURI = process.env.MONGOURL ; 

const store = new mongoSessionStore({
    uri : mongoURI,
    collection : "session"
});
const getSessionData = (sessionId)=> {
    store.get(sessionId , (err , data)=>{
        console.log(err);
        console.log(data);
        return data;
    })
}

module.exports = {store , getSessionData};