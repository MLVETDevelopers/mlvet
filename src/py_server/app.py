from flask import Flask
from background_removal import remove_background
from transcription import transcribe

app = Flask(__name__)

# READ: https://flask.palletsprojects.com/en/2.0.x/api/#flask.Request
# to find out how to get incoming request data


@app.route("/", methods=["GET"])
def start():
    return "<p>Hello world</p>"


@app.route("/remove_bg", methods=["POST"])
def handle_background():
    remove_background()
    return ""


@app.route("/transcribe", methods=["POST"])
def handle_transcription():
    transcribe()
    return ""
