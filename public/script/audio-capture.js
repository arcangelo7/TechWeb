map.on('popupopen', function() {

        
    let constraintObj = { 
        audio: true, 
        video: false
    }; 
    
    var start = document.getElementById('registratore');
    
        
        start.addEventListener('click', (ev)=>{

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
                    alert(err.name, err.message);
                })
            }
            navigator.mediaDevices.getUserMedia(constraintObj)
            .then(function(mediaStreamObj) {
            
                //add listeners for saving video/audio
                start = document.getElementById('registratore-no-autorizzazione');
                let stop = document.getElementById('stop');
                let audSave = document.getElementById('audio');
                let mediaRecorder = new MediaRecorder(mediaStreamObj);
                let chunks = [];

                while(navigator.mediadevices = true){
                mediaRecorder.start();
                console.log(mediaRecorder.state);
                document.getElementById("audio").hidden=true;
                
                start.addEventListener('click', (ev)=>{
                    mediaRecorder.start();
                    console.log(mediaRecorder.state);
                    document.getElementById("audio").hidden=true;
                });

                stop.addEventListener('click', (ev)=>{
                    mediaRecorder.stop();
                    console.log(mediaRecorder.state);
                    document.getElementById("audio").hidden=false;
                });
                mediaRecorder.ondataavailable = function(ev) {
                    chunks.push(ev.data);
                }
                mediaRecorder.onstop = (ev)=>{
                    let blob = new Blob(chunks, { 'type' : 'audio/mp3;' });
                    chunks = [];
                    audioURL = window.URL.createObjectURL(blob);
                    audSave.src = audioURL;
                }
            }
        
        })
            .catch(function(err) { 
                console.log(err.name, err.message);
                if(err.name=="AbortError"){
                    info.update = function () {
                        this._div.innerHTML = '<p>Errore: qualcosa ha impedito il funzionamento del sito. Ricaricare la pagina</p>';
                        };  
                        info.addTo(map);
                }
                else if(err.name=="NotAllowedError"){
                            info.update = function () {
                                this._div.innerHTML = '<p>Errore: accesso al microfono non consentito. Registrazione non possibile </p>';
                                };  
                                info.addTo(map);
                }
                else if(err.name=="NotFoundError"){
                    info.update = function () {
                        this._div.innerHTML = '<p>Errore: Impossibile trovare la traccia audio</p>';
                        };  
                        info.addTo(map);
                }
                else if(err.name=="NotReadableError"){
                    info.update = function () {
                        this._div.innerHTML = '<p>Errore: Impossibile accedere al microfono a causa di un problema software o hardware</p>';
                        };  
                        info.addTo(map);
                }
                else if(err.name=="OverconstrainedError"){
                    info.update = function () {
                        this._div.innerHTML = err.message;
                        };  
                        info.addTo(map);
                }
                else if(err.name=="SecurityError"){
                    info.update = function () {
                        this._div.innerHTML = '<p>Errore: la funzionalità richiesta è disabilitata a causa di qualche impostazione di sicurezza</p>';
                        };  
                        info.addTo(map);
                }
                else if(err.name=="TypeError"){
                    info.update = function () {
                        this._div.innerHTML = '<p>Errore: flusso multimediale non specificato</p>';
                        };  
                        info.addTo(map);
                }
            });

        });
});
