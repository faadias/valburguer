const rest = new Rest();
const currencyFormatter = Intl.NumberFormat("pt-br", { style : "currency", currency : "BRL", currencyDisplay : "symbol" });
const dateFormatter = Intl.DateTimeFormat("pt-br", {
	year : "numeric", month : "numeric", day : "numeric",
	hour : "numeric", minute : "numeric", hour12 : false
})

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
		let total = Object.keys(localStorage)
			.filter(key => /[0-9]+/.test(key))
			.map(id => {
				let json = JSON.parse(localStorage.getItem(id));
				return json.price * json.quantity;
			})
			.reduce((acum,value) => acum+value, 0);
		
		updateCart(total);
	}
	
	$("#overlay").show();
	
	bindActions();
	
	Promise.all([
		rest.post("order/list_categories").then(handleCategories),
		rest.post("order/list_products").then(handleProducts)
	]).then(initScreen);
	
	rest.post("login/get_address")
		.then(response => {
			if (isRestError(response)) return;
			
			if (response.data != null) {
				$("delivery-address").val(response.data.trim());
			}
		});
	
	rest.post("order/list_orders")
		.then(response => {
			if (isRestError(response)) return;
			handleOrders(response.data);
		});
});

function bindActions() {
	$(".action-config").on("click", openSettings);
	
	$("nav > input").on("change", openSection);
	
	$("#menu-list").on("click", ".product-item", openProductDetails);
	
	$(".action-back").on("click", closeModal);
	
	$(".action-quantity").on("click", changeQuantity);
	
	$("#product-detail-modal").on("click", ".modal-action", addToCart);
	$("#product-detail-modal").on("change", ".quantity", updateOrderDetail);
	
	$("#action-cart").on("click", checkout);
	
	$("#order-checkout-modal").on("click", ".action-quantity", changeQuantity);
	
	$(".action-clear-cart").on("click", emptyCart);
	
	$(".action-place-order").on("click", placeOrder);
}

function openSettings() {
	//TODO
	alert("Settings não implementado!");
}

function updateOrderDetail(e) {
	let id = parseInt($("#product-detail-modal .product-id").val());
	let quantity = parseInt(e.target.value);
	
	let storedData = JSON.parse(localStorage.getItem(id));
	if (quantity <= 0 && storedData && confirm("Deseja remover este produto do carrinho?")) {
		localStorage.removeItem(id);
		updateCart(-storedData.quantity*storedData.price);
		closeModal();
		return;
	}
	
	e.target.value = quantity = Math.min(Math.max(MIN_QUANTITY,quantity), MAX_QUANTITY);
	let price = currencyToFloat($(e.delegateTarget).find(".product-price").html());
	$(e.delegateTarget).find(".product-total-price").html(currencyFormatter.format(quantity*price));
}

function openSection() {
	let sectionId = $("nav > input:checked").attr("id").replace("nav-","");
	$("main > article#main > section").hide();
	$("#"+sectionId).show();
}

function openProductDetails(e) {
	$("#msg").html("");
	localStorage.setItem("lastActivity", new Date().getTime());
	
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
	let increment = $(e.target).hasClass("action-minus") ? -1 : 1;
	let quantity = parseInt($(e.target.parentNode).children(".quantity").val()) + increment;
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

function handleOrders(orders) {
	console.log(orders);
	$("#orders-list").html("");
	
	orders.forEach(order => {
		let $orderItem = $("<div>").addClass("orders-list-item");
		let $orderItemHeader = $("<div>").addClass("order-item-header");
		$orderItemHeader.append($("<label>").addClass("order-number").html(order.order_number));
		$orderItemHeader.append($("<label>").addClass("order-status").html(order.status));
		$orderItemHeader.append($("<label>").addClass("order-date").html(dateFormatter.format(order.created_date)));
		
		$orderItem.append($orderItemHeader);
		
		let $productsList = $("<div>").addClass("order-products-list");
		
		order.products.forEach(product => {
			let $productItem = $("<div>").addClass("order-product-item");
			$productItem.append($("<label>").addClass("product-name").html(product.name));
			$productItem.append($("<label>").addClass("product-quantity").html(product.quantity));
			
			$productsList.append($productItem);
		});
		
		$orderItem.append($productsList);
		$orderItem.append($("<label>").addClass("order-total").html(currencyFormatter.format(order.total_price)));
		
		$("#orders-list").append($orderItem);
	});
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
	
	closeModal();
}

function updateCart(increment) {
	cartTotal += increment;
	$(".cart-total-price").html(currencyFormatter.format(cartTotal));
	
	if (cartTotal === 0) {
		$("#action-cart").addClass("disabled");
	}
	else {
		$("#action-cart").removeClass("disabled");
	}
}

function checkout() {
	if (cartTotal === 0) return;
	
	$("#msg").html("");
	$("#checkout-list").children().remove();
	
	let productsMap = new Map();
	products.forEach(product => productsMap.set(product.id, product));
	
	Object.keys(localStorage)
		.filter(key => /[0-9]+/.test(key))
		.map(id => parseInt(id))
		.forEach(id => {
			let product = productsMap.get(id);
			let orderData = JSON.parse(localStorage.getItem(id));
			
			let $item = $("<div>").addClass("checkout-item");
			let $totalPrice = $("<div>").addClass("product-total-price").html(currencyFormatter.format(orderData.quantity*product.price));
			
			$item.append($("<label>").addClass("product-name").html(product.name));
			$item.append($totalPrice);
			$item.append(buildQuantityController(orderData.quantity, function(e) {
				let quantity = parseInt(e.target.value);
				if (quantity <= 0 && confirm("Deseja remover este produto do carrinho?")) {
					$item.remove();
					
					localStorage.removeItem(id);
					updateCart(-orderData.quantity*orderData.price);
					
					if (cartTotal === 0) {
						closeModal();
						return;
					}
				}
				
				e.target.value = quantity = Math.min(Math.max(MIN_QUANTITY,quantity), MAX_QUANTITY);
				$totalPrice.html(currencyFormatter.format(quantity*product.price));
			}));
			
			$("#checkout-list").append($item);
		});
	
	$("#order-checkout-modal").show();
}

function buildQuantityController(quantity=1, onChangeCallback) {
	let $controller = $(
		`<div class="quantity-controller">
			<span class="action-minus action-quantity symbol-action"></span>
			<input type="text" class="quantity" value="${quantity}" />
			<span class="action-plus action-quantity symbol-action"></span>
		</div>`);
	
	$controller.children(".quantity").on("change", onChangeCallback);
	
	return $controller;
}

function placeOrder() {
	if (cartTotal === 0) return;
	
	let address = $("#delivery-address").val().trim();
	if (address === "") {
		alert("Forneça um endereço de entraga.");
		return;
	}
	
	let payment = $("#payment-methods input:radio").val().trim();
	if (payment === "") {
		alert("Informe a forma de pagamento.");
		return;
	}
	
	let products = Object.keys(localStorage)
		.filter(key => /[0-9]+/.test(key))
		.map(function(id) {
			let json = JSON.parse(localStorage.getItem(id));
			return { id : parseInt(id), quantity : json.quantity };
		});
	
	let order = {products, payment, address};
	
	closeModal();
	$("#overlay").show();
	rest.post("order/place", JSON.stringify(order), "application/json")
		.then(response => {
			$("#overlay").hide();
			
			if (isRestError(response)) return;
			
			emptyCart();
			$("#msg").html("Pedido realizado com sucesso!");
		});
}

function isRestError(response) {
	$errorElement = $("#msg");
	
	if (response.code !== 0) {
		$errorElement.html(`${response.msg} (Cód. ${response.code})`);
		return true;
	}
	
	return false;
}

