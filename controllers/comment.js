const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const createNotification = require('../services/createNotification');
// const {formatCommentListData} =require ('../utils/formatCommentData');

const createComment = async (req, res) => {
  const { content, author, postId, parentCommentId } = req.body;

  try {
    const comment = new Comment({ content, author, postId, parentCommentId });
    const ret = await comment.save();
    if (ret.isRootComment) {
      createNotification({
        actionType: 'comment',
        payload: {
          triggerUserId: author,
          targetPostId: postId,
          targetCommentId: ret._id,
        },
      });
    }
    return res.status(StatusCodes.OK).json(ret);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const getComments = async (req, res) => {
  try {
    const { postId, nPerPage, pageNumber } = req.query;
    const nPerPageNumber = parseInt(nPerPage, 10);
    const id = mongoose.Types.ObjectId(postId);
    if (postId) {
      // const comments = await Comment.find({ postId });
      if (req.query.sortBy === 'createdAt') {
        const topComments = await Comment.aggregate([
          {
            $match: {
              parentCommentId: { $eq: undefined },
              postId: id,
            },
          },
          {
            $graphLookup: {
              from: 'comments',
              startWith: '$_id',
              connectFromField: '_id',
              connectToField: 'parentCommentId',
              depthField: 'level',
              as: 'children',
            },
          },
          {
            $unwind: {
              path: '$children',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $sort: {
              // "_id": -1,
              'children.level': -1,
              'children._id': -1,
            },
          },
          {
            $addFields: {
              'children.author': {
                $toObjectId: '$children.author',
                // $toObjectId: "$children.author"
              },
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'children.author',
              foreignField: '_id',
              pipeline: [
                {
                  $project: {
                    name: 1,
                    avatar: 1,
                  },
                },
              ],
              as: 'children.author',
            },
          },
          {
            $unwind: {
              path: '$children.author',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $group: {
              _id: '$_id',
              parentCommentId: {
                $first: '$parentCommentId',
              },
              content: {
                $first: '$content',
              },
              createdAt: {
                $first: '$createdAt',
              },
              author: {
                $first: '$author',
              },
              children: {
                $push: '$children',
              },
            },
          },

          {
            $addFields: {
              children: {
                $reduce: {
                  input: '$children',
                  initialValue: {
                    level: -1,
                    presentChild: [],
                    prevChild: [],
                  },
                  in: {
                    $let: {
                      vars: {
                        prev: {
                          $cond: [
                            {
                              $eq: ['$$value.level', '$$this.level'],
                            },
                            '$$value.prevChild',
                            '$$value.presentChild',
                          ],
                        },
                        current: {
                          $cond: [
                            {
                              $eq: ['$$value.level', '$$this.level'],
                            },
                            '$$value.presentChild',
                            [],
                          ],
                        },
                      },
                      in: {
                        level: '$$this.level',
                        prevChild: '$$prev',
                        presentChild: {
                          $concatArrays: [
                            '$$current',
                            [
                              {
                                $mergeObjects: [
                                  '$$this',
                                  {
                                    children: {
                                      $filter: {
                                        input: '$$prev',
                                        as: 'e',
                                        cond: {
                                          $eq: ['$$e.parentCommentId', '$$this._id'],
                                        },
                                      },
                                    },
                                  },
                                ],
                              },
                            ],
                          ],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          {
            $addFields: {
              children: '$children.presentChild',
            },
          },
          {
            $sort: { _id: -1 },
          },
          {
            $skip: pageNumber > 0 ? pageNumber * nPerPageNumber : 0,
          },
          {
            $limit: nPerPageNumber,
          },
          {
            $lookup: {
              from: 'users',
              localField: 'author',
              foreignField: '_id',
              pipeline: [
                {
                  $project: {
                    name: 1,
                    avatar: 1,
                  },
                },
              ],
              as: 'author',
            },
          },
        ]).exec();
        // const formatComments = formatCommentListData(topComments);
        return res.status(StatusCodes.OK).json(topComments);
      }
      // if (req.query.sortBy === 'like') {
      //   const topLikes = await Comment.aggregate([
      //     {
      //       $match: { postId: id, parentCommentId: undefined, visible: true }
      //     },
      //     {
      //       $project: {
      //         like: 1,
      //         content: 1,
      //         visible: 1,
      //         author: 1,
      //         mentionedUserId: 1,
      //         postId: 1,
      //         parentCommentId: 1,
      //         isRootComment: 1,
      //         length: { $size: '$like' },
      //       },
      //     },
      //     { $sort: { length: -1 } },
      //   ]).exec();
      //   return res.status(StatusCodes.OK).json(topLikes);
      // }
    }
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Must provide a post ID' });
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const getCommentById = async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);

    return res.status(StatusCodes.OK).json(comment);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const deleteCommentById = async (req, res) => {
  const { commentId } = req.params;
  const { visible } = req.body;

  try {
    await Comment.findByIdAndUpdate(
      { _id: commentId },
      [{ $set: { visible: { $toBool: visible } } }],
      {
        runValidator: true,
        useFindAndModify: true,
        new: true,
      }
    );
    return res.status(StatusCodes.OK).json({ message: 'Your comment has already been deleted!' });
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content, mentionUserId } = req.body;
  try {
    const comment = await Comment.findById(commentId);
    await comment.updateOne(
      { $set: { content, mentionUserId } },
      { runValidator: true, new: true }
    );
    return res.status(StatusCodes.OK).json('updated');
  } catch (err) {
    return res.status(StatusCodes.err).json(err);
  }
};

const toggleLikeOnComment = async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req;

  const comment = await Comment.findById(commentId).exec();
  if (!comment) return res.sendStatus(StatusCodes.NOT_FOUND);
  // the types are not correct, one is object id the other is string, but it works in mongoose
  const userLikedThis = comment.like.includes(userId);
  if (userLikedThis) {
    comment.like.pull(userId);
  } else {
    comment.like.push(userId);
  }
  await comment.save();
  // userLikedThis has changed, if user has not like the post before, now he likes it
  if (!userLikedThis) {
    createNotification({
      actionType: 'likeComment',
      payload: {
        notifiedUserId: comment.author,
        triggerUserId: userId,
        targetCommentId: commentId,
        targetPostId: comment.postId,
      },
    });
  }

  return res.status(StatusCodes.OK).json({
    commentId,
    likeCount: comment.likeCount,
    userId,
    userLikedThis: !userLikedThis,
  });
};

module.exports = {
  createComment,
  getComments,
  getCommentById,
  deleteCommentById,
  updateComment,
  toggleLikeOnComment,
};
