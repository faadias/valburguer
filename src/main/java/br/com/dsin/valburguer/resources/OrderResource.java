package br.com.dsin.valburguer.resources;

import java.sql.SQLException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;

import br.com.dsin.valburguer.beans.OrderBean;
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
	@Path("/list_orders")
	@Produces("application/json")
	public ResourceResponse listOrders() {
		ResourceResponse response = new ResourceResponse();
		
		String userId = (String) request.getSession().getAttribute(BaseDAO.USER_SESSION_ATTR_KEY);
		
		try {
			response.setData(orderDAO.getOrders(userId));
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
	public ResourceResponse placeOrder(OrderBean order) {
		ResourceResponse response = new ResourceResponse();
		
		String userId = (String) request.getSession().getAttribute(BaseDAO.USER_SESSION_ATTR_KEY);
		
		if (userId == null) {
			response.setCode(resid+1);
			response.setMsg("É preciso estar logado para fazer um pedido!");
			return response;
		}
		
		Set<String> validPaymentOptions = orderDAO.getPaymentOptions();
		
		if (
			order == null ||
			order.getProducts() == null ||
			order.getProducts().size() == 0 ||
			order.getAddress() == null ||
			"".equals(order.getAddress().trim()) ||
			order.getPayment() == null ||
			!validPaymentOptions.contains(order.getPayment())
		) {
			response.setCode(resid+2);
			response.setMsg("Não foi possível processar o seu pedido, pois um ou mais dados necessários não foram informados!");
			return response;
		}
		
		try {
			List<ProductBean> products = orderDAO.getProducts();
			Map<Integer, Double> productPriceMap = new HashMap<>();
			for(ProductBean product : products) {
				productPriceMap.put(product.getId(), product.getPrice());
			}
			
			Double totalPrice = 0.;
			for(ProductBean product : order.getProducts()) {
				totalPrice += productPriceMap.get(product.getId())*product.getQuantity();
			}
			
			if (order.getId() == null || "".equals(order.getId().trim())) {
				orderDAO.placeOrder(userId, UUID.randomUUID().toString(), order.getProducts(), totalPrice, new Date(), order.getAddress(), order.getPayment());
				response.setMsg("Pedido realizado com sucesso!");
			}
			else {
				String status = orderDAO.checkOrderIsUpdatable(order.getId());
				if (!"Recebido".equals(status)) {
					response.setCode(resid+3);
					response.setMsg("Não foi possível alterar o pedido, pois o mesmo está com status '"+status+"'!");
					return response;
				}
				orderDAO.updateOrder(userId, order.getId(), order.getProducts(), totalPrice, new Date(), order.getAddress(), order.getPayment());
				response.setMsg("Pedido atualizado com sucesso!");
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
			response.setCode(resid);
			response.setMsg(BaseDAO.DEFAULT_DB_ERROR_MSG);
		}
		
		return response;
	}
}
