from flask import Flask
from db import Database

app = Flask(__name__)

# Initialize the database connection
db = Database()

@app.route('/')
def hello_world():
    # Example of using the Database class to insert data
    db.insert_one('users', {'name': 'John Doe', 'email': 'john.doe@example.com'})
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)
