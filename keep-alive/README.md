# Spotter Keep-Alive Service

This service keeps the Spotter backend warm by making periodic API calls every 30 minutes.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the keep-alive service
npm start
```

## 📋 What it does

- Pings the backend every 30 minutes
- Tests multiple endpoints: `/health/`, `/api/`, `/admin/`
- Provides console output showing response status
- Keeps the backend responsive for testing

## ⚙️ Configuration

The service targets: `https://eld-connect.onrender.com`

## 🛑 Stopping the Service

Press `Ctrl+C` to stop the service gracefully.

## 📊 Monitoring

The service will show:

- ✅ Successful responses
- ⚠️ 4xx status codes (expected for some endpoints)
- ❌ Connection errors

## 🎯 Purpose

This ensures the backend responds quickly when the assignment is being tested, preventing cold start delays.
