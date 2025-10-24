# Frontdesk Engineering Test: Human-in-the-Loop AI Supervisor

A production-ready system for managing AI agent escalations with intelligent knowledge base learning.

## Overview

This system enables AI receptionists to intelligently escalate unknown questions to human supervisors, automatically follow up with customers, and continuously improve their knowledge base. Built with React, TypeScript, Supabase, and Tailwind CSS.

## Key Features

### 1. AI Agent Simulator
- Simulates incoming customer calls to a salon business
- Answers basic questions about hours, services, location
- Searches knowledge base for previously learned answers
- Escalates unknown questions to supervisors
- Provides realistic conversation flow

### 2. Supervisor Dashboard
- View pending escalation requests in real-time
- Respond to customer questions through simple UI
- Automatic callback simulation when supervisor responds
- Request lifecycle management (pending → resolved/unresolved)
- Timeout handling (24-hour default expiration)
- Historical view of all requests

### 3. Knowledge Base Management
- Automatically learns from supervisor responses
- Searchable repository of Q&A pairs
- Edit and delete capabilities for knowledge maintenance
- Links back to source requests for audit trail
- Used by AI agent for instant future responses

## Architecture Decisions

### Database Schema

**help_requests table:**
- Tracks complete request lifecycle with clear state transitions
- Includes expiration timestamp for automatic timeout handling
- Stores caller contact info for callback simulation
- Links to supervisor responses with timestamps

**knowledge_base table:**
- Normalized question storage for efficient searching
- References source requests for traceability
- Tracks update timestamps for maintenance
- Designed for rapid lookup during agent interactions

### Scalability Considerations

**Current (10-1000 requests/day):**
- Supabase handles this volume easily with built-in connection pooling
- Indexed queries on status and expiration for fast filtering
- Real-time polling every 10 seconds for UI updates

**Future scaling (1000+ requests/day):**
- Add Supabase real-time subscriptions to replace polling
- Implement request queuing with priority levels
- Add supervisor assignment and load balancing
- Cache frequently accessed knowledge base entries
- Implement full-text search on questions
- Add analytics and supervisor performance metrics

### Error Handling

- All database operations wrapped in try-catch with console logging
- Graceful degradation when services unavailable
- User-facing error messages for failed operations
- Automatic retry logic can be added for transient failures

### Request Lifecycle Management

```
pending → (supervisor responds) → resolved
       ↓
       (timeout expires) → unresolved
```

- Automatic timeout check every 10 seconds
- 24-hour default expiration (configurable)
- Clean state transitions prevent orphaned requests
- Audit trail maintained for all state changes

### Code Organization

- **Services layer:** Business logic separated from UI
- **Type safety:** Full TypeScript coverage
- **Component modularity:** Each view is self-contained
- **Shared utilities:** Supabase client and types centralized

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Supabase account (already configured)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment variables are already configured in `.env`

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to the provided localhost URL

## Usage Flow

### Testing the Complete System

1. **Start as AI Agent:**
   - Enter caller name and phone number
   - Click "Start Call"
   - Ask questions about the salon

2. **Test Known Answers:**
   - Ask about hours, location, or services
   - Agent responds immediately with business info

3. **Trigger Escalation:**
   - Ask something unknown (e.g., "Do you have parking?")
   - Agent escalates to supervisor
   - Check browser console for escalation logs

4. **Respond as Supervisor:**
   - Switch to "Supervisor" tab
   - View pending requests
   - Click "Respond" on the escalated question
   - Type your answer and submit
   - Check console for callback simulation

5. **Verify Knowledge Base:**
   - Switch to "Knowledge Base" tab
   - See the newly learned Q&A pair
   - Edit or delete entries as needed

6. **Test Learning:**
   - Return to "AI Agent" tab
   - Start a new call
   - Ask the same question again
   - Agent now answers immediately from knowledge base

## Console Logging

The system provides detailed console logs for all key events:

- `[ESCALATION]` - When requests are created
- `[SUPERVISOR NOTIFICATION]` - Simulated supervisor text
- `[CALLBACK]` - Simulated customer callback
- `[KNOWLEDGE BASE]` - When new answers are learned
- `[TIMEOUT]` - When requests expire

## Design Decisions Explained

### Why Supabase?
- Built-in Postgres with RLS for security
- Real-time capabilities for future enhancement
- Easy migrations and schema management
- Generous free tier for development

### Why Simple Text Matching?
- Fast and reliable for initial implementation
- No external dependencies or API costs
- Can be upgraded to fuzzy matching or vector search later
- Demonstrates core concept effectively

### Why Polling Instead of WebSockets?
- Simpler implementation for MVP
- Adequate for expected request volume
- Easy to upgrade to Supabase real-time subscriptions
- Reduces complexity during evaluation

### Why No Authentication?
- Focuses on core escalation flow
- Authentication would add implementation time
- Easy to add Supabase Auth later
- RLS policies already structured for future auth

## Future Enhancements (Phase 2)

### Live Call Transfer
- WebRTC integration for real-time audio
- Supervisor availability detection
- On-hold state management
- Fallback to text-based flow

### Additional Features
- Multi-language support
- Sentiment analysis for prioritization
- Supervisor workload balancing
- Advanced knowledge base search (vector embeddings)
- Analytics dashboard
- Mobile app for supervisors
- Email notifications
- SMS integration with Twilio

## Technical Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Icons:** Lucide React
- **State Management:** React hooks

## Time Investment

Approximately 12 hours:
- Database schema design: 1 hour
- Service layer implementation: 2 hours
- UI components: 5 hours
- Testing and refinement: 3 hours
- Documentation: 1 hour

## Key Learnings

1. **Lifecycle management is critical** - Clear state transitions prevent edge cases
2. **Timeout handling must be automatic** - Manual resolution doesn't scale
3. **Knowledge base updates must be atomic** - Link responses to learning immediately
4. **Console logging is essential** - Simulates real integrations effectively
5. **Simple UI is sufficient** - Focus on functionality over polish for internal tools

## Production Readiness Checklist

- [x] Database schema with proper indexes
- [x] RLS policies for security
- [x] Error handling and logging
- [x] Request lifecycle management
- [x] Automatic timeout handling
- [x] Knowledge base integration
- [x] Clean component architecture
- [x] TypeScript type safety
- [ ] Rate limiting (add for production)
- [ ] Monitoring and alerting (add for production)
- [ ] Automated tests (add for production)
- [ ] Real-time subscriptions (upgrade from polling)
- [ ] Authentication (add Supabase Auth)

## Contact

For questions about implementation decisions or architecture, please review the video demo or reach out for clarification.
