package br.com.dsin.valburguer.resources;

import java.sql.SQLException;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import br.com.dsin.valburguer.dao.BaseDAO;
import br.com.dsin.valburguer.dao.OrderDAO;

@Path("/order")
public class OrderResource {
	private final static int resid = 2000;
	private final static OrderDAO orderDAO = new OrderDAO();
	
	@POST
	@Path("/list_categories")
	@Produces("application/json")
	public ResourceResponse listCategories() {
		ResourceResponse response = new ResourceResponse();
		
		try {
			response.setData(orderDAO.getCategories());
		} catch (SQLException e) {
			e.printStackTrace();
			response.setCode(resid);
			response.setMsg(BaseDAO.DEFAULT_DB_ERROR_MSG);
		}
		
		return response;
	}
	
	@POST
	@Path("/list_products")
	@Produces("application/json")
	public ResourceResponse signin() {
		ResourceResponse response = new ResourceResponse();
		
		try {
			response.setData(orderDAO.getProducts());
		} catch (SQLException e) {
			e.printStackTrace();
			response.setCode(resid);
			response.setMsg(BaseDAO.DEFAULT_DB_ERROR_MSG);
		}
		
		return response;
	}
}
