package br.com.dsin.valburguer.resources;

import java.sql.SQLException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;

import br.com.dsin.valburguer.beans.PlaceOrderBean;
import br.com.dsin.valburguer.beans.ProductBean;
import br.com.dsin.valburguer.dao.BaseDAO;
import br.com.dsin.valburguer.dao.OrderDAO;

@Path("/order")
public class OrderResource {
	private final static int resid = 2000;
	private final static OrderDAO orderDAO = new OrderDAO();
	
	@Context
	private HttpServletRequest request;
	
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
	public ResourceResponse listProducts() {
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
	
	@POST
	@Path("/place")
	@Produces("application/json")
	@Consumes("application/json")
	public ResourceResponse placeOrder(List<PlaceOrderBean> order) {
		ResourceResponse response = new ResourceResponse();
		
		String id = (String) request.getSession().getAttribute(BaseDAO.USER_SESSION_ATTR_KEY);
		
		if (id == null) {
			response.setCode(resid+1);
			response.setMsg("É preciso estar logado para fazer um pedido!");
			return response;
		}
		
		try {
			List<ProductBean> products = orderDAO.getProducts();
			Map<Integer, Double> productPriceMap = new HashMap<>();
			for(ProductBean product : products) {
				productPriceMap.put(product.getId(), product.getPrice());
			}
			
			Double totalPrice = 0.;
			for(PlaceOrderBean placeOrder : order) {
				totalPrice += productPriceMap.get(placeOrder.getId())*placeOrder.getQuantity();
			}
			
			orderDAO.placeOrder(id, UUID.randomUUID().toString(), order, totalPrice, new Date());
		} catch (SQLException e) {
			e.printStackTrace();
			response.setCode(resid);
			response.setMsg(BaseDAO.DEFAULT_DB_ERROR_MSG);
		}
		
		return response;
	}
}
