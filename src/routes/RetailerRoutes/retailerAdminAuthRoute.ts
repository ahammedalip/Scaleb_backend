import express from 'express'
import { otpVerification, retailLogin, retailValidation } from '../../controllers/RetailerController/retailerAdminAuth';


const router = express.Router()

router.post('/verify_cred',retailValidation)
router.post ('/verify_otp', otpVerification)
router.post ('/login', retailLogin)

export default router;


