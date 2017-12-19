package br.com.dsin.valburguer.dao;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import org.apache.commons.dbcp2.BasicDataSource;
import org.apache.commons.dbutils.QueryRunner;

public class BaseDAO {
	
	public final static String USER_SESSION_ATTR_KEY = "USERSESSIONID";
	public final static String DEFAULT_DB_ERROR_MSG="Um erro ocorreu durante o processamente da solicitação. Por favor, tente novamente. Se o problema persistir, contate o administrador do sistema.";
	private final static BasicDataSource ds;
	protected final static QueryRunner runner;
	
	static {
		ds = new BasicDataSource();
		runner = new QueryRunner(ds);
		
		try(InputStream is = BaseDAO.class.getClassLoader().getResourceAsStream("db.properties")) {
			Properties props = new Properties();
			props.load(is);
			
			ds.setDriverClassName(props.getProperty("driver"));
			ds.setUrl(props.getProperty("url"));
			ds.setUsername(props.getProperty("user"));
			ds.setPassword(props.getProperty("pwd"));
		} catch (IOException e) {
			e.printStackTrace();
			System.out.println("Não foi possível inicializar o conector do banco de dados!");
		}
	}
}
