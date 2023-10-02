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

function show(req, res) {
  Expense.findById(req.params.expenseId)
  .populate('creator')
  .then(expense => {
    res.render('expenses/show', {
      expense,
      title: 'My Expenses'
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/expenses')
  })
}

function edit(req, res) {
  Expense.findById(req.params.expenseId)
  .then(expense => {
    res.render('expenses/edit', {
      expense,
      title: '',
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/expenses')
  })
}

function update(req, res) {
  Expense.findById(req.params.expenseId)
  .then(expense => {
    if (expense.creator.equals(req.user.profile._id)) {
      expense.updateOne(req.body)
      .then(() => {
        res.redirect(`/expenses/${expense._id}`)
      })
    } else {
      throw new Error('✋ Not Authorized 🛑')
    }
  })
  .catch(err => {
    console.log(err)
    res.redirect('/expenses')
  })
}

function deleteExpense(req, res) {
  Expense.findById(req.params.expenseId)
  .then(expense => {
    if (expense.creator.equals(req.user.profile._id)) {
      expense.deleteOne()
      .then(() => {
        res.redirect('/expenses')
      })
    } else {
      throw new Error('✋ Not Authorized 🛑')
    }
  })
  .catch(err => {
    console.log(err)
    res.redirect('/expenses')
  })
}

export {
  index,
  create,
  show,
  edit,
  update,
  deleteExpense as delete,
}