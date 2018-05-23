from flask import render_template, request

from app import app
from app.stop_words import stopWords
from app.localizze import Geolocalize, History
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
    return json.dumps({'info': Geolocalize(address).geolocalize()})


@app.route('/tell_history/<lat>:<lng>', methods=['GET', 'POST'])
def tell_history(lat, lng):
    return json.dumps({'history': History(lat, lng).history()})


@app.route('/')
@app.route('/index/')
def index():
    return render_template('index.html', title='Home')
