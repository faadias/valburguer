package br.com.dsin.valburguer.dao;

import java.sql.SQLException;

import org.apache.commons.dbutils.handlers.ScalarHandler;

public class TestDAO extends BaseDAO {

	public Long getNumberOne() throws SQLException {
		ScalarHandler<Long> rsh = new ScalarHandler<>(1);
		Long i = runner.query("select 1", rsh);
		
		return i;
	}
}
