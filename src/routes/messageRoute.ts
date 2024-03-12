import express from 'express'
import { getMessageProd, getMessageSales, sendMessageProduction, sendMessageSales } from '../controllers/messageController';
import { verifySender } from '../utils/verifyUser';

const router = express.Router()


router.post('/pro',verifySender, sendMessageProduction)
router.post('/sal', verifySender, sendMessageSales)
router.post('/get-prod',verifySender, getMessageProd)
router.post( '/get-sale', verifySender,getMessageSales)
// router

export default router;