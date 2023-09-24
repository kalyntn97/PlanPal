import { Router } from 'express'
import { isLoggedIn } from '../middleware/middleware.js'
import * as plansCtrl from '../controllers/plans.js'

const router = Router()

router.get('/', isLoggedIn, plansCtrl.index)
router.get('/:planId', isLoggedIn, plansCtrl.show)
router.get('/:planId/edit', isLoggedIn, plansCtrl.edit)
router.get('/:planId/tasks/newTask', isLoggedIn, plansCtrl.newTask)
router.get('/:planId/tasks/:taskId', isLoggedIn, plansCtrl.showTask)
router.get('/:planId/tasks/:taskId/editTask', isLoggedIn, plansCtrl.editTask)
router.post('/', isLoggedIn, plansCtrl.create)
router.post('/:planId/tasks', isLoggedIn, plansCtrl.addTask)
router.post('/:planId/comments', isLoggedIn, plansCtrl.addComment)
router.post('/:planId/tasks/:taskId/comments', isLoggedIn, plansCtrl.addTaskComment)
router.put('/:planId', isLoggedIn, plansCtrl.update)
router.put('/:planId/tasks/:taskId', isLoggedIn, plansCtrl.updateTask)
router.delete('/:planId', isLoggedIn, plansCtrl.delete)
router.delete('/:planId/tasks/:taskId', isLoggedIn, plansCtrl.deleteTask)


export {
  router
}