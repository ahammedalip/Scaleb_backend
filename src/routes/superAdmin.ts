import express from 'express'
import {actions, getProductionList, getRetailerList, login} from '../controllers/SuperAdmin/superAdmin'


const router = express.Router()


router.post('/Admin-auth', login)

router.get('/retailer_list', getRetailerList )
router.get('/production_list', getProductionList)





export default router;