const rest = new Rest();
const currencyFormatter = Intl.NumberFormat("pt-br", { style : "currency", currency : "BRL", currencyDisplay : "symbol" });

let products = [];

$(document).ready(function() {
	$("#modal").show();
	
	bindActions();
	
	Promise.all([
		rest.post("order/list_categories").then(handleCategories),
		rest.post("order/list_products").then(handleProducts)
	]).then(initScreen)
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
	
	let categories = response.data;
	
	categories
		.sort((c1,c2) => c1.list_order - c2.list_order)
		.map(category => {
			let div = $("<div>")
							.addClass("category-container")
							.attr("id", `category-${category.id}`);
			div.append($("<label>").addClass("category-name").html(category.name));
			div.append($("<div>").addClass("products-list"));
			
			return div;
		})
		.forEach($div => $("#products-list").append($div));
}

function handleProducts(response) {
	if (isRestError(response)) return;
	
	products = response.data.sort( (p1,p2) => p1.name.toLowerCase().localeCompare(p2.name.toLowerCase()));
}

function initScreen() {
	products.forEach(product => {
		let $item = $("<div>").addClass("product-item");
		
		let $pic = $("<img>").attr("src", product.pic || "../imgs/nopic.png");
		
		let $info = $("<div>").addClass("product-info");
		$info.append($("<label>").addClass("product-name").html(product.name));
		$info.append($("<div>").addClass("product-description").html(product.description));
		$info.append($("<div>").addClass("product-price").html(currencyFormatter.format(product.price).replace(/R\$/,"R$ ")));
		
		$item
			.append($pic)
			.append($info);
		
		$(`#category-${product.category_id} > .products-list`).append($item);
	});
	
	$(".content").css("visibility", "visible");
	$("#modal").hide();
}

function isRestError(response) {
	$errorElement = $("#msg");
	
	if (response.code !== 0) {
		$errorElement.html(`${response.msg} (Cód. ${response.code})`);
		return true;
	}
	
	return false;
}

