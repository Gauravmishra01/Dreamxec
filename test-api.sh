#!/bin/bash

# Test Backend API Connection
# Run this script to verify your backend is running and accessible

API_URL="${VITE_API_URL:-http://localhost:5000/api}"

echo "🔍 Testing backend API connection..."
echo "API URL: $API_URL"
echo ""

# Test 1: Public user projects endpoint
echo "1️⃣ Testing public user projects (campaigns)..."
response=$(curl -s -w "\n%{http_code}" "$API_URL/user-projects/public")
status_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)

if [ "$status_code" -eq 200 ]; then
  echo "✅ Success! Got campaigns data"
  echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
else
  echo "❌ Failed with status code: $status_code"
  echo "$body"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 2: Public donor projects endpoint
echo "2️⃣ Testing public donor projects..."
response=$(curl -s -w "\n%{http_code}" "$API_URL/donor-projects/public")
status_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)

if [ "$status_code" -eq 200 ]; then
  echo "✅ Success! Got donor projects data"
  echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
else
  echo "❌ Failed with status code: $status_code"
  echo "$body"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 3: Health check (if your backend has one)
echo "3️⃣ Testing backend health..."
response=$(curl -s -w "\n%{http_code}" "${API_URL%/api}/health" 2>/dev/null || echo "not_found\n404")
status_code=$(echo "$response" | tail -n 1)

if [ "$status_code" -eq 200 ] || [ "$status_code" -eq 404 ]; then
  if [ "$status_code" -eq 200 ]; then
    echo "✅ Backend is healthy"
  else
    echo "⚠️  Health endpoint not found (this is okay)"
  fi
else
  echo "❌ Backend might not be running"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "✨ API connection test complete!"
echo ""
echo "📝 Notes:"
echo "   - If all tests passed, your backend is running correctly"
echo "   - If tests failed, make sure your backend is running on $API_URL"
echo "   - Update VITE_API_URL in .env if using a different URL"
echo ""
