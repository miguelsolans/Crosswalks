// Loading modules
const createError   = require('http-errors');
// Express server
const express       = require('express');
const app           = express();
// Configure WebSockets
const expressWs     = require('express-ws')(app);
// Body Parser
const bodyParser    = require('body-parser');
// Cookie Parser
const cookieParser  = require('cookie-parser');
// CORS Middleware
const cors          = require('cors');
// Morgan For Request Status
const logger        = require('morgan');
// Axios
const axios         = require('axios');
const coordinates   = require('../app/controllers/Coordinates');

// Display Request Status
const env = process.argv[2];

if(env === 'dev')
    app.use( logger(env) );
else if( env === 'production')
    console.log = function(){ /* Do NOTHING - prevent logs under production */ };


// Tell node where public files are located
app.use(express.static('./app/public'));


app.use(logger('dev'));

// Setup EJS View Engine
app.set('view engine', 'ejs');
app.set('views', './app/views');

// urlencoded tells body-parser to extract data from <from>
app.use(bodyParser.urlencoded({
    extended: true
}));

// To read it in JSON
app.use(bodyParser.json());

// Configure CORS
// TODO: Setup Allowed Servers
app.use(cors());

// Use cookies
app.use(cookieParser());

// Define Routes
const ManageCars = require('../app/routes/car');
const ManagePedestrians = require('../app/routes/pedestrian');

app.use('/car', ManageCars);
app.use('/pedestrian', ManagePedestrians);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.jsonp({title: "Error!", message: err.message});
});

//GET CROSSWALKS ON INIT
axios.get(`${process.env.CROSSWALK_SERVICE}`)
    .then(response => {
        console.log(JSON.stringify(response.data))
        coordinates.addCrosswalks(response.data)
    })
    .catch(err => {console.log(err); process.exit(1)})

// Module Export
module.exports = app;