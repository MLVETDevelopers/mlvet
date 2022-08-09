//
//  main.swift
//  SpeechRecognizer
//
//  Created by Justin on 28/7/2022.
//

import Foundation
import Speech

print("Hello, World!")

SFSpeechRecognizer.requestAuthorization { (status) in
    switch status {
    case .notDetermined: print("Not determined")
  case .restricted: print("Restricted")
  case .denied: print("Denied")
  case .authorized: print("We can recognize speech now.")
  @unknown default: print("Unknown case")
  }
}
if let speechRecognizer = SFSpeechRecognizer() {
  if speechRecognizer.isAvailable {
      print("Recognizer")
    // Use the speech recognizer
      let fileUrl = URL(fileURLWithPath: "/Users/justin/Library/Mobile Documents/com~apple~CloudDocs/Test Files/sandwich_video.mov")
      let request = SFSpeechURLRecognitionRequest(url: fileUrl)
      speechRecognizer.supportsOnDeviceRecognition = true
      speechRecognizer.recognitionTask(
        with: request,
        resultHandler: { (result, error) in
          if let error = error {
              print("error")
          } else if let result = result {
            print(result.bestTranscription.formattedString)
          }
      })
      sleep(20)
  }
}



