import os
import flask
import pymongo
from flask import Flask
from urlparse import urlparse


MONGO_URL = "mongodb://heroku:fd9d5799f253c24ccc14ff9dcbd4ef5f@linus.mongohq.com:10038/app14922990"
conn = pymongo.Connection(MONGO_URL)
# Get the database
db = conn[urlparse(MONGO_URL).path[1:]]
db.movie_collection.drop()

def import_data():
    usersFile = open('/Users/nstehr/Desktop/ml-1m/users.dat', 'r')
    moviesFile = open('/Users/nstehr/Desktop/ml-1m/movies.dat', 'r')
    for userRecord in usersFile:
        user = userRecord.split('::')
        userId = user[0]
        userSex = user[1]
        userAge = user[2]
        userJob = user[3]
        #db.user_collection.insert({"userId":userId,"userSex":userSex,"userAge":userAge,"userJob":userJob})

    genreSet = set()
    for movieRecord in moviesFile:
        movie = movieRecord.split('::')
        movieId = movie[0]
        movieTitle = movie[1].decode('ascii', 'ignore')
        genres = movie[2].split('|')
        genres = [genre.rstrip() for genre in genres]
        genreSet.update(genres)
        try:
            db.movie_collection.insert({"movieId":movieId,"movieTitle":movieTitle,"movieGenres":genres})
        except:
            print movie
    genreList = list(genreSet)
    db.genre_collection.insert({"genres":genreList})

if __name__ == '__main__':
    import_data()