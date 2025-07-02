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

        tempMaintenant = meteo.list[0].main.temp
        console.log(`température maintenant: ${tempMaintenant}`)

        heureMaintenant = meteo.list[0].dt_txt
        console.log(`Maintenant c'est: ${heureMaintenant}`)

        tempMaintenantRessent = meteo.list[0].main.feels_like
        console.log(`Température ressenti mainteant: ${tempMaintenantRessent}`)

        ventMaintenant = meteo.list[0].wind.speed
        console.log(`La vitesse du vent est de ${ventMaintenant} m/s dés maintenant`)


        // HEURE A VENIR
        let heureAVenir = []
        let tempAVenir = []
        let tempAVenirRessent = []
        let ventAVenir = []
        for (let i = 1; i <= 4; i++) {

            tempAVenir.push(meteo.list[i].main.temp)
            heureAVenir.push(meteo.list[i].dt_txt)
            tempAVenirRessent.push(meteo.list[i].main.feels_like)
            ventAVenir.push(meteo.list[i].wind.speed)
            console.log(`Dans ${i * 3}h,il sera ${heureAVenir[i - 1]}, la température sera de ${tempAVenir[i - 1]}, ressenti ${tempAVenirRessent[i - 1]} avec un vent de ${ventAVenir[i - 1]} m/s`)

        }



        // DANS LA SEMAINE A VENIR (je peux avoir que 4 jours à l'avenir)
        let heureSemaine = []
        let tempSemaine = []
        let tempSemaineRessent = []
        let ventSemaine = []
        for (let i = 1; i <= 7; i++) {

            tempSemaine.push(meteo.list[i * 8].main.temp)
            heureSemaine.push(meteo.list[i * 8].dt_txt)
            tempSemaineRessent.push(meteo.list[i * 8].main.feels_like)
            ventSemaine.push(meteo.list[i * 8].wind.speed)
            console.log(`Dans ${i} jours,il sera ${heureSemaine[i - 1]}, la température sera de ${tempSemaine[i - 1]}, ressenti ${tempSemaineRessent[i - 1]} avec un vent de ${ventSemaine[i - 1]} m/s`)

        }

        document.getElementById("ville").textContent = ville
    })
