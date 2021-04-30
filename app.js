const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')


require('dotenv').config()

// middleware
app.use(express.json())
app.use(morgan('tiny'))

const api = process.env.API_URL

app.get(`${api}/products`, (req, res) => {
    const product = {
        id: 1,
        name: 'hair dresser',
        image: 'some_url'
    }
    res.send(product)
})

app.post(`${api}/products`, (req, res) => {
    const newProduct = req.body;
    console.log('====================================');
    console.log(newProduct);
    res.send(newProduct)
    console.log('====================================');
})

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