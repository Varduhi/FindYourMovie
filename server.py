import os
from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    return send_from_directory('MovieFinder/WebContent/', index.html)
