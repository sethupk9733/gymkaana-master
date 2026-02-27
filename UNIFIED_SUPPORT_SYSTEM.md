# Unified Support System Documentation

## Overview
The support system has been successfully unified to merge support tickets and chat conversations into a single conversation thread per user. This eliminates silos between different types of support interactions and provides a seamless experience for both users and admins.

## System Architecture

### Unified Model
- **Single Subject**: All support interactions now use `subject: 'Support Conversation'`
- **Single Storage**: Both tickets and chat messages stored in the same `replies` array
- **Message Formatting**: Formal ticket submissions are formatted with a **[TICKET]** prefix to distinguish them from regular chat messages

**Example Ticket Submission Format**:
```
**[TICKET]** Payment Issue

I'm unable to process my monthly membership payment. The payment gateway shows an error.
```

### Flow Diagram
```
User Submits Ticket / Sends Chat Message
          ↓
Hits `/api/tickets` or `/api/tickets/chat/message`
          ↓
Backend creates or finds user's "Support Conversation"
          ↓
Message added to replies array (formatted if ticket)
          ↓
Conversation status auto-reopens if closed
          ↓
Admin sees unified conversation in admin portal
          ↓
Admin replies to conversation (marked as Admin)
          ↓
User sees reply in support chat widget or app
```

## User-Facing Features

### Owner Web App
**Location**: `owner-web-app/src/app/components`

#### Support Chat Widget (`SupportChat.tsx`)
- **Display**: Minimized bubble in bottom-right corner (always visible)
- **Features**:
  - Click bubble to expand conversation window
  - Shows all messages with auto-scroll to latest
  - Real-time polling every 5 seconds
  - Enter key to send messages
  - Admin messages highlighted in green
  - User messages in blue
  - Full timestamp for each message
  - Loading indicators for fetch/send states
  
#### Profile Page (`Profile.tsx`)
- **Help Center Tab**:
  - 3 FAQs with collapse/expand
  - "Raise a Ticket" button opens ticket form
- **Ticket Form**:
  - Subject field
  - Description textarea
  - Validation before submit
  - Success notification
  - Auto-clears form after submission
- **Contact Tab**:
  - Email: support@gymkaana.com
  - Phone: +91 8000 900 900
  - Office address
- **Settings Tab**: 
  - Push notifications toggle
  - Two-factor authentication toggle
  - Privacy Policy link
  - Terms & Conditions link

### Owner Mobile App
**Location**: `owner-mobile-app/src/pages`

#### Chat Page (`Chat.tsx`)
- Dedicated full-screen chat interface
- Header with back button
- Message display with timestamps
- Textarea input with send button
- Auto-refresh every 3 seconds
- Mobile-optimized styling

#### Help & Support (`HelpSupport.tsx`)
- Collapsible FAQs
- "Raise a Ticket" button
- Ticket submission form (subject + description)
- Loading states during submission

#### Profile Actions
- "Support Chat" button → opens Chat page
- "Help Center" button → opens Help & Support
- "Contact Us" button → opens Contact page
- "Settings" button
- Privacy & Terms links

## Admin Features

### Admin Portal
**Location**: `admin-web-app/src/app/components/SupportTickets.tsx`

#### Conversation Management
- **Left Panel**: List of all user conversations
  - Filter buttons: All, Chat, Tickets, Status filters
  - Shows "Support Conversation - [Username]"
  - Last updated date
  - Priority badge
  - Sorted by most recent first

- **Right Panel**: Full conversation view
  - Header shows conversation title and user info
  - Status dropdown to change status (Open, In Progress, Resolved, Closed)
  - Full message history with timestamps
  - Message source indicator (Admin/User)
  - Color-coded replies (Admin = green, User = white)

#### Filtering System
- **All**: Shows all conversations
- **Chat**: Shows all "Support Conversation" entries (now unified)
- **Tickets**: Shows all "Support Conversation" entries (now unified)
- **Status Filters**: Open, In Progress, Resolved, Closed

#### Admin Actions
- View full conversation history
- Send replies to conversations
- Change conversation status
- Mark conversations as resolved/closed
- Reopen closed conversations via new message

## Backend Implementation

### Database Model
**File**: `backend-api/models/Ticket.js`

```javascript
{
  userId: ObjectId,           // User who started conversation
  subject: String,            // Always 'Support Conversation' for unified system
  description: String,        // Initial ticket/conversation description
  status: 'open' | 'in-progress' | 'resolved' | 'closed',
  priority: 'low' | 'medium' | 'high',
  replies: [{
    senderId: ObjectId,       // User ID
    senderName: String,       // Display name
    senderRole: 'user' | 'admin',  // Role of sender
    message: String,          // Message content (may start with **[TICKET]**)
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Controller Functions
**File**: `backend-api/controllers/ticketController.js`

#### `createTicket` (POST /api/tickets)
- Called when user submits support ticket from Help Center
- Finds or creates user's "Support Conversation"
- Formats message with **[TICKET]** prefix
- Adds message to replies array
- Returns updated conversation

#### `getSupportChat` (GET /api/tickets/chat/support)
- Gets user's "Support Conversation"
- Creates empty conversation if doesn't exist
- Returns conversation with all replies

#### `sendChatMessage` (POST /api/tickets/chat/message)
- Called when user sends chat message
- Finds or creates user's "Support Conversation"
- Auto-reopens if conversation was closed
- Adds message to replies array
- Updates `updatedAt` timestamp
- Returns updated conversation

#### `getAllTickets` (GET /api/tickets/admin/all-tickets)
- Admin only endpoint
- Fetches all "Support Conversation" records
- Sorted by most recent first
- Populates user and reply sender data

#### `addReply` (POST /api/tickets/:id/reply)
- Admin adds reply to conversation
- Marks senderRole as 'admin'
- Updates `updatedAt` timestamp
- Returns updated conversation

#### `updateTicketStatus` (PATCH /api/tickets/:id/status)
- Changes conversation status
- Admin only
- Can transition between any statuses

### API Routes
**File**: `backend-api/routes/ticketRoutes.js`

```javascript
POST   /api/tickets                    // Submit ticket
GET    /api/tickets/user/my-tickets    // Get user's conversations
GET    /api/tickets/admin/all-tickets  // Get all (admin only)
GET    /api/tickets/chat/support       // Get/create support conversation
POST   /api/tickets/chat/message       // Send chat message
GET    /api/tickets/:id                // Get single conversation
POST   /api/tickets/:id/reply          // Add admin reply
PATCH  /api/tickets/:id/status         // Update status
DELETE /api/tickets/:id                // Delete conversation
```

## Client API Integration

### Owner Web App
**File**: `owner-web-app/src/app/lib/api.ts`

- `submitTicket(ticketData)` → POST /api/tickets
- `getSupportChat()` → GET /api/tickets/chat/support
- `sendChatMessage(message)` → POST /api/tickets/chat/message

### Owner Mobile App
**File**: `owner-mobile-app/src/lib/api.ts`

- `submitTicket(ticketData)` → POST /api/tickets
- `getSupportChat()` → GET /api/tickets/chat/support
- `sendChatMessage(message)` → POST /api/tickets/chat/message

### Admin Web App
**File**: `admin-web-app/src/app/lib/api.ts`

- `fetchAllTickets()` → GET /api/tickets/admin/all-tickets
- `addTicketReply(ticketId, message)` → POST /api/tickets/{id}/reply
- `updateTicketStatus(ticketId, status)` → PATCH /api/tickets/{id}/status

## Key Features

### Auto-Reopen Conversations
When a user sends a new message to a closed conversation, the system automatically reopens it (status → 'open'). This prevents users from feeling ignored if their issue isn't truly resolved.

### Real-Time Updates
- Web app: Polls every 5 seconds
- Mobile app: Polls every 3 seconds
- Admin portal: Updates whenever conversation is selected

### Message Differentiation
Formal ticket submissions use **[TICKET]** prefix so admins can easily identify escalated issues vs casual chat messages. The format is:
```
**[TICKET]** {subject}

{description}
```

### Priority Tracking
Each conversation has a priority level (low/medium/high) that admins can use for triage.

### Status Workflow
- **Open**: New or unresolved
- **In Progress**: Actively being worked on
- **Resolved**: Issue fixed, awaiting closure
- **Closed**: Completed

## User Experience Flow

### Typical Ticket Submission (Owner)
1. User clicks "Help Center" in Profile
2. Reads FAQs
3. Clicks "Raise a Ticket"
4. Fills subject and description
5. Clicks "Submit Ticket"
6. Ticket added to their Support Conversation
7. Message appears with [TICKET] formatting
8. User can continue chatting or wait for admin reply

### Admin Response Flow
1. Admin opens "Support Tickets" in admin portal
2. Sees all user conversations in list
3. Clicks conversation to open details
4. Sees full conversation history with all messages
5. Formal tickets appear as formatted messages
6. Can reply to any message (all go in same thread)
7. Changes status as issue progresses
8. Closes when resolved

## Testing Checklist

- ✅ User can submit tickets from Help Center
- ✅ User can send chat messages from chat widget
- ✅ Tickets and messages appear in same conversation
- ✅ Admin can see all conversations
- ✅ Admin can reply to conversations
- ✅ Admin can change status
- ✅ Closed conversations auto-reopen on new message
- ✅ Timestamps are accurate
- ✅ Admin replies show as green/Admin
- ✅ User messages show as blue/User
- ✅ Mobile and web apps both work
- ✅ Build compilation successful

## Migration Notes

This system replaced the previous separate ticket/chat systems:
- Old "Support Chat" subject → unified to "Support Conversation"
- Separate ticket subjects → unified to "Support Conversation"
- All existing data structure remains compatible

## Future Enhancements

1. **Email Notifications**: Send email to admin when new ticket/message received
2. **Priority Routing**: Route high-priority tickets to senior staff
3. **Attachment Support**: Allow users to upload screenshots/files
4. **Conversation Search**: Full-text search across conversations
5. **Canned Responses**: Pre-written responses for common issues
6. **SLA Tracking**: Track response time and resolution time
7. **Satisfaction Rating**: Ask users to rate resolution after closing
8. **Knowledge Base**: Link FAQs to ticket categories
