# Trackit - Server Tip & Income Tracker
**CSC 372 - Web Development**
**Final Project - Fall 2024**

---

Video link: https://uncg-my.sharepoint.com/:v:/g/personal/a_cheguesan_uncg_edu/IQCmd4JonptwR57XdXU8XY9GAfFXXVdi65mfhCpLTnNnKQQ?e=worgj6&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D

---

## Deployed App
URL: 

---

## Setup Instructions

- Node.js, PostgreSQL database, Git

### 1. Clone the Repo
```bash
git clone https://github.com/alexachegue/track-it.git
cd track-it
```

### 2. Backend Setup

```bash
npm install
touch .env
```

*In the .env file*
```env
PORT=3000
DATABASE_URL=''
JWT_SECRET=''
```

```bash
npm start
```

### 3. Frontend Setup
```bash
cd track-it-frontend
npm install
npm run dev
```

---

## Project Overview
TrackIt is a web application designed to help restaurant servers track their tips, analyze earnings, and estimate tax obligations. The app provides analytics, data visualization, and financial planning tools specifically for tipped workers. 

### Target Users
- Restuarant servers
- Bartenders
- Tip income people

## Core Features
- Shift logging with tips and hourly wages
- Real-time earnings calculations
- Edit or delete logged shifts
- Interactive charts and data visualization (Recharts)
- Best/worst shift tracking
- Peer comparison with percentile rankings
- JWT-based authentication

---

## Reflection

---

## Design Choices

### Frontend Framework
- **Framework:** React 18
- **Styling:** Custom CSS
- **Icons:** Bootstrap Icons
- **Charts:** Recharts
- **Routing:** React Router DOM
- **Font:** DM Sans (Google Fonts)

### Backend Structure
- **Runtime:** Node.js
- **Framework:** Express.js
- **Authenications:** JST (JSON Web Tokens)
- **Password Security:** bcrypt

### Database Schema
- **Database:** PostgreSQL (Neon DB)
- **Schema:**
    - users table (id, username, email, password_hash, created_at)
    - shifts table (id, user_id, date, hours_worked, cash_tips, credit_tips,  hourly_wage, created_at)

### External APIs/ Libraries
- **Recharts** 
- **Google Fonts API:** DM Sans

---

## Challenges: Technical or conceptual hurdles you faced and how you solved them

### 1. JWT Authentication
Implementing secure authentication with JWT tokens was the first challenge. The solution was to create custom middleware to verify tokens and the bearer token header was added all protected requests.

### 2. Complex SQL Aggregations
Calculating percentile rankings and statistics required complex SQL queries. Was able to implement COALESCE() to handle null values and used TO_CHAR() for date formatting by period.

### 3. CORS Issues
Frontend couldn't communicate with backend due to CORS policy, so cors was installed and configured. Set proper headers for cross-origin requests.

---

## Learning Outcomes: What you learned about full-stack development and deployment

- Learned RESTful principles and proper HTTP status codes.
- Implemented React hooks for managing application state.
- Learned middleware, routing, and req/res cycle with Express.js
- Security with password hashing and input validation

---

## Future Work: Features you would add or refine with more time

1. Goal Tracking: Set monthly/yearly earnings goals, visual progress bar, and achievement notifications

2. Location Heatmap: Track which restaurant location earns more and compare locations.

3. Advanced Analytics: Machine learning predictions for earnings and identifying patterns.