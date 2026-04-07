const express = require('express');
const router = express.Router();
const {
    createTicket,
    getAllTickets,
    getUserTickets,
    getTicket,
    addReply,
    updateTicketStatus,
    deleteTicket,
    getSupportChat,
    sendChatMessage,
    getUnreadCount
} = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');

// Protected routes
router.post('/', protect, createTicket);
router.get('/user/my-tickets', protect, getUserTickets);
router.get('/user/unread-count', protect, getUnreadCount);
router.get('/admin/all-tickets', protect, getAllTickets);
router.get('/chat/support', protect, getSupportChat);
router.post('/chat/message', protect, sendChatMessage);
router.get('/:id', protect, getTicket);
router.post('/:id/reply', protect, addReply);
router.patch('/:id/status', protect, updateTicketStatus);
router.delete('/:id', protect, deleteTicket);

module.exports = router;
