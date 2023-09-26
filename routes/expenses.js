import { Router } from 'express'
import { isLoggedIn } from '../middleware/middleware.js'
import * as expensesCtrl from '../controllers/expenses.js'

const router = Router()

router.get('/', isLoggedIn, expensesCtrl.index)
router.post('/', isLoggedIn, expensesCtrl.create)

export {
  router
}