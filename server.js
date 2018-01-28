const express = require('express');
const path = require('path');

const config = require('./server/configure');

const port = process.env.PORT || 3000;
let app = express();


app = config(app);

app.listen(port, () => console.log(`Server running on localhost:${port}`));
