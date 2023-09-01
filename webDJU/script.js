let stations = new Array();
let station = "";

const resultatElement = document.getElementById("resultat");
const stationElement = document.getElementById("station");
const postalField = document.getElementById("postal-field");
const info = document.getElementById("infos");
const input = document.getElementById("input");

postalField.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    findClosestStation(postalField.value);
    postalField.value = "";
  }
});

function findClosestStation (codePostal) {
  // resultatElement.innerHTML = "";
  // stationElement.innerHTML = "";
  stations = new Array();
  console.log(codePostal);

  fetch("../geoCommunes.json")
    .then((response) => response.json())
    .then((JSCommunes) => {
      JSCommunes.forEach((element) => {
        if (element.postal == codePostal.toString()) {
          resultatElement.innerHTML += `<p class="text">Commune : <strong>${element.name}  
          </strong>closestStation : <strong>${element.closestStation}<strong></p>`;
          if (!stations.includes(element.closestStation)) {
            stations.push(element.closestStation);
          }
        }
      });
      displayStationElements();
      return stations;
    });
};

function displayStationElements() {

  if (stations.length == 0) {
    info.innerHTML = "Aucune ville trouvée";
    return
  }

  input.innerHTML = `<div class="info" id="infos">SeuilRef</div>
  <div class="form">
  <input type="field" id="postal-field" />
  </div>`;

  createStationElement();
    
  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter" && stations.includes(station)) {
      const postalField = document.getElementById("postal-field");
      seuilRef = postalField.value;
      startCalcul();
    }
  });
}

function createStationElement() {
  stationElement.innerHTML += `<div class="choice" id="firstChoice"><p class="choices">${stations[0]}</p></div>`;
  stationElement.innerHTML += `<div class="choice" id="secondChoice"><p class="choices">${stations[1]}</p></div>`;

  firstChoice = document.getElementById("firstChoice");
  secondChoice = document.getElementById("secondChoice");

  firstChoice.addEventListener("click", () => {
    secondChoice.className = "choice";
    firstChoice.className = "choice selected";
    station = stations[0];
  });
  secondChoice.addEventListener("click", () => {
    firstChoice.className = "choice";
    secondChoice.className = "choice selected";
    station = stations[1];
  });
}

function startCalcul() {
  let stationForCSV =
    station.split("-")[0].split("")[0].toUpperCase() +
    station.split("-")[0].slice(1);

  let dataStation = new Array()
  Papa.parse(`../dataStations/data${stationForCSV}.csv`, {
    download: true,
    header: true,
    delimiter: ";",
    step: function (data) {
      dataStation.push(data.data);
    },
    complete: function () {
      extractTemperatures(dataStation);
      calculation();
    },
  });
}