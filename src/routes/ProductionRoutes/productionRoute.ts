import express from 'express'
import { verifyProduction } from '../../utils/verifyUser';
import { acceptReq, addItem, fetchRequestedRetailers, getProfile } from '../../controllers/ProductionController/ProductionController';



const router = express.Router();


router.get('/profile', verifyProduction, getProfile)
router.post('/addItem', verifyProduction, addItem)
router.get('/requests', verifyProduction, fetchRequestedRetailers)
router.post('/acc-req', verifyProduction, acceptReq)



export default router;