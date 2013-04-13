import os
import flask
from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    return flask.send_from_directory('MovieFinder/WebContent/','index.html')

@app.route('/WEB-INF/lib/<path:filename>')
def libs(filename):
    return flask.send_from_directory('MovieFinder/WebContent/WEB-INF/lib',filename)


@app.route('/styles/<path:filename>')
def styles(filename):
    return flask.send_from_directory('MovieFinder/WebContent/styles',filename)

if __name__ == '__main__':
    app.run(debug=True)