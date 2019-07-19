function audioCapture() {
    console.log("Popupopen");

    var gumStream;
    var recorder;
    var input;
    var encodingType;
    var encodeAfterRecord = true;
  
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext; //new audio context to help us record
    
    var start = document.getElementById('registratore');
    //var start = document.querySelectorAll("#registratore, #registratore-no-autorizzazione");
    start.addEventListener('click', (ev)=>{
        console.log("CLICCATO");
        var constraints = { audio: true, video:false }
  
        navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
            console.log("then");
            audioContext = new AudioContext();
            gumStream = stream;
            input = audioContext.createMediaStreamSource(stream);
            encodingType = "mp3";
            console.log("then");
            
  
            recorder = new WebAudioRecorder(input, {
                workerDir: "script/WebAudioRecorder/", // must end with slash
                encoding: encodingType,
                numChannels:2, //2 is the default, mp3 encoding supports only 2
                onEncoderLoading: function(recorder, encoding) {
                    // show "loading encoder..." display
                    console.log("Loading "+encoding+" encoder...");
                },
                onEncoderLoaded: function(recorder, encoding) {
                    // hide "loading encoder..." display
                    console.log(encoding+" encoder loaded");
                }
            });
  
            recorder.onComplete = function(recorder, blob) { 
                console.log("Encoding complete");
                var reader = new FileReader();
                reader.onload = function () {
                    b64 = reader.result.replace(/^data:.+;base64,/, '');
                    document.getElementById("audio").value = b64;
                    console.log(b64);
                };
                reader.readAsDataURL(blob);
            }
    
            recorder.setOptions({
                timeLimit:120,
                encodeAfterRecord:encodeAfterRecord,
                ogg: {quality: 0.5},
                mp3: {bitRate: 160}
            });
  
            //start the recording process
            recorder.startRecording();
  
            console.log("Recording started");
            
            let stop = document.getElementById('stop');
  
            stop.addEventListener('click', (ev)=>{
                console.log("stopRecording() called");
    
                //stop microphone access
                gumStream.getAudioTracks()[0].stop();
                //tell the recorder to finish the recording (stop recording + encode the recorded audio)
                recorder.finishRecording();
                console.log('Recording stopped');
            });
  
    
        }).catch(function(err) {
            console.log("catchato");
        });
    }); 
}