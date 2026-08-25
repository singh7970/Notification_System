# 🔔 Notification System Admin

A full-stack multi-channel Notification System Admin built with **Python (Django REST Framework)** and **React (Vite)**. 

Allows administrators to manage all notification triggers and channels (**WhatsApp**, **Email**, **Web Push**) from a single, unified admin matrix screen on the website.

---

## ✨ Features

- 🎛️ **Unified Admin Control Matrix**: One table screen where Rows = Triggers, Columns = Channels (WhatsApp, Email, Web Push).
- ✏️ **Template Management**: Create, edit message text & title/subject with dynamic variable tags (`{user_name}`, `{time}`, `{order_id}`, `{amount}`).
- ⚡ **Toggle ON / OFF & Test Send**: Turn individual channel cells on or off with a switch, and test send messages directly from the admin panel.
- 🌐 **User Website Sandbox**: Built-in user simulator to test firing real website triggers (`Login`, `Logout`, `Password Reset`, `Order Placed`, `Inactive 1 Day`, `Inactive 1 Week`).
- 📜 **Notification Delivery Logs**: Real-time audit trail tracking message status (`SUCCESS`, `SANDBOX_SIMULATED`, `FAILED`) and provider responses.
- 🛡️ **Sandbox Ready**: Configured for Meta WhatsApp Cloud API (Sandbox), Postmark Email (Free Developer Server), and OneSignal Web Push.

---

## ⚡ Triggers Included

1. **Login** (`login`) — Fires when user logs into the website.
2. **Logout** (`logout`) — Fires when user logs out.
3. **Not Logged In 1 Day** (`not_logged_in_1_day`) — Inactive user re-engagement.
4. **Not Logged In 1 Week** (`not_logged_in_1_week`) — 7-day inactive discount offer.
5. **Password Reset** (`password_reset`) — Verification code alert.
6. **Order Placed** (`order_placed`) — Purchase confirmation receipt.

---

## 🚀 Quick Start Guide

### 1. Django Backend Setup

```bash
# 1. Activate virtual environment
source backend_env/bin/activate

# 2. Go to backend
cd backend

# 3. Install requirements
pip install -r requirements.txt

# 4. Migrate database & seed default triggers/templates
python manage.py migrate
python manage.py seed_data

# 5. Start development server
python manage.py runserver 0.0.0.0:8000
```
> Server runs at `http://127.0.0.1:8000/api/`

---

### 2. React Frontend Setup

```bash
# 1. Go to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```
> App runs at `http://localhost:5173/`

---

## 🔑 Environment Variables (`.env`)

Create a `.env` file in `backend/.env`:

```env
# General
SECRET_KEY=django-insecure-secret-key
DEBUG=True

# Meta WhatsApp Cloud API Sandbox
WHATSAPP_ACCESS_TOKEN=your_test_token
PHONE_NUMBER_ID=your_test_phone_number_id

# Postmark Email Developer Server
POSTMARKAPP_TOKEN=your_server_token
POSTMARK_FROM_EMAIL=your_verified_email@example.com

# OneSignal Web Push
ONESIGNAL_APP_ID=your_app_id
ONESIGNAL_REST_API_KEY=your_api_key
```

*Note: If environment tokens are omitted, the backend automatically logs delivery as `SANDBOX_SIMULATED` so testing can proceed without API keys.*

---

## ☁️ Deployment Instructions

### Deploy Backend on Render
1. Connect repository to [Render.com](https://render.com).
2. Render automatically reads `render.yaml`.
3. Set environment variables under Render Service Settings.

### Deploy Frontend on Vercel
1. Import repository on [Vercel.com](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Add Environment Variable `VITE_API_URL` pointing to your Render backend URL.

---

## 🎙️ Task D Interview Answers Summary

1. **What is a trigger?** An event condition on the website (e.g. Login, Logout, Order Placed) that causes notifications to be sent.
2. **What are the 3 channels?** WhatsApp (Meta Graph API), Email (Postmark), and Web Push (Browser pop-up).
3. **Why create templates in admin panel?** Centralized control—manage all message texts, toggles, and test sends from one screen without opening 3 vendor websites.
4. **What is Web Push?** Browser pop-up notifications delivered to users even when not actively on the site.
