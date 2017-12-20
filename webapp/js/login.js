const rest = new Rest();

$(document).ready(function() {
	$("#overlay").show();
	
	bindActions();
	updateRequiredFieldPlaceholder();
	
	rest.post("login/check_logged")
		.then(function(response) {
			if (isRestError(response) || !response.data) {
				stayHere();
			}
			else {
				goToOrdersPage();
			}
		})
		.catch(stayHere);
});

function stayHere() {
	$(".content").css("visibility", "visible");
	$("#signin-container .login").focus();
	$("#overlay").hide();
}

function goToOrdersPage() {
	window.location = "./orders.html";
}

function bindActions() {
	$("#action-open-signup").on("click", showSignup);
	
	$("#action-open-signin").on("click", showSignin);
	
	$(".field.phone").mask("(00) 0000-0000#", {
		onKeyPress: function(phone, e, field, options) {
			const masks = ['(00) 0000-0000#', '(00) 00000-0000'];
			if (phone.length>14) field.mask(masks[1], options);
			else field.mask(masks[0], options);
		}
	});
	
	$("#signup-container :required").on("blur", clearRequiredFieldStyleWhenInformed);
	
	$("#signup-container .password").on("blur", checkPasswordsMatch);
	$("#signup-container .password-confirm").on("blur", checkPasswordsMatch);
	
	$("#signup-container .email").on("blur", checkValidEmail);
	$("#signup-container .phone").on("blur", checkValidPhone);
	
	$("#signup-container .phone").on("blur", checkValidPhone);
	
	
	$("#action-signup").on("click", signup);
	$("#action-signin").on("click", signin);
}

function showSignup() {
	$("#signin-container").hide();
	$("#signup-container").show();
}

function showSignin() {
	$("#signup-container").hide();
	$("#signin-container").show();
	$("#signin-container .login").focus();
}

function updateRequiredFieldPlaceholder() {
	$(":required").each(function(i, input) {
		let placeholder = $(input).attr("placeholder");
		if (placeholder.trim() !== "") {
			$(input).attr("placeholder", placeholder.trim() + "*");
		}
	});
}

function clearRequiredFieldStyleWhenInformed() {
	let value = $(this).val().trim();
	if (value !== "") {
		$(this).removeClass("invalid");
	}
}

function checkAllRequiredFields() {
	let allValid = true;
	
	$(":required").each(function(i, input) {
		let value = $(input).val().trim();
		if (value === "") {
			$(input).addClass("invalid");
			allValid = false;
		}
		else {
			$(input).removeClass("invalid");
		}
	});
	
	if (!allValid) {
		$("#signup-container .msg").html("Os campos marcados com * são obrigatórios!");
	}
	
	return allValid;
}

function checkPasswordsMatch() {
	let password = $("#signup-container .password").val();
	let passwordConfirm = $("#signup-container .password-confirm").val();
	
	if (password === "" && passwordConfirm === "") {
		return false;
	}
	
	if (password !== passwordConfirm) {
		$("#signup-container .password-confirm").addClass("invalid");
		$("#signup-container .msg").html("As senhas não conferem!");
		return false;
	}
	
	$("#signup-container .password-confirm").removeClass("invalid");
	$("#signup-container .msg").html("");
	
	return true;
}

function checkValidEmail() {
	let email = $("#signup-container .email").val().trim();
	
	const re = /^[_a-z0-9-+]+([.][_a-z0-9-]+)*@[a-z0-9-]+([.][a-z0-9]+)*([.][a-z]{2,})$/;
	let isValid = email === "" || re.test(email.toLowerCase());
	
	if (isValid) {
		$("#signup-container .email").removeClass("invalid");
		$("#signup-container .msg").html("");
	}
	else {
		$("#signup-container .email").addClass("invalid");
		$("#signup-container .msg").html("O email digitado não é válido!");
	}
	
	return isValid;
}

function checkValidPhone() {
	let phone = $("#signup-container .phone").val().replace(/[^0-9]/g,"");
	
	if (phone.length === 0) {
		return false;
	}
	
	let isValid = phone.length === 10 || phone.length === 11;
	
	if (isValid) {
		$("#signup-container .phone").removeClass("invalid");
		$("#signup-container .msg").html("");
	}
	else {
		$("#signup-container .phone").addClass("invalid");
		$("#signup-container .msg").html("O telefone digitado não é válido!");
	}
	
	return isValid;
}

function signup() {
	if ( !(checkAllRequiredFields() && checkPasswordsMatch() && checkValidPhone() && checkValidEmail()) ) return;
	
	$("#overlay").show();
	
	let login = $("#signup-container .login").val().trim();
	let name = $("#signup-container .name").val().trim();
	let password = $("#signup-container .password").val();
	let email = $("#signup-container .email").val().trim();
	let phone = $("#signup-container .phone").val().replace(/[^0-9]/g,"");
	
	rest
		.post("login/signup", {login,name,password,email,phone})
		.then(response => {
			$("#overlay").hide();
			
			if (isRestError(response, $("#signup-container .msg"))) return;
			
			$("#signin-container .msg").html(response.msg);
			$("#signin-container .login").val(response.data);
			showSignin();
		});
}

function signin() {
	let login = $("#signin-container .login").val();
	let password = $("#signin-container .password").val();
	
	if (login.trim() === "" || password.trim() === "") return;
	
	$("#overlay").show();
	
	rest
		.post("login/signin", {login,password})
		.then(response => {
			if (isRestError(response, $("#signin-container .msg"))) return;
			
			goToOrdersPage();
		});
}

function isRestError(response, $errorElement) {
	if (response.code !== 0) {
		if ($errorElement) $errorElement.html(`${response.msg} (Cód. ${response.code})`);
		return true;
	}
	
	return false;
}