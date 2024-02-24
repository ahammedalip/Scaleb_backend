import  express from "express";
import {  addSalesExecutive, blockSalesExec, getSalesList } from "../../controllers/RetailerController/retailerAdmin";
import { verifyRetailer } from "../../utils/verifyUser";


const router = express.Router()



router.post('/add_sales', verifyRetailer,addSalesExecutive)
router.get('/sales_list',getSalesList)
router.put('/toggle_block_update', verifyRetailer,blockSalesExec)


export default router;