package br.com.dsin.valburguer.dao;

import java.sql.SQLException;

import org.apache.commons.dbutils.handlers.ScalarHandler;

public class LoginDAO extends BaseDAO {

	public void createNewUser(String id, String login, String hashedPassword, String name, String phone, String email) throws SQLException {
		String sql = "insert into user values (?,?,?,?,?,?)";
		runner.update(sql, id, login, hashedPassword, name, phone, email);
	}
	
	public boolean checkLoginExists(String login) throws SQLException {
		String sql = "select exists(select 1 from user where login = ?)";
		ScalarHandler<Long> rsh = new ScalarHandler<>(1);
		return runner.query(sql, rsh, login) == 1;
	}
	
	public String auth(String login, String hashedPassword) throws SQLException {
		String sql = "select id from user where login = ? and password = ?";
		ScalarHandler<String> rsh = new ScalarHandler<>(1);
		return runner.query(sql, rsh, login, hashedPassword);
	}
	
	public boolean checkValidSessionId(String sessionId) throws SQLException {
		String sql = "select exists(select 1 from user where id = ?)";
		ScalarHandler<Long> rsh = new ScalarHandler<>(1);
		return runner.query(sql, rsh, sessionId) == 1;
	}
}
