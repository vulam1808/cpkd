package com.ita.cpkd.model;

import com.inet.xportal.web.WebConstant;
import com.inet.xportal.web.annotation.XPortalModel;

/**
 * Created by ACER on 9/28/2016.
 */

public class Details {
    private String uuid;
    private String parent_ID;
    private String dateSubmit;// =System.currentTimeMillis();
    private String statusProcess;
    private String taskID;
    public Details() {}
    public String getTaskID() {
        return taskID;
    }

    public void setTaskID(String taskID) {
        this.taskID = taskID;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getParent_ID() {
        return parent_ID;
    }

    public void setParent_ID(String parent_ID) {
        this.parent_ID = parent_ID;
    }

    public String getDateSubmit() {
        return dateSubmit;
    }

    public void setDateSubmit(String dateSubmit) {
        this.dateSubmit = dateSubmit;
    }

    public String getStatusProcess() {
        return statusProcess;
    }

    public void setStatusProcess(String statusProcess) {
        this.statusProcess = statusProcess;
    }
}
