const path = require('path');

const express = require('express');

const config = require('./server/configure');
const { mongoose } = require('./server/mongoose');

const port = process.env.PORT || 3000;
const app = config(express());

app.listen(port, () => console.log(`Server running on localhost:${port}`));

/*TODO
- add users, auth etc
- add dark mode
- resize all uploaded images
- make comment to use AJAX instead of full reloads
- Check notes on refactoring and improvements
*/
