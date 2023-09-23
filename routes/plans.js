import { Router } from 'express'
import { isLoggedIn } from '../middleware/middleware.js'
import * as plansCtrl from '../controllers/plans.js'

const router = Router()

router.get('/', isLoggedIn, plansCtrl.index)
router.get('/:planId', isLoggedIn, plansCtrl.show)
router.post('/', isLoggedIn, plansCtrl.create)
router.post('/:planId/comments', isLoggedIn, plansCtrl.addComment)

export {
  router
}