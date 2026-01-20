# Hotel Admin Platform - Full-Stack Application

Full-stack hotel management application for internal staff to manage hotels, room types, and pricing adjustments.

## 🎯 Assignment Completion

**All required features have been implemented:**
- ✅ User authentication with JWT
- ✅ Hotel CRUD operations
- ✅ Room type CRUD operations  
- ✅ Rate adjustment system with history
- ✅ Effective rate calculation (base_rate + adjustment)
- ✅ Database migrations with Alembic
- ✅ Request/response validation
- ✅ Loading and error handling
- ✅ Clean folder structure
- ✅ Code readability and maintainability

---

## 🛠️ Tech Stack

### Backend
- **Framework:** FastAPI
- **ORM:** SQLAlchemy
- **Migration:** Alembic
- **Database:** SQLite (or PostgreSQL)
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Pydantic

### Frontend
- **Framework:** React 18 with Vite
- **Routing:** React Router DOM v6
- **State Management:** React Query (TanStack Query)
- **HTTP Client:** Axios with interceptors
- **Styling:** CSS styles

---

## 📁 Project Structure
```
hotel-project/
├── hotel-backend/              # Backend (FastAPI)
│   ├── alembic/               # Database migrations
│   │   ├── versions/          # Migration files
│   │   └── env.py
│   │
│   ├── app/
│   │   ├── routers/          # API endpoints
│   │   │   ├── auth.py       # Login endpoint
│   │   │   ├── hotels.py     # Hotel CRUD
│   │   │   ├── room_types.py # Room type CRUD
│   │   │   └── rate_adjustments.py
│   │   │
│   │   ├── main.py           # FastAPI app
│   │   ├── database.py       # DB connection
│   │   ├── models.py         # SQLAlchemy models
│   │   ├── schemas.py        # Pydantic schemas
│   │   └── auth.py           # JWT authentication
│   │
│   ├── .env                  # Environment variables
│   ├── requirements.txt      # Python dependencies
│   ├── alembic.ini          # Alembic config
│   ├── seed_data.py         # Initial user seeding
│   └── hotel.db             # SQLite database
│
└── hotel-frontend/            # Frontend (React + Vite)
    ├── src/
    │   ├── api/              # API layer
    │   │   ├── axios.js
    │   │   ├── authApi.js
    │   │   ├── hotelApi.js
    │   │   ├── roomTypeApi.js
    │   │   └── rateAdjustmentApi.js
    │   │
    │   ├── components/       # Reusable components
    │   │   ├── common/
    │   │   ├── hotels/
    │   │   ├── roomTypes/
    │   │   └── rateAdjustments/
    │   │
    │   ├── pages/           # Route pages
    │   ├── context/         # React Context
    │   ├── hooks/           # Custom hooks
    │   ├── utils/           # Utilities
    │   ├── App.jsx
    │   └── main.jsx
    │
    ├── .env
    ├── package.json
    └── vite.config.js
```

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js** 16+ and npm
- **Python** 3.10+
- **Git** (optional)

### Backend Setup
```bash
# Navigate to backend directory
cd hotel-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Seed initial admin user
python seed_data.py

# Start backend server
uvicorn app.main:app --reload
```

**Backend will run on:** `http://127.0.0.1:8000`  
**API Documentation:** `http://127.0.0.1:8000/docs`

### Frontend Setup
```bash
# Navigate to frontend directory (in new terminal)
cd hotel-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will run on:** `http://localhost:5173`

---

## 🔐 Default Credentials
```
Username: admin
Password: admin123
```

---

## ✨ Features Implemented

### 1. Authentication System
**Backend:**
- JWT token generation with bcrypt password hashing
- OAuth2 password flow
- Token expiration handling

**Frontend:**
- Login page with form validation
- Token storage in localStorage
- Protected routes with automatic redirect
- Axios interceptors for token injection
- Auto-logout on 401 errors

### 2. Hotel Management (CRUD)
**Backend Endpoints:**
- `GET /hotels/` - List all hotels
- `POST /hotels/` - Create hotel
- `GET /hotels/{id}` - Get hotel by ID
- `PUT /hotels/{id}` - Update hotel
- `DELETE /hotels/{id}` - Delete hotel

**Frontend Features:**
- Grid view with hotel cards
- Create hotel modal with validation
- Hotel detail page
- Edit hotel (pre-filled form)
- Delete hotel (with confirmation)

### 3. Room Type Management (CRUD)
**Backend Endpoints:**
- `GET /room-types/` - List room types (filterable by hotel_id)
- `POST /room-types/` - Create room type
- `GET /room-types/{id}` - Get room type by ID
- `PUT /room-types/{id}` - Update room type
- `DELETE /room-types/{id}` - Delete room type

**Frontend Features:**
- Room types displayed on hotel detail page
- Create room type with base rate validation
- Edit room type
- Delete room type (with confirmation)
- Base rate must be positive number

### 4. Rate Adjustment System
**Backend Endpoints:**
- `POST /rate-adjustments/` - Create rate adjustment
- `GET /rate-adjustments/room-type/{id}/history` - Get adjustment history

**Frontend Features:**
- Create adjustment with date picker
- Adjustment amount (positive or negative)
- Effective date (cannot be in past)
- Reason tracking (required field)
- View complete history in timeline
- Active vs pending status indicators
- Real-time effective rate preview

**Business Rule Implementation:**
```
effective_rate = base_rate + latest_active_adjustment

Example:
- Base Rate: $200.00
- Latest Active Adjustment: +$50.00 (effective Dec 20, 2025)
- Effective Rate: $250.00 (from Dec 20 onwards)
```

### 5. Database & Migrations
**Alembic Migrations:**
1. **Initial Migration:** Created all tables (User, Hotel, RoomType, RateAdjustment)
2. **Second Migration:** Added `status` field to hotels table

**Database Schema:**
- User (id, username, hashed_password)
- Hotel (id, name, location, description, status, created_at)
- RoomType (id, hotel_id, name, base_rate, description, created_at)
- RateAdjustment (id, room_type_id, adjustment_amount, effective_date, reason, created_at)

### 6. Validation
**Backend (Pydantic):**
- Request body validation
- Response model validation
- Type checking
- Field constraints

**Frontend:**
- Form validation before submission
- Required field checks
- Number validation (positive rates)
- Date validation (no past dates)
- String length constraints

### 7. Error Handling
**Backend:**
- HTTP exception handling
- Proper status codes
- Detailed error messages

**Frontend:**
- Loading spinners during API calls
- Error messages with retry functionality
- Form validation errors
- Network error handling
- 401 auto-logout

---

## 🔄 Data Flow

### Complete Request Flow
```
User Action (Frontend)
    ↓
React Component
    ↓
React Query Mutation
    ↓
API Function (axios)
    ↓
Axios Interceptor (add JWT token)
    ↓
FastAPI Endpoint
    ↓
Pydantic Validation
    ↓
SQLAlchemy ORM
    ↓
SQLite Database
    ↓
Response (JSON)
    ↓
Axios Interceptor (handle errors)
    ↓
React Query Cache Update
    ↓
UI Auto-Refresh
```

---

## 🧪 Testing the Application

### Step-by-Step Testing Guide

**1. Start Both Servers**
```bash
# Terminal 1 - Backend
cd hotel-backend
uvicorn app.main:app --reload

# Terminal 2 - Frontend  
cd hotel-frontend
npm run dev
```

**2. Login**
- Open `http://localhost:5173`
- Enter: `admin` / `admin123`
- Should redirect to `/hotels`

**3. Create Hotel**
- Click "Create Hotel" button
- Fill form:
  - Name: "Grand Plaza Hotel"
  - Location: "New York"
  - Description: "Luxury hotel in downtown"
- Submit → Hotel appears in list

**4. View Hotel Details**
- Click "View Details" on hotel card
- Verify hotel information displays
- Should see empty "Room Types" section

**5. Create Room Type**
- Click "Add Room Type" button
- Fill form:
  - Name: "Deluxe Suite"
  - Base Rate: 250.00
  - Description: "Spacious suite with ocean view"
- Submit → Room type appears

**6. Create Rate Adjustment**
- Click "Adjust Rate" on room type
- Fill form:
  - Adjustment: +50.00
  - Effective Date: Tomorrow's date
  - Reason: "Holiday season pricing increase"
- Watch preview: $250 + $50 = $300
- Submit → Success

**7. View Adjustment History**
- Click "View History" on room type
- Verify timeline shows adjustment
- Check "Pending" status (if future date)
- Verify effective rate calculation

**8. Edit & Delete**
- Test editing hotel, room type
- Test deleting with confirmation dialogs
- Verify data refreshes after operations

---

## 📝 Trade-offs & Design Decisions

### 1. Database Choice
**Decision:** SQLite for development
**Trade-off:**
- ✅ **Pros:** Zero configuration, file-based, perfect for assignment
- ⚠️ **Cons:** Not suitable for production, no concurrent writes
- **Alternative:** PostgreSQL (production-ready, requires setup)

### 2. Authentication Strategy
**Decision:** JWT access token only (no refresh token)
**Trade-off:**
- ✅ **Pros:** Simpler implementation, meets requirements
- ⚠️ **Cons:** User must re-login after token expires
- **Alternative:** Refresh token strategy (more complex)

### 3. Frontend State Management
**Decision:** React Query + Context API
**Trade-off:**
- ✅ **Pros:** Less boilerplate, better caching, easier to learn
- ⚠️ **Cons:** Less control than Redux
- **Alternative:** Redux Toolkit (more verbose, larger bundle)

### 4. Styling Approach
**Decision:** Inline styles
**Trade-off:**
- ✅ **Pros:** Fast development, self-contained, no build step
- ⚠️ **Cons:** Larger bundle, no pseudo-selectors, repetition
- **Alternative:** CSS Modules, Styled Components, Tailwind CSS

### 5. Validation Location
**Decision:** Both client and server
**Trade-off:**
- ✅ **Pros:** Better UX, defense in depth, reduced API calls
- ⚠️ **Cons:** Code duplication
- **Why:** Client for UX, server for security

### 6. Error Handling Strategy
**Decision:** Centralized in Axios interceptors
**Trade-off:**
- ✅ **Pros:** DRY code, consistent handling, auto-logout
- ⚠️ **Cons:** Less granular control per request
- **Alternative:** Per-component error handling

### 7. Modal vs Pages for Forms
**Decision:** Modals for Create/Edit, Pages for View
**Trade-off:**
- ✅ **Pros:** Better UX, preserves context, common pattern
- ⚠️ **Cons:** Modal complexity for large forms
- **Why:** Quick actions stay in context, complex views get space

### 8. Date Handling
**Decision:** Native HTML5 date input
**Trade-off:**
- ✅ **Pros:** No dependencies, browser-native validation
- ⚠️ **Cons:** Limited customization, browser inconsistencies
- **Alternative:** react-datepicker, date-fns

---

## 🌐 API Documentation

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | Login and get JWT token | No |

### Hotels
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/hotels/` | List all hotels | Yes |
| POST | `/hotels/` | Create hotel | Yes |
| GET | `/hotels/{id}` | Get hotel by ID | Yes |
| PUT | `/hotels/{id}` | Update hotel | Yes |
| DELETE | `/hotels/{id}` | Delete hotel | Yes |

### Room Types
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/room-types/` | List room types | Yes |
| POST | `/room-types/` | Create room type | Yes |
| GET | `/room-types/{id}` | Get room type | Yes |
| PUT | `/room-types/{id}` | Update room type | Yes |
| DELETE | `/room-types/{id}` | Delete room type | Yes |

### Rate Adjustments
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/rate-adjustments/` | Create adjustment | Yes |
| GET | `/rate-adjustments/room-type/{id}/history` | Get history | Yes |

**Interactive API Docs:** Visit `http://127.0.0.1:8000/docs` when backend is running

---

## 🐛 Known Limitations

### Backend
1. **Single User:** Only one seeded admin user
2. **No Refresh Token:** User must re-login after token expires
3. **SQLite Limitations:** Not suitable for production
4. **No Rate Limiting:** API endpoints not rate-limited
5. **Basic Error Messages:** Could be more descriptive

### Frontend
1. **No Pagination:** All items loaded at once
2. **Alert-based Notifications:** Could use toast notifications
3. **Inline Styles:** Could be migrated to CSS modules
4. **No Offline Support:** Requires active backend
5. **No Loading Skeleton:** Just spinners for loading states

### General
1. **No Unit Tests:** Would add Jest/Pytest for production
2. **No E2E Tests:** Would add Playwright/Cypress
3. **No CI/CD Pipeline:** Would add GitHub Actions
4. **No Logging:** Would add structured logging
5. **No Monitoring:** Would add error tracking (Sentry)

---

## 🔒 Security Considerations

### Implemented
✅ JWT authentication  
✅ Password hashing with bcrypt  
✅ CORS configuration  
✅ SQL injection prevention (SQLAlchemy ORM)  
✅ XSS prevention (React escapes by default)  
✅ Input validation (Pydantic + client-side)  

### Production Recommendations
- Use HTTPS in production
- Implement refresh token rotation
- Add rate limiting (e.g., slowapi)
- Use environment variables for secrets
- Implement CSRF protection
- Add request logging
- Use PostgreSQL instead of SQLite
- Implement proper user roles/permissions

---

## 🚀 Future Enhancements (Out of Scope)

### Backend
- [ ] User management (CRUD)
- [ ] Role-based access control (RBAC)
- [ ] Pagination for list endpoints
- [ ] Filtering and sorting
- [ ] Email notifications
- [ ] File upload (hotel images)
- [ ] API versioning
- [ ] Request rate limiting
- [ ] Background tasks (Celery)

### Frontend
- [ ] Toast notifications (react-hot-toast)
- [ ] Search and filter
- [ ] Bulk operations
- [ ] Data export (CSV/Excel)
- [ ] Charts and analytics
- [ ] Dark mode
- [ ] Mobile responsiveness
- [ ] Accessibility improvements (ARIA)
- [ ] Internationalization (i18n)
- [ ] PWA support

### DevOps
- [ ] Docker containers
- [ ] Docker Compose setup
- [ ] CI/CD pipeline
- [ ] Automated testing
- [ ] Code coverage
- [ ] Deployment scripts

---

## 🏗️ Build for Production

### Backend
```bash
# Install production dependencies
pip install -r requirements.txt

# Set environment variables
export SECRET_KEY="your-production-secret-key"
export DATABASE_URL="postgresql://user:pass@localhost/dbname"

# Run with gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend
```bash
# Create optimized build
npm run build

# Output in dist/ folder
# Serve with nginx or static hosting
```

---

## 📚 Dependencies

### Backend (requirements.txt)
```
fastapi==0.109.0
uvicorn==0.27.0
sqlalchemy==2.0.25
alembic==1.13.1
pydantic==2.5.3
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
bcrypt==4.1.2
python-multipart==0.0.6
python-dotenv==1.0.0
```

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@tanstack/react-query": "^5.12.0",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}
```

---

## 🔧 Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./hotel.db
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

---

## 📞 Troubleshooting

### Backend Issues

**Issue:** `ModuleNotFoundError: No module named 'app'`  
**Solution:** Make sure you're in the `hotel-backend` directory

**Issue:** `alembic upgrade head` fails  
**Solution:** Delete `hotel.db` and run migrations again

**Issue:** Port 8000 already in use  
**Solution:** `uvicorn app.main:app --reload --port 8001`

### Frontend Issues

**Issue:** `Cannot connect to backend`  
**Solution:** Ensure backend is running on port 8000

**Issue:** CORS errors  
**Solution:** Backend CORS is configured for `http://localhost:5173`

**Issue:** Token expired  
**Solution:** Login again to get a new token

---

## ✅ Assignment Checklist

### Backend Requirements
- [x] FastAPI framework
- [x] SQLAlchemy ORM
- [x] Alembic migrations (2 migrations created)
- [x] JWT authentication
- [x] Login endpoint with seeded user
- [x] Hotel CRUD endpoints
- [x] Room type CRUD endpoints
- [x] Rate adjustment endpoint with history
- [x] Request/response validation (Pydantic)
- [x] Effective rate calculation logic

### Frontend Requirements  
- [x] React with Vite
- [x] React Router DOM
- [x] Login page
- [x] Hotel list page
- [x] Hotel detail page with room types
- [x] Rate adjustment form
- [x] Request/response validation
- [x] Loading states
- [x] Error handling
- [x] Clean folder structure
- [x] Code readability

### Documentation
- [x] README with setup instructions
- [x] README with trade-offs
- [x] Code comments where needed
- [x] API documentation (FastAPI auto-generated)

---

## 📄 License

This is an assignment project for educational purposes.

---

---

## 🙏 Acknowledgments

- FastAPI documentation
- React documentation  
- TanStack Query documentation
- SQLAlchemy documentation
- Alembic documentation

---

**Note:** This project is a fully functional full-stack application demonstrating:
- RESTful API design
- JWT authentication
- Database migrations
- CRUD operations
- Complex business logic (rate adjustments)
- Modern React patterns
- State management with React Query
- Clean code architecture
