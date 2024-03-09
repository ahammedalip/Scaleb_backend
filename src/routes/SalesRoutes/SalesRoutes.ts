import express from 'express'
import { createOrder, editOrderRequest, fetchOrder, getAvailableProduction, viewIndividualprofile } from '../../controllers/SalesController/SalesController';
import { verifySales } from '../../utils/verifyUser';


const router = express.Router()


router.get('/available-prod',verifySales, getAvailableProduction)
router.get('/prod/profile', verifySales, viewIndividualprofile)
router.post('/createOrder', verifySales, createOrder)
router.get('/orders', verifySales, fetchOrder)
router.patch('/edit-order', verifySales,editOrderRequest )


export default router;