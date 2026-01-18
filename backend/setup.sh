#!/bin/bash

echo "Setting up VectorShift Backend..."
echo "================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "Setup complete!"
echo ""
echo "To start the backend server:"
echo "1. Activate virtual environment: source venv/bin/activate"
echo "2. Run: uvicorn main:app --reload"
echo "3. Open browser to: http://localhost:8000"
echo "4. API docs available at: http://localhost:8000/docs"