import os
import flask
import pymongo
import json
from flask import Flask,request
from urlparse import urlparse

app = Flask(__name__)

MONGO_URL = os.environ.get('MONGOHQ_URL')
if MONGO_URL is None:
    MONGO_URL = "mongodb://heroku:fd9d5799f253c24ccc14ff9dcbd4ef5f@linus.mongohq.com:10038/app14922990"
 
if MONGO_URL:
    # Get a connection
    conn = pymongo.Connection(MONGO_URL)
    
    # Get the database
    db = conn[urlparse(MONGO_URL).path[1:]]


@app.route('/')
def index():
    return flask.send_from_directory('MovieFinder/WebContent/','index.html')

@app.route('/dataVisualization.html')
def dataViz():
    return flask.send_from_directory('MovieFinder/WebContent/','dataVisualization.html')

@app.route('/channel.html')
def channel():
    return flask.send_from_directory('MovieFinder/WebContent/','channel.html')

@app.route('/test')
def test():
    return flask.send_from_directory('MovieFinder/WebContent/','test.html')

@app.route('/WEB-INF/lib/<path:filename>')
def libs(filename):
    return flask.send_from_directory('MovieFinder/WebContent/WEB-INF/lib',filename)


@app.route('/styles/<path:filename>')
def styles(filename):
    return flask.send_from_directory('MovieFinder/WebContent/styles',filename)

@app.route('/js/<path:filename>')
def js(filename):
    return flask.send_from_directory('MovieFinder/WebContent/js',filename)

@app.route('/genres')
def getGenres():
    genres = db.genre_collection.find_one()
    return json.dumps({"genres":genres['genres']})

@app.route('/movies')
def getMovies():    
    movies = db.movie_collection.find()
    movies = list(movies)
    for movie in movies:
	    movie.pop('_id')
    return json.dumps({"movies":movies})


@app.route('/filter')
def filter():
    query = {}
    ratings = request.args.get('ratings')
    if(ratings is not None):
	    query['rating'] = str(ratings.split(',')[0])
    jobs = request.args.get('occupation')
    if(jobs is not None):
        query['userJob'] = str(jobs.split(',')[0])
    gender = request.args.get('gender')
    if(gender is not None):
        query['userSex'] = str(gender.split(',')[0])
    age = request.args.get('agegroup')
    if(age is not None):
        query['userAge'] = str(age.split(',')[0])
    genres = request.args.get('genres')
    results = db.ratings_collection.find(query).distinct("movieTitle")
    movies = list(results)
    print len(movies)

    return json.dumps({'movies':movies})

if __name__ == '__main__':
    app.run(debug=True)