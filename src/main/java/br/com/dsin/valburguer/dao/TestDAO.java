package br.com.dsin.valburguer.dao;

import java.sql.SQLException;

import org.apache.commons.dbutils.handlers.ScalarHandler;

public class TestDAO extends BaseDAO {

	public Integer getNumberOne() throws SQLException {
		ScalarHandler<Integer> rsh = new ScalarHandler<>(1);
		Integer i = runner.query("select 1", rsh);
		
		return i;
	}
}
