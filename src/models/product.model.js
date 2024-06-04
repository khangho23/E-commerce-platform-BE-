'use strict'

const { Schema, model } = require('mongoose') // Erase if already required
const ProductCategory = require('../enums/ProductCategory')
const slugify = require('slugify')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

// ENUMS
const categoriesArray = Object.values(ProductCategory) || []

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    thumb: {
        type: String,
        required: true
    },
    description: String,
    slug: String,
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        require: true,
        enum: categoriesArray
    },
    shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    attributes: {
        type: Schema.Types.Mixed,
        require: true,
    },
    rating: {
        type: Number,
        default: 0,
        min: [0, 'Rating must be at least 0'],
        max: [5, 'Rating must be at most 5'],
        set: (value) => Math.floor(value)
    },
    variation: {
        type: Array,
        default: []
    },
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false
    },
    isPublished: {
        type: Boolean,
        default: false,
        index: true,
        select: false
    },
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

// Create index for the product schema
productSchema.index({ name: 'text', description: 'text' }, {unique: false})

// Document middleware: runs before .save() and .create()
productSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true })
    next()
})

// Define the product category
const clothingSchema = new Schema({
    brand: {
        type: String,
        require: true
    },
    size: String,
    material: String,
    shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    }
}, {
    collection: 'clothes',
    timestamps: true
})

const electronicSchema = new Schema({
    manufacturer: {
        type: String,
        require: true
    },
    model: String,
    color: String,
    shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
    }
}, {
    collection: 'electronics',
    timestamps: true
})

const furnitureSchema = new Schema({
    brand: {
        type: String,
        require: true
    },
    size: String,
    material: String,
    shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
    }
}, {
    collection: 'furnitures',
    timestamps: true
})

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),

    // Export the product's categories model
    clothing: model('Clothes', clothingSchema),
    electronic: model('Electronics', electronicSchema),
    furniture: model('Furnitures', furnitureSchema),
}