package br.com.dsin.valburguer.beans;

public class CategoryBean {
	private String id;
	private String name;
	private Long list_order;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Long getList_order() {
		return list_order;
	}
	public void setList_order(Long list_order) {
		this.list_order = list_order;
	}
}
