# Node/Express/Mongoose Social App

### My personal node project for my portfolio which is a clone of popular image hosting site imgur.

# Getting started

To get the Node server running locally:

-   Clone this repo
-   `npm install` to install all required dependencies
-   Install MongoDB Community Edition ([instructions](https://docs.mongodb.com/manual/installation/#tutorials)) and run it by executing `mongod`
-   `npm run dev` to start the local server

Alternately, to quickly try out this app live, you can check it [here](https://imagepload.herokuapp.com)

# Code Overview

## Application Structure

-   `server.js` - The entry point to our application. This file starts the server.
-   `config/` - This folder contains configuration for passport as well as a central location for configuration/environment variables and templates setup.
-   `routes/` - This folder contains the route definitions for our app.
-   `models/` - This folder contains the schema definitions for our Mongoose models.
