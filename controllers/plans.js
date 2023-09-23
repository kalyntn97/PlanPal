import { populate } from 'dotenv'
import { Plan } from '../models/plan.js'

function index(req, res) {
  Plan.find({})
  .then(plans => {
		res.render('plans/index', {
			plans,
			title: ''
		})
	})
	.catch(err => {
		console.log(err)
		res.redirect('/')
	})
}

function create(req, res) {
  req.body.creator = req.user.profile._id
  Plan.create(req.body)
  .then(plan => {
    res.render('/plans')
  })
  .catch(err => {
		console.log(err)
		res.redirect('/')
	})
}

function show(req, res) {
	Plan.findById(req.params.planId)
  .populate([
    {path: 'creator'},
    {path: 'comments.author'}
  ])
	.then(plan => {
		res.render('plans/show', {
			plan,
			title: ''
		})
	})
	.catch(err => {
		console.log(err)
		res.redirect('/')
	})
}

function addComment(req, res) {
  Plan.findById(req.params.planId)
  .then(plan => {
    req.body.author = req.user.profile._id
    plan.comments.push(req.body)
    plan.save()
    .then(() => {
      res.redirect(`/plans/${plan._id}`)
    })
    .catch(err => {
      console.log(err)
      res.redirect('/plans')
    })
  })
  .catch(err => {
		console.log(err)
		res.redirect('/plans')
	})
}

export {
  index,
  show,
  create,
  addComment,
}