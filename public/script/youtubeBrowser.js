var vd = "short";
var rl;

function languageSelect(){
    $("#results").html("");
    init();
}

function lenghtSelect(){
    vd = document.getElementById("approfondimento").value;
    $("#results").html("");
    init();
}

function init() {
    rl = document.getElementById("lingua").value;
    gapi.client.setApiKey("AIzaSyDqgVctqbqa3G_DK4UBnH6v7cOqrSGr8L0");
    gapi.client.load("youtube", "v3", function() {
        console.log("YouTube Api is ready");
        var request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            // location: document.getElementById('coordinate').value,
            // locationRadius: "100km",
            q: "8FPHFC5J+8X:what:ita:none:gen:1%%%Questa è una clip di cui conservare la descrizione.",
            // relevanceLanguage: rl,
            // videoDuration: vd,
            // topicId: "/m/07bxq",	
            maxResults: 5
            // order: "relevance"
        }); 
        // execute the request
        request.execute(function(response) {
            console.log(response);
            var entryArr = response.result.items;
            var videoIDString = '';
            for (var i = 0; i < entryArr.length; i++) {
                var videoResult = new Object();
                videoResult.videoId = entryArr[i].id.videoId;
                videoIDString = videoIDString + videoResult.videoId + ",";
            }
            //remove trailing comma from the string of video ids
            var videoIDStringFinal = videoIDString.substring(0, videoIDString.length - 1);
            var videoIDRequest = gapi.client.youtube.videos.list({
                id: videoIDStringFinal,
                part: 'id,snippet,recordingDetails'
            });
            videoIDRequest.execute(function(response) {
                console.log(response);
                for(var i = 0; i < response.items.length; i++){
                    var title = response.items[i].snippet.title;
                    var description = response.items[i].snippet.description;
                    // var coordinate = response.items[i].recordingDetails.location;
                    var videoId = response.items[i].id;
                    // var lat = coordinate.latitude;
                    // var long = coordinate.longitude;   
                    var thumbUrlHight = response.items[i].snippet.thumbnails.high.url;
                    var metadati = description.split("%%%")[0];
                    var descrizione = description.split("%%%")[1];
                    var olc = metadati.split(":")[0];
                    var coordinate = OpenLocationCode.decode(olc);
                    var markerContent =
                                        `
                                        <div id="${videoId}mappa" class="card">
                                            <div class="card-body">
                                                <h5 class="card-title">${title}</h5>
                                                <p class="card-text clip-description">${descrizione}</p>
                                            </div>
                                            <div class="card-footer text-center">
                                                <a class="btn" href="#${videoId}link">Vai alla clip</a>
                                            </div>
                                        </div>                                
                                        `;

                    marker = new L.marker([coordinate.latitudeCenter, coordinate.longitudeCenter], {myCustomId: videoId + "mappa"})
                        .bindPopup(markerContent)
                        .addTo(map);
                    $("#results").append(
                        `
                        <div id="${videoId}link" class="col-md-4 my-2">
                            <div class="card h-100">
                                <img id="card-image" class="position-static card-img-top" src="${thumbUrlHight}" alt="Anteprima video YouTube">
                                <div class="card-body">
                                    <h5 class="card-title">${title}</h5>
                                    <p class="card-text clip-description">${descrizione}</p>
                                </div>
                                <div class="card-footer text-center">
                                    <button id="${videoId}" class="btn"><i class="far fa-play-circle fa-3x"></i></button>
                                    <button class="pause btn"><i class="far fa-pause-circle fa-3x"></i></button>
                                    <a id="${videoId}mappa" class="float-right" href="#mappa"><i class="fas fa-map-marked-alt fa-2x"></i></a>
                                </div>
                            </div>
                        </div>
                        <script>
                            $("#${videoId}").click(function(){
                                player.loadVideoById(this.id);
                            });
                            $(".pause").click(function(){
                                player.pauseVideo();
                            })
                            $("#${videoId}mappa").on("click", function(event){
                                var $theId = "${videoId}mappa";
                                $.each(map._layers, function(i, item){
                                    if(this.options.myCustomId == $theId){
                                        this.openPopup();
                                        map.panTo(this._latlng)
                                    }
                                });
                            });
                        </script>
                    `);
                }
            });
        });   
    });
}


