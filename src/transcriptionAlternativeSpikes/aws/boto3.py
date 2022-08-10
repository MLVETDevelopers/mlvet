import time
import boto3

S3_KEY = "AKIASJ6WKFPTQLWWA7HM"
S3_SECRET_KEY = "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"

def transcribe_file(job_name, file_uri, transcribe_client):
    transcribe_client.start_transcription_job(
        TranscriptionJobName=job_name,
        Media={'MediaFileUri': file_uri},
        MediaFormat='mp3',
        LanguageCode='en-US'
    )

    max_tries = 60
    while max_tries > 0:
        max_tries -= 1
        job = transcribe_client.get_transcription_job(TranscriptionJobName=job_name)
        job_status = job['TranscriptionJob']['TranscriptionJobStatus']
        if job_status in ['COMPLETED', 'FAILED']:
            print(f"Job {job_name} is {job_status}.")
            if job_status == 'COMPLETED':
                print(
                    f"Download the transcript from\n"
                    f"\t{job['TranscriptionJob']['Transcript']['TranscriptFileUri']}.")
            break
        else:
            print(f"Waiting for {job_name}. Current status is {job_status}.")
        time.sleep(10)


def main():
    transcribe_client = boto3.client('transcribe', region_name = "us-west-1"
    ,aws_access_key_id = S3_KEY, aws_secret_access_key = S3_SECRET_KEY)
    file_uri = "s3://fit3170/Y2Mate.is - Me at the zoo-jNQXAC9IVRw-96k-1659063146700.mp3"
    transcribe_file('fucku', file_uri, transcribe_client)


if __name__ == '__main__':
    main()
