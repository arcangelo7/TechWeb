map.on('popupopen', function() {

        
    let constraintObj = { 
        audio: true, 
        video: false
    }; 
    
    var start = document.getElementById('registratore');
    
        
        start.addEventListener('click', (ev)=>{

            start = document.getElementById('registratore-no-autorizzazione');
            //handle older browsers that might implement getUserMedia in some way
            if (navigator.mediaDevices === undefined) {
                navigator.mediaDevices = {};
                navigator.mediaDevices.getUserMedia = function(constraintObj) {
                    let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                    if (!getUserMedia) {
                        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
                    }
                    return new Promise(function(resolve, reject) {
                        getUserMedia.call(navigator, constraintObj, resolve, reject);
                    });
                }
            }else{
                navigator.mediaDevices.enumerateDevices()
                .then(devices => {
                    devices.forEach(device=>{
                        console.log(device.kind.toUpperCase(), device.label);
                    })
                })
                .catch(err=>{
                    console.log(err.name, err.message);
                })
            }
            navigator.mediaDevices.getUserMedia(constraintObj)
            .then(function(mediaStreamObj) {
            
                //add listeners for saving video/audio
                let stop = document.getElementById('stop');
                let audSave = document.getElementById('aud2');
                let mediaRecorder = new MediaRecorder(mediaStreamObj);
                let chunks = [];

                mediaRecorder.start();
                console.log(mediaRecorder.state);
                document.getElementById("aud2").hidden=true;
                
                start.addEventListener('click', (ev)=>{
                    mediaRecorder.start();
                    console.log(mediaRecorder.state);
                    document.getElementById("aud2").hidden=true;
                });

                stop.addEventListener('click', (ev)=>{
                    mediaRecorder.stop();
                    console.log(mediaRecorder.state);
                    document.getElementById("aud2").hidden=false;
                });
                mediaRecorder.ondataavailable = function(ev) {
                    chunks.push(ev.data);
                }
                mediaRecorder.onstop = (ev)=>{
                    let blob = new Blob(chunks, { 'type' : 'audio/mp3;' });
                    chunks = [];
                    let audioURL = window.URL.createObjectURL(blob);
                    audSave.src = audioURL;
                }
        
        })
            .catch(function(err) { 
                console.log(err.name, err.message); 
            });

        });
});
