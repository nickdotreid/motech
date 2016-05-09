package org.motechproject.security.authentication;

import org.motechproject.commons.api.json.MotechJsonMessage;
import org.motechproject.osgi.web.extension.HttpRequestEnvironment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * A logout handler for logging users that log out from MOTECH.
 */
@Component("motechLogoutSuccessHandler")
public class MotechLogoutSuccessHandler implements LogoutHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(MotechLogoutSuccessHandler.class);

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response,
                       Authentication authentication) {
        LOGGER.info("User {} logged out", authentication == null ? "not_authenticated" : authentication.getName());
        if(HttpRequestEnvironment.isAjax(request)){
            response.setHeader("Content-Type", "application/json");
            MotechJsonMessage message = new MotechJsonMessage("SUCCESS");
            try{
                response.getWriter().write(message.toJson());
            } catch(IOException exception){
                LOGGER.error("Errror logging out User {} with Ajax", authentication == null ? "not_authenticated" : authentication.getName());
            }
        }
    }
}
