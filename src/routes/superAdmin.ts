import express from 'express'
import {actions, login} from '../controllers/superAdmin'


const router = express.Router()


router.post('/Admin-auth', login)
router.post('/home', actions)





export default router;