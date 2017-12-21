package br.com.dsin.valburguer.dao;

import java.sql.SQLException;
import java.util.Date;
import java.util.List;

import org.apache.commons.dbutils.handlers.BeanListHandler;

import br.com.dsin.valburguer.beans.CategoryBean;
import br.com.dsin.valburguer.beans.PlaceOrderBean;
import br.com.dsin.valburguer.beans.ProductBean;

public class OrderDAO extends BaseDAO {

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
	
	public void placeOrder(String userId, String orderId, List<PlaceOrderBean> order, Double totalPrice, Date date) throws SQLException {
		runner.update("insert into user_order (id, user_id, total_price, date_created) values (?,?,?,?)", new Object[] {orderId, userId, totalPrice, date});
		for (PlaceOrderBean placeOrder : order) {
			runner.update("insert into order_product (order_id, product_id, quantity) values (?,?,?)", orderId, placeOrder.getId(), placeOrder.getQuantity());
		}
	}
}
