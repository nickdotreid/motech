package org.motechproject.server.web.controller;

import org.apache.commons.lang.StringUtils;
import org.joda.time.DateTime;
import org.motechproject.osgi.web.LocaleService;
import org.motechproject.server.startup.StartupManager;
import org.motechproject.server.web.form.UserInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.lang.management.ManagementFactory;
import java.net.InetAddress;
import java.net.UnknownHostException;

import static org.motechproject.commons.date.util.DateUtil.now;

/**
 * Main application controller. Responsible for retrieving information shared across the UI of different modules.
 * The view returned by this controller will embed the UI of the currently requested module.
 */
@Controller
@PreAuthorize("hasRole('viewUI')")
public class DashboardController {

    private StartupManager startupManager;
    private LocaleService localeService;

    @RequestMapping({"/index", "/", "/home"})
    public ModelAndView index(final HttpServletRequest request) {
        ModelAndView mav;

        // check if this is the first run
        if (startupManager.isConfigRequired()) {
            mav = new ModelAndView(Constants.REDIRECT_STARTUP);
        } else {
            mav = new ModelAndView("index");
            mav.addObject("isAccessDenied", false);
            mav.addObject("loginPage", false);
            String contextPath = request.getSession().getServletContext().getContextPath();

            if (StringUtils.isNotBlank(contextPath) && !"/".equals(contextPath)) {
                mav.addObject("contextPath", contextPath.substring(1) + "/");
            } else if (StringUtils.isBlank(contextPath) || "/".equals(contextPath)) {
                mav.addObject("contextPath", "");
            }
        }

        return mav;
    }

    @RequestMapping(value = "/accessdenied", method = RequestMethod.GET)
    public ModelAndView accessdenied(final HttpServletRequest request) {
        ModelAndView view = index(request);
        view.addObject("isAccessDenied", true);
        view.addObject("loginPage", false);
        return view;
    }

    @RequestMapping(value = "/gettime", method = RequestMethod.POST)
    @ResponseBody
    public DateTime getTime() {
        return now();
    }

    @RequestMapping(value = "/getUptime", method = RequestMethod.POST)
    @ResponseBody
    public DateTime getUptime() {
        return now().minus(ManagementFactory.getRuntimeMXBean().getUptime());
    }

    @RequestMapping(value = "/getUser", method = RequestMethod.POST)
    @ResponseBody
    public UserInfo getUser(HttpServletRequest request) {
        String lang = localeService.getUserLocale(request).getLanguage();
        boolean securityLaunch = request.getUserPrincipal() != null;
        String userName = securityLaunch ? request.getUserPrincipal().getName() : "Admin Mode";

        return new UserInfo(userName, securityLaunch, lang);
    }

    @RequestMapping(value = "/getNodeName", method = RequestMethod.POST)
    @ResponseBody
    public String getNodeName() throws UnknownHostException {
        InetAddress ip = InetAddress.getLocalHost();

        return '"' + ip.getHostName() + '"';
    }

    @Autowired
    public void setStartupManager(StartupManager startupManager) {
        this.startupManager = startupManager;
    }

    @Autowired
    public void setLocaleService(LocaleService localeService) {
        this.localeService = localeService;
    }
}
