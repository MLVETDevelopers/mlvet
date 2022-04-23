/**
 * util to simulate running of transcription
 * @param n seconds to sleep
 * @returns promise resolving after n seconds
 */
const sleep: (n: number) => Promise<void> = (n) =>
  new Promise((resolve) => setTimeout(resolve, n * 1000));

const handleTranscription: (fileName: string) => Promise<string> = async () => {
  await sleep(5);
  return 'Mock Transcription';
};

export default handleTranscription;
