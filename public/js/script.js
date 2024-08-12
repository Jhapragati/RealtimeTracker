const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("send-location", { latitude, longitude });
    }, (error) => {
        console.error(error);
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    });
}

const map = L.map("map").setView([0, 0], 2);  // Initial center and zoom

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Banasthali Vidyapeeth"
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;

    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);  // Update existing marker position
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);  // Create a new marker
    }

    // Set the map view to the new location with an appropriate zoom level
    map.setView([latitude, longitude], 13);
});

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
