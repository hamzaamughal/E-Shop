const express = require('express')
const router = express.Router()
const { Product } = require('../models/product')
const { Category } = require('../models/category')
const mongoose = require('mongoose')
const multer = require('multer')

const FILE_TYPE_MAP = {
    'image/png': 'png'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const filename = file.originalname.split(' ').join('-')
        cb(null, `${filename}-${Date.now()}.${extension}`)
    }
})
const uploadOptions = multer({ storage: storage })

router.get('/', async (req, res) => {
    // localhost:3000/api/v1/products/?categories=234324,344322
    let filter = {}
    if (req.query.categories) {
        filter = { category: req.query.categories.split(',') }
    }
    const productList = await Product.find(filter).populate('category')

    if (!productList) {
        res.status(500).json({ success: false })
    }
    res.send(productList)
})

router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category')

    if (!product) {
        res.status(500).json({ success: false })
    }
    res.send(product)
})

router.post('/', uploadOptions.single('image'), async (req, res) => {
    const category = await Category.findById(req.body.category)
    if (!category) return res.status(400).send('Invalid Category')
    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/upload/`

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}${fileName}`,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    })
    product = await product.save()
    if (!product)
        return res.status(500).send('The product cannot be created')
    res.send(product)
})

router.put('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Product ID')
    }
    const category = await Category.findById(req.body.category)
    if (!category) return res.status(400).send('Invalid Category')

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
        },
        { new: true }
    )
    if (!product) {
        return res.status(404).send('the product cannot be updated..!')
    }
    res.send(product)
})

router.delete('/:id', async (req, res) => {
    try {
        product = await Product.findByIdAndRemove(req.params.id)
        if (product) {
            return res.status(200).json({ success: true, message: 'the product is deleted!' })
        } else {
            return res.status(400).json({ success: false, message: 'product not found' })
        }
    } catch (err) {
        return res.status(400).json({ success: false, error: err })
    }
})

router.get('/get/count', async (req, res) => {
    const productCount = await Product.countDocuments((count) => count)

    if (!productCount) {
        res.status(500).json({ success: false })
    }
    res.send({
        productCount: productCount
    })
})

router.get('/get/featured/:count', async (req, res) => {
    const count = req.params.count ? req.params.count : 0
    const products = await Product.find({ isFeatured: true }).limit(+count)

    if (!products) {
        res.status(500).json({ success: false })
    }
    res.send({
        products: products
    })
})

module.exports = router