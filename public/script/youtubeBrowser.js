function init() {
    gapi.client.setApiKey("AIzaSyC3vOztNiecvkLDdHCnP8W3nEafKFdohNQ");
    gapi.client.load("youtube", "v3", function() {
        console.log("YouTube Api is ready");
        var request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            location: document.getElementById('coordinate').value,
            locationRadius: "100km",
            q: "teatro",
            // relevanceLanguage: "it",
            topicId: "/m/07bxq",	
            maxResults: 10,
            order: "relevance"
        }); 
        // execute the request
        request.execute(function(response) {
            var entryArr = response.result.items;
            var videoIDString = '';
            for (var i = 0; i < entryArr.length; i++) {
                var videoResult = new Object();
                videoResult.title = entryArr[i].snippet.title;
                videoResult.videoId = entryArr[i].id.videoId;
                videoIDString = videoIDString + videoResult.videoId + ",";

                $("#results").append(
                    `<h2>${videoResult.title}</h2>
                    <iframe class="video w100" width="640" height="360" src="https://www.youtube.com/embed/${videoResult.videoId}" frameborder="0" allowfullscreen></iframe>
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
                    var coordinate = response.items[i].recordingDetails.location;
                    var lat = coordinate.latitude;
                    var long = coordinate.longitude;   
                    var thumbUrl = response.items[i].snippet.thumbnails.default.url;
                    var markerContent =
                                        `<div>
                                            <image src="${thumbUrl}" width=120px height=90px />
                                        </div>`;
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


