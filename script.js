import {birds} from "./data.js";

// boutons des vues
const listBtn = document.getElementById("list-view");
const cardBtn = document.getElementById("card-view");
const mapBtn = document.getElementById("map-view");

// conteneurs pour les vues
const cardsOfBirds = document.getElementById("cards-of-birds");
const listOfBirds = document.getElementById("dynamic-list-of-birds");

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

// Vue en tuiles
// générer la liste des oiseaux selon les données
function displayBird(arr) {
    arr.forEach(bird => {
        let birdName = bird.name.toLowerCase().split(" ").join(".");

        // pour les cartes
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

        // pour la liste sous forme de tableau
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

        if (!orders.includes(bird.ordre)) {
            orders.push(bird.ordre);
        }
    });
}

displayBird(birds);

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
    allBirds.forEach(bird => {
        bird.classList.contains(selectedOrder) ? bird.classList.remove("hidden") : bird.classList.add("hidden");
    })
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
    if ((e.target.closest("li") && e.target.closest("li").classList.contains("bird-card")) || e.target.classList.contains("bird-link")) {
        popup.classList.toggle("hidden");
        let selectedBird;

        if (e.target.classList.contains("bird-link")) {
            selectedBird = e.target.classList[0].split(".").join(" ");
        } else {
            selectedBird = e.target.closest("li").id.split(".").join(" ");
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

        // zones de répartition avec D3.js
        const zoneRepWidth = 800;
        const zoneRepHeight = 500;
        const svg = d3.select(zoneRepartition);

        const projection = d3.geoMercator()
        .scale(130)
        .translate([zoneRepWidth / 2, zoneRepHeight / 1.5]);

        const path = d3.geoPath().projection(projection);

        d3.json("./countries.json")
        .then(function(geojsonData) {
            svg.selectAll("path")
            .data(geojsonData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("stroke", "#fff")
            .attr("fill", d => {
            if (foundBird.zonesderepartition.present && foundBird.zonesderepartition.present.includes(d.properties.name)) return "#4ece81";
            if (foundBird.zonesderepartition.introduit && foundBird.zonesderepartition.introduit.includes(d.properties.name)) return "#9adfb6ff";
            if (foundBird.zonesderepartition.rare && foundBird.zonesderepartition.rare.includes(d.properties.name)) return "#b5e0ffff";
            if (foundBird.zonesderepartition.incertain && foundBird.zonesderepartition.incertain.includes(d.properties.name)) return "#fbf5b6ff";
            if (foundBird.zonesderepartition.extprob && foundBird.zonesderepartition.extprob.includes(d.properties.name)) return "#fcd694ff";
            if (foundBird.zonesderepartition.eteint && foundBird.zonesderepartition.eteint.includes(d.properties.name)) return "#ff6060ff";
            return "#949494ff";
            });
        });
    } else if (!popup.classList.contains("hidden") && !popup.contains(e.target)) {
        popup.classList.toggle("hidden");
    } else if (popup.querySelector("#go-back").contains(e.target)) {
        const svg = d3.select(zoneRepartition);
        svg.selectAll("*").remove();
        popup.classList.toggle("hidden");
    } else if (listBtn.contains(e.target)) {
        filtres.classList.add("hidden");
        cardsOfBirds.classList.add("hidden");
        listOfBirds.classList.remove("hidden");
    } else if (cardBtn.contains(e.target)) {
        listOfBirds.classList.add("hidden");
        filtres.classList.remove("hidden");
        cardsOfBirds.classList.remove("hidden");
    } else if (nomFr.contains(e.target)) {
        nomSci.childNodes.item(1).textContent = "arrow_drop_down";
        nomOrdre.childNodes.item(1).textContent = "arrow_drop_down";
        listOfBirds.innerHTML = "";
        let filteredBirdsArr = [...birds];
        if (nomFr.childNodes.item(1).textContent === "arrow_drop_down") {
            filteredBirdsArr.sort((a, b) => b.name.localeCompare(a.name));
            nomFr.childNodes.item(1).textContent = "arrow_drop_up";
        } else {
            filteredBirdsArr.sort();
            nomFr.childNodes.item(1).textContent = "arrow_drop_down";
        }
        displayBird(filteredBirdsArr);
    } else if (nomSci.contains(e.target)) { // attention à changer le code ici une fois que j'aurais récupéré et inséré les noms scientifiques
        nomFr.childNodes.item(1).textContent = "arrow_drop_down";
        nomOrdre.childNodes.item(1).textContent = "arrow_drop_down";
        listOfBirds.innerHTML = "";
        let filteredBirdsArr = [...birds];
        if (nomSci.childNodes.item(1).textContent === "arrow_drop_down") {
            filteredBirdsArr.sort((a, b) => b.name.localeCompare(a.name));
            nomSci.childNodes.item(1).textContent = "arrow_drop_up";
        } else {
            filteredBirdsArr.sort();
            nomSci.childNodes.item(1).textContent = "arrow_drop_down";
        }
        displayBird(filteredBirdsArr);
    } else if (nomOrdre.contains(e.target)) {
        nomFr.childNodes.item(1).textContent = "arrow_drop_down";
        nomSci.childNodes.item(1).textContent = "arrow_drop_down";
        listOfBirds.innerHTML = "";
        let filteredBirdsArr = [...birds];
        if (nomOrdre.childNodes.item(1).textContent === "arrow_drop_down") {
            filteredBirdsArr.sort((a, b) => b.ordre.localeCompare(a.ordre));
            nomOrdre.childNodes.item(1).textContent = "arrow_drop_up";
        } else {
            filteredBirdsArr.sort((a, b) => a.ordre.localeCompare(b.ordre));
            nomOrdre.childNodes.item(1).textContent = "arrow_drop_down";
        }
        displayBird(filteredBirdsArr);
    }
})