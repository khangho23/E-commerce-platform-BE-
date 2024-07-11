'use strict'

const { comment } = require('../models/comment.model')
const {
    convertToObjectIdMongoDB,
    getSelectedData
} = require('../utils')

// --- SELECT ---
const findById = async (id) => {
    return comment.findById(convertToObjectIdMongoDB(id))
}

const findByProductId = async (productId) => {
    return comment.findOne({
        productId: convertToObjectIdMongoDB(productId)
    }, 'right', { sort: { right: -1 } })
}

const findProductRootComments = async ({ productId }, { selectedData = [], limit = 50, offset = 0 }) => {
    return comment.find({
        parentId: null,
        productId: convertToObjectIdMongoDB(productId)
    })
        .select(getSelectedData(selectedData))
        .sort({
            left: 1
        })
        .skip(offset)
        .limit(limit)
}

const findByLeftRight = async ({ productId, left, right }, { selectedData = [], limit = 50, offset = 0 }) => {
    return comment.find({
        productId: convertToObjectIdMongoDB(productId),
        left: { $gt: left },
        right: { $lte: right }
    })
        .select(getSelectedData(selectedData))
        .sort({
            left: 1
        })
        .skip(offset)
        .limit(limit)
}
// --- END SELECT ---

// --- INSERT ---
const create = async (commentData) => {
    return comment.create(commentData)
}
// --- END INSERT ---

// --- UPDATE ---
const updateMany = async ({ productId, side, rightValue }) => {
    const filter = {
        productId: convertToObjectIdMongoDB(productId),
        [side]: { $gte: rightValue }
    };

    const updateDoc = {
        $inc: { [side]: 2 }
    };

    return comment.updateMany(filter, updateDoc);
}

const updateAfterDelete = async ({ productId, side, value, width }) => {
    if (!['left', 'right'].includes(side)) {
        throw new Error("Invalid side value. It must be 'left' or 'right'.");
    }

    return await comment.updateMany({
        productId: convertToObjectIdMongoDB(productId),
        [side]: { $gt: value }
    }, {
        $inc: { [side]: -width }
    });
}
// --- END UPDATE ---


// --- DELETE ---
const deleteMany = async ({ productId, left, right }) => {
    return comment.deleteMany({
        productId: convertToObjectIdMongoDB(productId),
        left: { $gte: left },
        right: { $lte: right }
    });
}
// --- END DELETE ---

module.exports = {
    findById,
    findByProductId,
    findProductRootComments,
    findByLeftRight,
    create,
    updateMany,
    updateAfterDelete,
    deleteMany
}