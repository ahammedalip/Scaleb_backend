import express from 'express'
import { otpVerification, retailValidation } from '../controllers/retailerAdmin';


const router = express.Router()

router.post('/signup/verify_cred',retailValidation)
router.post ('/signup/verify_otp', otpVerification)

export default router;

