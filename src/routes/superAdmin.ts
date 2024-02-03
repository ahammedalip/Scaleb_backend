import express from 'express'
import {login} from '../controllers/superAdmin'


const router = express.Router()


router.post('/Admin-auth', login)





export default router;