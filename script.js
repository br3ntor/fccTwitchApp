/*
 ******************* Some Notes On This Code ********************
 ****************************************************************
 * I learned a lot about AJAX & API writing this. I also learned
 * a lot about different ways to do the same thing. So it's
 * probably inconsistent as I've made the API calls with two
 * different styles.
 *
 * This is probably the most advanced script I've written.
 * It could be written better I know. Please let me know what
 * mistakes I could fix or improvements I could make.

 * Also this feels so hacked together and the latest problem I
 * have I solved in a hacky way i.e. the output order of the
 * data.
 * 
 * For some reason the fccArray seems to process in a random
 * order each time the script is run =/
 * 
 * I can see the end in sight, but I feel more and more hacky.
 ****************************************************************
 */

// Code for bootstrap tabs
$("#myTabs a").click(function(e) {
    e.preventDefault();
    $(this).tab("show");
});

console.log("Script2 Testing");
console.log("***************");
var fccArray = ["freecodecamp", "OgamingSC2", "cretetion", "ESL_SC2", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "tsm_theoddone", "dotamajor", "brunofin", "comster404", "definitelynull"];

//Create URL and make API call with it
function apiCall(rootURL, endpoint) {
    return $.ajax({
        url: rootURL + endpoint,
        headers: {
            "Client-ID": "bt3cudkorr3pi3p4pxurgwnrzcguzbx",
            "Accept": "application/vnd.twitchtv.v5+json"
        }
    });
}

//Part 1
//Call streamers followed object if connected with twitch
function signedIn() {

    //Store the return data from signing into twitch
    var hash = document.location.hash;
    console.log("Hash = " + hash);

    //Extract the Access_Token from the hash info sent by twitch
    var hashString = hash.slice(14, 44);
    console.log("Access_Token = " + hashString);
    console.log("\n");

    $.ajax({
        url: "https://api.twitch.tv/kraken/streams/followed/",
        headers: {
            "Client-ID": "bt3cudkorr3pi3p4pxurgwnrzcguzbx",
            "Accept": "application/vnd.twitchtv.v5+json",
            "Authorization": "OAuth " + hashString
        },
        crossDomain: true,
        success: function(data, status, jqXHR) {
            console.log("Data from streams followed with sign-in:");
            console.log(data);
            if (data.streams) {
                console.log("True, data.streams exists!");
                $("#replace").html("<img src='kappa.png' class='spin center-block'>");
                // $("#replace").html("<h2 class='text-center'><span class='label label-success'>Success!</span></h2>");
            } else {
                console.log("False");
            }
            for (var i = 0; i < data.streams.length; i++) {
                $("#following").append("<div class='row rowMargins'><div class='col-xs-5'><img class='pull-right' src='" +
                    data.streams[i].channel.logo + "'><h3><a href='" +
                    data.streams[i].channel.url + "'>" +
                    data.streams[i].channel.display_name + "</a></h3></div><div class='col-xs-7'><img src='" +
                    data.streams[i].preview.large + "'><h4 class='usrOn'><strong>Online</strong></h4><h4><strong>Status:</strong> " +
                    data.streams[i].channel.status + "</h4><h4><strong>Game:</strong> " +
                    data.streams[i].channel.game + "</h4><h4><strong>Viewers:</strong> " +
                    data.streams[i].viewers + "</h4><h4><strong>Followers:</strong> " +
                    data.streams[i].channel.followers + "</h4></div></div>");
            }
        }
    });
}
signedIn();

//Part 2
//Loop through given array to make individual API calls
//Gets user object by name with data including user id even if offline
fccArray.forEach(function(channel) {
    function handleData(theData) {
        console.log(theData);

        // Does stream exist?
        if (theData._total === 1) {
            console.log(channel + " exists!");

            // Takes care of missing logo
            if (theData.users[0].logo === null) {
                $(".noExist").prepend("<div class='row rowMargins'><div class='col-xs-5'><img class='pull-right' src='https://static-cdn.jtvnw.net/jtv_user_pictures/twitch-profile_image-8a8c5be2e3b64a9a-300x300.png'>" +
                    "<h3><a href='https://www.twitch.tv/" + channel + "'>" + theData.users[0].display_name +
                    "</a></h3></div><div class='col-xs-7'><img src='https://static-cdn.jtvnw.net/ttv-static/404_preview-640x360.jpg'><h4 class='usrOff'><strong>Offline</strong></h4><h4><strong>Bio:</strong> " +
                    theData.users[0].bio + "</h4></div></div>");
            } else {

                apiCall("https://api.twitch.tv/kraken/streams/", theData.users[0]._id).done(function(data) {
                    console.log(data);

                    //steam exists but is it live?
                    if (data.stream !== null) {
                        
                        console.log(theData.users[0].display_name + " is online!");
                        $("#online, #all").prepend("<div class='row rowMargins'><div class='col-xs-5'><img class='pull-right' src='" +
                            data.stream.channel.logo + "'><h3><a href='" +
                            data.stream.channel.url + "'>" +
                            data.stream.channel.display_name + "</a></h3></div><div class='col-xs-7'><img src='" +
                            data.stream.preview.large + "'><h4 class='usrOn'><strong>Online</strong></h4><h4><strong>Status:</strong> " +
                            data.stream.channel.status + "</h4><h4><strong>Game:</strong> " +
                            data.stream.channel.game + "</h4><h4><strong>Viewers:</strong> " +
                            data.stream.viewers + "</h4><h4><strong>Followers:</strong> " +
                            data.stream.channel.followers + "</h4></div></div>");

                    } else if (data.stream === null) {

                        console.log(theData.users[0].display_name + " is offline :(");
                        $("#offline, #all").append("<div class='row rowMargins'><div class='col-xs-5'><img class='pull-right' src='" +
                            theData.users[0].logo + "'><h3><a href='https://www.twitch.tv/" +
                            channel + "'>" +
                            theData.users[0].display_name +
                            "</a></h3></div><div class='col-xs-7'><img src='https://static-cdn.jtvnw.net/ttv-static/404_preview-640x360.jpg'><h4 class='usrOff'><strong>Offline</strong></h4><h4><strong>Bio:</strong> " +
                            theData.users[0].bio + "</h4></div></div>");
                    }
                });
            }

            //else if steam does not exist
        } else if (theData._total === 0) {

            console.log(channel + " does not exist!");
            $(".noExist").append("<div class='row rowMargins'><div class='col-xs-5'><img class='pull-right' src='https://static-cdn.jtvnw.net/jtv_user_pictures/twitch-profile_image-8a8c5be2e3b64a9a-300x300.png'><h3>" +
                channel + "</h3></div><div class='col-xs-7'><img src='http://i.imgur.com/tPoH4zD.jpg'><h4>This channel does not exist</h4></div></div>");
        }
    }
    apiCall("https://api.twitch.tv/kraken/users?login=", channel).done(handleData);
});
