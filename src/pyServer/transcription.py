# See README.md Installation instructions if you encounter an import error trying to run deepspeech
import subprocess as sp
import os


def transcribe(audio_filepath):
    output_filename = "transcription_output.txt"
    sp.getoutput("deepspeech " \
              "--model deepspeech-0.9.3-models.pbmm " \
              "--scorer deepspeech-0.9.3-models.scorer " \
              "--audio " + audio_filepath + " " \
              "--candidate_transcripts 1 " \
              "--json " \
              "> " + output_filename)

    with open(output_filename, "r") as text_file:
        transcription_output = text_file.read()

    os.remove(output_filename)

    return transcription_output
