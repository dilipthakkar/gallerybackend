require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8000;
const mongoSessionStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
// const mongoURI = 'mongodb://localhost:27017/newAuthApp'
const mongoURI = process.env.MONGOURL ; 
const AuthRoute = require('./routes/auth');
const ImageRoute = require('./routes/images');
console.log(mongoURI);
mongoose.connect(mongoURI , {useNewUrlParser : true , useCreateIndex : true , useUnifiedTopology : true}).then(console.log("connected"));


const app = express();

const store = new mongoSessionStore({
    uri : mongoURI,
    collection : "session"
});

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store : store,
    cookie: {
         secure : false,
         httpOnly : false,
        maxAge : 20* 30* 200000 },
    
}))

app.use(bodyParser.json());
app.use(cors({
    credentials : true,
    origin : ["http://localhost:3000" ],
    methods : ['GET','POST']
}));
app.use('/api', AuthRoute);
app.use('/api', ImageRoute);


app.listen(PORT , ()=>{
    console.log(`App is runnig at port ${PORT}`);
})