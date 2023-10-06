import { populate } from 'dotenv'
import { Plan } from '../models/plan.js'
import { Task } from '../models/task.js'
import { Expense } from '../models/expense.js'
import { Profile } from '../models/profile.js'

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
    {path: 'members'},
    {path: 'tasks'},
    {path: 'comments.author'},
  ])
	.then(plan => {
    Profile.find({_id: {$in: plan.creator.friends}})
    .then(creatorFriends => {
      const isCreatorsFriend = creatorFriends.some(profile => profile._id.toString() === req.user.profile._id.toString())
      Task.find({})
      .then(tasks => {
        const isMember = plan.members.some(member => member._id.toString() === req.user.profile._id.toString())
        const isCreator = plan.creator.equals(req.user.profile._id)
        res.render('plans/show', {
          plan,
          tasks,
          creatorFriends,
          isCreatorsFriend,
          isMember,
          isCreator,
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
  })
	.catch(err => {
		console.log(err)
		res.redirect('/')
	})
}

function edit(req, res) {
  Plan.findById(req.params.planId)
  .then(plan => {
    res.render('plans/edit', {
      plan,
      title: 'My Plans',
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

function addMember(req, res) {
  Plan.findById(req.params.planId)
  .then(plan => {
    const memberExisted = plan.members.some(member => member._id.toString() === req.body.memberId.toString())
    if (plan.creator.equals(req.user.profile._id) && !memberExisted) {
      plan.members.push(req.body.memberId)
      plan.save()
      .then(() => {
        res.redirect(`/plans/${plan._id}`)
      })
      .catch(err => {
        console.log(err)
        res.redirect(`/plans`)
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
    res.render('tasks/new', {
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
    const isPlanCreator = plan.creator.equals(req.user.profile._id)
    const isMember = plan.members.some(member => member._id.toString() === req.user.profile._id.toString())
    Task.findById(req.params.taskId)
    .populate([
      {path: 'creator'},
      {path: 'comments.author'},
      {path: 'expenses'},
    ])
    .then(task => {
      const isTaskCreator = task.creator.equals(req.user.profile._id)
      Expense.find({_id: {$nin: task.expenses}})
      .then(expenses => {
        res.render('tasks/show', {
          plan,
          task,
          isPlanCreator,
          isTaskCreator,
          isMember,
          expenses,
          title: 'My Plans',
        })
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
      res.render('tasks/edit', {
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

function deleteComment(req, res) {
  Plan.findById(req.params.planId)
  .then(plan => {
    const comment = plan.comments.id(req.params.commentId)
    if (comment.author.equals(req.user.profile._id)) {
      plan.comments.remove(comment)
      plan.save()
      .then(() => {
        res.redirect(`/plans/${plan._id}`)
      })
      .catch(err => {
        console.log(err)
        res.redirect(`/plans`)
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

function deleteTaskComment(req, res) {
  Plan.findById(req.params.planId)
  .then(plan => {
    Task.findById(req.params.taskId)
    .then(task => {
      const comment = task.comments.id(req.params.commentId)
      if (comment.author.equals(req.user.profile._id)) {
        task.comments.remove(comment)
        task.save()
        .then(() => {
          res.redirect(`/plans/${plan._id}/tasks/${task._id}`)
        })
        .catch(err => {
          console.log(err)
          res.redirect(`/plans/${plan._id}/tasks`)
        })
      } else {
        throw new Error('✋ Not Authorized 🛑')
      }
    })
    .catch(err => {
      console.log(err)
      res.redirect(`/plans/${plan._id}`)
    })
  })
  .catch(err => {
		console.log(err)
		res.redirect('/plans')
	})
}

function addExpense(req, res) {
  Plan.findById(req.params.planId)
  .then(plan => {
    Task.findById(req.params.taskId)
    .then(task => {
      task.expenses.push(req.body.expenseId)
      task.save()
      .then(() => {
        res.redirect(`/plans/${plan._id}/tasks/${task._id}`)
      })
      .catch(err => {
        console.log(err)
        res.redirect(`/plans/${plan._id}/tasks`)
      })
    })
    .catch(err => {
      console.log(err)
      res.redirect(`/plans/${plan._id}`)
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
  addMember,
  addComment,
  deleteComment,
  addTask,
  newTask,
  showTask,
  editTask,
  updateTask,
  deleteTask,
  addTaskComment,
  deleteTaskComment,
  addExpense,
}