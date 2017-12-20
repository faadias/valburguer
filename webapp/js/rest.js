class Rest {
	constructor(url) {
		this.url = url == null ? window.location.origin + "/valburguer/rest/" : url;
	}
	
	post(service, params) {
		return $.post(this.url+service, params).catch(() => $("#overlay").hide());
	}
}