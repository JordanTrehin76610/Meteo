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
                    console.log(`ville: ${city}, département: ${state} et pays: ${country}`)
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
    {
        city = document.getElementById("lieuxChoisie").value
        url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}&lang=${langue}&units=${unite}`

        // TEST SI LA VILLE EST VALIDE EN REGARDER SI L'URL RENVOIE UNE ERREUR 404
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                document.getElementById("ajoutRecherche").innerHTML = ""
                for (let i = 0; i < 5; i++) {
                    document.getElementById("ajoutRecherche").innerHTML += `
                        <a onclick="avoirLaMeteo('https://api.openweathermap.org/data/2.5/forecast?q=${data[i].name},${data[i].country}&appid=${apiKey}&lang=${langue}&units=${unite}')" id="result${i}" style="display: block">
                            <div class="container text-center rounded-4 my-5">
                                <div class="row">
                                    <div class="col-6">
                                        <p class="h3 my-4 ms-3" id="recherche${i}">city</p>
                                    </div>
                                    <div class="col-6">
                                        <p class="h3 my-4" id="recherchePays${i}">Pays</p>
                                    </div>
                                </div>
                            </div>
                        </a > `
                    document.getElementById(`recherche${i}`).textContent = data[i].name
                    document.getElementById(`recherchePays${i}`).textContent = data[i].country
                    essaieHTML(`https://api.openweathermap.org/data/2.5/forecast?q=${data[i].name},${data[i].country}&appid=${apiKey}&lang=${langue}&units=${unite}`, i)
                }
                
                // Enlève les doublons
                for (let i = 0; i < 5; i++) {
                    for(let o = i+1; o < 5; o++) {
                        if (document.getElementById(`recherchePays${i}`).textContent == document.getElementById(`recherchePays${o}`).textContent) {
                            document.getElementById(`result${i}`).style = "display: none"
                        }
                    }
                }

                document.getElementById(`corp`).style = "display: none"
                document.getElementById(`recherche`).style = "display: block"
            })
    }
}