async function essaieHTML(url, i) {
    try {
        const response = await fetch(url);

        if (response.ok) {
            console.log(url)
        } else {
            console.error('Failed');
            document.getElementById(`result${i}`).style = "display: none"
        }
    } catch {
        console.error('Promise rejected');
    }
}
