import express from 'express'
import { verifyProduction } from '../../utils/verifyUser';
import { addItem, getProfile } from '../../controllers/ProductionController/ProductionController';



const router = express.Router();


router.get('/profile', verifyProduction, getProfile)
router.post('/addItem', verifyProduction, addItem)



export default router;