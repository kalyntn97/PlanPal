import { populate } from 'dotenv'
import { Plan } from '../models/plan.js'
import { Task } from '../models/task.js'
import { Expense } from '../models/expense.js'

function index(req, res) {
  Plan.find({})
  .then(plans => {
		res.render('plans/index', {
			plans,
			title: 'My Plans',
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
    res.redirect('/plans')
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
    {path: 'tasks'},
    {path: 'comments.author'},
  ])
	.then(plan => {
    Task.find({})
    .then(tasks => {
      res.render('plans/show', {
        plan,
        tasks,
        title:'My Plans',
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
  Plan.findById(req.params.planId)
  .then(plan => {
    const planDate = plan.date.toISOString().slice(0, 16)
    res.render('plans/edit', {
      plan,
      title: 'My Plans',
      planDate,
    })
  })
  .catch(err => {
		console.log(err)
		res.redirect('/plans')
	})
}

function update(req, res) {
  Plan.findById(req.params.planId)
  .then(plan => {
    if (plan.creator.equals(req.user.profile._id)) {
      plan.updateOne(req.body)
      .then(() => {
        res.redirect(`/plans/${plan._id}`)
      })
    } else {
      throw new Error('✋ Not Authorized 🛑')
    }
  })
  .catch(err => {
		console.log(err)
		res.redirect('/plans')
	})
}

function deletePlan(req, res) {
  Plan.findById(req.params.planId)
  .then(plan => {
    if (plan.creator.equals(req.user.profile._id)) {
      plan.deleteOne()
      .then(() => {
        res.redirect(`/plans/`)
      })
    } else {
      throw new Error('✋ Not Authorized 🛑')
    }
  })
  .catch(err => {
		console.log(err)
		res.redirect('/plans')
	})
}

function newTask(req, res) {
  Plan.findById(req.params.planId)
  .then(plan => {
    res.render('tasks/newTask', {
      plan,
      title: 'My Plans'
    })
  })
}

function addTask(req, res) {
  Plan.findById(req.params.planId)
  .then(plan => {
    req.body.creator = req.user.profile._id
    Task.create(req.body)
    .then(task => {
      plan.tasks.push(task._id)
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
  })
  .catch(err => {
    console.log(err)
    res.redirect('/plans')
  })
}

function showTask(req, res) {
  Plan.findById(req.params.planId)
  .then(plan => {
    Task.findById(req.params.taskId)
    .populate([
      {path: 'creator'},
      {path: 'comments.author'},
    ])
    .then(task => {
      res.render('tasks/showTask', {
        plan,
        task,
        title: 'My Plans',
      })
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

function editTask(req, res) {
  Plan.findById(req.params.planId)
  .then(plan => {
    Task.findById(req.params.taskId)
    .then(task => {
      const taskDate = task.date.toISOString().slice(0, 16)
      res.render('tasks/editTask', {
        plan,
        task,
        taskDate,
        title: 'My Plans',
      })
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

function updateTask(req, res) {
  Plan.findById(req.params.planId)
  .then(plan => {
    Task.findById(req.params.taskId)
    .then(task => {
      if (task.creator.equals(req.user.profile._id)) {
        task.updateOne(req.body)
        .then(() => {
          res.redirect(`/plans/${plan._id}/tasks/${task._id}`)
        })
      } else {
        throw new Error('✋ Not Authorized 🛑')
      }
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

function deleteTask(req, res) {
  Plan.findById(req.params.planId)
  .then(plan => {
    Task.findById(req.params.taskId)
    .then(task => {
      if (task.creator.equals(req.user.profile._id)) {
        task.deleteOne()
        .then(() => {
          res.redirect(`/plans/${plan._id}/`)
        })
      } else {
        throw new Error('✋ Not Authorized 🛑')
      }
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

function addTaskComment(req, res) {
  Plan.findById(req.params.planId)
  .then(plan => {
    Task.findById(req.params.taskId)
    .then(task => {
      req.body.author = req.user.profile._id
      task.comments.push(req.body)
      task.save()
      .then(() => {
        res.redirect(`/plans/${plan._id}/tasks/${task._id}`)
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
  edit,
  update,
  deletePlan as delete,
  addComment,
  addTask,
  newTask,
  showTask,
  editTask,
  updateTask,
  deleteTask,
  addTaskComment,
}