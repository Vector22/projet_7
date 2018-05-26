import requests
import responses
import json
import unittest
from app import app


class TestGeolocalize:
    """A mock class to simulate the geolocalize method
    return's data"""

    @responses.activate
    def test_geolocalize(self):
        urlTest = 'https://maps.googleapis.com/maps/api/geocode/json?'
        urlTest += 'address=Abidjan&key=AIzaSyCObG729BmFhcBjVOiVlWW-Ea_DAfe1NSs'

        responses.add(responses.GET, urlTest,
                      json={"results":
                            [
                                {"geometry":
                                    {"location":
                                        {"lat": 5.3599517,
                                         "lng": -4.0082563
                                        }
                                    },
                                 "formatted_address": 'Abidjan, Côte d\'Ivoire'

                                }
                            ]
                        }
                      , status=200)
        resp = requests.get(urlTest)

        content = json.loads(resp.content.decode('utf-8-sig'))

        assert content['results'][0]['formatted_address'] == 'Abidjan, Côte d\'Ivoire'
        assert content['results'][0]['geometry']['location']['lat'] == 5.3599517


class TestHistory:
    """A mock class to simulate the tell_history method
    return's data"""

    @responses.activate
    def test_history(self):
        urlTest = 'https://fr.wikipedia.org/w/api.php?format=json&action=query&'
        urlTest += 'list=geosearch&gscoord=48.87610678029149%7C2.351913680291502&gsradius=40'

        responses.add(responses.GET, urlTest,
                      json={"title": 'Cité d\'Hauteville',
                            "pageid": 5424968},
                      status=200)
        resp = requests.get(urlTest)
        content = json.loads(resp.content.decode('utf-8-sig'))

        assert content['title'] == 'Cité d\'Hauteville'
        assert content['pageid'] == 5424968


class TestRoutes(unittest.TestCase):
    """Class to test the routes.py's methods"""

    def setUp(self):
        self.app = app.test_client()

    def test_index_page_works(self):
        rv = self.app.get('/')
        self.assertTrue(rv.data)
        self.assertEqual(rv.status_code, 200)

    def test_localize_page_works(self):
        rv = self.app.post('/localize',
                           data=dict(address='Abidjan'))
        self.assertTrue(rv.data)
        self.assertEqual(rv.status_code, 301)  # 301 redirection

    def test_tell_history_page_works(self):
        rv = self.app.get("tell_history/48.87610:2.35191")
        self.assertTrue(rv.data)
        self.assertEqual(rv.status_code, 200)

    def test_404_page(self):
        rv = self.app.get('/i-am-not-found/')
        self.assertEqual(rv.status_code, 404)  # the page is not found
