import express from 'express'
import { verifyProduction } from '../../utils/verifyUser';
import { getProfile } from '../../controllers/ProductionController/ProductionController';



const router = express.Router();


router.get('/profile', verifyProduction, getProfile)



export default router;