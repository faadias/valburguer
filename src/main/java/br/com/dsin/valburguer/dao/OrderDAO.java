package br.com.dsin.valburguer.dao;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.dbutils.handlers.BeanListHandler;
import org.apache.commons.dbutils.handlers.MapListHandler;

import br.com.dsin.valburguer.beans.CategoryBean;
import br.com.dsin.valburguer.beans.OrderBean;
import br.com.dsin.valburguer.beans.ProductBean;

public class OrderDAO extends BaseDAO {
	
	private static final Set<String> paymentOptions = new HashSet<String>(Arrays.asList(new String[] {"CC","CD","DC","VO","VR"}));
	
	public Set<String> getPaymentOptions() {
		return paymentOptions;
	}
	
	public List<CategoryBean> getCategories() throws SQLException {
		String sql = "select * from category";
		BeanListHandler<CategoryBean> rsh = new BeanListHandler<>(CategoryBean.class);
		return runner.query(sql, rsh);
	}
	
	public List<ProductBean> getProducts() throws SQLException {
		String sql = "select * from product";
		BeanListHandler<ProductBean> rsh = new BeanListHandler<>(ProductBean.class);
		return runner.query(sql, rsh);
	}
	
	public List<OrderBean> getOrders(String userId) throws SQLException {
		String sql = "SELECT " + 
				"	o.id, " +
				"	p.name, " + 
				"	op.quantity, " + 
				"	o.total_price, " + 
				"	o.date_created, " + 
				"	o.order_number, " +
				"	o.address, " + 
				"	o.payment, " + 
				"	o.status " + 
				"FROM " + 
				"	order_product op, " + 
				"	user_order o, " + 
				"	product p " + 
				"WHERE " + 
				"	op.order_id = o.id and " + 
				"	op.product_id = p.id and " +
				"	o.user_id = ? " +
				"ORDER BY " + 
				"	o.order_number, " + 
				"	p.name ";
		
		List<OrderBean> orders = new ArrayList<>();
		
		MapListHandler rsh = new MapListHandler();
		
		List<Map<String, Object>> rows = runner.query(sql, rsh, userId);
		
		Integer lastOrderNumber = -1;
		OrderBean orderBean = null;
		for(Map<String, Object> row : rows) {
			String orderId = (String) row.get("id");
			String producName = (String) row.get("name");
			Integer quantity = (Integer) row.get("quantity");
			Double totalPrice = ((BigDecimal) row.get("total_price")).doubleValue();
			Date dateCreated = (Date) row.get("date_created");
			Integer orderNumber = (Integer) row.get("order_number");
			String status = (String) row.get("status");
			String address = (String) row.get("address");
			String payment = (String) row.get("payment");
			
			if (lastOrderNumber.intValue() != orderNumber.intValue()) {
				lastOrderNumber = orderNumber.intValue();
				orderBean = new OrderBean();
				orderBean.setId(orderId);
				orderBean.setTotal_price(totalPrice);
				orderBean.setDate_created(dateCreated);
				orderBean.setOrder_number(orderNumber);
				orderBean.setStatus(status);
				orderBean.setPayment(payment);
				orderBean.setAddress(address);
				orderBean.setProducts(new ArrayList<ProductBean>());
				orders.add(orderBean);
			}
			
			ProductBean productBean = new ProductBean();
			productBean.setName(producName);
			productBean.setQuantity(quantity);
			orderBean.getProducts().add(productBean);
		}
		
		return orders;
	}
	
	public void placeOrder(String userId, String orderId, List<ProductBean> products, Double totalPrice, Date date, String address, String payment) throws SQLException {
		//FIXME rodar dentro de uma transação
		runner.update("insert into user_order (id, user_id, total_price, date_created, address, payment) values (?,?,?,?,?,?)", orderId, userId, totalPrice, date, address, payment);
		for (ProductBean product : products) {
			runner.update("insert into order_product (order_id, product_id, quantity) values (?,?,?)", orderId, product.getId(), product.getQuantity());
		}
		
		runner.update("update user set address = ? where id = ? and (address is null or address = '')", address, userId);
	}
}
