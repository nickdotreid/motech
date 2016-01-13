package org.motechproject.config.core.service.impl;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.motechproject.config.core.MotechConfigurationException;
import org.motechproject.config.core.bootstrap.BootstrapManager;
import org.motechproject.config.core.datanucleus.DbConfigManager;
import org.motechproject.config.core.domain.ConfigLocation;
import org.motechproject.config.core.environment.Environment;
import org.motechproject.config.core.filestore.ConfigLocationFileStore;

import java.nio.file.FileSystemException;
import java.util.Arrays;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


public class CoreConfigurationServiceImplTest {

    @Mock
    private Environment environmentMock;

    @Mock
    private BootstrapManager bootstrapManagerMock;

    @Mock
    private ConfigLocationFileStore configLocationFileStoreMock;

    @Mock
    private DbConfigManager dbConfigManagerMock;

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    private CoreConfigurationServiceImpl coreConfigurationService;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        coreConfigurationService = new CoreConfigurationServiceImpl(bootstrapManagerMock, dbConfigManagerMock, configLocationFileStoreMock);
    }

    @Test
    public void shouldGetConfigLocation() {
        String correctConfigPath = this.getClass().getClassLoader().getResource("config").getPath();
        String inCorrectConfigPath = this.getClass().getClassLoader().getResource("some_random_dir").getPath();
        ConfigLocation incorrectLocation = new ConfigLocation(inCorrectConfigPath);
        ConfigLocation correctLocation = new ConfigLocation(correctConfigPath);
        when(configLocationFileStoreMock.getAll()).thenReturn(Arrays.asList(incorrectLocation, correctLocation));

        ConfigLocation configLocation = coreConfigurationService.getConfigLocation();

        assertEquals(correctLocation, configLocation);
    }

    @Test
    public void shouldThrowExceptionIfNoneOfTheConfigLocationsAreReadable() {
        String inCorrectConfigPath = this.getClass().getClassLoader().getResource("some_random_dir").getPath();
        when(configLocationFileStoreMock.getAll()).thenReturn(Arrays.asList(new ConfigLocation(inCorrectConfigPath)));

        expectedException.expect(MotechConfigurationException.class);
        expectedException.expectMessage(String.format("Could not read settings from any of the config locations. Searched directories: %s .", new ConfigLocation(inCorrectConfigPath).getLocation()));

        coreConfigurationService.getConfigLocation();
    }

    @Test
    public void shouldAddConfigLocation() throws FileSystemException {
        final String location = "/etc";
        coreConfigurationService.addConfigLocation(location);
        verify(configLocationFileStoreMock).add(location);
    }
}
