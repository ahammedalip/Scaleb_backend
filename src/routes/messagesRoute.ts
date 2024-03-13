import expres from 'express';
import { addMessage, getMessage } from '../controllers/messagesController';

const router = expres.Router()

router.post ('/',addMessage)
router.get ('/', getMessage)


export default router;