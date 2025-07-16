function goFavoris(id) {
    url = `https://api.openweathermap.org/data/2.5/forecast?id=${id}&appid=${apiKey}&lang=${langue}&units=${unite}`

    // TEST SI LA VILLE EST VALIDE EN REGARDER SI L'URL RENVOIE UNE ERREUR 404
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "404") {
                alert("Ville non trouvée !");
                return;
            }
            avoirLaMeteo(url);
        })
}


function ajoutFavoris(city, country, id) {
    favCity = window.localStorage.getItem(`favCity`)
    favCountry = window.localStorage.getItem(`favCountry`)
    favId = window.localStorage.getItem(`favId`)

    // Si le localStorage est vide, on initialise favCity comme un tableau vide pour éviter les erreurs
    // Sinon, on le parse pour le transformer en tableau
    if (!favCity) {
        favCity = []
    } else {
        favCity = JSON.parse(favCity)
    }
    if (!favCountry) {
        favCountry = []
    } else {
        favCountry = JSON.parse(favCountry)
    }
    if (!favId) {
        favId = []
    } else {
        favId = JSON.parse(favId)
    }

    //Ajout de la ville en favoris
    // Si la ville est déjà dans les favoris, on la supprime
    supprCountry = false
    if (!favCity.includes(city.toUpperCase())) {
        favCity.push(city.toUpperCase());
        changeEtoile()
    } else {
        favCity.forEach(element => {
            if (element == city.toUpperCase()) {
                changeEtoile()
                indexSuppr = favCity.indexOf(element) // On récupère l'index de la ville pour supprimer le pays correspondant
                favCity.splice(indexSuppr, 1);
                supprCountry = true
                favCountry.splice(indexSuppr, 1); // On supprime le pays correspondant
                favId.splice(indexSuppr, 1); // On supprime l'id correspondant
            }
        })
    }
    if (supprCountry == false) {
        favCountry.push(country);
    }
    if (supprCountry == false) {
        favId.push(id)
    }
    window.localStorage.setItem(`favCity`, JSON.stringify(favCity)); // On sauvegarde le tableau dans le localStorage
    window.localStorage.setItem(`favCountry`, JSON.stringify(favCountry)); // On sauvegarde le tableau dans le localStorage
    window.localStorage.setItem(`favId`, JSON.stringify(favId)); // On sauvegarde le tableau dans le localStorage
    favoris()
}

function favoris() {
    favCity = window.localStorage.getItem(`favCity`) // On récupère le tableau
    favCountry = window.localStorage.getItem(`favCountry`) // On récupère le tableau des pays
    favId = window.localStorage.getItem(`favId`) // On récupère le tableau des id

    if (!favCity) {
        favCity = []
    } else {
        favCity = JSON.parse(favCity)
    }
    if (!favCountry) {
        favCountry = []
    } else {
        favCountry = JSON.parse(favCountry)
    }
    if (!favId) {
        favId = []
    } else {
        favId = JSON.parse(favId)
    }

    document.getElementById("favoris").innerHTML = "";
    for (let i = 0; i < favCity.length; i++) { // On boucle sur le tableau pour afficher les villes
        document.getElementById("favoris").innerHTML += `
        <a onclick="goFavoris('${favId[i]}')">
        <div class="container text-center rounded-4 mt-2 mb-2">
            <div class="row">
                <div class="col-2">
                    <p class="h5 mt-3 ms-3" id="tempFav${i}">temp</p>
                </div>
                <div class="col-5">
                    <img src="assets/img/01.png" alt="météo ${favCity[i]}" class="iconeMeteo mt-2" id="meteofav${i}">
                </div>
                <div class="col-5">
                    <p class="h5">${favCity[i]}</p>
                    <p class="h5">${favCountry[i]}</p>
                </div>
            </div>
        </div>
        </a>`;

        iconeTempFav(favId[i], favCity[i], i) // On appelle la fonction pour afficher les icônes météo des villes favorites
    }
}

function changeEtoile() {
    if (document.getElementById("ajoutFavorisBtn").innerHTML == `<i class="bi bi-star-fill"></i>`) {
        document.getElementById("ajoutFavorisBtn").innerHTML = `<i class="bi bi-star"></i>`;
    } else {
        document.getElementById("ajoutFavorisBtn").innerHTML = `<i class="bi bi-star-fill"></i>`;
    }
}

function updateEtoile() {
    idfav = window.localStorage.getItem(`favId`)
    if (idfav.includes(document.getElementById("id").textContent)) {
        document.getElementById("ajoutFavorisBtn").innerHTML = `<i class="bi bi-star-fill"></i>`;
    } else {
        document.getElementById("ajoutFavorisBtn").innerHTML = `<i class="bi bi-star"></i>`;
    }
}

function iconeTempFav(id, city, i) {
    url = `https://api.openweathermap.org/data/2.5/forecast?id=${id}&appid=${apiKey}&lang=${langue}&units=${unite}`
    fetch(url)
        .then(response => response.json())
        .then(data => {
            meteoItem = data.list[0]
            iconeFavMeteoHTML = cielFav(meteoItem)
            iconeFavMeteoAChanger = `assets/img/${iconeFavMeteoHTML}.png`
            document.getElementById(`tempFav${i}`).textContent = `${Math.round(meteoItem.main.temp)}°`
            document.getElementById(`meteofav${i}`).src = `assets/img/${iconeFavMeteoHTML}.png`

            function cielFav(meteoItem) {
                let dansCiel = meteoItem.weather[0].main
                let nuage = meteoItem.clouds.all
                let pluie = meteoItem.weather[0].id
                if (dansCiel == "Clear") {
                    return "01"
                }
                else if (dansCiel == "Clouds" && nuage < 50) {
                    return "02"
                }
                else if (dansCiel == "Clouds" && nuage >= 50) {
                    return "03"
                }
                else if (dansCiel == "Rain" && pluie <= 500) {
                    return "04"
                }
                else if (dansCiel == "Rain" && pluie > 500) {
                    return "05"
                }
            }
        })
        .catch(error => {
            console.error("Erreur lors de la récupération de l'icône météo :", error);
        });
}