const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

//update user
router.put('/:id', async (req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin) {
    if(req.body.password) {
        try {
            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hash(req.body.password, salt)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
    try {
        const user = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        });
        res.status(200).json('account updated')
    } catch (error) {
        return res.status(400).json(error)
    }
    } else {
        return res.status(400).json('get out')
    }
} )
//delete user
router.delete('/:id', async (req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin) {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        res.status(200).json('account deleted')
    } catch (error) {
        return res.status(400).json(error)
    }
    } else {
        return res.status(400).json('delete only your account')
    }
} )
//get a user
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const {password,updatedAt, ...other} = user._doc
        res.status(200).json(other)
    } catch (error) {
        res.status(200).json(error)
    }
})
//follow a user
router.put("/:id/follow", async  (req, res) => {
    if(req.body.userId !== req.params.id) {
       try {
        const user = await User.findById(req.params.id)
        const currentUser = await User.findById(req.body.userId)

        if(!user.followers.includes(req.body.userId)) {
         await user.updateOne({$push: {followers: req.body.userId}})
         await currentUser.updateOne({$push: {followings: req.params.id}})
         res.status(200).json("user has been followed")
        } else {
         res.status(403).json('you already follow this person')
        }
       } catch (error) {
        res.status(500).json(error)
        
       }
    } else {
        res.status(400).json('cannot follow yourself')
    }
})

//unfollow a user
router.put("/:id/unfollow", async  (req, res) => {
    if(req.body.userId !== req.params.id) {
       try {
        const user = await User.findById(req.params.id)
        const currentUser = await User.findById(req.body.userId)

        if(user.followers.includes(req.body.userId)) {
         await user.updateOne({$pull: {followers: req.body.userId}})
         await currentUser.updateOne({$pull: {followings: req.params.id}})
         res.status(200).json("user has been unfollowed")
        } else {
         res.status(403).json('you are not following this person')
        }
       } catch (error) {
        res.status(500).json(error)
        
       }
    } else {
        res.status(400).json('cannot unfollow yourself')
    }
})



module.exports = router