import express from 'express'
import { getAvailableProduction, viewIndividualprofile } from '../../controllers/SalesController/SalesController';
import { verifySales } from '../../utils/verifyUser';


const router = express.Router()


router.get('/available-prod',verifySales, getAvailableProduction)
router.get('/prod/profile', verifySales, viewIndividualprofile)


export default router;