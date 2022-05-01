# See README.md Installation instructions if you encounter an import error trying to run deepspeech
import subprocess as sp


def transcribe(audio_filepath):
    sp.getoutput("deepspeech " \
              "--model deepspeech-0.9.3-models.pbmm " \
              "--scorer deepspeech-0.9.3-models.scorer " \
              "--audio " + audio_filepath + " " \
              "--candidate_transcripts 1 " \
              "--json " \
              "> output.txt")

    with open("output.txt", "r") as text_file:
        output = text_file.read()

    return output


print(transcribe("audio/2830-3980-0043.wav"))
