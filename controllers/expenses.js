import { Expense } from "../models/expense.js"

function index(req, res) {
  Expense.find({})
  .then(expenses => {
    res.render('expenses/index', {
      expenses,
      title: 'My Expenses'
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/expenses')
  })
}

function create(req, res) {
  req.body.creator = req.user.profile._id
  Expense.create(req.body)
  .then(expense => {
    res.redirect('/expenses')
  })
  .catch(err => {
    console.log(err)
    res.redirect('/expenses')
  })
}

export {
  index,
  create,
}