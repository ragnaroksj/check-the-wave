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
    var f = document.getElementById('aIF');
    var sF = document.getElementById('stopRefresh');
    var cF = document.getElementById('contRefresh');
    var frequency = parseInt((f.value));
    var autoReload;
    if (!isNaN(frequency) && frequency !== 0) {
        autoReload = setTimeout(() =>{
            window.location.href = window.location.origin + '/' + document.getElementById('type').dataset.type + '/' + frequency;
        }, frequency * 1000);
    }

    f.addEventListener('change', function() {
        var newFre = parseInt(this.value);
        if (!isNaN(newFre)){
            if (newFre === 0) {
                clearTimeout(autoReload);
            } else {
                autoReload = setTimeout(() =>{
                    window.location.href = window.location.origin + '/' + document.getElementById('type').dataset.type + '/' + newFre;
                }, newFre * 1000);  
            }
        }
    });

    f.addEventListener('focus', function() {
        clearTimeout(autoReload);
    });

    f.addEventListener('blur', function() {
        var newFre = parseInt(this.value);
        if (!isNaN(newFre)){
            autoReload = setTimeout(() =>{
                window.location.href = window.location.origin + '/' + document.getElementById('type').dataset.type + '/' + newFre;
            }, newFre * 1000);  
        }
    });

    sF.addEventListener('click', function() {
        clearTimeout(autoReload);
        this.className += '-disabled';
        cF.className = 'nav cont-frequency';
    });

    cF.addEventListener('click', function() {
        var newFre = parseInt(f.value);
        if (!isNaN(newFre)){
            autoReload = setTimeout(() =>{
                window.location.href = window.location.origin + '/' + document.getElementById('type').dataset.type + '/' + newFre;
            }, newFre * 1000);  
        }
        this.className += '-disabled';
        sF.className = "nav stop-frequency";
    });

}