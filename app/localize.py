import json
import requests
from random import randrange


#initialisize the key of google maps geocoding api
geoApiKey = "AIzaSyCObG729BmFhcBjVOiVlWW-Ea_DAfe1NSs"


def geolocalize(address):
    """function that returns information about
    a place based on an address
    """
    #construct the url based on the address
    urlBase = "https://maps.googleapis.com/maps/api/geocode/json?"
    url = urlBase + "address=" + address + "&key=" + geoApiKey

    #do the request
    r = requests.get(url)
    #if r.status_code != 200:
    #    return ('Error: the geolocalisation service failed.')
    return json.loads(r.content.decode('utf-8-sig'))


def history(lat, lng):
    """function that return a history from the media
    wiki api based on the location parameter"""
    """urlBase = "http://fr.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page="
    url = urlBase + location

    r = requests.get(url)
    if r.status_code != 200:
        return ('Error: the media wiki service failed.')
    return json.loads(r.content.decode('utf-8-sig'))"""
    """here, we'll do two requests on the media wiki API
    one to geosearch an other to extrat some informations
    about the points returned by geosearch request"""

    radius = 2000  # the search radius around the target point in meter
    urlOne = "https://fr.wikipedia.org/w/api.php?\
    format=json&action=query&list=geosearch&gscoord=\
    {}%7C{}&gsradius={}".format(str(lat), str(lng), str(radius))

    # do the request
    r1 = requests.get(urlOne)
    if r1.status_code != 200:
        return ('Error: the media wiki geosearch API failed.')

    # extrat some locations returned
    meta = r1.json()
    knowedPoints = meta['query']['geosearch']

    # if knowedPoints is empty return empty description
    if len(knowedPoints) is 0:
        return({'title': 'Je ne crois pas bien connaitre cet endroit...',
                'description': '', 'state': 0})
    # choose a point randomly to get infos about it
    pointIndex = randrange(len(knowedPoints))
    # extract media wiki title and pageId about this point
    pageId = knowedPoints[pointIndex]['pageid']
    title = knowedPoints[pointIndex]['title']

    # do a new request to get a short description of this way
    urlTwo = "https://fr.wikipedia.org/w/api.php?format=json&\
    action=query&prop=extracts&exsentences=3&explaintext=true&\
    titles={}".format(title)
    r2 = requests.get(urlTwo)
    if r2.status_code != 200:
        return ('Error: the media wiki informations API failed.')
    # extract the description
    infos = r2.json()
    description = infos['query']['pages'][str(pageId)]['extract']
    # return the result on a dict format
    return ({'title': title, 'description': description,
            'state': 1})
