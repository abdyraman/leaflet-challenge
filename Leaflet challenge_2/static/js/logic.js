// Creating the map object
let myMap = L.map('map').setView([36.778259, -119.417931], 3);

// Adding the tile layers

// Satellite tile layer
var satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri'
});

// Greyscale tile layer
var greyscaleLayer = L.tileLayer('https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
  attribution: 'Tiles &copy; Wikimedia'
});

// Outdoors tile layer
var outdoorsLayer = L.tileLayer('https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png', {
  attribution: 'Tiles &copy; Thunderforest'
});

// Adding the tile layers to the map
satelliteLayer.addTo(myMap);
greyscaleLayer.addTo(myMap);
outdoorsLayer.addTo(myMap);

// Creating a base layers object
var baseLayers = {
  'Satellite': satelliteLayer,
  'Greyscale': greyscaleLayer,
  'Outdoors': outdoorsLayer
};
// Adding layer control to switch between tile layers
L.control.layers(baseLayers).addTo(myMap);


// Creating a merged GeoJSON layer
var mergedGeoJSON = L.geoJSON();

// URLs of the GeoJSON files
var urls = [
  'static/data/PB2002_boundaries.json',
  'static/data/PB2002_orogens.json',
  'static/data/PB2002_plates.json',
  'static/data/PB2002_steps.json'
];

// Loading and adding each GeoJSON file to the mergedGeoJSON layer
urls.forEach(function(url) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      var geojsonLayer = L.geoJSON(data);
      geojsonLayer.eachLayer(function(layer) {
        mergedGeoJSON.addLayer(layer);
      });
    });
});

// Adding the merged GeoJSON layer to the map
mergedGeoJSON.addTo(myMap);

