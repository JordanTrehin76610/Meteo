let city = ""
let zip = ""
let country = ""
let apiKey = "142fa27ef3629e56358aebb03acba4f1"
let langue = "fr"
let unite = "metric"
let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=${langue}&units=${unite}`
let cityAllFav = []


geolocation()



function geolocation() {


    if (confirm("Voulez-vous activer la geolocalition ? (Activer position si oui)") == true) {
        navigator.geolocation.getCurrentPosition((position) => {

            latitude = position.coords.latitude //Je choppe la latitude
            longitude = position.coords.longitude // Je choppe la longitude
            urlCity = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=${apiKey}` // Je m'en sert et ça me retourne un JSON

            fetch(urlCity)
                .then(response => response.json())
                .then(data => {

                    
                    //JSON que j'exploite pour chopper le lieu le plus proche
                    city = data[0].name
                    state = data[0].state
                    country = data[0].country
                    console.log(`ville: ${city}, state: ${state} et country: ${country}`)
                    console.log(data)
                    url = `http://api.openweathermap.org/data/2.5/forecast?q=${city},${state},${country}&appid=${apiKey}&lang=${langue}&units=${unite}`
                    avoirLaMeteo(url)
                })
        })
    } else {
        id = "2988507" //Commune française, c rigolo ^^
        url = `https://api.openweathermap.org/data/2.5/forecast?id=${id}&appid=${apiKey}&lang=${langue}&units=${unite}`
        console.log("ville par défault activé")
        avoirLaMeteo(url)
    }
}




function lieux() {
    if (document.getElementById("lieuxChoisie").value.includes(",")) {
    city = document.getElementById("lieuxChoisie").value
    url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=${langue}&units=${unite}`

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
    } else {
        alert("Veuillez entrer une ville valide avec le code de son pays\nExemple: \nParis, FR \nNew York, US \nTokyo, JP")
    }
}

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
                favCity.splice(favCity.indexOf(element), 1);
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



function avoirLaMeteo(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            favoris()

            let meteo = data
            
            let ville = meteo.city.name
            let pays = meteo.city.country
            let id = meteo.city.id
            
            console.log(`ville visée: ${ville}`)
            console.log(data)

            let tempMaintenant = Math.round(meteo.list[0].main.temp)

            let now = new Date()
            let maintenant = [now.getHours(), now.getMinutes()]
            maintenant.splice(1, 0, "h")
            if (maintenant[2] < 10) {
                maintenant.splice(2, 0, 0)
            }
            if (maintenant[0] < 10) {
                maintenant.splice(0, 0, 0)
            }

            let tempMaintenantRessent = Math.round(meteo.list[0].main.feels_like)

            let ventMaintenant = Math.round((meteo.list[0].wind.speed) * 3.6)


            // HEURE A VENIR
            let heureAVenir = []
            let tempAVenir = []
            let tempAVenirRessent = []
            let ventAVenir = []
            let codeCielAVenir = []
            for (let i = 1; i <= 4; i++) {

                tempAVenir.push(Math.round((meteo.list[i].main.temp)))
                tempAVenirRessent.push(meteo.list[i].main.feels_like)
                ventAVenir.push(Math.round((meteo.list[i].wind.speed) * 3.6))
                codeCielAVenir.push(ciel(meteo.list[i]))
            }





            // DANS LA SEMAINE A VENIR (je peux avoir que 4 jours à l'avenir)
            let tempSemaine = []
            let tempSemaineRessent = []
            let ventSemaine = []
            let codeCielSemaine = []


            let heuresCibles = ["09", "15"]
            for (let i = 0; i < meteo.list.length; i++) {
                let date = new Date(meteo.list[i].dt_txt)
                let jour = date.getDate(); //On choppe la date
                let heure = meteo.list[i].dt_txt.slice(11, 13) //on regarde son heure

                // On saute aujourd'hui
                if (jour === now.getDate()) {
                    continue;
                } else if (heuresCibles.includes(heure)) { //Si son heure correspond à nos objectifs alors c bon
                    tempSemaine.push(Math.round(meteo.list[i].main.temp))
                    tempSemaineRessent.push(Math.round(meteo.list[i].main.feels_like))
                    ventSemaine.push(Math.round(meteo.list[i].wind.speed * 3.6))
                    codeCielSemaine.push(ciel(meteo.list[i]))
                }
            }




            // MODIF INTERFACE MAINTENANT
            document.getElementById("ville").innerText = ville
            document.getElementById("country").innerText = pays
            document.getElementById("id").innerText = id
            document.getElementById("heureMaintenant").innerText = maintenant.join("")
            document.getElementById("températureMaintenant").textContent = `${tempMaintenant}°`
            document.getElementById("températureMaintenantRessenti").innerText = `${tempMaintenantRessent}°`
            document.getElementById("ventMaintenant").innerText = `${ventMaintenant} km/h`
            let codeCiel = ciel(meteo.list[0])
            document.getElementById("meteoMaintenant").src = `assets/img/${codeCiel}.png`





            // MODIF INTERFACE DANS PLUSIEUR HEURES
            document.getElementById("meteo3h").src = `assets/img/${codeCielAVenir[0]}.png`
            document.getElementById("température3h").innerText = `${tempAVenir[0]}°`
            document.getElementById("vent3h").innerText = `${ventAVenir[0]}km/h`
            document.getElementById("meteo6h").src = `assets/img/${codeCielAVenir[1]}.png`
            document.getElementById("température6h").innerText = `${tempAVenir[1]}°`
            document.getElementById("vent6h").innerText = `${ventAVenir[1]}km/h`
            document.getElementById("meteo9h").src = `assets/img/${codeCielAVenir[2]}.png`
            document.getElementById("température9h").innerText = `${tempAVenir[2]}°`
            document.getElementById("vent9h").innerText = `${ventAVenir[2]}km/h`
            document.getElementById("meteo12h").src = `assets/img/${codeCielAVenir[3]}.png`
            document.getElementById("température12h").innerText = `${tempAVenir[3]}°`
            document.getElementById("vent12h").innerText = `${ventAVenir[3]}km/h`



            // Tableau des jours de la semaine
            let joursSemaine = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
            let numeroJour = now.getDay()

            document.getElementById("jourSuivant").innerHTML = ""

            // AJOUT DES JOURS SUIVANT
            for (let i = 1; i <= 4; i++) {
                let jourIndex = (numeroJour + i) % 7;
                let jourNom = joursSemaine[jourIndex];

                document.getElementById("jourSuivant").innerHTML += `
        <p id="jour" class="h3 ms-2 text-lg-center">${jourNom}</p>
        <div class="container text-center mt-0 mb-5 rounded-4">
        <div class="row mt-2">
            <div class="col">
                <img src="assets/img/01.png" alt="météo jour +${i}M" class="iconeMeteoSemaine" id="meteoJour+${i}M">
                <img src="assets/img/01.png" alt="météo jour +${i}A" class="iconeMeteoSemaine" id="meteoJour+${i}A">
            </div>
            <div class="col mt-3 h3">
                <p><i class="bi bi-thermometer-half" id="températureJour+${i}M"></i>/<i class="bi bi-thermometer-half" id="températureJour+${i}A"></i></p>
            </div>
        </div>
        <div class="row">
            <div class="col h5">
                <p><i class="bi bi-wind" id="ventJour+${i}M">Vitesse vent</i>/<i id="ventJour+${i}A">Vitesse vent</i></p>
            </div>
            <div class="col h3">
                <p><i class="bi bi-emoji-sunglasses" id="températureJour+${i}RessentiM"></i>/<i class="bi bi-emoji-sunglasses" id="températureJour+${i}RessentiA"></i></p>
            </div>
        </div>
    </div>`
            }




            // MODIF INTERFACE DANS PLUSIEUR JOURS
            // DEMAIN
            document.getElementById("meteoJour+1M").src = `assets/img/${codeCielSemaine[0]}.png`   //MATIN
            document.getElementById("meteoJour+1A").src = `assets/img/${codeCielSemaine[1]}.png`   //APRES MIDI
            document.getElementById("températureJour+1M").innerText = `${tempSemaine[0]}°`
            document.getElementById("températureJour+1A").innerText = `${tempSemaine[1]}°`
            document.getElementById("températureJour+1RessentiM").innerText = `${tempSemaineRessent[0]}°`
            document.getElementById("températureJour+1RessentiA").innerText = `${tempSemaineRessent[1]}°`
            document.getElementById("ventJour+1M").innerText = `${ventSemaine[0]}`
            document.getElementById("ventJour+1A").innerText = `${ventSemaine[1]} km/h`

            // DANS 2 JOUR
            document.getElementById("meteoJour+2M").src = `assets/img/${codeCielSemaine[2]}.png`
            document.getElementById("meteoJour+2A").src = `assets/img/${codeCielSemaine[3]}.png`
            document.getElementById("températureJour+2M").innerText = `${tempSemaine[2]}°`
            document.getElementById("températureJour+2A").innerText = `${tempSemaine[3]}°`
            document.getElementById("températureJour+2RessentiM").innerText = `${tempSemaineRessent[2]}°`
            document.getElementById("températureJour+2RessentiA").innerText = `${tempSemaineRessent[3]}°`
            document.getElementById("ventJour+2M").innerText = `${ventSemaine[2]}`
            document.getElementById("ventJour+2A").innerText = `${ventSemaine[3]} km/h`


            //DANS 3 JOUR
            document.getElementById("meteoJour+3M").src = `assets/img/${codeCielSemaine[4]}.png`
            document.getElementById("meteoJour+3A").src = `assets/img/${codeCielSemaine[5]}.png`
            document.getElementById("températureJour+3M").innerText = `${tempSemaine[4]}°`
            document.getElementById("températureJour+3A").innerText = `${tempSemaine[5]}°`
            document.getElementById("températureJour+3RessentiM").innerText = `${tempSemaineRessent[4]}°`
            document.getElementById("températureJour+3RessentiA").innerText = `${tempSemaineRessent[5]}°`
            document.getElementById("ventJour+3M").innerText = `${ventSemaine[4]}`
            document.getElementById("ventJour+3A").innerText = `${ventSemaine[5]} km/h`

            //DANS 4 JOUR
            document.getElementById("meteoJour+4M").src = `assets/img/${codeCielSemaine[6]}.png`
            document.getElementById("meteoJour+4A").src = `assets/img/${codeCielSemaine[7]}.png`
            document.getElementById("températureJour+4M").innerText = `${tempSemaine[6]}°`
            document.getElementById("températureJour+4A").innerText = `${tempSemaine[7]}°`
            document.getElementById("températureJour+4RessentiM").innerText = `${tempSemaineRessent[6]}°`
            document.getElementById("températureJour+4RessentiA").innerText = `${tempSemaineRessent[7]}°`
            document.getElementById("ventJour+4M").innerText = `${ventSemaine[6]}`
            document.getElementById("ventJour+4A").innerText = `${ventSemaine[7]} km/h`


            //FONCTION (PENSER A REVENIR POUR CONFIG ORAGE ET NEIGE)
            function ciel(meteoItem) {
                let dansCiel = meteoItem.weather[0].main
                let nuage = meteoItem.clouds.all
                let pluie = meteoItem.weather[0].id
                if (dansCiel == "Clear") {
                    return "01"
                }
                if (dansCiel == "Clouds" && nuage < 50) {
                    return "02"
                }
                if (dansCiel == "Clouds" && nuage >= 50) {
                    return "03"
                }
                if (dansCiel == "Rain" && pluie <= 500) {
                    return "04"
                }
                if (dansCiel == "Rain" && pluie > 500) {
                    return "05"
                }

            }
            updateEtoile() // On change l'icône du bouton d'ajout aux favoris

        })
}
