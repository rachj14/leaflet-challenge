// Creating the map object.
let myMap = L.map("map", {
    center: [36, 10],
    zoom: 2
  });

// Adding the title layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Load the GeoJSON data.
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create function for marker size based on earthquake magnitude value.
function markerSize(magnitude) {
    return magnitude * 3;
}

// Create function for colour of marker size based on earthquake depth value.
function getColor(depth) {
    if (depth < 10) return '#FAD7A0';
    else if (depth < 30) return '#F1948A';
    else if (depth < 50) return '#CD6155';
    else if (depth < 70) return '#A93226';
    else if (depth < 90) return '#884EA0';
    else return '#4A235A';
}

// Print data in console.
d3.json(geoData).then(data => {console.log(data)});

// Get the data with d3.
d3.json(geoData).then(function(data) {
    
    // Create geoJSON layer.
    L.geoJSON(data, {
        
        // Create function and style for the circle marker to mark earthquakes on map.
        pointToLayer: function (feature, latlng) {
            let style = {
                fillOpacity: 0.8,
                fillColor: getColor(feature.geometry.coordinates[2]),
                radius: markerSize(feature.properties.mag),
                color: "black",
                weight: 1
            }
            return L.circleMarker(latlng, style)
        },
        
        // Creating a popup for each marker.
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<strong>Location:</strong> " + feature.properties.place + "<br /><strong>Magnitude:</strong> " + feature.properties.mag + "<br /><strong>Depth: </strong>" + feature.geometry.coordinates[2]);
        }
    
    // Add layer to map.
    }).addTo(myMap);
});

// Create legend for map.
let legend = L.control({position: "bottomright"});
legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    depth = [-10, 10, 30, 50, 70, 90];

    // Header for legend.
    div.innerHTML += "<h4 style='text-align: center'>Depth</h4>";

    // Loop through depth values and marker colour to add to legend.
    for (let i = 0; i <depth.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
};
// Add legend to map.
legend.addTo(myMap);


