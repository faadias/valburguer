package br.com.dsin.valburguer.filters;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import br.com.dsin.valburguer.dao.BaseDAO;

public class AuthFilter implements Filter {

	@Override
	public void destroy() {
		// TODO Auto-generated method stub

	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		
		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse res = (HttpServletResponse) response;
		
		if (req.getRequestURI().contains("login")) {
			chain.doFilter(request, response);
		}
		else {
			HttpSession session = req.getSession(false);
			String sessionId = session != null ? (String) session.getAttribute(BaseDAO.USER_SESSION_ATTR_KEY) : null;
			
			if (sessionId != null && !"".equals(sessionId)) {
				chain.doFilter(request, response);
			}
			else {
				res.sendRedirect(req.getContextPath());
			}
		}
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
		// TODO Auto-generated method stub

	}

}
