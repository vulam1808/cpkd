package com.ita.cpkd.model;

/**
 * Created by ACER on 9/14/2016.
 */
public class EndBusiness {
    private String uuid;
    private String homeBusiness_ID;
    private String dateEnd;
    private String reason;
    private String dateSubmit;//=System.currentTimeMillis();
    private String statusProcess;
    private String taskID;

    public String getTaskID() {
        return taskID;
    }

    public void setTaskID(String taskID) {
        this.taskID = taskID;
    }

    public String getStatusProcess() {
        return statusProcess;
    }

    public void setStatusProcess(String statusProcess) {
        this.statusProcess = statusProcess;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getHomeBusiness_ID() {
        return homeBusiness_ID;
    }

    public void setHomeBusiness_ID(String homeBusiness_ID) {
        this.homeBusiness_ID = homeBusiness_ID;
    }

    public String getDateEnd() {
        return dateEnd;
    }

    public void setDateEnd(String dateEnd) {
        this.dateEnd = dateEnd;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getDateSubmit() {
        return dateSubmit;
    }

    public void setDateSubmit(String dateSubmit) {
        this.dateSubmit = dateSubmit;
    }
}
