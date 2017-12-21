package br.com.dsin.valburguer.resources;

import java.sql.SQLException;
import java.util.Date;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;

import org.apache.commons.codec.digest.DigestUtils;

import br.com.dsin.valburguer.dao.BaseDAO;
import br.com.dsin.valburguer.dao.LoginDAO;

@Path("/login")
public class LoginResource {
	@Context
	private HttpServletRequest request;
	
	private final static int resid = 1000;
	private final static LoginDAO loginDAO = new LoginDAO();
	
	@POST
	@Path("/signup")
	@Produces("application/json")
	public ResourceResponse signup(
		@FormParam("login") String login,
		@FormParam("password") String password,
		@FormParam("name") String name,
		@FormParam("phone") String phone,
		@FormParam("email") String email
	) {
		if (email != null && "".equals(email.trim())) {
			email = null;
		}
		
		ResourceResponse response = checkSignupFields(login, password, name, phone, email);
		if (response.getCode() != 0) {
			return response;
		}
		
		response.setData(login);
		
		try {
			if (loginDAO.checkLoginExists(login)) {
				response.setCode(resid+1);
				response.setMsg("O login "+login+" já está em uso...");
				return response;
			}
			
			String id = UUID.randomUUID().toString();
			String hashedPassword = DigestUtils.sha256Hex(password);
			loginDAO.createNewUser(id, login, hashedPassword, name, phone, email, new Date());
		} catch(SQLException e) {
			e.printStackTrace();
			response.setCode(resid);
			response.setMsg(BaseDAO.DEFAULT_DB_ERROR_MSG);
		}
		
		response.setCode(0);
		response.setMsg("Usuário cadastrado com sucesso!");
		return response;
	}
	
	private ResourceResponse checkSignupFields(String login, String password, String name, String phone, String email) {
		ResourceResponse response = new ResourceResponse();
		
		if (login == null || "".equals(login.trim()) || name == null || "".equals(name.trim()) || password == null || "".equals(password.trim()) || phone == null || "".equals(phone.trim())) {
			response.setCode(resid+2);
			response.setMsg("Um ou mais campos obrigatórios não foram preenchidos!");
		}
		
		if (phone.length() != 10 && phone.length() != 11 && !phone.matches("/^[0-9]^$/")) {
			response.setCode(resid+3);
			response.setMsg("O telefone informado não é válido!");
		}
		
		if (email != null && !email.toLowerCase().matches("^[_a-z0-9-\\+]+(\\.[_a-z0-9-]+)*@[a-z0-9-]+(\\.[a-z0-9]+)*(\\.[a-z]{2,})$")) {
			response.setCode(resid+4);
			response.setMsg("O email informado não é válido!");
		}
		
		return response;
	}
	
	@POST
	@Path("/signin")
	@Produces("application/json")
	public ResourceResponse signin(
		@FormParam("login") String login,
		@FormParam("password") String password
	) {
		ResourceResponse response = new ResourceResponse();
		
		if (login == null || password == null || "".equals(login.trim()) || "".equals(password.trim())) {
			response.setCode(resid+5);
			response.setMsg("Por favor, informe um nome de usuário e senha.");
			return response;
		}
		
		
		try {
			String hashedPassword = DigestUtils.sha256Hex(password);
			String id = loginDAO.auth(login, hashedPassword);
			if (id == null) {
				response.setCode(resid+6);
				response.setMsg("O usuário/senha informados estão incorretos!");
				return response;
			}
			
			request.getSession().setAttribute(BaseDAO.USER_SESSION_ATTR_KEY, id);
		} catch(SQLException e) {
			e.printStackTrace();
			response.setCode(resid);
			response.setMsg(BaseDAO.DEFAULT_DB_ERROR_MSG);
		}
		
		return response;
	}
	
	@POST
	@Path("/check_logged")
	@Produces("application/json")
	public ResourceResponse checkLogged() {
		ResourceResponse response = new ResourceResponse();
		
		String sessionId = (String) request.getSession().getAttribute(BaseDAO.USER_SESSION_ATTR_KEY);
		try {
			response.setData(loginDAO.checkValidSessionId(sessionId));
		} catch (SQLException e) {
			e.printStackTrace();
			response.setCode(resid);
			response.setMsg(BaseDAO.DEFAULT_DB_ERROR_MSG);
		}
		
		return response;
	}
	
	@POST
	@Path("/get_address")
	@Produces("application/json")
	public ResourceResponse getAddress() {
		ResourceResponse response = new ResourceResponse();
		
		String sessionId = (String) request.getSession().getAttribute(BaseDAO.USER_SESSION_ATTR_KEY);
		try {
			response.setData(loginDAO.getAddress(sessionId));
		} catch (SQLException e) {
			e.printStackTrace();
			response.setCode(resid);
			response.setMsg(BaseDAO.DEFAULT_DB_ERROR_MSG);
		}
		
		return response;
	}
}
