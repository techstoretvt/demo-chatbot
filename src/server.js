import express from 'express';
import viewEngine from './config/ViewEngine'
import initWebRoutes from './routes/web'
import bodyParser from 'body-parser';
require('dotenv').config();

let app = express();

//config view engine
viewEngine(app);

//parse request to json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//init web routes
initWebRoutes(app);


let port = process.env.PORT || 8080
app.listen(port, () => {
    console.log('Chatbot is running on port: ', port);
})


