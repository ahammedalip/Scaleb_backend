import express from 'express'
import { retailerSignUp } from '../controllers/retailerAdmin';


const router = express.Router()

router.post('/signup/verify_cred',retailerSignUp)

export default router;

