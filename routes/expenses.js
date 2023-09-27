import { Router } from 'express'
import { isLoggedIn } from '../middleware/middleware.js'
import * as expensesCtrl from '../controllers/expenses.js'

const router = Router()

router.get('/', isLoggedIn, expensesCtrl.index)
router.get('/:expenseId', isLoggedIn, expensesCtrl.show)
router.get('/:expenseId/edit', isLoggedIn, expensesCtrl.edit)
router.post('/', isLoggedIn, expensesCtrl.create)
router.put('/:expenseId', isLoggedIn, expensesCtrl.update)
router.delete('/:expenseId', isLoggedIn, expensesCtrl.delete)

export {
  router
}