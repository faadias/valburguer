class Rest {
	constructor(url) {
		this.url = url == null ? window.location.origin + "/valburguer/rest/" : url;
	}
	
	post(service, params, contentType="application/x-www-form-urlencoded") {
		return $.post({
			url : this.url+service,
			data : params,
			contentType : contentType
		}).catch(() => $("#overlay").hide());
	}
}