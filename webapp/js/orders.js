const rest = new Rest();

$(document).ready(function() {
	$("#modal").show();
	
	bindActions();
	
	Promise.all([
		rest.post("order/list_categories").then(handleCategories),
		rest.post("order/list_products").then(handleProducts)
	]).then(function() {
		$(".content").css("visibility", "visible");
		$("#modal").hide();
	})
});

function bindActions() {
	$("#action-config").on("click", openSettings);
}

function openSettings() {
	//TODO
	alert("Settings não implementado!");
}

function handleCategories(response) {
	if (isRestError(response)) return;
	
	console.log(response.data);
}

function handleProducts(response) {
	if (isRestError(response)) return;
	
	console.log(response.data);
}

function isRestError(response) {
	$errorElement = $("#msg");
	
	if (response.code !== 0) {
		$errorElement.html(`${response.msg} (Cód. ${response.code})`);
		return true;
	}
	
	return false;
}

