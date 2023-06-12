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



// Use this link to get the GeoJSON data.
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Helper function to determine marker color based on depth
function getColor(depth) {
  if (depth < -10) return "black";
  else if (depth >= -10 && depth < 10) return "lightgreen";
  else if (depth >= 10 && depth < 30) return "#69B34C";
  else if (depth >= 30 && depth < 50) return "#FAB733";
  else if (depth >= 50 && depth < 70) return "#FF8E15";
  else if (depth >= 70 && depth < 90) return "#FF4E11";
  else if (depth >= 90) return "#FF0D0D";
}
// Create a layer group for the earthquakes
var earthquakeLayer = L.layerGroup();

// Using Leaflet, create a map that plots all the earthquakes from your dataset based on their longitude and latitude.
fetch(url)
  .then(response => response.json())
  .then(data => {
    const depth_values = []; // Move the declaration here
    L.geoJSON(data.features, {
      pointToLayer: function (feature, latlng) {
        const magnitude = feature.properties.mag;
        const depth = feature.geometry.coordinates[2];
        depth_values.push(depth);

        // Calculate marker size based on magnitude
        const markerSize = magnitude * 3;

        // Calculate marker color based on depth
        const markerColor = getColor(depth);

        return L.circleMarker(latlng, {
          radius: markerSize,
          fillColor: markerColor,
          color: 'black',
          fillOpacity: 0.7,
          weight: 1
        });
      },
      onEachFeature: onEachFeature
    }).addTo(earthquakeLayer);   

    // Create a legend after the GeoJSON data is loaded
    createLegend();

    // Find the minimum and maximum depth_values
    const minValue = Math.min(...depth_values);
    const maxValue = Math.max(...depth_values);
    console.log('Minimum depth:', minValue);
    console.log('Maximum depth:', maxValue);
  });

// Helper function to create popups for each feature
function onEachFeature(feature, layer) {
  layer.bindPopup(`<h3>${feature.properties.place}</h3><hr>${feature.geometry.coordinates[2]}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
}

function createLegend() {
  // Create a legend control
  const legend = L.control({ position: 'bottomright' });

  // Define the legend HTML content
  legend.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'legend');

    // Define depth ranges and labels
    const limits = [-10, 10, 30, 50, 70, 90];
    const colors = limits.map(depth => getColor(depth));

    // Create a legend title
    const legendTitle = '<h4>Legend</h4>';
    div.innerHTML = legendTitle;

    // Create a legend content container
    const legendContent = L.DomUtil.create('div', 'legend-content');
    div.appendChild(legendContent);

    // Loop through the depth ranges and generate the legend items
    for (let i = 0; i < limits.length - 1; i++) {
      const legendItem = L.DomUtil.create('div', 'legend-item');

      // Create the legend label with depth range
      const legendLabel = L.DomUtil.create('div', 'legend-label');
      legendLabel.innerHTML = `${limits[i]} - ${limits[i + 1]}`;
      legendItem.appendChild(legendLabel);

      // Create the legend color box
      const legendColor = L.DomUtil.create('div', 'legend-color');
      legendColor.style.backgroundColor = colors[i];
      legendItem.appendChild(legendColor);

      legendContent.appendChild(legendItem);
    }

    // Add the last legend item for "90+"
    const lastLegendItem = L.DomUtil.create('div', 'legend-item');
    const lastLegendLabel = L.DomUtil.create('div', 'legend-label');
    lastLegendLabel.innerHTML = '    90+';
    lastLegendItem.appendChild(lastLegendLabel);
    const lastLegendColor = L.DomUtil.create('div', 'legend-color');
    lastLegendColor.style.backgroundColor = colors[colors.length - 1];
    lastLegendItem.appendChild(lastLegendColor);
    legendContent.appendChild(lastLegendItem);

    return div;
  };

  // Add the legend to the map
  legend.addTo(myMap);
}

// Creating an overlays object
var overlays = {
  'Tectonic Plates': geoJSONLayer,
  'Earthquakes': earthquakeLayer
};

// Adding layer control to switch between tile layers and overlays
L.control.layers(baseLayers, overlays).addTo(myMap);
