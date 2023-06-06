// Creating the map object
let myMap = L.map('map').setView([36.778259, -119.417931], 3);

// Adding the tile layers
var satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri'
});

var greyscaleLayer = L.tileLayer('https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
  attribution: 'Tiles &copy; Wikimedia'
});

var outdoorsLayer = L.tileLayer('https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png', {
  attribution: 'Tiles &copy; Thunderforest'
});

// Creating a layer group for GeoJSON data
var geoJSONLayer = L.layerGroup();


// URLs of the GeoJSON files
var urls = [
  'static/data/PB2002_boundaries.json',
  'static/data/PB2002_orogens.json',
  'static/data/PB2002_plates.json',
  'static/data/PB2002_steps.json'
];

// Loading and adding each GeoJSON file to the GeoJSON layer group
urls.forEach(function(url) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      var geojsonLayer = L.geoJSON(data);
      geojsonLayer.eachLayer(function(layer) {
        geoJSONLayer.addLayer(layer);
      });
    });
});


// Adding the tile layers and GeoJSON layer to the map
satelliteLayer.addTo(myMap);
greyscaleLayer.addTo(myMap);
outdoorsLayer.addTo(myMap);
geoJSONLayer.addTo(myMap);

// Creating a base layers object
var baseLayers = {
  'Satellite': satelliteLayer,
  'Greyscale': greyscaleLayer,
  'Outdoors': outdoorsLayer
};

// Creating an overlays object
var overlays = {
  'Tectonic Plates': geoJSONLayer
};

// Adding layer control to switch between tile layers and GeoJSON layer
L.control.layers(baseLayers, overlays).addTo(myMap);
