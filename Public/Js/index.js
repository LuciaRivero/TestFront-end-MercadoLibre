
$(document).ready(function() {
	$("#buscar").bind("click", function(event) {
		event.preventDefault();
		var queryString = $("#buscarItem").val();

		$(".search").attr("action", "/items");
		$(".search").submit()
	});
});