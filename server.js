var express = require('express');
var https = require('https');
var path = require('path');
var app = express();
var _ = require("underscore");

// Host
var HOST 						= "https://api.mercadolibre.com/";
var API_URI 					= "sites/MLA/";
var PORT 						= 8080;

// Endpoints Mercado Libre
var SEARCH_ENDPOINT 			= "search?q=";
var ITEM_DETAIL_ENDPOINT 		= "items/";
var ITEM_DESCRIPTION_ENDPOINT 	= "/description";

app.use('/lib', express.static(__dirname + '/node_modules'));
app.use('/static', express.static('Public'));
		
app.get('/items/:id', function(req, res) {
	res.sendFile(__dirname + '/Public/Detalle/detalle.html');
});

app.get('/items', function(req, res) {
	res.sendFile(__dirname + '/Public/Busqueda/busqueda.html');

});

app.get('/', function (req, res) {
  	res.sendFile(__dirname + '/Public/index.html');
});

app.get('/api/items/:id', function(req, res) {
	res.setHeader("Content-Type", "application/json");
	var itemDescription = "";
	https.get(HOST + ITEM_DETAIL_ENDPOINT + req.params.id + ITEM_DESCRIPTION_ENDPOINT, function(response){
		var body = '';

		response.on('data', function(d){
			body += d;
		});

		response.on('end', function(){
			body = JSON.parse(body);
			itemDescription = (body.text != '') ? body.text : body.plain_text;

			https.get(HOST + ITEM_DETAIL_ENDPOINT + req.params.id, function(response){
				var body ='';

				response.on('data', function(d){
					body += d;
				});

				response.on('end', function(){
					body = JSON.parse(body);
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
								amount: Math.floor(body.price),
								decimals: (body.price+"").split(".")[1] || 0
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

		});

	});

})

app.get('/api/items', function (req, res) {
	res.setHeader("Content-Type", "application/json");

	https.get(HOST + API_URI + SEARCH_ENDPOINT + req.query.q, function(response){
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
			}

			for(var index = 0; index < results.length; index++) {
				items.push({
					id: results[index].id,
					title: results[index].title,
					price: {
						currency: results[index].currency_id,
						amount: Math.floor(results[index].price),
						decimals: (results[index].price+"").split(".")[1] || 0
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
});

app.listen(PORT, function () {
  console.log('Server running on: ' + PORT);
});

