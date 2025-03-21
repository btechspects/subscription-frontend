# Subscription Billing System - Frontend (Vue 3)

This is the Vue 3 Frontend of the Subscription Billing System that connects to the Laravel backend REST API.
It provides users with: 
- Registration & Login
- Subscription Plan Management
- Invoice / Payment History Viewing & Deletion
- Token-based API communication

## Features

- User registration and login
- JWT token storage in localStorage
- Protected routes (Dashboard)
- Subscription plan listing and upgrade
- Invoice / Transaction history fetch and delete
- Confirmation modals
- Toast notifications for success & error
- Mobile-friendly responsive design

## Technologies

- Vue 3 (Composition API)
- Vue Router
- Axios (API calls)
- vue3-toastify (Notifications)
- CSS / Scoped Styles (Optional: Tailwind CSS ready)
- FontAwesome icons

## Installation

- **git clone**
- **Once the project is created, navigate to its directory using the cd command:**

```bash
git clone https://github.com/btechspects/subscription-frontend.git
cd subscription-frontend
```

- **Install dependencies**
```bash
npm install 
or
npm install --legacy-peer-deps
```

- **API Base URL Configuration. Create a .env file:**
```bash
VUE_APP_API_URL=http://127.0.0.1:8000/api
```

- **Run the Project**
```bash
npm run serve
```

- **Run the Unit test**
```bash
npm run test:unit
```
