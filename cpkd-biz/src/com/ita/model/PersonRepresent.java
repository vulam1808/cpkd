package com.ita.model;

import com.inet.xportal.web.WebConstant;
import com.inet.xportal.web.annotation.XPortalModel;

/**
 * Created by HS on 13/09/2016.
 */
@XPortalModel(name = "ita-personrepresent", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class PersonRepresent {
    private String uuid;
    private String gender;
    private String namerepresent;
    private String birthday;
    private String race;
    private String religion;
    private String idnumber;
    private String issueDate;
    private String issuePlace;

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getNamerepresent() {
        return namerepresent;
    }

    public void setNamerepresent(String namerepresent) {
        this.namerepresent = namerepresent;
    }

    public String getBirthday() {
        return birthday;
    }

    public void setBirthday(String birthday) {
        this.birthday = birthday;
    }

    public String getRace() {
        return race;
    }

    public void setRace(String race) {
        this.race = race;
    }

    public String getReligion() {
        return religion;
    }

    public void setReligion(String religion) {
        this.religion = religion;
    }

    public String getIdnumber() {
        return idnumber;
    }

    public void setIdnumber(String idnumber) {
        this.idnumber = idnumber;
    }

    public String getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(String issueDate) {
        this.issueDate = issueDate;
    }

    public String getIssuePlace() {
        return issuePlace;
    }

    public void setIssuePlace(String issuePlace) {
        this.issuePlace = issuePlace;
    }






}
