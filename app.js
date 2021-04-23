require('dotenv').config();
const cors =require('cors')
const express = require('express');
const { sequelize } = require('./models');
const errorMiddleware = require('./Middleware/error')
const app = express();
const adminController = require('./Controller/adminController')
const customerController = require('./Controller/customerController')
const customerRoute = require('./Routes/customerRoute')
const productRoute = require('./Routes/productRoute')
const couponRoute = require('./Routes/couponRoute')
const paymentRoute = require('./Routes/paymentRoute')
const orderRoute = require('./Routes/orderRoute')

//const adminRoute = require('./Routes/adminRoute')

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/product', productRoute)
app.use('/coupon', couponRoute)
app.use('/customer', customerRoute)
app.use('/payment', paymentRoute)
app.use('/order', orderRoute)

app.post('/register',customerController.register)
app.post('/registeradmin',adminController.register)

app.post('/login', customerController.login)
app.post('/loginadmin', adminController.login)

app.use((req, res, next)=>{
    res.status(404).json({message: "page not found"})
});

app.use(errorMiddleware)

//sequelize.sync({force: true}).then(()=> console.log('DB Synce'))


const port = process.env.PORT || 8000;
app.listen(port, ()=> console.log(`server running on ${port}`))