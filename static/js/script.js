let map = L.map('map', {doubleClickZoom: false}).locate({setView: true, watch: true, maxZoom: 16});

let osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright%22%3EOpenStreetMap</a> contributors'});
osm.addTo(map);

map.on('locationfound', onLocationFound);

let gpsMarker = null;
let gpsCircleMarker;

const locationIconOptions = {
    iconUrl: '../../world/data/location.png',
    iconSize: [30,30],
}
let locationIcon = L.icon(locationIconOptions);
let locationMarkerOptions = {
    icon: locationIcon,
    draggable: true,
}

function onLocationFound(e) {
    let radius = e.accuracy / 2;
    let popupContent = "You are within " + radius + " meters from this point";

    if (gpsMarker == null) {
        gpsMarker = L.marker(e.latlng, locationMarkerOptions).addTo(map);
        gpsMarker.bindPopup(popupContent).openPopup();
        gpsCircleMarker = L.circle(e.latlng, radius).addTo(map);
    }
    else {
        gpsMarker.getPopup().setContent(popupContent);
        gpsMarker.setLatLng(e.latlng);
        gpsCircleMarker.setLatLng(e.latlng);
        gpsCircleMarker.setRadius(radius);
    }

    let url = '/update_location/';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({'latitude': e.latlng.lat, 'longitude': e.latlng.lng})
    })
        .then((response) => {
            return response.json()
        })
}

const hospitalIconOptions = {
    iconUrl: '../../world/data/hospital.png',
    iconSize: [30,30],
}
let hospitalIcon = L.icon(hospitalIconOptions);
let hospitalMarkerOptions = {
    icon: hospitalIcon,
    draggable: true,
}

geoJsonFile = '../../world/data/export.geojson'

fetch(geoJsonFile)
    // .then(res => res.json())
    // .then(data => console.log(data));
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        L.geoJSON(data, {
            onEachFeature: function (feature, layer) {
                let medicalCentreDetails = "";

                if(feature.properties.name) {
                    medicalCentreDetails += '<p style="font-size: 18px;"><strong>' + feature.properties.name + '</strong></p>';
                }
                if(feature.properties.operator) {
                    medicalCentreDetails += '<p><strong>Operator:</strong> ' + feature.properties.operator + '</p>';
                }
                if(feature.properties.addrcity) {
                    medicalCentreDetails += '<p><strong>City:</strong> ' + feature.properties.addrcity + '</p>';
                }
                if(feature.properties.addrstreet) {
                    medicalCentreDetails += '<p><strong>Street:</strong> ' + feature.properties.addrstreet + '</p>';
                }
                if(feature.properties.website) {
                    medicalCentreDetails += '<p><strong>Website:</strong> ' + feature.properties.website + '</p>';
                }
                if(feature.properties.email) {
                    medicalCentreDetails += '<p><strong>Email:</strong> ' + feature.properties.email + '</p>';
                }
                if(feature.properties.phone) {
                    medicalCentreDetails += '<p><strong>Phone:</strong> ' + feature.properties.phone + '</p>';
                }

                layer.bindPopup(medicalCentreDetails);
            }
        }, hospitalMarkerOptions).addTo(map)
    });

const emergencyIconOptions = {
    iconUrl: '../../world/data/emergency.png',
    iconSize: [30,30],
}
let emergencyIcon = L.icon(emergencyIconOptions);
let emergencyMarkerOptions = {
    icon: emergencyIcon,
    draggable: true,
}

let emergencyDetails = ""

map.on("click", function(e) {
    emergencyDetails = prompt("Give details of your emergency");
    console.log(emergencyDetails)

    let marker = new L.marker([e.latlng.lat, e.latlng.lng], emergencyMarkerOptions).addTo(map);
    marker.bindPopup(
        '<p style="font-size: 18px;"><strong>EMERGENCY: </strong>'
        + emergencyDetails
        + '</p>'
        + '<button class="btn btn-primary" style="color: whitesmoke; border: none; background-color: #5460ff">Edit</button>'
        + '<button class="btn btn-warning" style="margin-left: 8px; color: black; background-color: red; border: none">Delete</button>'
    );
    markerCreator(marker)
})

let url = '/create_marker/';

function markerCreator(e) {
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
            'latitude': e.latlng.lat,
            'longitude': e.latlng.lng,
            'emergency_details': emergencyDetails
        })
    })
        .then((response) => {
            return response.json()
        })
}