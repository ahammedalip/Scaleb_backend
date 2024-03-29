import express from 'express'
import {blockUser, getProductionList, getRetailerList, login} from '../controllers/SuperAdmin/superAdmin'
import { verifyAdmin } from '../utils/verifyUser'


const router = express.Router()


router.post('/Admin-auth', login)

router.get('/retailer_list', getRetailerList )
router.get('/production_list', getProductionList)
router.put('/toggle_block_update',verifyAdmin, blockUser)





export default router;