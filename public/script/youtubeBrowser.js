var rl;
var audienceSelezionata;
var dettaglioSelezionato;

function filtra(){
    $("#results").html("");
    init();
}

// function lenghtSelect(){
//     vd = document.getElementById("approfondimento").value;
//     $("#results").html("");
//     init();
// }

function init() {
    rl = document.getElementById("lingua").value;
    audienceSelezionata = document.getElementById("audience").value;
    dettaglioSelezionato = document.getElementById("dettaglio").value;
    // gapi.client.setApiKey("AIzaSyC5bzLvEG6GGvw8WrsdbETj5tUOe_8wyQQ");
    // gapi.client.setApiKey("AIzaSyB06GGowaL0BF-ladpPabNIuO3ihMdiqX4");
    gapi.client.setApiKey("AIzaSyC3vOztNiecvkLDdHCnP8W3nEafKFdohNQ");
    gapi.client.load("youtube", "v3", function() {
        console.log("YouTube Api is ready");
        var request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            channelId: "UC5mREzTEPh9h1vUhPq1FKhQ",
            maxResults: 10,
            order: "title"
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
                part: 'id,snippet,recordingDetails',
                order: "title"
            });
            videoIDRequest.execute(function(response) {
                console.log(response);
                var items = [];
                for(var i = 0; i < response.items.length; i++){
                    items.push(response.items[i]);
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
                    var scopo = metadati.split(":")[1];
                    switch(scopo) {
                        case "what":
                            scopo = "Che cos'è?";
                            break;
                        case "how":
                            scopo = "Come ci arrivo?";
                            break;
                        case "why?":
                            scopo = "Perché ne vale la pena?";
                            break;
                    }
                    var lingua = metadati.split(":")[2];
                    switch(lingua) {
                        case "it":
                            lingua = "italiano";
                            break;
                        case "en":
                            lingua = "inglese";
                            break;
                        case "de":
                            lingua = "tedesco";
                            break;
                        case "fr":
                            lingua = "francese";
                            break;
                        case "es":
                            lingua = "spagnolo";
                            break;
                    }
                    var categoria = metadati.split(":")[3];
                    switch(categoria) {
                        case "none":
                            categoria = "nessuna";
                            break;
                        case "nat":
                            categoria = "natura";
                            break;
                        case "art":
                            categoria = "arte";
                            break;
                        case "his":
                            categoria = "storia";
                            break;
                        case "flk":
                            categoria = "folklore";
                            break;
                        case "mod":
                            categoria = "cultura moderna";
                            break;
                        case "rel":
                            categoria = "religione";
                            break;
                        case "cui":
                            categoria = "cucina e drink";
                            break;
                        case "spo":
                            categoria = "sport";
                            break;
                        case "mus":
                            categoria = "musica";
                            break;
                        case "mov":
                            categoria = "film";
                            break;
                        case "fas":
                            categoria = "moda";
                            break;
                        case "shp":
                            categoria = "shopping";
                            break;
                        case "tec":
                            categoria = "tecnologia";
                            break;
                        case "pop":
                            categoria = "cult. pop. e gossip";
                            break;
                        case "prs":
                            categoria = "esperienze personali";
                            break;
                        case "oth":
                            categoria = "altro";
                            break;
                    }
                    var audience = metadati.split(":")[4];
                    switch(audience) {
                        case "gen":
                            audience = "pubblico generico";
                            break;
                        case "pre":
                            audience = "pre-scuola";
                            break;
                        case "elm":
                            audience = "scuola primaria";
                            break;
                        case "mid":
                            audience = "scuola media";
                            break;
                        case "scl":
                            audience = "specialisti del settore";
                            break;
                    }
                    var dettaglio = metadati.split(":")[5];
                    switch(dettaglio) {
                        case "1":
                            dettaglio = "leggero";
                            break;
                        case "2":
                            dettaglio = "medio";
                            break;
                        case "3":
                            dettaglio = "approfondito";
                            break;
                    }
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
                                    <p class="card-text">${scopo}</p>
                                    <p class="card-text clip-description">${descrizione}</p>
                                </div>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item"><strong>Lingua</strong>: ${lingua}</li>
                                    <li class="list-group-item"><strong>Categoria</strong>: ${categoria}</li>
                                    <li class="list-group-item"><strong>Audience</strong>: ${audience}</li>
                                    <li class="list-group-item"><strong>Dettaglio</strong>: ${dettaglio}</li>
                                </ul>
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
                // FILTRI
                var ids = [];
                // Hide cards
                for(i = 0; i < items.length; i++) {
                    var description = items[i].snippet.description;
                    var id = items[i].id;
                    var lingua = description.split(":")[2];
                    var audience = description.split(":")[4];
                    var dettaglio = description.split(":")[5];
                    dettaglio = dettaglio.split("%%%")[0];
                    if(lingua != rl || audienceSelezionata != audience || dettaglioSelezionato != dettaglio){
                        ids.push(id);
                        document.getElementById(id+"link").hidden = true;                
                    }
                }
                // Delete markers
                for(i = 0; i < ids.length; i++){
                    var currentId = ids[i];
                    map.eachLayer(function(layer){
                        if(layer.options.myCustomId == (currentId + "mappa")) {
                            map.removeLayer(layer);
                        }
                    });   
                }
            });
        });   
    });
    map.closePopup();
}


