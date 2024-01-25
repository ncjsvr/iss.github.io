const mapboxAccessToken = 'pk.eyJ1IjoibmNqOTIiLCJhIjoiY2tiMWJ2Y2VtMDBmYzJxcnVqdG4zajg0dSJ9.byYOj9RVssE-LJyaMUbrhQ';
const apiUrlLocation = 'http://api.open-notify.org/iss-now.json';

const mymap = L.map('map', {
    center: [0, 0],
    zoom: 2.5, 
    zoomControl: false, 
    attributionControl: false, 
    scrollWheelZoom: false, 
    doubleClickZoom: false,
    dragging: false,
    preferCanvas: true,
    boxZoom: false,
    keyboard: false,
    tap: false
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mymap);
L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`, {
    tileSize: 512,
    zoomOffset: -1,
}).addTo(mymap);


const shuttleIcon = L.icon({
    iconUrl: 'iss.png',  
    iconSize: [164, 71],
    iconAnchor: [16, 16],
    popupAnchor: [0, 0],
});


let issMarker;


const issLocationText = document.createElement('div');
issLocationText.id = 'iss-location-text';
document.body.appendChild(issLocationText);

function updateISSLocation() {
    fetch(apiUrlLocation)
        .then(response => response.json())
        .then(data => {
            const { iss_position } = data;
            const { latitude, longitude } = iss_position;
            mymap.setView([latitude, longitude], mymap.getZoom());

           
            if (issMarker) {
                mymap.removeLayer(issMarker);
            }
            issMarker = L.marker([latitude, longitude], { icon: shuttleIcon }).addTo(mymap).bindPopup('International Space Station');

           
            updateISSLocationText(latitude, longitude);
        })
        .catch(error => console.error('Error fetching ISS location:', error));
}


updateISSLocation();


setInterval(updateISSLocation, 1000);