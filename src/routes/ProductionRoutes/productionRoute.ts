import express from 'express'
import { verifyProduction } from '../../utils/verifyUser';
import { acceptOrder, acceptReq, addItem, addSubscription, availableSales, fetchOrders, fetchRequestedRetailers, 
    getAvailRetailList, getConnRetailersList, getProfile, getRetailerProfile, getSalesProfile, 
    rejectOrder, rejectReq, sendConnectionRequest } from '../../controllers/ProductionController/ProductionController';




const router = express.Router();


router.get('/profile', verifyProduction, getProfile)
router.post('/addItem', verifyProduction, addItem)
router.get('/requests', verifyProduction, fetchRequestedRetailers)
router.delete('/delete-req', verifyProduction, rejectReq)
router.post('/acc-req', verifyProduction, acceptReq)
router.get('/orders', verifyProduction,fetchOrders)
router.patch('/order-acc', verifyProduction,acceptOrder)
router.patch('/order-rej', verifyProduction,rejectOrder)
router.get('/available-sales', verifyProduction,availableSales)
router.post('/sales-prof', verifyProduction, getSalesProfile)
router.get('/conn-ret', verifyProduction, getConnRetailersList)
router.get('/avail-ret', verifyProduction, getAvailRetailList)
router.get('/ret-profile', verifyProduction,getRetailerProfile)
router.patch('/conn-req', verifyProduction, sendConnectionRequest)
router.patch('/subscription', verifyProduction,addSubscription)


export default router;