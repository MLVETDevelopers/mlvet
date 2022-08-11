import Foundation
import Speech
import AppKit
//Referenced from https://github.com/dtinth/transcribe
let app = NSApplication.shared

class AppDelegate: NSObject, NSApplicationDelegate {
    private let audioEngine = AVAudioEngine()
    private let speechRecognizer = SFSpeechRecognizer(locale: Locale(identifier: "en-US"))
    private var recognitionRequest: SFSpeechAudioBufferRecognitionRequest?
    private var recognitionTask: SFSpeechRecognitionTask?

    func applicationDidFinishLaunching(_ notification: Notification) {
        let inputNode = audioEngine.inputNode
        let recordingFormat = inputNode.outputFormat(forBus: 0)
        inputNode.installTap(onBus: 0, bufferSize: 1024, format: recordingFormat) { (buffer: AVAudioPCMBuffer, when: AVAudioTime) in
            self.recognitionRequest?.append(buffer)
        }
        SFSpeechRecognizer.requestAuthorization({ (authStatus: SFSpeechRecognizerAuthorizationStatus) in
            self.recognitionRequest = SFSpeechAudioBufferRecognitionRequest()
            guard let speechRecognizer = self.speechRecognizer else { fatalError("Unable to create a SpeechRecognizer object") }
            guard let recognitionRequest = self.recognitionRequest else { fatalError("Unable to create a SFSpeechAudioBufferRecognitionRequest object") }
            recognitionRequest.shouldReportPartialResults = true
            let fileUrl = URL(fileURLWithPath: "/Users/justin/Desktop/hardBoiledEggs.mp4")
            let start = DispatchTime.now()
            let request = SFSpeechURLRecognitionRequest(url: fileUrl)
            speechRecognizer.recognitionTask(
              with: request,
              resultHandler: { (result, error) in
                if let error = error {
                    print("error: ")
                    print(error)
                } else if let result = result {
                    if result.isFinal {
                        print("\n Final Result: \n")
                        print(result.bestTranscription.formattedString)
                        let end = DispatchTime.now()
                        print("Time Taken: \(Float(end.uptimeNanoseconds - start.uptimeNanoseconds) / 1000000000)")
                        exit(0)
                    }
                  print(result.bestTranscription.formattedString)
                    
                }
            }
        )
        })
    }
}

let delegate = AppDelegate()
app.delegate = delegate
app.run()

