function handleClientLoad() {
    gapi.load('client:auth2', initClient)  
}
var GoogleAuth; // Google Auth object.
function initClient() {
gapi.client.init({
    'clientId': '464791775721-qu6cj90prgb60csokgvtvt8vtg22n2g4.apps.googleusercontent.com',
    'scope': 'https://www.googleapis.com/auth/youtube',
    'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
})
.then(() => {
    GoogleAuth = gapi.auth2.getAuthInstance();
    // Listen for sign in state changes
    GoogleAuth.isSignedIn.listen(updateSigninStatus);
    // Handle initial sign in state
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
})
.catch(err => console.log(JSON.stringify(err)));
}

// Handle login
function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

// Handle logout
function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}

$(document).ready(function() {
    handleClientLoad();
});

// function uploadVideo(file, metadata, callback) {
//     // Get access token
//     var auth = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;

//     // Setup request
//     var form = new FormData();
//     // In order to get the correct content type we need to set a blob field
//     var metadata = new Blob([JSON.stringify(metadata)], {type: 'application/json'});
//     form.append('video', metadata);
//     form.append('mediaBody', file);
//     $.ajax({
//         url: 'https://www.googleapis.com/upload/youtube/v3/videos?access_token='
//         + encodeURIComponent(auth) + '&part=snippet,status',
//         data: form,
//         cache: false,
//         contentType: false,
//         processData: false,
//         method: 'POST',
//         success: (data) => callback(data)
//     });
// }

// function updateSigninStatus(isSignedIn) {
//     if (isSignedIn) {
//         video = document.getElementById('video');
//         var metadata = {
//             kind: 'youtube#video',
//             snippet: {
//             title: "prova",
//             description: "questa è una prova"
//             },
//             status: {
//             privacyStatus: 'public',
//             embeddable: true
//             }
//         };
//         uploadVideo(video.files[0], metadata, function(data) {
//             alert("Grazie per il tuo contributo!");
//             location.reload();
//         });
//     } 
// }

$("a[href='/editor']").addClass("active");
$("a[href='/lista-clip']").addClass("active");

