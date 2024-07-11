'use strict'

const { CREATED, OK } = require('../cores/success.response')

// SERVICES
const CommentService = require('../services/comment.service')

class CommentController {
    static async getCommentsByParentId(req, res) {
        const { productId, parentCommentId, limit, offset } = req.query

        new OK({
            message: 'Comments fetched',
            metadata: await CommentService.getCommentsByParentId({
                productId, parentCommentId, limit, offset
            })
        }).send(res)
    }

    static async createComment(req, res) {
        const { productId, userId, content, parentCommentId } = req.body

        new CREATED({
            message: 'Comment created',
            metadata: await CommentService.createComment({
                productId, userId, content, parentCommentId
            })
        }).send(res)
    }

    static async deleteComment(req, res) {
        const { id, productId } = req.body

        new OK({
            message: 'Comment deleted',
            metadata: await CommentService.deleteComment({ id, productId })
        }).send(res)
    }
}

module.exports = CommentController