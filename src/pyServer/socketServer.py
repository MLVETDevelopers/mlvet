from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app)

@socketio.event
def connect():
  print('connect')

@socketio.event
def transcribe(data):
  print('transcribe ', data)
  return transcript(data)

@socketio.event
def disconnect():
  print('disconnect')

def transcript(data):
  return 'Transctipt of: ' + str(data)

if __name__ == '__main__':
    socketio.run(app)
