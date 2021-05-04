const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const authJwt = require('./helpers/jwt')
const errorHandler = require('./helpers/error-handler')

app.use(cors())
app.options('*', cors())

require('dotenv/config')
const api = process.env.API_URL;

// middleware
app.use(express.json())
app.use(morgan('tiny'))
app.use(authJwt())
// app.use(errorHandler)

//Routes
const categoriesRoutes = require('./routers/categories')
const productsRouter = require('./routers/products')
const usersRouter = require('./routers/users')
const ordersRouter = require('./routers/orders')

app.use(`${api}/categories`, categoriesRoutes)
app.use(`${api}/products`, productsRouter)
app.use(`${api}/users`, usersRouter)
app.use(`${api}/orders`, ordersRouter)

mongoose.connect(process.env.CONNECTION_STRING,
    { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        console.log('====================================');
        console.log(`Database Connection is Ready`);
        console.log('====================================');
    }).catch((err) => {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
    })

app.listen(3000, () => {
    console.log('====================================');
    console.log(`server is running at port 3000`);
    console.log('====================================');
})