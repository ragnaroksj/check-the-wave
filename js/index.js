function getSelectValues(select) {
  var result = [];
  var options = select && select.options;
  var opt;

  for (var i=0, iLen=options.length; i<iLen; i++) {
    opt = options[i];

    if (opt.selected) {
      result.push(opt.value || opt.text);
    }
  }
  return result;
}

function register() {
    document.getElementById("register").addEventListener('click', function() {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if(xmlhttp.readyState === XMLHttpRequest.DONE && xmlhttp.status === 200){
                console.log('data', xmlhttp.responseText);
            }
        };
        xmlhttp.open('POST', '/register');
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify({
            email: document.getElementById("email").value
        }));
    });
}

function itemFilter(elm) {
    if(elm.name === 'weekType') {
        if(elm.checked) {
            document.querySelectorAll('.weekdays').forEach(function(item){
                item.setAttribute('class','item weekdays hide');
            });
        } else {
            document.querySelectorAll('.weekdays').forEach(function(item){
                item.setAttribute('class','item weekdays');
            });
        } 
    }else if(elm.name === 'numbers') {
       var allOptions = getSelectValues(document.getElementById('numbers'));
       var elms = document.getElementById('weekType').checked ?
        document.querySelectorAll('.weekends') : document.querySelectorAll('.item');

       elms.forEach(function(item) {
           if( allOptions.indexOf("0") !== -1  ) {
               item.setAttribute('class', 'item ' + item.dataset.weektype );
           } else if(allOptions.indexOf(item.dataset.number) === -1 ) {
               item.setAttribute('class','hide item ' + item.dataset.weektype);
            } else {
                item.setAttribute('class', 'item ' + item.dataset.weektype );
            }
        });
    }
}

window.onload = function() {
    register();
    
    setTimeout(() =>{
        window.location.reload(true);
    }, 30000);
}