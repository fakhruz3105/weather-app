const express = require('express');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();

const app = express();

//Setup ejs
app.use( express.static("public"));
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Use JSON data
app.use(express.json({ limit: '1mb' }));

//Routes
app.use('/', require('./routes/index'));

//Setup PORT
const PORT = process.env.PORT || 5000;

//Setup Server
app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));