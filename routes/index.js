import { Router } from 'express'
import { Profile } from '../models/profile.js'
import { isLoggedIn } from '../middleware/middleware.js'
import { User } from '../models/user.js'

const router = Router()

router.get('/', function (req, res) {
  if (req.user) {
    Profile.findById(req.user.profile._id)
    .then(profile => {
      res.render('index', {
        title: 'Home Page',
        profile,
      })
    })
  } else {
    res.render('index', { title: 'Home Page' })
  }
})

export {
  router
}
