package com.ita.cpkd.model;

import com.inet.xportal.web.WebConstant;
import com.inet.xportal.web.annotation.XPortalModel;

/**
 * Created by ACER on 9/28/2016.
 */
@XPortalModel(name = "ita-detail", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class Detail {
    private String uuid;
    private String parent_ID;
    private long dateSubmit;
    private String statusProcess;
    private String taskID;

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

    public long getDateSubmit() {
        return dateSubmit;
    }

    public void setDateSubmit(long dateSubmit) {
        this.dateSubmit = dateSubmit;
    }

    public String getStatusProcess() {
        return statusProcess;
    }

    public void setStatusProcess(String statusProcess) {
        this.statusProcess = statusProcess;
    }
}
