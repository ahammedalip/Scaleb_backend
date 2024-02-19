import express from 'express'
import {actions, getRetailerList, login} from '../controllers/SuperAdmin/superAdmin'


const router = express.Router()


router.post('/Admin-auth', login)

router.get('/retailer_list', getRetailerList )





export default router;