var express = require('express');
var https = require('https');
var path = require('path');
var app = express();
var _ = require("underscore");

// Host
var HOST 						= "https://api.mercadolibre.com/";
var API_URI 					= "sites/MLA/";

// Endpoints Mercado Libre
var SEARCH_ENDPOINT 			= "search?q=:";
var ITEM_DETAIL_ENDPOINT 		= "items/";
var ITEM_DESCRIPTION_ENDPOINT 	= "/description";

app.use('/lib', express.static(__dirname + '/node_modules'));
app.use('/static', express.static('Public'));

app.get('/', function (req, res) {
	console.log(req.query);
  	res.sendFile(__dirname + '/Public/index.html');
});
		
app.get('/items', function(req, res) {
	console.log("pase por search");
	res.sendFile(__dirname + '/Public/Busqueda/busqueda.html');
});

app.get('/detalle', function(req, res) {
	console.log("detalleasdasd");
	res.sendFile(__dirname + '/Public/Detalle/detalle.html');

});

app.get('/detalle/:id', function(req, res) {
	res.setHeader("Content-Type", "application/json");
	var itemDescription = "";

	https.get(HOST + ITEM_DETAIL_ENDPOINT + req.params.id + ITEM_DESCRIPTION_ENDPOINT, function(response){
		var body = '';
		console.log("obtengo description")
		response.on('data', function(d){
			console.log("d " + d)
			body +=d;
		});

		response.on('end', function(){
			body = JSON.parse(body);
			itemDescription = body.text;
			console.log("descr "+itemDescription)

		});

	});

	https.get(HOST + API_URI + ITEM_DETAIL_ENDPOINT + req.params.id, function(response){
		var body ='';

		response.on('data', function(d){
			body +=d;
		});

		response.on('end', function(){
			body = JSON.parse(body);
			console.log("description 2" + itemDescription)
			var jsonResponse = JSON.stringify({
				author: {
					name: "Lucia",
					lastname: "Rivero"
				},
				item: {
					id: body.id,
					title: body.title,
					price: {
						currency: body.currency_id,
						amount: body.price,
						decimals: 0
					},
					picture: body.thumbnail,
					condition: body.condition,
					/*free_shipping: body.shipping.free_shipping,*/
					sold_quantity: body.sold_quantity,
					description: itemDescription 
				}
			});

			res.send(jsonResponse);
		});

	});
})


app.get('/items/:q', function (req, res) {
	res.setHeader("Content-Type", "application/json");

	//validar parámetro q
	// si es nulo devolver html con error
	https.get(HOST + API_URI + SEARCH_ENDPOINT + req.params.q, function(response){
		var body ='';

		response.on('data', function(d){
			body +=d;
		});

		response.on('end', function(){
			body = JSON.parse(body);

			var filters = body.filters;
			var results = body.results;
			var categories = [];
			var items = [];

			var filtered = _.where(filters, {id: "category"});
			var path_from_root = filtered[0].values[0].path_from_root; 

			for(var i = 0; i < path_from_root.length; i++) {
				categories.push(path_from_root[i].name);
				console.log(path_from_root[i].name);
			}

			for(var index = 0; index < results.length; index++) {
				items.push({
					id: results[index].id,
					title: results[index].title,
					price: {
						currency: results[index].currency_id,
						amount: results[index].price,
						decimals: 0
					},
					picture: results[index].thumbnail,
					condition: results[index].condition,
					free_shipping: results[index].shipping.free_shipping
				});
			}

			var jsonResponse = JSON.stringify({
				author: {
					name: "Lucia",
					lastname: "Rivero"
				},
				categories: categories,
				items: items
			});

			res.send(jsonResponse);
		});
	});
	//armar json para devolver al front
	//res.sendFile(__dirname + '/Public/Busqueda/busqueda.html');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

