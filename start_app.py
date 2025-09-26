#!/usr/bin/env python
"""
ClassCue Application Startup Script
This script helps you start both the Django backend and React frontend
"""

import subprocess
import sys
import os
import time
import threading
from pathlib import Path

def run_command(command, cwd=None, shell=True):
    """Run a command in a subprocess"""
    try:
        process = subprocess.Popen(
            command,
            cwd=cwd,
            shell=shell,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        return process
    except Exception as e:
        print(f"Error running command '{command}': {e}")
        return None

def start_backend():
    """Start the Django backend server"""
    print("Starting Django backend server...")
    backend_dir = Path(__file__).parent / "backend"
    
    # Check if virtual environment exists
    venv_python = backend_dir / "venv" / "Scripts" / "python.exe"
    if venv_python.exists():
        python_cmd = str(venv_python)
    else:
        python_cmd = "python"
    
    # Start Django server
    process = run_command(f"{python_cmd} manage.py runserver", cwd=backend_dir)
    
    if process:
        print("Django backend started at http://localhost:8000")
        return process
    else:
        print("Failed to start Django backend")
        return None

def start_frontend():
    """Start the React frontend server"""
    print("Starting React frontend server...")
    frontend_dir = Path(__file__).parent / "frontend"
    
    # Check if node_modules exists
    if not (frontend_dir / "node_modules").exists():
        print("Installing frontend dependencies...")
        install_process = run_command("npm install", cwd=frontend_dir)
        if install_process:
            install_process.wait()
            print("Frontend dependencies installed")
    
    # Start React development server
    process = run_command("npm run dev", cwd=frontend_dir)
    
    if process:
        print("React frontend started at http://localhost:5173")
        return process
    else:
        print("Failed to start React frontend")
        return None

def main():
    """Main function to start the application"""
    print("=" * 50)
    print("ClassCue Application Startup")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not (Path(__file__).parent / "backend").exists():
        print("Error: Please run this script from the ClassCue root directory")
        sys.exit(1)
    
    # Start backend
    backend_process = start_backend()
    if not backend_process:
        print("Failed to start backend. Exiting.")
        sys.exit(1)
    
    # Wait a moment for backend to start
    time.sleep(3)
    
    # Start frontend
    frontend_process = start_frontend()
    if not frontend_process:
        print("Failed to start frontend. Exiting.")
        backend_process.terminate()
        sys.exit(1)
    
    print("\n" + "=" * 50)
    print("Application started successfully!")
    print("Backend: http://localhost:8000")
    print("Frontend: http://localhost:5173")
    print("=" * 50)
    print("\nPress Ctrl+C to stop both servers")
    
    try:
        # Wait for both processes
        while True:
            time.sleep(1)
            if backend_process.poll() is not None:
                print("Backend process stopped")
                break
            if frontend_process.poll() is not None:
                print("Frontend process stopped")
                break
    except KeyboardInterrupt:
        print("\nShutting down servers...")
        backend_process.terminate()
        frontend_process.terminate()
        print("Servers stopped")

if __name__ == "__main__":
    main()
