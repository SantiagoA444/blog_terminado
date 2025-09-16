# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Flask microblog application built as an educational project. It's a complete social media platform featuring user authentication, posts, followers, and email functionality. The application uses SQLAlchemy for database operations with SQLite as the default database.

## Development Commands

### Environment Setup
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Running the Application
```bash
# Option 1: Using Flask CLI (recommended)
flask run

# Option 2: Direct execution
python microblog.py

# Option 3: Development mode with auto-reload
set FLASK_ENV=development
flask run
```

### Database Operations
```bash
# Initialize migrations (first time setup)
flask db init

# Create a new migration
flask db migrate -m "Description of changes"

# Apply migrations to database
flask db upgrade

# Access Flask shell with pre-loaded models
flask shell
```

### Testing
```bash
# Run all tests
python tests.py

# Run with verbose output
python -m unittest tests.py -v

# Run specific test class
python -m unittest tests.UserModelCase -v

# Run single test method
python -m unittest tests.UserModelCase.test_password_hashing -v
```

### Debugging and Exploration
```bash
# View all available routes
flask routes

# Access interactive shell with app context
flask shell
```

## Architecture Overview

### Application Structure
- **app/__init__.py**: Flask app factory with extensions initialization (SQLAlchemy, Flask-Login, Flask-Mail, Flask-Bootstrap)
- **app/models.py**: SQLAlchemy models (User, Post) with relationships and business logic
- **app/routes.py**: All application routes with authentication and pagination
- **app/forms.py**: WTForms classes for form handling and validation
- **app/email.py**: Email sending functionality for password resets
- **config.py**: Configuration class with environment variable support
- **microblog.py**: Application entry point with shell context

### Key Models and Relationships
- **User Model**: Handles authentication, password hashing, followers/following relationships, and email functionality
- **Post Model**: Blog posts with timestamps, linked to users via foreign key
- **Followers**: Many-to-many relationship implemented via association table

### Authentication Flow
The app uses Flask-Login for session management:
- Login/logout functionality in routes.py
- User loader callback in models.py
- Password reset via JWT tokens and email

### Database Patterns
- Uses SQLAlchemy 2.0+ syntax with modern mapped_column and relationship patterns
- Implements pagination for posts using Flask-SQLAlchemy's paginate method
- Complex queries for following posts using joins and subqueries

### Template System
- Base template with Bootstrap integration
- Jinja2 templates for all pages in app/templates/
- Form rendering with WTForms-Flask integration
- Flash messaging system for user feedback

## Environment Configuration

The application reads from these environment variables:
- `FLASK_APP=microblog.py` (set in .flaskenv)
- `FLASK_DEBUG=1` (set in .flaskenv)
- `SECRET_KEY`: Application secret (falls back to hardcoded value)
- `DATABASE_URL`: Database connection string (defaults to SQLite)
- Email configuration: `MAIL_SERVER`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_USE_TLS`

## Key Features Implementation

### User System
- Registration with username/email uniqueness validation
- Password hashing using Werkzeug
- Profile editing with about_me field
- Gravatar integration for avatars
- Last seen tracking

### Social Features
- Follow/unfollow functionality
- Timeline showing followed users' posts
- Explore page with all posts
- User profiles with post history

### Content Management
- 140-character post limit (like early Twitter)
- Pagination for large datasets (25 posts per page)
- Chronological ordering of posts

### Email Integration
- Password reset functionality via email
- SMTP configuration support
- Error notification emails for admins in production