const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const app = express();

//Setup server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));