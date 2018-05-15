from flask import render_template, jsonify, request

from app import app
from app.stop_words import stopWords
from app.localize import geolocalize, history
import json


@app.route('/localize', methods=['POST'])
def localize():

    address = ""
    question = request.form['text'].split(" ")
    pertinentWord = []
    for word in question:
        if word in stopWords:
            pass
        else:
            pertinentWord.append(word)
    address += " ".join(pertinentWord)
    return json.dumps({'info': geolocalize(address)})


@app.route('/tell_history/<location>', methods=['GET', 'POST'])
def tell_history(location):
    return json.dumps({'history': history(str(location))})


@app.route('/index/')
def index():
    user = {'name': 'vector22'}
    return render_template('index.html', title='Home', user=user)


"""@app.after_request
def add_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')
    return response"""
