from src.pyServer.transcription import *
import unittest
import json
import os


class TestTranscription(unittest.TestCase):
    def test_transcribe(self):
        os.chdir('..')
        actual = json.loads(transcribe("audio/2830-3980-0043.wav"))
        expected = {
            "transcripts": [
                {
                    "confidence": -16.056907653808594,
                    "words": [
                        {
                          "word": "experience",
                          "start_time": 0.68,
                          "duration": 0.44
                        },
                        {
                          "word": "proves",
                          "start_time": 1.22,
                          "duration": 0.22
                        },
                        {
                          "word": "this",
                          "start_time": 1.5,
                          "duration": 0.14
                        }
                    ]
                }
            ]
        }

        self.assertEquals(actual, expected)
