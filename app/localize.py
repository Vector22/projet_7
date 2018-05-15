import json
import requests


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
    if r.status_code != 200:
        return ('Error: the geolocalisation service failed.')
    return json.loads(r.content.decode('utf-8-sig'))


def history(location):
    """function that return a history from the media
    wiki api based on the location parameter"""
    urlBase = "http://fr.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page="
    url = urlBase + location

    r = requests.get(url)
    if r.status_code != 200:
        return ('Error: the media wiki service failed.')
    return json.loads(r.content.decode('utf-8-sig'))
