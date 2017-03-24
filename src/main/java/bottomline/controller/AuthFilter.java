package bottomline.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by raft on 24.03.2017.
 */
@Component
public class AuthFilter extends OncePerRequestFilter {

    private static final Logger LOG = LoggerFactory.getLogger(GroupController.class);
    public static final String USER_HEADER = "user";


    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, FilterChain filterChain) throws ServletException, IOException {
        LOG.debug("Filter internal");
        if (httpServletRequest.getHeader(USER_HEADER) != null) {
            filterChain.doFilter(httpServletRequest, httpServletResponse);
        }
    }
}
