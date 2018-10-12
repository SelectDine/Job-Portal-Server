const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const body_parser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');

const port = process.env.PORT || 8000;
const db = process.env.DATABASE;

const app = express();
const logger = morgan('dev');

const auth_router = require('./routes/auth_routes');
const employer_router = require('./routes/employer_routes');
const user_router = require('./routes/user_routes');

// Setting up the database connection
mongoose.connect(db, (err) => {
    if (err) {
        console.error("Error connecting the database!");
    } else {
        console.log("Connection to the database established successfully...");

        // Setting up body parser for parsing request bodies
        app.use(body_parser.json());
        app.use(body_parser.urlencoded({extended: true}));

        // Setting up logger to log all the API calls
        app.use(logger);

        // Setting up helmet and compression to make the request headers secure and compressed
        app.use(helmet());
        app.use(compression());

        // Setting up the respective routers with base routes
        app.use('/api/auth', auth_router);
        //app.use('/api/employer', employer_router);
        app.use('/api/user', user_router);

        // Setting up the error handler
        app.use((req, res, next) => {
            let err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        app.use((err, req, res, next) => {
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            res.status(err.status || 500);
            res.send('error');
        });

        // Launching the server
        app.listen(port, () => console.log(`App running successfully on port number: ${port} ...`));

    }
});