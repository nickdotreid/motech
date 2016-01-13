package org.motechproject.mds.service;

import org.motechproject.mds.dto.SchemaHolder;

import java.io.File;
import java.io.IOException;

/**
 * This interface provides methods to create a bundle jar with all entities defined in MDS module.
 */
public interface JarGeneratorService {

    String MDS_COMMON_CONTEXT = "META-INF/motech/mdsCommonContext.xml";
    String DATANUCLEUS_PROPERTIES = "datanucleus_data.properties";
    String FLYWAY_PROPERTIES = "flyway_data.properties";
    String MOTECH_MDS_PROPERTIES = "motech-mds.properties";
    String MDS_ENTITIES_CONTEXT = "META-INF/motech/mdsEntitiesContext.xml";
    String TASK_CHANNEL_JSON = "task-channel.json";
    String BLUEPRINT_XML = "META-INF/spring/blueprint.xml";
    String PACKAGE_JDO = "META-INF/package.jdo";
    String BLUEPRINT_TEMPLATE = "/velocity/templates/blueprint-template.vm";
    String MDS_ENTITIES_CONTEXT_TEMPLATE = "/velocity/templates/mdsEntitiesContext-template.vm";
    String MDS_CHANNEL_TEMPLATE = "/velocity/templates/task-channel-template.vm";
    String BUNDLE_IMPORTS = "bundleImports.txt";
    String ENTITY_LIST_FILE = "entityNames.txt";
    String LISTENER_LIST_FILE = "entitiesWithJdoListeners.txt";
    String HISTORY_LIST_FILE = "entitiesWithHistory.txt";
    String VALIDATION_PROVIDER = "META-INF/services/javax.validation.spi.ValidationProvider";
    String ENTITY_INFO_DIR = "META-INF/entity-info/";

    /**
     * Generates a jar file that contains entity class definitions, repositories, interfaces,
     * implementations of these interfaces. The jar should also contains class related with
     * historical data and trash.
     *
     * @param schemaHolder the holder of the MDS that should be built
     * @return file that points to the entities bundle jar.
     * @throws IOException if an I/O error occurs while creating the jar file.
     */
    File generate(SchemaHolder schemaHolder) throws IOException;

    /**
     * Constructs entities, builds and starts the entities bundle jar
     *
     * @param schemaHolder the holder of the MDS that should be built
     * @see #generate(SchemaHolder)
     */
    void regenerateMdsDataBundle(SchemaHolder schemaHolder);


    /**
     * Constructs entities, builds and starts the entities bundle jar.
     * This method should be used after DDE enhancement. It will build all DDE classes
     * and refresh modules from which the DDE being enhanced comes from.
     *
     * @param schemaHolder the holder of the MDS that should be built
     * @param moduleNames modules names of the entities from which the enhanced DDE comes from
     * @see #generate(SchemaHolder)
     */
    void regenerateMdsDataBundleAfterDdeEnhancement(SchemaHolder schemaHolder, String... moduleNames);

    /**
     * Constructs entities, builds the entities bundle jar. The generated bundle will start only if
     * the <strong>startBundle</strong> will be set to {@code true}.
     *
     * @param schemaHolder the holder of the MDS that should be built
     * @param startBundle {@code true} if the generated bundle should start;
     *                    otherwise {@code false}.
     * @see #generate(SchemaHolder)
     */
    void regenerateMdsDataBundle(SchemaHolder schemaHolder, boolean startBundle);
}
