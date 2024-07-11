'use strict'

const express = require('express')
const CommentController = require('../../controllers/comment.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()

router.get('', asyncHandler(CommentController.getCommentsByParentId))

router.use(authentication)

router.route('')
    .post(asyncHandler(CommentController.createComment))
    .delete(asyncHandler(CommentController.deleteComment))

module.exports = router