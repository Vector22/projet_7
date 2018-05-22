from app.localizze import geolocalize
import requests
import json
from io import BytesIO


def test_http_return(monkeypatch):

    response = {"results":
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

    def mockreturn(request):
        return json.dumps(response)

    monkeypatch.setattr(requests, 'get', mockreturn)

    assert geolocalize('Abidjan') == response
