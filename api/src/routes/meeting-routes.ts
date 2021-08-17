import express from 'express';
import {
    createMeeting,
    getAllMeetings,
} from "../controllers/meeting-controller";

const router = express.Router();
router.post('/create', createMeeting);
router.get('/all', getAllMeetings);

export default router;
