const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')


require('dotenv').config()
const api = process.env.API_URL

// middleware
app.use(express.json())
app.use(morgan('tiny'))

const productSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: Number
})
const Product = mongoose.model('Product', productSchema)

app.get(`${api}/products`, async (req, res) => {
    const productList = await Product.find()

    if (!productList) {
        res.status(500).json({ success: false })
    }
    res.send(productList)
})

app.post(`${api}/products`, (req, res) => {
    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: {
            type: Number,
            required: true
        }
    })
    product.save().then((createdProduct) => {
        res.status(201).json(createdProduct)
    }).catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        })
    })
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