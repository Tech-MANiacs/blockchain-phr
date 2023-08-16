const express = require('express');
const colors = require('colors');
const morgan = require('morgan');

const dotenv = require('dotenv');

const connectDB = require('./config/db');


dotenv.config();

//rest obj
const app = express();

//connecting to database
connectDB();

//middlewares
app.use(express.json());
app.use(morgan('dev'));

//user routes
app.use('/api/v1/user', require('./routes/userRoutes'));

//admin routes
app.use('/api/v1/admin', require('./routes/adminRoutes'));

//doctor routes
app.use('/api/v1/doctor', require('./routes/doctorRoutes'));



//port
const port = process.env.PORT || 8080;
app.listen(port, ()=>{
    console.log(`server running in ${process.env.NODE_MODE} mode on port ${port} port`);
})


//Observation:
//these .js files works like a function or group of functions, we just need to export at the bottom of these functions like we return from a normal function in c++ and to call these function's instances we need to require them where we want them.