import http.server
import socketserver
import json
from urllib.parse import urlparse, parse_qs
import importlib.util
import sys
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(dotenv_path='../.env')

PORT = 8080

# Import the handler from income-statements.py
spec = importlib.util.spec_from_file_location("income_statements", "income-statements.py")
income_statements = importlib.util.module_from_spec(spec)
sys.modules["income_statements"] = income_statements
spec.loader.exec_module(income_statements)

class LocalDevHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL and query parameters
        parsed_url = urlparse(self.path)
        
        # Route requests to the appropriate handler
        if parsed_url.path.startswith('/api/income-statements'):
            # Create an instance of the income statements handler
            handler_instance = income_statements.handler(self, ('', PORT), None)
            handler_instance.path = self.path
            handler_instance.do_GET()
        else:
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Not found"}).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()

if __name__ == "__main__":
    print(f"Starting server at http://localhost:{PORT}")
    print(f"API Key configured: {'FMP_API_KEY' in os.environ}")
    
    with socketserver.TCPServer(("", PORT), LocalDevHandler) as httpd:
        print("Server started. Press Ctrl+C to stop.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")
