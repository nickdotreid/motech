package org.motechproject.mds.domain;

import org.joda.time.DateTime;

import javax.jdo.annotations.Column;
import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

/**
 * The <code>BundleFailureReport</code> class contains information about a bundle failure caused by a timeout after MDS schema regeneration.
 */
@PersistenceCapable(identityType = IdentityType.DATASTORE)
public class BundleFailureReport {

    @PrimaryKey
    @Persistent(valueStrategy = IdGeneratorStrategy.NATIVE)
    private Long id;

    @Persistent
    private DateTime reportDate;

    @Persistent
    private String nodeName;

    @Persistent
    private String bundleSymbolicName;

    @Persistent
    @Column(sqlType = "CLOB")
    private String errorMessage;

    @Persistent
    private BundleRestartStatus bundleRestartStatus;

    public BundleFailureReport() {
    }

    public BundleFailureReport(DateTime reportDate, String nodeName, String bundleSymbolicName, String errorMessage, BundleRestartStatus bundleRestartStatus) {
        this.reportDate = reportDate;
        this.nodeName = nodeName;
        this.bundleSymbolicName = bundleSymbolicName;
        this.errorMessage = errorMessage;
        this.bundleRestartStatus = bundleRestartStatus;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DateTime getReportDate() {
        return reportDate;
    }

    public void setReportDate(DateTime reportDate) {
        this.reportDate = reportDate;
    }

    public String getNodeName() {
        return nodeName;
    }

    public void setNodeName(String nodeName) {
        this.nodeName = nodeName;
    }

    public String getBundleSymbolicName() {
        return bundleSymbolicName;
    }

    public void setBundleSymbolicName(String bundleSymbolicName) {
        this.bundleSymbolicName = bundleSymbolicName;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public BundleRestartStatus getBundleRestartStatus() {
        return bundleRestartStatus;
    }

    public void setBundleRestartStatus(BundleRestartStatus bundleRestartStatus) {
        this.bundleRestartStatus = bundleRestartStatus;
    }
}
