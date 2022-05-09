from flask import Flask, request, abort, jsonify
from transcription import transcribe

app = Flask(__name__)
# app.config["DEBUG"] = True

# READ: https://flask.palletsprojects.com/en/2.0.x/api/#flask.Request
# to find out how to get incoming request data


@app.route("/", methods=["GET"])
def start():
    return "<p>Hello world</p>"

@app.errorhandler(400)
def bad_request_missing_audio_filepath(e):
  return jsonify(error=str(e)), 400

@app.route("/transcribe", methods=["GET"])
def handle_transcription():
    audio_filepath = request.args.get("audiofilepath")
    if audio_filepath is not None:
      # return transcribe(audio_filepath)
      return "{{'word': 'aword', 'start_time': 12.4, 'duration': 2}, {'word': 'anotherword', 'start_time': 15, 'duration': 1}}"
    else:
      abort(400, description="File path for audio file not included in request")

# app.run()
