# Blood Donation App

A web application built using Django as the backend and React (with Tailwind CSS) as the frontend for finding blood donors easily and efficiently.

## Features

- User registration and authentication
- Donor and recipient management
- Blood request and donation tracking
- Responsive UI with Tailwind CSS

## Tech Stack

- **Backend:** Django
- **Frontend:** React, Tailwind CSS

## Getting Started

### Prerequisites

- Python 3.x
- Node.js
- npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hafilpk/blood_donation_app.git
   cd blood_donation
   ```

2. **Backend Setup (Django):**
   ```bash
   cd blood_dntn
   python3 -m venv venv
   source .venv/bin/activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

3. **Frontend Setup (React + Tailwind CSS):**
   ```bash
   cd ../blood_frontend
   npm install
   npm start
   ```


