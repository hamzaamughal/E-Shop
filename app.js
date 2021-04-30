const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')

require('dotenv/config')
const api = process.env.API_URL;

const productsRouter = require('./routers/products')

// middleware
app.use(express.json())
app.use(morgan('tiny'))

app.use(`${api}/products`, productsRouter)

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