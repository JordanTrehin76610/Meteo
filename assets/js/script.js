let city = ""
let zip = ""
let country = ""
let apiKey = "142fa27ef3629e56358aebb03acba4f1"
let langue = "fr"
let unite = "metric"
let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=${langue}&units=${unite}`
let latitude = 1000
let longitude = 1000

geolocation()


function geolocation() {


    if (confirm("Voulez-vous activer la geolocalition ? (Activer position si oui)") == true) {
        while (latitude == 1000 || longitude == 1000) {
            navigator.geolocation.getCurrentPosition((position) => {

                latitude = position.coords.latitude //Je choppe la latitude
                longitude = position.coords.longitude // Je choppe la longitude
                urlCity = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=${apiKey}` // Je m'en sert et ça me retourne un JSON

                fetch(urlCity)
                    .then(response => response.json())
                    .then(data => {

                        console.log(data)

                        //JSON que j'exploite pour chopper le lieu le plus proche
                        city = data[0].name
                        state = data[0].state
                        country = data[0].country
                        console.log(`ville: ${city}, state: ${state} et country: ${country}`)
                        url = `http://api.openweathermap.org/data/2.5/forecast?q=${city},${state},${country}&appid=${apiKey}&lang=${langue}&units=${unite}`
                        if (latitude == 1000 || longitude == 1000) {
                            alert("ACTIVE TA POSITION")
                        } else {
                            avoirLaMeteo(url)
                        }
                    })
            })
        }
    } else {
        city = "aucun" //Commune française, c rigolo ^^
        url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=${langue}&units=${unite}`
        console.log("ville par défault activé")
        avoirLaMeteo(url)
    }
}




function lieux() {
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
}




function avoirLaMeteo(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {

            console.log(data)
            let meteo = data

            let ville = meteo.city.name
            console.log(`ville visée: ${ville}`)

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
                if (dansCiel == "Rain" && pluie == 500) {
                    return "04"
                }
                if (dansCiel == "Rain" && pluie > 500) {
                    return "05"
                }

            }

        })
}
