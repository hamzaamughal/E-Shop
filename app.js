const express = require('express')
const app = express()
const morgan = require('morgan')

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

app.listen(3000, () => {
    console.log('====================================');
    console.log(`server is running at port 3000`);
    console.log('====================================');
})