# Imageine
An attempt to clone popular image hosting social network [imgur](//imgur.com) for learning purposes, built with javascipt on the frontend and backend (node & expressjs)

A deployed version on heroku can be found [here](https://imagepload.herokuapp.com)

## Screenshot
![image](https://user-images.githubusercontent.com/35289837/201735716-38048d7b-7b1f-401c-8090-3c3995c9d9ac.png)


## Getting started

To get the Node server running locally:

-   Clone this repo
-   `npm install` to install all required dependencies
-   Install MongoDB Community Edition ([instructions](https://docs.mongodb.com/manual/installation/#tutorials)) and run it by executing `mongod`
-   `npm run dev` to start the local server

## Application Structure

-   `server.js` - The entry point to our application. This file starts the server.
-   `config/` - This folder contains configuration for passport as well as a central location for configuration/environment variables and templates setup.
-   `routes/` - This folder contains the route definitions for our app.
-   `models/` - This folder contains the schema definitions for our Mongoose models.
