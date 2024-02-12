import  express from "express";
import {  addSalesExecutive, getSalesList } from "../../controllers/RetailerController/retailerAdmin";


const router = express.Router()



router.post('/add_sales', addSalesExecutive)
router.get('/sales_list',getSalesList)


export default router;