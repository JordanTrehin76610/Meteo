let city = "2982653" //Rouelles
let zip = "76600"
let country = ""
let apiKey = "142fa27ef3629e56358aebb03acba4f1"
let langue = "fr"
let unite = "metric"
let url = `https://api.openweathermap.org/data/2.5/forecast?id=${city}&appid=${apiKey}&lang=${langue}&units=${unite}`

fetch(url)
    .then(response => response.json())
    .then(data => {

        console.log(data)
        meteo = data

        ville = meteo.city.name
        console.log(`ville visée: ${ville}`)

        tempMaintenant = Math.round(meteo.list[0].main.temp)

        const now = new Date()
        maintenant = [now.getHours(), now.getMinutes()]
        maintenant.splice(1, 0, "h")
        if (maintenant[2] < 10) {
            maintenant.splice(1, 0, 0)
        }
        if (maintenant[0] < 10) {
            maintenant.splice(0, 0, 0)
        }


        tempMaintenantRessent = Math.round(meteo.list[0].main.feels_like)

        ventMaintenant = Math.round((meteo.list[0].wind.speed) * 3.6)


        // HEURE A VENIR
        let heureAVenir = []
        let tempAVenir = []
        let tempAVenirRessent = []
        let ventAVenir = []
        let codeCielAVenir = []
        for (let i = 1; i <= 4; i++) {

            tempAVenir.push(Math.round((meteo.list[i].main.temp)))
            tempAVenirRessent.push(meteo.list[i].main.feels_like)
            ventAVenir.push(Math.round((meteo.list[i].wind.speed)*3.6))
            codeCielAVenir.push(ciel(i))
        }





        // DANS LA SEMAINE A VENIR (je peux avoir que 4 jours à l'avenir)
        let heureSemaine = []
        let tempSemaine = []
        let tempSemaineRessent = []
        let ventSemaine = []
        let codeCielSemaine = []

        //PLEIN DE IF POUR ESSAYER DE VISER LA JOURNEE VERS 15H (POUR CA QU'ON DEMARRE DE DIFFERENTE VALEUR AVEC I)
        if (maintenant[0] == 1 && maintenant[1] <= 3) {
            for (let i = 1; i < meteo.list.length; i = i + 4) {

                tempSemaine.push(Math.round(meteo.list[i].main.temp))
                tempSemaineRessent.push(Math.round(meteo.list[i].main.feels_like))
                ventSemaine.push(Math.round((meteo.list[i].wind.speed)*3.6))
                codeCielSemaine.push(ciel(i))

            }
        }
        else if (maintenant[0] == 0 && maintenant[1] <= 9 && maintenant[1] > 5) {
            for (let i = 2; i < meteo.list.length; i = i + 4) {

                tempSemaine.push(Math.round(meteo.list[i].main.temp))
                tempSemaineRessent.push(Math.round(meteo.list[i].main.feels_like))
                ventSemaine.push(Math.round((meteo.list[i].wind.speed)*3.6))
                codeCielSemaine.push(ciel(i))

            }
        }
        else if (maintenant[0] == 0 && maintenant[1] <= 5) {
            for (let i = 3; i < meteo.list.length; i = i + 4) {

                tempSemaine.push(Math.round(meteo.list[i].main.temp))
                tempSemaineRessent.push(Math.round(meteo.list[i].main.feels_like))
                ventSemaine.push(Math.round((meteo.list[i].wind.speed)*3.6))
                codeCielSemaine.push(ciel(i))

            }
        }
        else if ((maintenant[0] == 1 && maintenant[1] >= 9) || (maintenant[0] == 2)) {
            for (let i = 5; i < meteo.list.length; i = i + 4) {

                tempSemaine.push(Math.round(meteo.list[i].main.temp))
                tempSemaineRessent.push(Math.round(meteo.list[i].main.feels_like))
                ventSemaine.push(Math.round((meteo.list[i].wind.speed)*3.6))
                codeCielSemaine.push(ciel(i))


            }
        } else {
            for (let i = 0; i < meteo.list.length; i = i + 4) {

                tempSemaine.push(Math.round(meteo.list[i].main.temp))
                tempSemaineRessent.push(Math.round(meteo.list[i].main.feels_like))
                ventSemaine.push(Math.round((meteo.list[i].wind.speed)*3.6))
                codeCielSemaine.push(ciel(i))

            }
        }











        // MODIF INTERFACE MAINTENANT
        document.getElementById("ville").innerText = ville
        document.getElementById("heureMaintenant").innerText = maintenant.join("")
        document.getElementById("températureMaintenant").textContent += `${tempMaintenant}°`
        document.getElementById("températureMaintenantRessenti").innerText = `${tempMaintenantRessent}°`
        document.getElementById("ventMaintenant").innerText = `${ventMaintenant} km/h`
        codeCiel = ciel(0)
        document.getElementById("meteoMaintenant").src = `assets/img/${codeCiel}.png`





        // MODIF INTERFACE DANS PLUSIEUR HEURES
        document.getElementById("meteo3h").src = `assets/img/${codeCielAVenir[0]}.png`
        document.getElementById("température3h").innerText = `${tempAVenir[0]}°`
        document.getElementById("vent3h").innerText = `${ventAVenir[0]} km/h`
        document.getElementById("meteo6h").src = `assets/img/${codeCielAVenir[1]}.png`
        document.getElementById("température6h").innerText = `${tempAVenir[1]}°`
        document.getElementById("vent6h").innerText = `${ventAVenir[1]} km/h`
        document.getElementById("meteo9h").src = `assets/img/${codeCielAVenir[2]}.png`
        document.getElementById("température9h").innerText = `${tempAVenir[2]}°`
        document.getElementById("vent9h").innerText = `${ventAVenir[2]} km/h`
        document.getElementById("meteo12h").src = `assets/img/${codeCielAVenir[3]}.png`
        document.getElementById("température12h").innerText = `${tempAVenir[3]}°`
        document.getElementById("vent12h").innerText = `${ventAVenir[3]} km/h`





        // AJOUT DES JOURS SUIVANT
        for (let i = 1; i <= 4; i++) {
            if (i == 1) {
                jour = "Demain"
            } else if (i == 2) {
                jour = "Dans 2 jours"
            } else if (i == 3) {
                jour = "Dans 3 jours"
            } else if (i == 4) {
                jour = "Dans 4 jours"
            }
            document.getElementById("jourSuivant").innerHTML += `
        <p id="jour">${jour}</p>
        <div class="container text-center border border-dark my-5">
        <div class="row">
            <div class="col">
                <img src="assets/img/01.png" alt="météo jour +${i}M" class="iconeMeteo" id="meteoJour+${i}M">
                <img src="assets/img/01.png" alt="météo jour +${i}A" class="iconeMeteo" id="meteoJour+${i}A">
            </div>
            <div class="col">
                <p><i class="bi bi-thermometer-half" id="températureJour+${i}M"></i>/<i class="bi bi-thermometer-half" id="températureJour+${i}A"></i></p>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <p><i class="bi bi-wind" id="ventJour+${i}">Vitesse vent</i></p>
            </div>
            <div class="col">
                <p ><i class="bi bi-emoji-sunglasses" id="températureJour+${i}Ressenti"></i></p>
            </div>
        </div>
    </div>`
        }




        // MODIF INTERFACE DANS PLUSIEUR JOURS
        // DEMAIN
        document.getElementById("meteoJour+1M").src = `assets/img/${codeCielSemaine[1]}.png`   //MATIN
        document.getElementById("meteoJour+1A").src = `assets/img/${codeCielSemaine[2]}.png`   //APRES MIDI
        document.getElementById("températureJour+1M").innerText = `${tempSemaine[1]}°`
        document.getElementById("températureJour+1A").innerText = `${tempSemaine[2]}°`
        document.getElementById("températureJour+1Ressenti").innerText = `${tempSemaineRessent[1]}°`
        document.getElementById("ventJour+1").innerText = `${ventSemaine[1]} km/h`

        // DANS 2 JOUR
        document.getElementById("meteoJour+2M").src = `assets/img/${codeCielSemaine[3]}.png`
        document.getElementById("meteoJour+2A").src = `assets/img/${codeCielSemaine[4]}.png`
        document.getElementById("températureJour+2M").innerText = `${tempSemaine[3]}°`
        document.getElementById("températureJour+2A").innerText = `${tempSemaine[4]}°`
        document.getElementById("températureJour+2Ressenti").innerText = `${tempSemaineRessent[2]}°`
        document.getElementById("ventJour+2").innerText = `${ventSemaine[2]} km/h`


        //DANS 3 JOUR
        document.getElementById("meteoJour+3M").src = `assets/img/${codeCielSemaine[5]}.png`
        document.getElementById("meteoJour+3A").src = `assets/img/${codeCielSemaine[6]}.png`
        document.getElementById("températureJour+3M").innerText = `${tempSemaine[5]}°`
        document.getElementById("températureJour+3A").innerText = `${tempSemaine[6]}°`
        document.getElementById("températureJour+3Ressenti").innerText = `${tempSemaineRessent[3]}°`
        document.getElementById("ventJour+3").innerText = `${ventSemaine[3]} km/h`

        //DANS 4 JOUR
        document.getElementById("meteoJour+4M").src = `assets/img/${codeCielSemaine[7]}.png`
        document.getElementById("meteoJour+4A").src = `assets/img/${codeCielSemaine[8]}.png`
        document.getElementById("températureJour+4M").innerText = `${tempSemaine[7]}°`
        document.getElementById("températureJour+4A").innerText = `${tempSemaine[8]}°`
        document.getElementById("températureJour+4Ressenti").innerText = `${tempSemaineRessent[4]}°`
        document.getElementById("ventJour+4").innerText = `${ventSemaine[4]} km/h`



        function ciel(i) {
            dansCiel = meteo.list[i].weather[0].main
            nuage = meteo.list[i].clouds.all
            pluie = meteo.list[i].weather[0].id
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


