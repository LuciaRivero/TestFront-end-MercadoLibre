function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i=0; i<arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // in case params look like: list[]=thing1&list[]=thing2
      var paramNum = undefined;
      var paramName = a[0].replace(/\[\d*\]/, function(v) {
        paramNum = v.slice(1,-1);
        return '';
      });

      // set parameter value (use 'true' if empty)
      var paramValue = typeof(a[1])==='undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      paramValue = paramValue.toLowerCase();

      // if parameter name already exists
      if (obj[paramName]) {
        // convert value to array (if still string)
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]];
        }
        // if no array index number specified...
        if (typeof paramNum === 'undefined') {
          // put the value on the end of the array
          obj[paramName].push(paramValue);
        }
        // if array index number specified...
        else {
          // put the value at that index number
          obj[paramName][paramNum] = paramValue;
        }
      }
      // if param name doesn't exist yet, set it
      else {
        obj[paramName] = paramValue;
      }
    }
  }

  return obj;
}

function getItemID(url) {
  var pathName = url.pathname.split("/");
  return pathName.pop();
}

$(document).ready(function(){
  $("#buscar").bind("click", function(event) {
    event.preventDefault();
    var queryString = $("#buscarItem").val();

    $(".search").attr("action", "/items");
    $(".search").submit()
  });
  $.get("/api/items/" + getItemID(window.location), function(data, status){

    var html = 
    "<div class='item-image'>"+
      "<figure>"+
        "<img src='" + data.item.picture + "'width='500'>"+
      "</figure>"+
    "</div>"+
    "<div class='info-box'>"+
      "<div class='cantVend'>"+
        "<div class='status'>"+ data.item.condition  +" - </div>"+
        "<div class='cant'>" + data.item.sold_quantity + " Vendidos </div>"+
      "</div>"+
      "<div class='item-title'>"+
        "<h3>"+ data.item.title + "</h3>"+
      "</div>"+
      "<div class='item-price'> $ "+ data.item.price.amount +"<sup>"+data.item.price.decimals+"</sup>"+"</div>"+
      "<div class='item-pri-action'>"+
        "<button>Comprar</button>"+
      "</div>"+
    "</div>"+
    "<div class='item-description'>"+
      "<div class='descProduct'>"+
        "<h1>Descripción del producto</h2>"+
      "</div>"+
      "<div>"+
       data.item.description +
      "</div>"+
    "</div>"
  $(".itemDescrip").append(html); 
  });
});