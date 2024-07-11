'use strict'

const { NotFoundError } = require('../cores/error.response')

// REPOSITORIES
const commentRepository = require('../repositories/comment.repository')
const productRepository = require('../repositories/product.repository')

// UTILS
const { unGetInfoData } = require('../utils')

class CommentService {
    static async getCommentsByParentId({
        productId,
        parentCommentId = null,
        limit = 50,
        offset = 0
    }) {
        let comments
        console.log(parentCommentId);
        if (parentCommentId) {
            const parentComment = await commentRepository.findById(parentCommentId)
            if (!parentComment)
                throw new NotFoundError('Parent comment not found')

            comments = await commentRepository.findByLeftRight({
                productId,
                left: parentComment.left,
                right: parentComment.right
            }, { selectedData: ['_id', 'left', 'right', 'content', 'parentId'], limit, offset })
        } else {
            comments = await commentRepository.findProductRootComments({
                productId
            }, { selectedData: ['_id', 'left', 'right', 'content', 'parentId'], limit, offset })
        }

        return comments
    }

    static async createComment({
        productId, userId, content, parentCommentId = null
    }) {
        // Implement the logic here
        const comment = {
            productId,
            userId,
            content,
            parentId: parentCommentId
        }

        let rightValue
        if (parentCommentId) {
            const parentComment = await commentRepository.findById(parentCommentId)
            if (!parentComment)
                throw new NotFoundError('Parent comment not found')

            rightValue = parentComment.right

            await commentRepository.updateMany({
                productId,
                side: 'right',
                rightValue
            })

            await commentRepository.updateMany({
                productId,
                side: 'left',
                rightValue
            })
        } else {
            const maxRightValue = await commentRepository.findByProductId(productId)

            if (maxRightValue)
                rightValue = maxRightValue.right + 1
            else
                rightValue = 1
        }

        // Insert comment to database
        comment.left = rightValue
        comment.right = rightValue + 1

        const commentModel = await commentRepository.create(comment)
        return unGetInfoData({ fields: ['__v'], object: commentModel._doc })
    }

    static async deleteComment({ id, productId }) {
        const productExisted = await productRepository.checkProductById(productId)
        if (!productExisted)
            throw new NotFoundError('Product not found')

        const comment = await commentRepository.findById(id)
        if (!comment)
            throw new NotFoundError('Comment not found')

        const { left, right } = comment || {}

        // Calculate the width
        const width = left - right + 1

        await commentRepository.deleteMany({
            productId,
            left,
            right
        })

        await commentRepository.updateAfterDelete({
            productId,
            side: 'left',
            value: left,
            width
        })

        await commentRepository.updateAfterDelete({
            productId,
            side: 'right',
            value: right,
            width
        })

        return true
    }
}

module.exports = CommentService