import time
def transcribe_file(speech_file, long=False):
    """Transcribe the given audio file."""
    from google.cloud import speech
    import io

    client = speech.SpeechClient()
    
    if not long:
        with io.open(speech_file, "rb") as audio_file:
            content = audio_file.read()
        audio = speech.RecognitionAudio(content=content)
    else:
        # Upload to Google Cloud Storage Here
        audio = speech.RecognitionAudio(uri=speech_file)
    
    config = speech.RecognitionConfig(
        language_code="en-US",
        audio_channel_count=2,
        # enable_separate_recognition_per_channel = True,
        enable_word_confidence=True,
        enable_word_time_offsets=True,
        model = "video"
    )

    start = time.time()
    if not long:
        response = client.recognize(config=config, audio=audio)
    else:
        operation = client.long_running_recognize(config=config, audio=audio)
        response = operation.result(timeout=90)
    time_taken = time.time() - start
    print(response)


    # Each result is for a consecutive portion of the audio. Iterate through
    # them to get the transcripts for the entire audio file.
    with open("transcription.txt", "w") as output_file:
        output_file.write(str(response))
        for result in response.results:
            # The first alternative is the most likely one for this portion.
            print(u"Transcript: {}".format(result.alternatives[0].transcript))
            output_file.write(str(result))
    
    print(f"Time Transcribing: {time_taken}")

transcribe_file("gs://mlvet/hardBoiledEggs.wav", True)