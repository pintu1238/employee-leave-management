import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { getLeaves, getLeaveSummary, getLeaveById, createLeave, updateLeaveStatus } from '../controllers/leaveController.js'

const router = express.Router()

router.get('/', authMiddleware, getLeaves)
router.get('/summary', authMiddleware, getLeaveSummary)
router.post('/', authMiddleware, createLeave)
router.get('/:id', authMiddleware, getLeaveById)
router.patch('/:id/status', authMiddleware, updateLeaveStatus)

export default router
