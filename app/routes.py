from flask import render_template, request

from app import app
from app.stop_words import stopWords
from app.localizze import geolocalize, history
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


@app.route('/tell_history/<lat>:<lng>', methods=['GET', 'POST'])
def tell_history(lat, lng):
    return json.dumps({'history': history(lat, lng)})


@app.route('/index/')
def index():
    return render_template('index.html', title='Home')
