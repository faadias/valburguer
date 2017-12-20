const rest = new Rest();
const currencyFormatter = Intl.NumberFormat("pt-br", { style : "currency", currency : "BRL", currencyDisplay : "symbol" });

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 99;
const IDLE_TIME_BEFORE_CLEAR_CART_IN_MS = 1000*60*15; //15 minutos

let cartTotal = 0;
let products = [];

$(document).ready(function() {
	let lastActivity = localStorage.getItem("lastActivity");
	if (lastActivity == null || new Date().getTime() - parseInt(lastActivity) > IDLE_TIME_BEFORE_CLEAR_CART_IN_MS) {
		localStorage.clear();
	}
	else {
		localStorage.removeItem("lastActivity");
		let total = Object.keys(localStorage)
			.map(id => {
				let json = JSON.parse(localStorage.getItem(id));
				return json.price * json.quantity;
			})
			.reduce((acum,value) => acum+value, 0);
		
		updateCart(total);
	}
	
	localStorage.setItem("lastActivity", new Date().getTime());
	
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
	
	$("#product-detail-modal").on("click", ".action-minus", changeQuantity);
	$("#product-detail-modal").on("click", ".action-plus", changeQuantity);
	
	$("#product-detail-modal").on("click", ".modal-action", addToCart);
	$("#product-detail-modal").on("change", ".quantity", updateTotalPrice);
}

function openSettings() {
	//TODO
	alert("Settings não implementado!");
}

function updateTotalPrice(e) {
	let quantity = parseInt(e.target.value);
	let price = currencyToFloat($(e.delegateTarget).find(".product-price").html());
	$(e.delegateTarget).find(".product-total-price").html(currencyFormatter.format(quantity*price));
}

function openSection() {
	let sectionId = $("nav > input:checked").attr("id").replace("nav-","");
	$("main > article#main > section").hide();
	$("#"+sectionId).show();
}

function openProductDetails(e) {
	let data = $(e.currentTarget).data();
	
	let storedData = JSON.parse(localStorage.getItem(data.id)) || {quantity : MIN_QUANTITY, obs : ""};
	$("#product-detail-modal .product-obs").val(storedData.obs);
	$("#product-detail-modal .quantity").val(storedData.quantity);
	
	$("#product-detail-modal .product-id").val(data.id);
	$("#product-detail-modal .product-pic").attr("src", data.pic || "../imgs/nopic.png");
	$("#product-detail-modal .product-name").html(data.name);
	$("#product-detail-modal .product-description").html(data.description || "");
	$("#product-detail-modal .product-price").html(currencyFormatter.format(data.price));
	$("#product-detail-modal .product-total-price").html(currencyFormatter.format(data.price*storedData.quantity));
	
	$("#product-detail-modal").show();
}

function closeModal() {
	$("article.modal").hide();
}

function currencyToFloat(currency) {
	return parseFloat(currency.replace(",",".").replace(/[^0-9.]/g,""));
}

function changeQuantity(e) {
	let $context = $(e.delegateTarget);
	let increment = $(e.target).hasClass("action-minus") ? -1 : 1;
	let quantity = parseInt($(e.target.parentNode).children(".quantity").val()) + increment;
	let id = parseInt($context.find(".product-id").val());
	
	let storedData = JSON.parse(localStorage.getItem(id));
	if (quantity <= 0 && storedData && confirm("Deseja remover este produto do carrinho?")) {
		localStorage.removeItem(id);
		updateCart(-storedData.quantity*storedData.price);
		closeModal();
		return;
	}
	
	quantity = Math.max(Math.min(quantity, MAX_QUANTITY), MIN_QUANTITY);
	$(e.target.parentNode).children(".quantity").val(quantity).change();
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
	let price = currencyToFloat($("#product-detail-modal .product-price").html());
	let quantity = parseInt($("#product-detail-modal .quantity").val());
	let obs = $("#product-detail-modal .product-obs").val();
	
	let data = JSON.parse(localStorage.getItem(id));
	if (data !== null) {
		updateCart(-data.quantity*data.price);
	}
	
	localStorage.setItem(id, JSON.stringify({quantity, obs, price}));
	
	updateCart(quantity*price);
	
	closeModal();
}

function emptyCart() {
	localStorage.clear();
	updateCart(-cartTotal);
}

function updateCart(increment) {
	cartTotal += increment;
	$("#cart-total-price").html(currencyFormatter.format(cartTotal));
	
	if (cartTotal === 0) {
		$("#action-cart").addClass("disabled");
	}
	else {
		$("#action-cart").removeClass("disabled");
	}
}

function isRestError(response) {
	$errorElement = $("#msg");
	
	if (response.code !== 0) {
		$errorElement.html(`${response.msg} (Cód. ${response.code})`);
		return true;
	}
	
	return false;
}

