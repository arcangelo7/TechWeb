var rl = "en";
var vd = "short";

function languageSelect(){
    rl = document.getElementById("lingua").value;
    $("#results").html("");
    init();
}

function lenghtSelect(){
    vd = document.getElementById("approfondimento").value;
    $("#results").html("");
    init();
}

function init() {
    gapi.client.setApiKey("AIzaSyB06GGowaL0BF-ladpPabNIuO3ihMdiqX4");
    gapi.client.load("youtube", "v3", function() {
        console.log("YouTube Api is ready");
        var request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            location: document.getElementById('coordinate').value,
            locationRadius: "100km",
            q: "teatro",
            relevanceLanguage: rl,
            videoDuration: vd,
            topicId: "/m/07bxq",	
            maxResults: 10,
            order: "relevance"
        }); 
        // execute the request
        request.execute(function(response) {
            var entryArr = response.result.items;
            console.log(entryArr);
            var videoIDString = '';
            for (var i = 0; i < entryArr.length; i++) {
                var videoResult = new Object();
                videoResult.title = entryArr[i].snippet.title;
                videoResult.description = entryArr[i].snippet.description;
                videoResult.videoId = entryArr[i].id.videoId;
                videoIDString = videoIDString + videoResult.videoId + ",";
                videoResult.thumbUrl = entryArr[i].snippet.thumbnails.high.url;
                $("#results").append(
                    `
                    <div class="col-md-4 my-2">
                        <div class="card h-100">
                            <img id="card-image" class="position-static card-img-top" src="${videoResult.thumbUrl}" alt="Anteprima video YouTube">
                            <div class="card-body">
                                <h5 class="card-title">${videoResult.title}</h5>
                                <p class="card-text">${videoResult.description}</p>
                            </div>
                            <div class="card-footer text-center">
                                <button id="${videoResult.videoId}" class="btn"><i class="far fa-play-circle fa-3x"></i></button>
                                <button class="pause btn"><i class="far fa-pause-circle fa-3x"></i></button>
                            </div>
                        </div>
                    </div>
                    <script>
                        $("#${videoResult.videoId}").click(function(){
                            player.loadVideoById(this.id);
                        });
                        $(".pause").click(function(){
                            player.pauseVideo();
                        })
                    </script>
                `);
            }
            //remove trailing comma from the string of video ids
            var videoIDStringFinal = videoIDString.substring(0, videoIDString.length - 1);
            var videoIDRequest = gapi.client.youtube.videos.list({
                id: videoIDStringFinal,
                part: 'id,snippet,recordingDetails'
            });
            videoIDRequest.execute(function(response) {
                for(var i = 0; i < response.items.length; i++){
                    var title = response.items[i].snippet.title;
                    var description = response.items[i].snippet.description;
                    var coordinate = response.items[i].recordingDetails.location;
                    var videoId = response.items[i].id.videoId
                    var lat = coordinate.latitude;
                    var long = coordinate.longitude;   
                    var thumbUrl = response.items[i].snippet.thumbnails.default.url;
                    var markerContent =
                                        `
                                        <div class="card h-100">
                                            <img id="card-image" class="position-static card-img-top" src="${thumbUrl}" alt="Anteprima video YouTube">
                                            <div class="card-body">
                                                <h5 class="card-title">${title}</h5>
                                                <p class="card-text">${description}</p>
                                            </div>
                                            <div class="card-footer text-center">
                                                <button id="${videoId}" class="btn"><i class="far fa-play-circle fa-3x"></i></button>
                                                <button class="pause btn"><i class="far fa-pause-circle fa-3x"></i></button>
                                            </div>
                                        </div>
                                        <script>
                                            $("#${videoId}").click(function(){
                                                player.loadVideoById(this.id);
                                            });
                                            $(".pause").click(function(){
                                                player.pauseVideo();
                                            })
                                        </script>                                        
                                        `;
                    marker = new L.marker([lat,long])
                        .bindPopup(markerContent)
                        .addTo(map);
                }
            });
        });   
    });
}

$(document).on("ready", function(){
    init();
})


