var darkMode = false;
let urlLayer;
let darkLayer =
  "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png";
let lightLayer = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
let darkIcon = "🌛";
let lightIcon = "☀️";
let btnIcon = lightIcon;

let markersGroupLayer = L.layerGroup();

let darkLayerTile = L.tileLayer(darkLayer, {
  updateWhenIdle: true,
  reuseTiles: true,
  edgeBufferTiles: 2,
  tileSize: 512,
  zoomOffset: -1
});
let lightLayerTile = L.tileLayer(lightLayer, {
  updateWhenIdle: true,
  reuseTiles: true,
  edgeBufferTiles: 2,
  tileSize: 230,
  zoomOffset: -1
});

let baseLayers = {
  "🌛": darkLayerTile,
  "☀️": lightLayerTile
};

if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  // dark mode
  urlLayer = darkLayer;
  darkMode = true;
} else {
  urlLayer = lightLayer;
}

// const $map = document.querySelector('#map');
var map = L.map("map", {
  zoomAnimation: false,
  markerZoomAnimation: false,
  zoomControl: true,
  fullscreenControl: true,
  fullscreenControlOptions: {
    /*  position: "topleft" */
    position: "bottomleft"
  },
  layers: [lightLayerTile]
}).setView([4.281093, -73.818063], 5.5);
L.tileLayer(urlLayer, {}).addTo(map);

// Metodo fetch sobre la API
async function getData() {
  const response = await fetch(
    /*    "https://wuhan-coronavirus-api.laeyoung.endpoint.ainize.ai/jhu-edu/latest" */
    "https://api-covi-19.jorgevelasquez006.now.sh/API/db.json"
  );
  const data = await response.json();
  return data;
}
function renderExtraData({
  confirmed,
  deaths,
  recovered,
  provincestate,
  countryregion
}) {
  return `
        <div>
          <p> <strong>${provincestate} - ${countryregion}</strong> </p>
          <p> Confirmados: <strong><span style="color:#cc6600">${confirmed}</span> </strong></p>
          <p> Muertes: <strong><span style="color:black">${deaths}</span> </strong> </p>
          <p> Recuperados: <strong><span style="color:#008000">${recovered}</span> </strong> </p>
        </div>
      `;
}
//Añador Titulo
var info = L.control({ position: "bottomcenter" });
info.onAdd = function(map) {
  this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
  this.update();
  return this._div;
};

/* function renderExtraData2({
  confirmed,
  deaths,
  recovered,
  provincestate,
  countryregion
})  */

// method that we will use to update the control based on feature properties passed
info.update = function(props) {
  this._div.innerHTML = `<h2>Total confirmados 108</h2>
  <h3>Total Muertes 0</h3>
  <h4>Total Recuperados 1</h4>
  
  
  
  `;
};

// Button Link COVID-19 MUNDIAL
var boton = L.control({ position: "bottomcenter" });
boton.onAdd = function(map) {
  this._div = L.DomUtil.create("div", "boton");
  this.update();
  return this._div;
};
boton.update = function(props) {
  this._div.innerHTML = `
  
  <input class="btn btn-warning" type="button" onclick="location.href='https://www.arcgis.com/apps/opsdashboard/index.html#/85320e2ea5424dfaaa75ae62e5c06e61';" value="COVID-19 Mundo" />
  `;
};

boton.addTo(map);
info.addTo(map);

//Añadir Marcadores
/* const iconUrl = "./icon.png"; */
const iconUrl = "./favicon.ico";
const shadowIcon = "./marker-shadow.png";
const icon = new L.Icon({
  iconUrl: iconUrl,
  shadowUrl: shadowIcon,
  shadowSize: [20, 20],
  iconSize: [25, 25]
  /* iconAnchor: [12, 41] */
  /*  popupAnchor: [1, -34] */
});

async function renderData() {
  const data = await getData();
  let markersGroup = [];
  data.forEach((item, index) => {
    const marker = L.marker([item.location.lat, item.location.lng], {
      icon: icon
    })
      // .addTo(map)
      .bindPopup(renderExtraData(item))
      .addTo(markersGroupLayer);
  });

  map.addLayer(markersGroupLayer);
  const overlayMarkers = {
    "<span>☣</span>": markersGroupLayer
  };
  L.control
    .layers(baseLayers, overlayMarkers, {
      collapsed: false
    })
    .addTo(map);
}

renderData();
