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

$(document).ready(function(){
	var queryString = getAllUrlParams();

	$.get("/items/" + queryString.search, function(data, status) {
		var items = data.items;
		var categories = data.categories;

		//recorrer arreglo de categorias
		// appendear cada categoria en el html de busqueda
		//sconsole.log(data.categories); //contiene todas las categorias
		for (var i = 0; i < categories.length; i++) {
			var categ = categories[i];
			var categorias = 
				
				"<li>"+
					"<span>"+categ+"</span>"+
				"</li>"+
				console.log(categ);
		}
		$(".category").append(categorias);

		for (var i = 0; i < items.length; i++) {
			var itemData = items[i];
			var item = "<li class='list-item'>"+
						"<div>"+
							"<div class='img-box'>"+
								"<a href='detalle?id=" + itemData.id + "'>"+
									"<figure>"+"<img src='" + itemData.picture + "'>"+"</figure>"+
								"</a>"+
							"</div>"+
							"<div class='details-box'>"+
								"<div class='location'>"+"asdasd"+"</div>"+
								"<div class='price'>"+"<span>"+"$"+ itemData.price.amount+"<sup>"+""+"</sup>"+"</span>"+"</div>"+
								"<h2 class='tittle'>"+"<a href='detalle?id=" + itemData.title + "'>"+ itemData.title +"</a>"+"</h2>"+
							"</div>"+
						"</div>"+				
					"</li>";

			$(".list").append(item);
		}
	});	
});