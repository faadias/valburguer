package br.com.dsin.valburguer.resources;

import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

@Path("/login")
public class LoginService {

	@POST
	@Path("/signup")
	@Produces("application/json")
	public ResourceResponse signup(@FormParam("login") String login, @FormParam("password") String password, @FormParam("phone") String phone, @FormParam("email") String email) {
		if (email != null && "".equals(email.trim())) {
			email = null;
		}
		
		ResourceResponse response = checkSignupFields(login, password, phone, email);
		response.setData(login);
		
		//TODO salvar no banco de dados
		
		return response;
	}
	
	private ResourceResponse checkSignupFields(String login, String password, String phone, String email) {
		ResourceResponse response = new ResourceResponse();
		
		if (login == null || "".equals(login.trim()) || password == null || "".equals(password.trim()) || phone == null || "".equals(phone.trim())) {
			response.setCode(101);
			response.setMsg("Um ou mais campos obrigatórios não foram preenchidos!");
		}
		
		if (phone.length() != 10 && phone.length() != 11 && !phone.matches("/^[0-9]^$/")) {
			response.setCode(102);
			response.setMsg("O telefone informado não é válido!");
		}
		
		if (email != null && !email.toLowerCase().matches("^[_a-z0-9-\\+]+(\\.[_a-z0-9-]+)*@[a-z0-9-]+(\\.[a-z0-9]+)*(\\.[a-z]{2,})$")) {
			response.setCode(103);
			response.setMsg("O email informado não é válido!");
		}
		
		return response;
	}
}
