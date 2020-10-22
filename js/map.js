let myIp, myLocation, myTimezone, myISP, mymap;
let myIcon = L.icon({ iconUrl: "../images/icon-location.svg" });

let domIP = document.querySelector(".ipAddr");
let domLoc = document.querySelector(".location");
let domTime = document.querySelector(".time");
let domISP = document.querySelector(".isp");

async function mapSetUp() {
    // request to find user IP address
    await axios
        .get("http://www.geoplugin.net/json.gp")
        .then((response) => {
            myIp = response.data.geoplugin_request;
        })
        .catch((error) => {
            console.log(error);
        });

    // request to get additional information at user's IP address
    await axios
        .get(
            `https://geo.ipify.org/api/v1?apiKey=at_HYvw4DfeTgHyjOCtMsdHVvHwOXvre&ipAddress=${myIp}`
        )
        .then((response) => {
            myLocation = [
                response.data.location.lat,
                response.data.location.lng,
            ];
            myISP = response.data.isp;
            myTimezone = response.data.location.timezone;

            domIP.textContent = myIp;
            domLoc.textContent = `${response.data.location.city}, ${response.data.location.region} ${response.data.location.postalCode}`;
            domTime.textContent = `UTC ${myTimezone}`;
            domISP.textContent = myISP;
        })
        .catch((error) => console.log(error));

    // set up map with user info
    // if no info then it will be set to london
    myMap = L.map("mapid").setView(
        myLocation ? myLocation : [51.505, -0.09],
        13
    );

    L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
            attribution:
                'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: "mapbox/streets-v11",
            tileSize: 512,
            zoomOffset: -1,
            accessToken:
                "pk.eyJ1IjoiZGV2aW5rIiwiYSI6ImNrZ2p0NndzNzAxdGEzMW12YnAzcThhaXMifQ.uZQwQmVt2jWHpmgGJJAr7A",
        }
    ).addTo(myMap);

    let marker = L.marker(myLocation ? myLocation : [51.505, -0.09], {
        icon: myIcon,
    }).addTo(myMap);
}

mapSetUp();

// myMap = L.map("mapid").setView(myLocation ? myLocation : [51.505, -0.09], 13);

// L.tileLayer(
//     "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
//     {
//         attribution:
//             'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//         maxZoom: 18,
//         id: "mapbox/streets-v11",
//         tileSize: 512,
//         zoomOffset: -1,
//         accessToken:
//             "pk.eyJ1IjoiZGV2aW5rIiwiYSI6ImNrZ2p0NndzNzAxdGEzMW12YnAzcThhaXMifQ.uZQwQmVt2jWHpmgGJJAr7A",
//     }
// ).addTo(myMap);

// let myIcon = L.icon({ iconUrl: "../images/icon-location.svg" });

// let marker = L.marker(myLocation ? myLocation : [51.505, -0.09], {
//     icon: myIcon,
// }).addTo(myMap);

const input = document.getElementById("searchInput");
const submit = document.getElementById("submitButton");

submit.addEventListener("click", async () => {
    myIp = input.value;

    await axios
        .get(
            `https://geo.ipify.org/api/v1?apiKey=at_HYvw4DfeTgHyjOCtMsdHVvHwOXvre&ipAddress=${myIp}`
        )
        .then((response) => {
            myLocation = [
                response.data.location.lat,
                response.data.location.lng,
            ];
            myISP = response.data.isp;
            myTimezone = response.data.location.timezone;

            domIP.textContent = myIp;
            domLoc.textContent = `${response.data.location.city}, ${response.data.location.region} ${response.data.location.postalCode}`;
            domTime.textContent = `UTC ${myTimezone}`;
            domISP.textContent = myISP;
        })
        .catch((error) => console.log(error));

    marker = L.marker(myLocation, {
        icon: myIcon,
    }).addTo(myMap);

    myMap.setView(myLocation, 13);
});
