package br.com.dsin.valburguer.dao;

import java.sql.SQLException;
import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.dbutils.handlers.BeanListHandler;

import br.com.dsin.valburguer.beans.CategoryBean;
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
	
	public void placeOrder(String userId, String orderId, List<ProductBean> products, Double totalPrice, Date date, String address, String payment) throws SQLException {
		//FIXME rodar dentro de uma transação
		runner.update("insert into user_order (id, user_id, total_price, date_created, address, payment) values (?,?,?,?,?,?)", orderId, userId, totalPrice, date, address, payment);
		for (ProductBean product : products) {
			runner.update("insert into order_product (order_id, product_id, quantity) values (?,?,?)", orderId, product.getId(), product.getQuantity());
		}
		
		runner.update("update user set address = ? where id = ? and (address is null or address = '')", address, userId);
	}
}
