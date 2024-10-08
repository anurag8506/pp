const express = require("express");
const cors = require("cors");
const routes = require('./route');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const routes_para =require("./routes/para/para_routes")
const requests_para=require("./routes/para/para_requests")
const product_request=require("./routes/add_product_route/product_requests")
const product_route=require("./routes/add_product_route/product_routes")

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/", express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
}));
app.set('view engine', 'ejs');
// app.use('/', routes);
app.use('/', routes_para);
app.use('/',  requests_para);
app.use('/add_product', product_request);
app.use('/add_product',  product_route);
app.listen(8000, () => {
    console.log('Server is running on port 8000');
});






// const express = require("express");
// const cors = require("cors");
// const routes = require('./route');
// const path = require('path');
// const session = require('express-session');
// const routes_m =require("./routes/mailsender/mailsender_routes")
// const requests_mailsender =require("./routes/mailsender/mailsender_requests")
// require('dotenv').config();
// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());
// app.use("/", express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'));

// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));
// app.use(session({
//     resave: false,
//     saveUninitialized: true,
//     secret: process.env.SESSION_SECRET
// }));
// app.set('view engine', 'ejs');
// // app.use('/', routes);
// app.use('/', routes_m);
// app.use('/',  requests_mailsender);
// app.listen(8000, () => {
//     console.log('Server is running on port 8000');
// });






















