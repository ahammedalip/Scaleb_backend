import express from 'express'
import { createOrder, fetchOrder, getAvailableProduction, viewIndividualprofile } from '../../controllers/SalesController/SalesController';
import { verifySales } from '../../utils/verifyUser';


const router = express.Router()


router.get('/available-prod',verifySales, getAvailableProduction)
router.get('/prod/profile', verifySales, viewIndividualprofile)
router.post('/createOrder', verifySales, createOrder)
router.get('/orders', verifySales, fetchOrder)


export default router;