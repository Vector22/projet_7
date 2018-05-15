from flask import Flask
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

# to avoid recursive include off the variable app
from app import routes
