package org.motechproject.scheduler.contract;

import org.apache.commons.lang.ObjectUtils;
import org.joda.time.DateTime;
import org.motechproject.event.MotechEvent;

/**
 * Schedulable Job - a data carrier class for a scheduled job that can be fired set number of times
 */
public class RepeatingSchedulableJob extends SchedulableJob {

    private static final long serialVersionUID = 1L;


    private MotechEvent motechEvent;
    private Integer repeatCount;
    private Integer repeatIntervalInSeconds;
    private DateTime startTime;
    private DateTime endTime;
    private boolean ignorePastFiresAtStart;
    private boolean useOriginalFireTimeAfterMisfire;

    /**
     * Constructor. It will create a job, which will never end, won't ignore past fires at start and will use original fire time after misfire.
     * Start time, {@code MotechEvent}, repeat count and repeat interval are not assigned, which means that further usage, without setting them, can cause exceptions.
     */
    public RepeatingSchedulableJob() {
        super(false);
        endTime = null;
        ignorePastFiresAtStart = false;
        useOriginalFireTimeAfterMisfire = true;
    }

    /**
     * Constructor.
     *
     * @param motechEvent  the {@code MotechEvent} which will be fired when the job triggers, not null
     * @param repeatCount  the number of times job should be repeated, null treated as infinite
     * @param repeatIntervalInSeconds  the interval(in seconds) between job fires
     * @param startTime  the {@code DateTime} at which job should become ACTIVE, not null
     * @param endTime  the {@code DateTime} at which job should be stopped, null treated as never end
     * @param ignorePastFiresAtStart  the flag defining whether job should ignore past fires at start or not
     */
    public RepeatingSchedulableJob(final MotechEvent motechEvent, final Integer repeatCount, final Integer repeatIntervalInSeconds,
                                   final DateTime startTime, final DateTime endTime, boolean ignorePastFiresAtStart) {
        this(motechEvent, repeatCount, repeatIntervalInSeconds, startTime, endTime, ignorePastFiresAtStart, false);
    }

    /**
     * Constructor.
     *
     * @param motechEvent  the {@code MotechEvent} which will be fired when the job triggers, not null
     * @param repeatCount  the number of times job should be repeated, null treated as infinite
     * @param repeatIntervalInSeconds  the interval(in seconds) between job fires
     * @param startTime  the {@code Date} at which job should become ACTIVE, not null
     * @param endTime  the {@code Date} at which job should be stopped, null treated as never end
     * @param ignorePastFiresAtStart  the flag defining whether job should ignore past fires at start or not
     * @param uiDefined  the flag defining, whether job has been created through the UI
     */
    public RepeatingSchedulableJob(final MotechEvent motechEvent, final Integer repeatCount,
                                   final Integer repeatIntervalInSeconds, final DateTime startTime, final DateTime endTime,
                                   boolean ignorePastFiresAtStart, boolean uiDefined) {
        super(uiDefined);
        this.motechEvent = motechEvent;
        this.repeatCount = repeatCount;
        this.repeatIntervalInSeconds = repeatIntervalInSeconds;
        this.startTime = startTime;
        this.endTime = endTime;
        this.ignorePastFiresAtStart = ignorePastFiresAtStart;
        this.useOriginalFireTimeAfterMisfire = true;
    }

    /**
     * Constructor.
     *
     * @param motechEvent  the {@code MotechEvent} which will be fired when the job triggers, not null
     * @param repeatIntervalInSeconds  the interval(in seconds) between job fires
     * @param startTime  the {@code DateTime} at which job should become ACTIVE, not null
     * @param endTime  the {@code DateTime} at which job should be stopped, null treated as never end
     * @param ignorePastFiresAtStart  the flag defining whether job should ignore past fires at start or not
     */
    public RepeatingSchedulableJob(final MotechEvent motechEvent, final Integer repeatIntervalInSeconds,
                                   final DateTime startTime, final DateTime endTime, boolean ignorePastFiresAtStart) {
        this(motechEvent, null, repeatIntervalInSeconds, startTime, endTime, ignorePastFiresAtStart);
    }

    public MotechEvent getMotechEvent() {
        return motechEvent;
    }

    public RepeatingSchedulableJob setMotechEvent(final MotechEvent motechEvent) {
        this.motechEvent = motechEvent;
        return this;
    }

    public DateTime getStartTime() {
        return startTime;
    }

    public RepeatingSchedulableJob setStartTime(final DateTime startTime) {
        this.startTime = startTime;
        return this;
    }

    public DateTime getEndTime() {
        return endTime;
    }

    public RepeatingSchedulableJob setEndTime(final DateTime endTime) {
        this.endTime = endTime;
        return this;
    }

    public Integer getRepeatCount() {
        return repeatCount;
    }

    public RepeatingSchedulableJob setRepeatCount(final Integer repeatCount) {
        this.repeatCount = repeatCount;
        return this;
    }

    public Integer getRepeatIntervalInSeconds() {
        return repeatIntervalInSeconds;
    }

    public RepeatingSchedulableJob setRepeatIntervalInSeconds(final Integer repeatIntervalInSeconds) {
        this.repeatIntervalInSeconds = repeatIntervalInSeconds;
        return this;
    }

    public boolean isIgnorePastFiresAtStart() {
        return ignorePastFiresAtStart;
    }

    /**
     * Ignore past fires when start time of job is in past.
     * <pre>ex : repeating job with interval of 5 unit, and current time in between fire 2 and 3 will start triggering from 3rd firetime.
     *  1     2     3     4
     *  +-----+-----+-----+
     *  start    ^current time
     *  </pre>
     * @param ignorePastFiresAtStart
     */
    public RepeatingSchedulableJob setIgnorePastFiresAtStart(boolean ignorePastFiresAtStart) {
        this.ignorePastFiresAtStart = ignorePastFiresAtStart;
        return this;
    }

    public boolean isUseOriginalFireTimeAfterMisfire() {
        return useOriginalFireTimeAfterMisfire;
    }

    public RepeatingSchedulableJob setUseOriginalFireTimeAfterMisfire(boolean useOriginalFireTimeAfterMisfire) {
        this.useOriginalFireTimeAfterMisfire = useOriginalFireTimeAfterMisfire;
        return this;
    }

    @Override
    public String toString() {
        return "RepeatingSchedulableJob [motechEvent=" + motechEvent
                + ", startTime=" + startTime + ", endTime=" + endTime
                + ", repeatCount=" + repeatCount + ", repeatIntervalInSeconds="
                + repeatIntervalInSeconds + "]";
    }

    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof RepeatingSchedulableJob)) {
            return false;
        }
        RepeatingSchedulableJob job = (RepeatingSchedulableJob) obj;
        if (!ObjectUtils.equals(motechEvent, job.motechEvent)) {
            return false;
        } else if (!ObjectUtils.equals(startTime, job.startTime)) {
            return false;
        } else if (!ObjectUtils.equals(endTime, job.endTime)) {
            return false;
        } else if (!ObjectUtils.equals(repeatCount, job.repeatCount)) {
            return false;
        } else if (!ObjectUtils.equals(repeatIntervalInSeconds, job.repeatIntervalInSeconds)) {
            return false;
        } else if (ignorePastFiresAtStart != job.ignorePastFiresAtStart) {
            return false;
        } else if (useOriginalFireTimeAfterMisfire != job.useOriginalFireTimeAfterMisfire) {
            return false;
        }

        return true;
    }

    @Override
    public int hashCode() {
        int hash = 1;
        hash = hash * 31 + ObjectUtils.hashCode(motechEvent);
        hash = hash * 31 + ObjectUtils.hashCode(startTime);
        hash = hash * 31 + ObjectUtils.hashCode(endTime);
        hash = hash * 31 + ObjectUtils.hashCode(repeatCount);
        hash = hash * 31 + ObjectUtils.hashCode(repeatIntervalInSeconds);
        hash = hash * 31 + ObjectUtils.hashCode(ignorePastFiresAtStart);
        hash = hash * 31 + ObjectUtils.hashCode(useOriginalFireTimeAfterMisfire);

        return hash;
    }
}
