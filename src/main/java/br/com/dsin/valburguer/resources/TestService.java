package br.com.dsin.valburguer.resources;

import java.sql.SQLException;

import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import br.com.dsin.valburguer.dao.TestDAO;

@Path("/test")
public class TestService {

	@POST
	@Path("/sum")
	@Produces("application/json")
	public ResourceResponse getMsg(@FormParam("a") int a, @FormParam("b") int b) {
		ResourceResponse r = new ResourceResponse();
		r.setData(a+b);
		
		TestDAO dao = new TestDAO();
		try {
			System.out.println(dao.getNumberOne());
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return r;
	}

}
