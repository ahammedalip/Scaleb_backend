import express from 'express'
import { getAvailableProduction } from '../../controllers/SalesController/SalesController';
import { verifySales } from '../../utils/verifyUser';


const router = express.Router()


router.get('/available-prod',verifySales, getAvailableProduction)


export default router;