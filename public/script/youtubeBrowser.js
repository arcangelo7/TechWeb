$(function() {
    $("form").on("submit", function(e) {
       e.preventDefault();
       // prepare the request
       var request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            q: encodeURIComponent($("#search").val()).replace(/%20/g, "+"),
            maxResults: 10,
            order: "relevance"
       }); 
       // execute the request
       request.execute(function(response) {
           var results = response.result;
           $.each(results.items, function(index, item){
               console.log(item)
           });
       });
    });
});

function init() {
    gapi.client.setApiKey("AIzaSyC3vOztNiecvkLDdHCnP8W3nEafKFdohNQ");
    gapi.client.load("youtube", "v3", function() {
        console.log("YouTube Api is ready");
    });
}