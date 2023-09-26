import { Router } from 'express'
import { isLoggedIn } from '../middleware/middleware.js'
import * as profilesCtrl from '../controllers/profiles.js'

const router = Router()

router.get('/', isLoggedIn, profilesCtrl.index)
router.get('/:profileId', isLoggedIn, profilesCtrl.show)
router.get('/:profileId/edit', isLoggedIn, profilesCtrl.edit)
router.put('/:profileId', isLoggedIn, profilesCtrl.update)

export {
  router
}
