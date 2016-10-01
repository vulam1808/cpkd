package com.ita.cpkd.bo;

import javax.inject.Inject;
import javax.inject.Named;


import com.inet.base.util.ReflectionUtils;
import com.inet.xportal.nosql.web.bf.MagicContentBF;
import com.inet.xportal.nosql.web.bo.MagicContentBO;
import com.inet.xportal.nosql.web.data.SearchDTO;
import com.inet.xportal.web.context.ContentContext;
import com.inet.xportal.web.exception.WebOSBOException;
import com.inet.xportal.web.util.JSONUtils;
import com.inet.xportal.xdb.persistence.JSONDB;
import com.inet.xportal.xdb.query.Query;
import com.inet.xportal.xdb.query.impl.QueryImpl;
import com.ita.cpkd.enums.EnumStatus;
import com.ita.cpkd.lib.Utility;
import com.ita.cpkd.model.*;
import net.sf.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;


/**
 * Created by LamLe on 9/7/2016.
 */
@Named("HomeBusinessBo")
public class HomeBusinessBo extends MagicContentBO<HomeBusiness> {
    protected static final Logger logger = LoggerFactory.getLogger(HomeBusinessBo.class);
    @Inject
    private BusinessDetailBo businessDetailBo;
    @Inject
    private ChangeBusinessBo changeBusinessBo;
    @Inject
    private PauseBusinessBo pauseBusinessBo;
    @Inject
    private EndBusinessBo endBusinessBo;
    @Inject
    private PersonRepresentBo personRepresentBo;
    /**
     * Create {@link AccountBo} instance
     *
     * @param contentBf the given {@link MagicContentBF}
     */
    @Inject
    protected HomeBusinessBo(@ContentContext(context = "itaNoSqlContext") MagicContentBF contentBf) {
        super(contentBf, "homeBusiness");
    }


    /*public HomeBusiness loadHomeBusinessByTaskID(String taskID) throws WebOSBOException
    {
        *//*Query<JSONDB> query = new QueryImpl<JSONDB>();
        query.field("taskID").equal(taskID);
        SearchDTO<HomeBusiness> datas = super.query((QueryImpl<JSONDB>) query);
        HomeBusiness objHome = new HomeBusiness();
        if(datas.getTotal()>0)
        {
             objHome = datas.getItems().get(0);
        }*//*
        logger.debug("HomeBusiness getUuid {}: ", taskID);
        HomeBusiness objHome = super.load(taskID);

        return objHome;
    }*/
    public HomeBusiness addHomeBusiness(HomeBusiness objHomeBusiness) throws WebOSBOException
    {
        /*Query<JSONDB> query = new QueryImpl<JSONDB>();
        query.field("taskID").equal(taskID);
        SearchDTO<HomeBusiness> datas = super.query((QueryImpl<JSONDB>) query);
        HomeBusiness objHome = new HomeBusiness();
        if(datas.getTotal()>0)
        {
             objHome = datas.getItems().get(0);
        }*/


        // TODO check your required data

        // save account
        //district.setUuid(districtBo.add(district));
        String uuid= super.add(objHomeBusiness);
        objHomeBusiness.setUuid(uuid);

        return objHomeBusiness;
    }
    public HomeBusiness updateHomeBusiness(String uuid,HomeBusiness objHomeBusiness) throws WebOSBOException
    {
        super.update(uuid, objHomeBusiness);
        objHomeBusiness.setUuid(uuid);

        return objHomeBusiness;
    }

    public JSONObject loadBusinessProcessByTaskID(String taskID) throws WebOSBOException
    {
        BusinessDetail objDetail = businessDetailBo.loadBusinessDetailByTaskID(taskID);
        HomeBusiness objHome = super.load(objDetail.getHomeBusiness_ID());
        String status = objHome.getStatusType();

            logger.debug("getStatusType {}", status);
            JSONObject mainObj = new JSONObject();
            mainObj.put("statusType", status);
            if (status.equals(EnumStatus.CAP_DOI.toString())) {
                ChangeBusiness objChange = changeBusinessBo.loadByHomeBusinessID(objHome.getUuid());
                logger.debug("objChange uuid {}", objChange.getUuid());
                mainObj.put("idHomeBusiness", objChange.getUuid());
                mainObj.put("HomeBusiness", objChange);
                String idPerson = objChange.getPersonRepresent_ID();
                //Lấy thong tin nguoi dai dien
                if (idPerson != null) {
                    PersonRepresent objperson = personRepresentBo.loadPersonRepresentByID(idPerson);
                    mainObj.put("PersonRepresent", objperson);
                }
            } else {
                logger.debug("objHome uuid {}", objHome.getUuid());
                mainObj.put("idHomeBusiness", objHome.getUuid());
                mainObj.put("HomeBusiness", objHome);
                String idPerson = objHome.getPersonRepresent_ID();
                //logger.debug("idPerson uuid {}", idPerson);
                //Lấy thong tin nguoi dai dien
                if (idPerson != null) {
                    PersonRepresent objperson = personRepresentBo.loadPersonRepresentByID(idPerson);
                    mainObj.put("PersonRepresent", objperson);
                }
            }

        return mainObj;
    }

    public JSONObject loadBusinessInfoByHomeBusinessID(String homeBusinessID) throws WebOSBOException
    {
        logger.debug("begin loadBusinessInfoByTaskID ", "");
        JSONObject mainObj = new JSONObject();
        BusinessDetail objDetail = businessDetailBo.loadBusinessDetailByHomeBusinessID(homeBusinessID);
        HomeBusiness objHome = super.load(objDetail.getHomeBusiness_ID());
        mainObj.put("HomeBusiness", objHome);
        List<Detail> lstChange = objDetail.getList_changeBusiness_ID();
        Utility.sortList(lstChange,"dateSubmit");
        logger.debug("sort ", lstChange);
        int i = 0;
        for(Detail item : lstChange){
            i++;
            ChangeBusiness objChange = changeBusinessBo.loadByID(item.getParent_ID());
            mainObj.put("ChangeBusiness"+i, objChange);
        }
        List<Detail> lstPause = objDetail.getList_pauseBusiness_ID();
        Utility.sortList(lstPause,"dateSubmit");
        i = 0;
        for(Detail item : lstPause){
            i++;
            PauseBusiness objChange = pauseBusinessBo.loadByID(item.getParent_ID());
            mainObj.put("PauseBusiness"+i, objChange);
        }
        List<Detail> lstEnd = objDetail.getList_endBusiness_ID();
        Utility.sortList(lstEnd,"dateSubmit");
        i = 0;
        for(Detail item : lstEnd){
            i++;
            EndBusiness objChange = endBusinessBo.loadByID(item.getParent_ID());
            mainObj.put("EndBusiness"+i, objChange);
        }

        return mainObj;
    }



    @Override
    protected Class<HomeBusiness> getClassConvetor() {
        return HomeBusiness.class;
    }
}


