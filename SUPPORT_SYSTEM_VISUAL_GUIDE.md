# Unified Support System - Visual Guide

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    SUPPORT CONVERSATION                          │
│                   (Per User - Subject Fixed)                     │
│                                                                   │
│  userId: "12345"                                                │
│  subject: "Support Conversation"  (always same)                 │
│  status: "open" | "in-progress" | "resolved" | "closed"        │
│                                                                   │
│  Replies Array:                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Message 1: "Hello, I need help with..."                 │   │
│  │ Sender: User | Role: user | Time: 2024-01-15 10:30     │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ Message 2: "**[TICKET]** Payment Issue                  │   │
│  │             I'm unable to process payment..."           │   │
│  │ Sender: User | Role: user | Time: 2024-01-15 10:45     │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ Message 3: "Thank you for reporting this. We'll look... │   │
│  │ Sender: Admin | Role: admin | Time: 2024-01-15 11:00   │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ Message 4: "Issue has been resolved. Please check..."   │   │
│  │ Sender: Admin | Role: admin | Time: 2024-01-15 14:30   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## User Journey - Submitting a Ticket

```
┌─────────────────────────────────────────────────────────────────┐
│                     OWNER WEB APP                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. User clicks Profile → Help Center                           │
│     ↓                                                             │
│  2. Views 3 FAQs                                                │
│     ↓                                                             │
│  3. Clicks "Raise a Ticket" button                              │
│     ↓                                                             │
│  4. Fills out:                                                  │
│     - Subject: "Payment Issue"                                  │
│     - Description: "I'm unable to process payment..."           │
│     ↓                                                             │
│  5. Clicks "Submit Ticket"                                      │
│     ↓                                                             │
│  6. Frontend: POST /api/tickets                                 │
│     {                                                            │
│       "subject": "Payment Issue",                               │
│       "description": "I'm unable to process payment..."         │
│     }                                                            │
│     ↓                                                             │
│  7. Backend: createTicket()                                     │
│     - Find or create "Support Conversation" for user            │
│     - Format message: "**[TICKET]** Payment Issue\n\n..."       │
│     - Add to replies array                                      │
│     - Save to database                                          │
│     ↓                                                             │
│  8. Frontend: Show "Ticket submitted successfully!"             │
│     ↓                                                             │
│  9. User sees message in Support Chat widget (chat icon)        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## User Journey - Chat Interaction

```
┌─────────────────────────────────────────────────────────────────┐
│                     OWNER WEB APP                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. User clicks Support Chat bubble (bottom-right)              │
│     ↓                                                             │
│  2. Chat window expands showing conversation                    │
│     ↓                                                             │
│  3. Frontend: GET /api/tickets/chat/support                     │
│     ↓                                                             │
│  4. Backend: getSupportChat()                                   │
│     - Find or create "Support Conversation" for user            │
│     - Return with all replies                                   │
│     ↓                                                             │
│  5. Display all messages (tickets + chat mixed)                 │
│     ↓                                                             │
│  6. User types message and presses Enter                        │
│     ↓                                                             │
│  7. Frontend: POST /api/tickets/chat/message                    │
│     { "message": "Can you help me with..." }                    │
│     ↓                                                             │
│  8. Backend: sendChatMessage()                                  │
│     - Find user's "Support Conversation"                        │
│     - If closed → reopen (status = 'open')                      │
│     - Add message to replies array                              │
│     - Update updatedAt timestamp                                │
│     ↓                                                             │
│  9. Frontend: Clear input, show new message                     │
│     ↓                                                             │
│  10. Poll every 5 seconds for new admin replies                 │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Admin Journey - Managing Conversations

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN WEB APP                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. Admin logs in and navigates to Support Tickets              │
│     ↓                                                             │
│  2. Left Panel: Frontend: GET /api/tickets/admin/all-tickets    │
│     ↓                                                             │
│  3. Backend: getAllTickets()                                    │
│     - Query: Find all with subject: "Support Conversation"      │
│     - Sort by updatedAt (most recent first)                     │
│     - Populate user and reply sender data                       │
│     - Return list                                               │
│     ↓                                                             │
│  4. Display conversation list:                                  │
│     "Support Conversation - John Smith | 2024-01-15"           │
│     ↓                                                             │
│  5. Admin clicks conversation to expand                         │
│     ↓                                                             │
│  6. Right Panel: Display full conversation history              │
│     - Shows ALL messages (tickets + chat mixed)                 │
│     - [TICKET] formatted items clearly visible                  │
│     - Admin messages in green                                   │
│     - User messages in white/blue                               │
│     ↓                                                             │
│  7. Admin actions available:                                    │
│     A. Change status dropdown:                                  │
│        - Open → In Progress → Resolved → Closed                 │
│        - Calls PATCH /api/tickets/{id}/status                   │
│     B. Send reply:                                              │
│        - Types response in textarea                             │
│        - Clicks "Send Reply"                                    │
│        - Calls POST /api/tickets/{id}/reply                     │
│        - Message marked as senderRole: 'admin'                  │
│     C. Close conversation:                                      │
│        - Changes status to "Closed"                             │
│        - If user sends new message → auto-reopens               │
│     ↓                                                             │
│  8. User receives notifications:                                │
│     - Chat widget updates on next poll                          │
│     - Mobile app updates on next refresh                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow - Complete Lifecycle

```
CREATION FLOW:
└─ User submits ticket OR sends chat
   └─ POST /api/tickets OR POST /api/tickets/chat/message
      └─ Backend checks: Does "Support Conversation" exist for user?
         ├─ NO: Create new with description
         └─ YES: Use existing
      └─ Format message (add [TICKET] if from ticket submit)
      └─ Add to replies array
      └─ If closed: reopen
      └─ Save to DB
      └─ Return updated document

RETRIEVAL FLOW:
└─ User opens chat OR admin views conversations
   └─ GET /api/tickets/chat/support OR GET /api/tickets/admin/all-tickets
      └─ Backend queries for subject: "Support Conversation"
      └─ Populate related data (user names, roles)
      └─ Sort by updatedAt descending
      └─ Return to frontend

RESPONSE FLOW:
└─ Admin sends reply to conversation
   └─ POST /api/tickets/{id}/reply
      └─ Backend finds conversation by ID
      └─ Add reply with senderRole: 'admin'
      └─ Update updatedAt
      └─ Save to DB
      └─ Return updated document

UPDATE FLOW:
└─ Admin changes conversation status
   └─ PATCH /api/tickets/{id}/status
      └─ Backend finds conversation
      └─ Update status field
      └─ Save to DB
      └─ Return updated document
```

## Message Format Examples

### Regular Chat Message
```
{
  senderId: ObjectId,
  senderName: "John Smith",
  senderRole: "user",
  message: "Can you help me with my subscription?"
}
```

### Formal Ticket Submission
```
{
  senderId: ObjectId,
  senderName: "John Smith",
  senderRole: "user",
  message: "**[TICKET]** Payment Issue\n\nI'm unable to process my monthly membership payment. The payment gateway shows error code 500."
}
```

### Admin Reply
```
{
  senderId: ObjectId,
  senderName: "Support Admin",
  senderRole: "admin",
  message: "Thank you for reporting this issue. We've identified the problem with our payment gateway and it has been fixed. Please try again."
}
```

## Filter Logic

### Admin Portal Filters
```
User clicks filter button:

"All" 
  └─ Show: All "Support Conversation" records

"Chat" 
  └─ Show: All "Support Conversation" records
  (Now same as all, since unified)

"Tickets"
  └─ Show: All "Support Conversation" records
  (Now same as all, since unified)

"Open"
  └─ Show: All "Support Conversation" with status="open"

"In Progress"
  └─ Show: All "Support Conversation" with status="in-progress"

"Resolved"
  └─ Show: All "Support Conversation" with status="resolved"

"Closed"
  └─ Show: All "Support Conversation" with status="closed"
```

## Key Implementation Details

### Unified Subject
```javascript
// OLD (BEFORE)
Ticket 1: subject = "Payment Issue"
Ticket 2: subject = "Login Error"
Chat: subject = "Support Chat"

// NEW (AFTER)
All: subject = "Support Conversation"
(Formatted messages distinguish ticket vs chat)
```

### Auto-Reopen Logic
```javascript
// When user sends message to closed conversation
if (conversation.status === 'closed') {
  conversation.status = 'open'; // Automatically reopen
}
// This ensures users don't feel ignored
```

### Timestamp Tracking
```
createdAt: When conversation first created
updatedAt: Updated every time message added
// Admin list sorted by updatedAt DESC (most recent first)
```

## Browser Features

### Web App - Support Chat Widget
```
┌────────────────────────┐
│  Support Chat Bubble   │ ← Minimized (bottom-right corner)
│      (Click to)        │
│      Expand            │
└────────────────────────┘

After Click:
┌──────────────────────────────────────────┐
│  Support                            ✕    │ ← Header
├──────────────────────────────────────────┤
│ Ticket from yesterday:                   │
│ [TICKET] Payment Issue                   │
│ I can't process my payment...            │
│                                          │
│ Admin replied:                           │
│ Thank you for reporting. We've fixed it. │ ← Green background
│                                          │
│ Latest chat:                             │
│ Has it worked now?                       │
│                                          │
│ Admin:                                   │
│ Yes, please try again.                   │ ← Green background
├──────────────────────────────────────────┤
│ Your message...        [Send Button]     │
└──────────────────────────────────────────┘
```

### Mobile App - Chat Page
```
┌──────────────────────────────────────┐
│ ← Support Chat                    ⋮ │ ← Header with back
├──────────────────────────────────────┤
│                                      │
│ Full message history displayed       │
│ (scrollable)                         │
│                                      │
│ Message 1                            │
│ Message 2                            │
│ Message 3                            │
│ ...                                  │
│                                      │
├──────────────────────────────────────┤
│ [Type a message...         ] [Send] │
└──────────────────────────────────────┘
```
