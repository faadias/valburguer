const rest = new Rest();
const currencyFormatter = Intl.NumberFormat("pt-br", { style : "currency", currency : "BRL", currencyDisplay : "symbol" });

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 99;

let products = [];

$(document).ready(function() {
	$("#overlay").show();
	
	bindActions();
	
	Promise.all([
		rest.post("order/list_categories").then(handleCategories),
		rest.post("order/list_products").then(handleProducts)
	]).then(initScreen)
});

function bindActions() {
	$(".action-config").on("click", openSettings);
	
	$("nav > input").on("change", openSection);
	
	$("#menu-list").on("click", ".product-item", openProductDetails);
	
	$(".action-back").on("click", closeModal);
	
	$(".action-minus").on("click", changeQuantity);
	$(".action-plus").on("click", changeQuantity);
	
	$("#product-detail-modal .modal-action").click(addToCart);
}

function openSettings() {
	//TODO
	alert("Settings não implementado!");
}

function openSection() {
	let sectionId = $("nav > input:checked").attr("id").replace("nav-","");
	$("main > article#main > section").hide();
	$("#"+sectionId).show();
}

function openProductDetails(e) {
	let data = $(e.currentTarget).data();
	
	$("#product-detail-modal .product-id").val(data.id);
	$("#product-detail-modal .product-pic").attr("src", data.pic || "../imgs/nopic.png");
	$("#product-detail-modal .product-name").html(data.name);
	$("#product-detail-modal .product-description").html(data.description || "");
	$("#product-detail-modal .product-price").html(data.price);
	$("#product-detail-modal .order-obs").val("");
	
	$("#product-detail-modal").show();
}

function closeModal() {
	$("article.modal").hide();
}

function changeQuantity(e) {
	let increment = $(e.target).hasClass("action-minus") ? -1 : 1;
	let quantity = parseInt($(e.target.parentNode).children(".quantity").html());
	
	quantity = Math.min(Math.max(MIN_QUANTITY, quantity+increment), MAX_QUANTITY);
	$(e.target.parentNode).children(".quantity").html(quantity);
}

function handleCategories(response) {
	if (isRestError(response)) return;
	
	let categories = response.data;
	
	categories
		.sort((c1,c2) => c1.list_order - c2.list_order)
		.map(category => {
			let $categorySection = $("<div>")
							.addClass("category-section")
							.attr("id", `category-${category.id}`);
			$categorySection.append($("<label>").addClass("category-name").html(category.name));
			$categorySection.append($("<div>").addClass("products-list"));
			
			return $categorySection;
		})
		.forEach($categorySection => $("#menu-list").append($categorySection));
}

function handleProducts(response) {
	if (isRestError(response)) return;
	
	products = response.data.sort( (p1,p2) => p1.name.toLowerCase().localeCompare(p2.name.toLowerCase()));
}

function initScreen() {
	products.forEach(product => {
		let $item = $("<div>").addClass("product-item").data(product);
		
		let $pic = $("<img>").addClass("product-pic").attr("src", product.pic || "../imgs/nopic.png");
		
		let $info = $("<div>").addClass("product-info");
		$info.append($("<label>").addClass("product-name").html(product.name));
		$info.append($("<label>").addClass("product-price").html(currencyFormatter.format(product.price)));
		$info.append($("<div>").addClass("product-description").html(product.description));
		
		$item
			.append($pic)
			.append($info);
		
		$(`#category-${product.category_id} > .products-list`).append($item);
	});
	
	openSection();
	$("main").css("visibility", "visible");
	$("#overlay").hide();
}

function addToCart() {
	let id = parseInt($("#product-detail-modal .product-id").val());
	let quantity = parseInt($("#product-detail-modal .quantity").html());
	let obs = $("#product-detail-modal .order-obs").val();

	closeModal();
}

function isRestError(response) {
	$errorElement = $("#msg");
	
	if (response.code !== 0) {
		$errorElement.html(`${response.msg} (Cód. ${response.code})`);
		return true;
	}
	
	return false;
}

