package org.motechproject.server.ui.impl;

import org.apache.commons.lang.LocaleUtils;
import org.apache.commons.lang.WordUtils;
import org.eclipse.gemini.blueprint.context.BundleContextAware;
import org.motechproject.security.service.MotechUserService;
import org.motechproject.server.ui.LocaleSettings;
import org.osgi.framework.BundleContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.i18n.CookieLocaleResolver;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Enumeration;
import java.util.Locale;
import java.util.NavigableMap;
import java.util.TreeMap;

@Service
public class LocaleSettingsImpl implements LocaleSettings, BundleContextAware {
    private static final String I18N_RESOURCES_PATH = "webapp/messages/";

    @Autowired
    private BundleContext bundleContext;

    @Autowired
    private MotechUserService userService;

    @Autowired
    private CookieLocaleResolver cookieLocaleResolver;

    @Override
    public Locale getUserLocale(final HttpServletRequest request) {
        if(request.getUserPrincipal() == null) {
            return cookieLocaleResolver.resolveLocale(request);
        }
        return userService.getLocale(request.getUserPrincipal().getName());
    }

    @Override
    public void setUserLocale(final HttpServletRequest request, final HttpServletResponse response, final Locale locale) {
        SecurityContext context = (SecurityContext) request.getSession().getAttribute("SPRING_SECURITY_CONTEXT");
        Authentication authentication = context.getAuthentication();
        User userInSession = (User) authentication.getPrincipal();
        userService.setLocale(userInSession.getUsername(), locale);
        cookieLocaleResolver.setLocale(request, response, locale);
    }

    @Override
    public NavigableMap<String, String> getAvailableLanguages() {
        NavigableMap<String, String> languages = new TreeMap<>();
        Enumeration<String> resources = bundleContext.getBundle().getEntryPaths(I18N_RESOURCES_PATH);

        while (resources.hasMoreElements()) {
            String file = resources.nextElement().replace(I18N_RESOURCES_PATH, "");

            int underscore = file.indexOf('_');
            int dot = file.lastIndexOf('.');

            if (underscore != -1 && dot != -1) {
                String langShort = file.substring(underscore + 1, dot);
                Locale locale = LocaleUtils.toLocale(langShort);
                String langFull = WordUtils.capitalize(locale.getDisplayLanguage(locale));
                languages.put(langShort, langFull);
            }
        }

        if (!languages.containsKey("en")) {
            languages.put("en", "English");
        }

        return languages;
    }

    @Override
    public void setBundleContext(final BundleContext context) {
        this.bundleContext = context;
    }
}