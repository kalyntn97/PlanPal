import { Profile} from "../models/profile.js"

function index(req, res) {
	Profile.find({})
		.then(profiles => {
			res.render('profiles/index', {
				profiles,
				title: 'My Friends'
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
			const isSelf = profile._id.equals(req.user.profile._id)
			res.render('profiles/show', {
				profile,
				isSelf,
				title: 'My Profile'
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
	Profile.findById(req.params.profileId)
	.then(profile => {
		console.log(req.params.profileId)
		console.log(req.user.profile._id)
		console.log(req.body)
		profile.friends.push(req.body)
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

export {
	index,
	show,
	edit,
	update,
	sendFriendRequest,
	addFriend,
}