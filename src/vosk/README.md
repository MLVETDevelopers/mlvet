# Local Transcription

### VOSK

Local transcription makes use of models and libraries created by [Alpha-Cephei](https://alphacephei.com/en/) as part of [VOSK](https://alphacephei.com/vosk/).

They have created a [JS API package](https://www.npmjs.com/package/vosk) that works well on a standard node js server. However, it does not work well with Electron due to the way native modules are compiled. The most obstructive errors occured when packaging the app.

To get VOSK working in our packaged application as part of our local transcription feature, we rewrote the JS API part of the package.

We still use the C++ code (compiled as DLLs) that comes with the vosk package. However, as we cannot make use of the VOSK package directly (due to packaging issues), we extracted the compiled libraries (DLLs) from the package and host them on a public [github repository](https://github.com/MLVETDevelopers/mlvet-local-transcription-assets). These DLLs are downloaded at runtime as part of the user setting up local transcription.

These DLLs are loaded at runtime using the [koffi](https://www.npmjs.com/package/koffi) package.

### Models

The VOSK models are also downloaded at runtime as part of the user setting up local transcription. The models are downloaded directly from [the VOSK website](https://alphacephei.com/vosk/models). By default, Windows and MacOS users download the 1.8GB model and linux users download the 40MB model. It is unknown why the larger model could not be loaded on linux. It could be to do with the koffi package or it could simply have been the linux devices we were using (we had a small number of linux devices to test on).

The models that are chosen to be downloaded, can be configured by the end user. The local transcription assets config file is stored in the app user data directory (Note: The user data directory is different for the development and production [packaged] apps).

On windows, by default this path is `C:\Users\<insert-user-here>\AppData\Roaming\Electron\mlvet` for the development application and `C:\Users\<insert-user-here>\AppData\Roaming\MLVET\mlvet` for the production application.

More information on Electron user data paths can be found [here](https://www.electronjs.org/docs/latest/api/app).
