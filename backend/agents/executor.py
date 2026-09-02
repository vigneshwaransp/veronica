import os
import subprocess
import webbrowser
from typing import Dict, Any

def execute_action(action_type: str, params: Dict[str, Any]) -> Dict[str, Any]:
    """
    Execute a local Windows operating system task.
    Supports opening websites, launching desktop programs, and running console commands.
    """
    try:
        if action_type == "open_url":
            url = params.get("url")
            if not url:
                return {"status": "failed", "error": "Missing parameter 'url'"}
            
            # Open URL using default system web browser
            webbrowser.open(url)
            return {"status": "success", "message": f"Successfully opened web link: {url}"}
            
        elif action_type == "launch_app":
            app_path = params.get("app_path")
            if not app_path:
                return {"status": "failed", "error": "Missing parameter 'app_path'"}
            
            # Spawn application using Popen (runs in background and doesn't block FastAPI)
            subprocess.Popen(app_path, shell=True)
            return {"status": "success", "message": f"Successfully launched desktop process: {app_path}"}
            
        elif action_type == "run_command":
            command = params.get("command")
            if not command:
                return {"status": "failed", "error": "Missing parameter 'command'"}
            
            # Run terminal command capturing standard output buffers
            result = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=30.0)
            
            if result.returncode == 0:
                return {
                    "status": "success", 
                    "stdout": result.stdout.strip(), 
                    "stderr": result.stderr.strip()
                }
            else:
                return {
                    "status": "failed", 
                    "error": f"Command returned exit code {result.returncode}",
                    "stdout": result.stdout.strip(),
                    "stderr": result.stderr.strip()
                }
        else:
            return {"status": "failed", "error": f"Unsupported action type: {action_type}"}
            
    except Exception as e:
        return {"status": "failed", "error": f"Executor exception: {str(e)}"}
