from flask import Flask
from flask_socketio import SocketIO
from transcription import transcribe

app = Flask(__name__)
socketio = SocketIO(app)


@app.route("/", methods=["GET"])
def start():
    return "<p>Hello world</p>"


@socketio.event
def connect():
    print('connect')


@socketio.on('transcribe')
def transcribeHandler(audio_file_path):
    audio_file_path = "\"%s\""%audio_file_path
    print('transcribe', audio_file_path)
    return transcribe(audio_file_path)


@socketio.event
def disconnect():
    print('disconnect')


if __name__ == '__main__':
    socketio.run(app)
