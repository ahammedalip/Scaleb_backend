import  express from "express";
import {  addSalesExecutive, avialableProd, blockSalesExec, connectedProd, getOrder, getSalesList, profile, sendConnectionRequest, showProductionprofile } from "../../controllers/RetailerController/retailerAdmin";
import { verifyRetailer } from "../../utils/verifyUser";


const router = express.Router()



router.post('/add_sales', verifyRetailer,addSalesExecutive)
router.get('/sales_list',getSalesList)
router.put('/toggle_block_update', verifyRetailer,blockSalesExec)
router.get('/available', verifyRetailer,avialableProd)
router.get('/profile', verifyRetailer, profile)
router.get('/prod/profile' , verifyRetailer,showProductionprofile)
router.post('/conn-req', verifyRetailer,sendConnectionRequest)
router.get('/connected', verifyRetailer, connectedProd)
router.get('/getOrder', verifyRetailer,getOrder)


export default router;