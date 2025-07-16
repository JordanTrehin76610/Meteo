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