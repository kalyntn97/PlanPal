import mongoose from "mongoose"
import { Profile } from "../models/profile.js"
import OpenAI from "openai"

function index(req, res) {
	Profile.find({})
		.then(profiles => {
			Profile.findById(req.user.profile.id)
			.then(userProfile => {
				res.render('profiles/index', {
					profiles,
					userProfile,
					title: 'People'
				})
			})
			.catch(err => {
				console.log(err)
				res.redirect('/')
			})
		})
		.catch(err => {
			console.log(err)
			res.redirect('/')
		})
}

function show(req, res) {
	Profile.findById(req.params.profileId)
	.populate([{path: 'friends'}, {path: 'friendRequests'}])
		.then(profile => {
			Profile.findById(req.user.profile.id)
			.then(userProfile => {
				const isSelf = profile._id.equals(req.user.profile._id)
				res.render('profiles/show', {
					profile,
					userProfile,
					isSelf,
					title: 'My Profile'
				})
			})
			.catch(err => {
				console.log(err)
				res.redirect('/')
			})
		})
		.catch(err => {
			console.log(err)
			res.redirect('/')
		})
}

function edit(req, res) {
	Profile.findById(req.params.profileId)
		.then(profile => {
			res.render(`profiles/edit`, {
				profile,
				title: 'Home Page',
			})
		})
		.catch(err => {
			console.log(err)
			res.redirect('/')
		})
}

function update(req, res) {
	Profile.findById(req.params.profileId)
	.then(profile => {
		if (profile._id.equals(req.user.profile._id)) {
			profile.updateOne(req.body)
			.then(() => {
				console.log(profile)
				res.redirect(`/profiles/${profile._id}`)
			})
		} else {
			throw new Error('✋ Not Authorized 🛑')
		}
	})
	.catch(err => {
		console.log(err)
		res.redirect('/')
	})
}

function sendFriendRequest(req, res) {
	Profile.findById(req.params.profileId)
	.then(profile => {
		profile.friendRequests.push(req.user.profile._id)
		profile.save()
		.then(() => {
			res.redirect(`/profiles/${profile._id}`)
		})
		.catch(err => {
			console.log(err)
			res.redirect('/')
		})
	})
	.catch(err => {
		console.log(err)
		res.redirect('/')
	})
}

function addFriend(req, res) {
	// find user profile and push friend request profile id to friends array
	Profile.findById(req.user.profile._id)
	.then(userProfile => {
		// find friend profile
		Profile.findById(req.body.friendRequestId)
		.then(friendProfile => {
			userProfile.friends.push(friendProfile._id)
			// find the index of the friend request to remove it from the friend requests array
			const friendRequestIdx = userProfile.friendRequests.findIndex(friendRequestId  => {
				const ObjectId = mongoose.Types.ObjectId
				return friendRequestId.equals(new ObjectId(req.body.friendRequestId))
			})
			if (friendRequestIdx >= 0) {
				userProfile.friendRequests.splice(friendRequestIdx, 1)
			}
			// add user profile id to friend profile friends array
			friendProfile.friends.push(userProfile._id)
			//save user profile and friend profile
			Promise.all([userProfile.save(), friendProfile.save()])
		})
		.then(() => {
			res.redirect(`/profiles/${friendProfile._id}`)
		})
		.catch(err => {
			console.log(err)
			res.redirect('/')
		})
	})
	.catch(err => {
		console.log(err)
		res.redirect('/')
	})
}

function addHashTag(req, res) {
	Profile.findById(req.user.profile._id)
  .then(profile => {
		profile.hashtags.push(req.body)
		profile.save()
		res.redirect('/')
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

function deleteHashTag(req, res) {
	Profile.findById(req.user.profile._id)
	.then(profile => {
		const hashtag = profile.hashtags.id(req.params.hashtagId)
		profile.hashtags.remove(hashtag)
		profile.save()
		.then(() => {
			res.redirect('/')
		})
		.catch(err => {
			console.log(err)
			res.redirect('/')
		})
	})
	.catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

export {
	index,
	show,
	edit,
	update,
	sendFriendRequest,
	addFriend,
	addHashTag,
	deleteHashTag,
}