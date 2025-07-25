import {birds} from "./data.js";

// boutons des vues
const listBtn = document.getElementById("list-view");
const cardBtn = document.getElementById("card-view");
const mapBtn = document.getElementById("map-view");

// conteneurs pour les vues
const cardsOfBirds = document.getElementById("cards-of-birds");
const tableOfBirds = document.getElementById("list-of-birds");
const listOfBirds = document.getElementById("dynamic-list-of-birds");
const mapContainer = document.getElementById("map-container");
const mapOfBirds = document.getElementById("map-of-birds");
const countryBirds = document.getElementById("country-birds");
const countries = [];

// Filtres
const filtres = document.getElementById("filters");
const orderFilter = document.getElementById("ordre");
const triFilter = document.getElementById("tri");
let orders = [];

// Boutons de tri du tableau
const nomFr = document.getElementById("nom-fr");
const nomSci = document.getElementById("nom-sci");
const nomOrdre = document.getElementById("nom-ordre");

// popup 
let popup = document.getElementById("popup");
let photoOiseau = document.getElementById("photo-oiseau");
let nomOiseau = document.getElementById("nom-oiseau");
let tailleOiseau = document.getElementById("taille-oiseau");
let envergureOiseau = document.getElementById("envergure-oiseau");
let poidsOiseau = document.getElementById("poids-oiseau");
let longeviteOiseau = document.getElementById("longevite-oiseau");
let conservationOiseau = document.getElementById("conservation-oiseau");
let zoneRepartition = document.getElementById("zones-de-repartition");
let timelineMigration = document.getElementById("timeline-de-migration");
let sonsListe = document.getElementById("sons");
let galerieOiseau = document.getElementById("galerie");

// générer la liste des oiseaux selon les données
function displayBird(arr) {
    arr.forEach(bird => {
        let birdName = bird.name.toLowerCase().split(" ").join(".");

        // pour les cartes  
        if (!cardsOfBirds.classList.contains("hidden")) {
            let birdElement = document.createElement("li");
            birdElement.classList.add("bird-card");
            birdElement.classList.add(bird.ordre);
            birdElement.id = `${birdName}`;

            let birdImg = document.createElement("img");
            birdImg.setAttribute("src", bird.photo);
            birdImg.setAttribute("alt", bird.name);

            let birdInfo = document.createElement("div");

            let birdTitle = document.createElement("h3");
            birdTitle.innerText = bird.name;

            birdInfo.appendChild(birdTitle);
            birdElement.appendChild(birdImg);
            birdElement.appendChild(birdInfo);
            cardsOfBirds.appendChild(birdElement); 
        }
        
        // pour la liste sous forme de tableau
        else if (!tableOfBirds.classList.contains("hidden")) {
            let birdRow = document.createElement("tr");
            let birdFirstCell = document.createElement("td");
            birdFirstCell.classList.add(birdName);
            birdFirstCell.classList.add("bird-link");
            birdFirstCell.innerText = bird.name;

            let birdSecCell = document.createElement("td");
            birdSecCell.innerText = "" // mettre plus tard le nom scientifique;

            let birdThirdCell = document.createElement("td");
            birdThirdCell.innerText = bird.ordre;

            birdRow.appendChild(birdFirstCell);
            birdRow.appendChild(birdSecCell);
            birdRow.appendChild(birdThirdCell);
            listOfBirds.appendChild(birdRow);
        }


        // pour la carte du monde 
        else if (!mapContainer.classList.contains("hidden")) {
            if (bird.zonesderepartition) {
                let zone = bird.zonesderepartition;
                let wantedStates = ["present", "reintroduit", "rare"];
                Object.entries(zone).forEach(([state, countryList]) => {
                    if (wantedStates.includes(state)) {
                        countryList.forEach(country => {
                            if (!countries.includes(country)) countries.push(country);
                        }) 
                    }
                });
            }
        }


        if (!orders.includes(bird.ordre)) {
            orders.push(bird.ordre);
        }
    });
}

displayBird(birds);

function displayBirdByCountry(country) {
    countryBirds.innerHTML = "";
    birds.forEach(bird => {
        if (bird.zonesderepartition?.present?.includes(country) || bird.zonesderepartition?.reintroduit?.includes(country) || bird.zonesderepartition?.rare?.includes(country)) {
            let birdName = bird.name.toLowerCase().split(" ").join(".");

            let birdElement = document.createElement("li");
            birdElement.classList.add("bird-card");
            birdElement.classList.add(bird.ordre);
            birdElement.id = `${birdName}`;

            let birdImg = document.createElement("img");
            birdImg.setAttribute("src", bird.photo);
            birdImg.setAttribute("alt", bird.name);

            let birdInfo = document.createElement("div");

            let birdTitle = document.createElement("h3");
            birdTitle.innerText = bird.name;

            birdInfo.appendChild(birdTitle);
            birdElement.appendChild(birdImg);
            birdElement.appendChild(birdInfo);
            countryBirds.appendChild(birdElement);
        }
    })
}


function drawWorldMap() {
    // zones de répartition avec D3.js
    const zoneRepWidth = 1200;
    const zoneRepHeight = 700;

    const svg = d3.select(mapOfBirds)
        .attr("width", zoneRepWidth)
        .attr("height", zoneRepHeight);

    const g = svg.append("g");

    const projection = d3.geoMercator()
    .scale(250)
    .translate([zoneRepWidth / 2, zoneRepHeight / 1.5]);

    const path = d3.geoPath().projection(projection);

    d3.json("./countries.json")
    .then(function(geojsonData) {
        g.selectAll("path")
        .data(geojsonData.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("stroke", "#fff")
        .attr("fill", d => {
            const c = countries;
            const name = d.properties.name;
            return c.includes(name) ? "#a1e4baff" : "#949494ff";
        })
        .on("click", function (event, d) {
            const countryName = d.properties.name;
            displayBirdByCountry(countryName);
        });
    });

    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", (event) => {
            g.attr('transform', event.transform);
        });

    svg.call(zoom);
}

// générer la liste des filtres par ordre 
orders.sort();
orders.forEach(order => {
    let newOrder = document.createElement("option");
    newOrder.setAttribute("value", order);
    newOrder.textContent = order;
    orderFilter.appendChild(newOrder);
})

// gestion du filtre par ordre
orderFilter.addEventListener("change", (e) => {
    let selectedOrder = e.target.value;
    let allBirds = document.querySelectorAll(".bird-card");

    if (selectedOrder !== "") {
        allBirds.forEach(bird => {
            bird.classList.contains(selectedOrder) ? bird.classList.remove("hidden") : bird.classList.add("hidden");
        })
    } else {
        allBirds.forEach(bird => {
            bird.classList.remove("hidden");
        })
    }
})

// gestion du tri
triFilter.addEventListener("change", (e) => {
    cardsOfBirds.innerHTML = "";
    let filteredBirdsArr = [...birds];
    let selectedTri = e.target.value;

    if (selectedTri === "env-cr") {
        filteredBirdsArr.sort((a, b) => a.envergure - b.envergure);
        displayBird(filteredBirdsArr);
    } else if (selectedTri === "env-decr") {
        filteredBirdsArr.sort((a, b) => b.envergure - a.envergure);
        displayBird(filteredBirdsArr);
    } else if (selectedTri === "taille-cr") {
        filteredBirdsArr.sort((a, b) => a.taille - b.taille);
        displayBird(filteredBirdsArr);
    } else if (selectedTri === "taille-decr") {
        filteredBirdsArr.sort((a, b) => b.taille - a.taille);
        displayBird(filteredBirdsArr);
    } else if (selectedTri === "poids-cr") {
        filteredBirdsArr.sort((a, b) => a.poids - b.poids);
        displayBird(filteredBirdsArr);
    } else if (selectedTri === "poids-decr") {
        filteredBirdsArr.sort((a, b) => b.poids - a.poids);
        displayBird(filteredBirdsArr);
    } else {
        displayBird(birds);
    }
    let allBirds = document.querySelectorAll(".bird-card");
    allBirds.forEach(bird => {
        let selectedOrdre = orderFilter.value;
        if (selectedOrdre === "") {
            return;
        } else {
            bird.classList.contains(selectedOrdre) ? bird.classList.remove("hidden") : bird.classList.add("hidden");
        }
    })
})

window.addEventListener("click", (e) => {
    const target = e.target;

    if (isBirdClicked(target)) {
        openPopup(target)        
    } else if (isOutsidePopupClick(target) || isGoBackClick(target)) {
        hidePopup();
    } else if (listBtn.contains(target)) {
        showListMode();
        displayBird(birds);
    } else if (cardBtn.contains(target)) {
        showCardMode();
    } else if (mapBtn.contains(target)) {
        showMapMode();
        displayBird(birds);
        drawWorldMap();
    } else if (nomFr.contains(target)) {
        sortBirdTable("fr")
    } else if (nomSci.contains(target)) { 
        sortBirdTable("sci")
    } else if (nomOrdre.contains(target)) {
        sortBirdTable("ordre")
    }
})

function isBirdClicked(target) {
    return ((target.closest("li") && target.closest("li").classList.contains("bird-card")) || target.classList.contains("bird-link"));
}

function isOutsidePopupClick(target) {
    return (!popup.classList.contains("hidden") && !popup.contains(target))
}

function isGoBackClick(target) {
    return (popup.querySelector("#go-back").contains(target));
}

function openPopup(target) {
        popup.classList.toggle("hidden");
        let selectedBird;

        if (target.classList.contains("bird-link")) {
            selectedBird = target.classList[0].split(".").join(" ");
        } else {
            selectedBird = target.closest("li").id.split(".").join(" ");
        }

        let foundBird = birds.find(bird => bird.name.toLowerCase() == selectedBird);
        
        photoOiseau.setAttribute("src", foundBird.photo);
        photoOiseau.setAttribute("alt", foundBird.name);
        nomOiseau.innerText = foundBird.name;
        tailleOiseau.innerText = foundBird.taille;
        envergureOiseau.innerText = foundBird.envergure;
        poidsOiseau.innerText = foundBird.poids;
        longeviteOiseau.innerText = foundBird.longevite;
        conservationOiseau.innerText = foundBird.menace;

        drawRepZoneMap(foundBird)
}

function hidePopup() {
    const svg = d3.select(zoneRepartition);
    svg.selectAll("*").remove();
    popup.classList.toggle("hidden");
}

function drawRepZoneMap(foundBird) {
    // zones de répartition avec D3.js
    const zoneRepWidth = 800;
    const zoneRepHeight = 500;
    const svg = d3.select(zoneRepartition);

    const g = svg.append("g");

    const projection = d3.geoMercator()
    .scale(130)
    .translate([zoneRepWidth / 2, zoneRepHeight / 1.5]);

    const path = d3.geoPath().projection(projection);

    d3.json("./countries.json")
    .then(function(geojsonData) {
        g.selectAll("path")
        .data(geojsonData.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("stroke", "#fff")
        .attr("fill", d => {
        const z = foundBird.zonesderepartition;
        const name = d.properties.name;
        if (z?.present?.includes(name)) return "#4ece81";
        if (z?.introduit?.includes(name)) return "#9adfb6ff";
        if (z?.rare?.includes(name)) return "#b5e0ffff";
        if (z?.incertain?.includes(name)) return "#fbf5b6ff";
        if (z?.extprob?.includes(name)) return "#fcd694ff";
        if (z?.eteint?.includes(name)) return "#ff6060ff";
        return "#949494ff";
        });
    });

    if (window.innerWidth <= 1000) {
    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", (event) => {
            g.attr('transform', event.transform);
        });

    svg.call(zoom);
}
}

function showListMode() {
    countryBirds.innerHTML = "";
    countryBirds.classList.add("hidden");
    filtres.classList.add("hidden");
    cardsOfBirds.classList.add("hidden");
    mapContainer.classList.add("hidden");
    tableOfBirds.classList.remove("hidden");
}

function showCardMode() {
    countryBirds.innerHTML = "";
    countryBirds.classList.add("hidden");
    tableOfBirds.classList.add("hidden");
    mapContainer.classList.add("hidden");
    filtres.classList.remove("hidden");
    cardsOfBirds.classList.remove("hidden");
}

function showMapMode() {
    tableOfBirds.classList.add("hidden");
    filtres.classList.add("hidden");
    cardsOfBirds.classList.add("hidden");  
    countryBirds.classList.remove("hidden");  
    mapContainer.classList.remove("hidden");
}

function sortBirdTable(type) {
    listOfBirds.innerHTML = "";
    let filteredBirdsArr = [];
    filteredBirdsArr = [...birds];

    const config = [
        { type: "fr", el: nomFr, key: "name" },
        { type: "sci", el: nomSci, key: "name" }, // remplacer plus tard par le nom scientifique que j'aurais mis en data 
        { type: "ordre", el: nomOrdre, key: "ordre" }
    ];

    const ele = config.find(obj => obj.type === type).el;
    const key = config.find(obj => obj.type === type).key;

    config.forEach(obj => {
        if (obj.type !== type) {
            obj.el.childNodes.item(1).textContent = "arrow_drop_down";
        }
    })

    const arrow = ele.childNodes.item(1);
    const isDescending = arrow.textContent === "arrow_drop_down";

    filteredBirdsArr.sort((a, b) =>
        isDescending
            ? b[key].localeCompare(a[key])
            : a[key].localeCompare(b[key])
    );

    arrow.textContent = isDescending ? "arrow_drop_up" : "arrow_drop_down";

    displayBird(filteredBirdsArr);
} 