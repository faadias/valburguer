package br.com.dsin.valburguer.dao;

import java.sql.SQLException;
import java.util.List;

import org.apache.commons.dbutils.handlers.BeanListHandler;

import br.com.dsin.valburguer.beans.ProductBean;
import br.com.dsin.valburguer.beans.CategoryBean;

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
}
