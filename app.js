const express =require('express');
require('dotenv').config();
const mailroutes=require('./routes/mailRoutes');
const bodyParser = require('body-parser');
const app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/",mailroutes)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

