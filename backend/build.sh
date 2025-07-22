#!/bin/bash
# Build script for Railway deployment

echo "Starting build process..."

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

echo "Build completed successfully!" 