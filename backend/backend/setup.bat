@echo off
REM This script sets up the environment for the Django project

REM Activate the virtual environment (change the path if necessary)
call venv\Scripts\activate

REM Set the environment variable for Django settings module
set DJANGO_SETTINGS_MODULE=backend.settings

REM Install the required dependencies (if not already installed)
pip install -r requirements.txt

REM Run the Django command-line utility
python manage.py runserver

REM Deactivate the virtual environment when done
deactivate
