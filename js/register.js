function register() {
    document.getElementById("register").addEventListener('click', function() {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if(xmlhttp.readyState === XMLHttpRequest.DONE && xmlhttp.status === 200){
                console.log('data', xmlhttp.responseText);
            }
        };
        xmlhttp.open('POST', '/register-ragnaroksj-wavechecker');
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify({
            email: document.getElementById("email").value
        }));
    });
}

function del(email) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if(xmlhttp.readyState === XMLHttpRequest.DONE && xmlhttp.status === 200){
            console.log('data', xmlhttp.responseText);
        }
    };
    xmlhttp.open('POST', '/delete-ragnaroksj-wavechecker');
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify({
        email: email
    }));
}

window.onload = function() {
    register();
}