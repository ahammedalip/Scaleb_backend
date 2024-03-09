import express from 'express'
import { verifyProduction } from '../../utils/verifyUser';
import { acceptOrder, acceptReq, addItem, fetchOrders, fetchRequestedRetailers, getProfile, rejectOrder } from '../../controllers/ProductionController/ProductionController';



const router = express.Router();


router.get('/profile', verifyProduction, getProfile)
router.post('/addItem', verifyProduction, addItem)
router.get('/requests', verifyProduction, fetchRequestedRetailers)
router.post('/acc-req', verifyProduction, acceptReq)
router.get('/orders', verifyProduction,fetchOrders)
router.patch('/order-acc', verifyProduction,acceptOrder)
router.patch('/order-rej', verifyProduction,rejectOrder)



export default router;