package org.motechproject.mds.osgi;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;

@RunWith(Suite.class)
@Suite.SuiteClasses({MdsBundleIT.class, HistoryTrashServiceBundleIT.class})
public class MdsBundleIntegrationTests {
}