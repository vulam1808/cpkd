package com.ita.cpkd.service.process;

import com.inet.xportal.web.WebConstant;
import com.inet.xportal.web.action.AbstractBaseAction;
import com.inet.xportal.web.annotation.XPortalDataService;
import com.inet.xportal.web.annotation.XPortalPageRequest;
import com.inet.xportal.web.exception.WebOSBOException;
import com.inet.xportal.web.interfaces.DataServiceMarker;
import com.inet.xportal.web.interfaces.ObjectWebDataservice;
import com.inet.xportal.web.interfaces.WebDataService;
import com.inet.xportal.web.util.XParamUtils;
import com.ita.cpkd.bo.*;
import com.ita.cpkd.enums.EnumProcess;
import com.ita.cpkd.enums.EnumStatus;
import com.ita.cpkd.model.*;
import net.sf.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.inject.Named;
import java.lang.reflect.Array;
import java.util.Map;


/**
 * Created by HS on 13/09/2016.
 */
@Named("ita_business_newtaskservice")
@XPortalDataService(roles = {"cpkd.create"}, description = "Tạo hồ sơ")
@XPortalPageRequest(uri = "ita/business/save", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class BusinessNewTaskService extends DataServiceMarker {
    protected static final Logger logger = LoggerFactory.getLogger(EnumStatusLoadService.class);
    @Inject
    private HomeBusinessBo homeBusinessBo;
    @Inject
    private ChangeBusinessBo changeBusinessBo;
    @Inject
    private PauseBusinessBo pauseBusinessBo;
    @Inject
    private EndBusinessBo endBusinessBo;
    @Inject
    private BusinessDetailBo businessDetailBo;

    @Override
    protected WebDataService service(AbstractBaseAction action, Map<String, Object> params)
            throws WebOSBOException {

        String statusType = XParamUtils.getString("statusType", params, "");
        String taskID = XParamUtils.getString("taskID", params, "");
        if(statusType.equals(EnumStatus.CAP_MOI.toString()))
        {
            HomeBusiness arbmodel = action.getModel(HomeBusiness.class);
            //set taskID, statusType vao homebusiness
            arbmodel.setTaskID(taskID);
            arbmodel.setStatusType(statusType);
            arbmodel.setStatusProcess(EnumProcess.PROCESS.toString());
            //arbmodel.setDateSubmit(Date);
            arbmodel = homeBusinessBo.addHomeBusiness(arbmodel);
            businessDetailBo.saveBusinessDetail(arbmodel.getNameBusiness(),arbmodel.getUuid(),taskID,statusType,new Detail());
            return new ObjectWebDataservice<HomeBusiness>(arbmodel);
        }
        else if(statusType.equals(EnumStatus.CAP_DOI.toString()))
        {
            ChangeBusiness objmodel = action.getModel(ChangeBusiness.class);

            String homebusinessID = XParamUtils.getString("homebusinessID", params, "");
            //update homebusiness status
            HomeBusiness objBusiness = new HomeBusiness();
            objBusiness.setStatusType(statusType);
            homeBusinessBo.updateHomeBusiness(homebusinessID, objBusiness);
            logger.debug("homebusinessID {}", homebusinessID);
            //Set EndBusiness
            String strInfoChange = XParamUtils.getString("infoChange", params, "");
            objmodel.setTaskID(taskID);
            objmodel.setHomeBusiness_ID(homebusinessID);
            objmodel.setStatusProcess(EnumProcess.PROCESS.toString());
            ChangeBusiness objchange = changeBusinessBo.addChangeBusiness(objmodel,strInfoChange);


            logger.debug("objchange uuid {}: objchange getHomeBusiness_ID {}", objchange.getUuid(), objchange.getHomeBusiness_ID());


            String changeBusinessID = objchange.getUuid();
            Detail _objDetail =new Detail();
            _objDetail.setParent_ID(changeBusinessID);
            _objDetail.setStatusProcess(EnumProcess.PROCESS.toString());
            //_objDetail.setDateSubmit();
            businessDetailBo.saveBusinessDetail(objchange.getNameBusiness(),homebusinessID, taskID, statusType, _objDetail);
            logger.debug("objchange uuid {}: objchange getHomeBusiness_ID {}", objchange.getUuid(), objchange.getHomeBusiness_ID());
            return new ObjectWebDataservice<ChangeBusiness>(objmodel);
        }
        else if(statusType.equals(EnumStatus.CHAM_DUT.toString()))
        {
            String homebusinessID = XParamUtils.getString("homebusinessID", params, "");
            //update homebusiness status
            HomeBusiness objBusiness = new HomeBusiness();
            objBusiness.setStatusType(statusType);
            homeBusinessBo.updateHomeBusiness(homebusinessID,objBusiness);

            //Set EndBusiness
            EndBusiness objmodel = action.getModel(EndBusiness.class);
            objmodel.setTaskID(taskID);
            objmodel.setHomeBusiness_ID(homebusinessID);
            objmodel.setStatusProcess(EnumProcess.PROCESS.toString());
            objmodel = endBusinessBo.addEndBusiness(objmodel);

            String endBusinessID = objmodel.getUuid();
            Detail _objDetail =new Detail();
            _objDetail.setParent_ID(endBusinessID);
            _objDetail.setStatusProcess(EnumProcess.PROCESS.toString());
            //_objDetail.setDateSubmit();
            businessDetailBo.saveBusinessDetail(null,homebusinessID,taskID,statusType,_objDetail);
            return new ObjectWebDataservice<EndBusiness>(objmodel);
        }
        else if(statusType.equals(EnumStatus.TAM_NGUNG.toString()))
        {

            String homebusinessID = XParamUtils.getString("homebusinessID", params, "");
            //update homebusiness status
            HomeBusiness objBusiness = new HomeBusiness();
            objBusiness.setStatusType(statusType);
            homeBusinessBo.updateHomeBusiness(homebusinessID,objBusiness);

            //set PauseBusiness
            PauseBusiness objmodel = action.getModel(PauseBusiness.class);
            objmodel.setTaskID(taskID);
            objmodel.setHomeBusiness_ID(homebusinessID);
            objmodel.setStatusProcess(EnumProcess.PROCESS.toString());
            objmodel = pauseBusinessBo.addPauseBusiness(objmodel);

            String pauseBusinessID = objmodel.getUuid();
            Detail _objDetail =new Detail();
            _objDetail.setParent_ID(pauseBusinessID);
            _objDetail.setStatusProcess(EnumProcess.PROCESS.toString());
            //_objDetail.setDateSubmit();
            businessDetailBo.saveBusinessDetail(null,homebusinessID,taskID,statusType,_objDetail);
            return new ObjectWebDataservice<PauseBusiness>(objmodel);
        }
        JSONObject mainObj = new JSONObject();
        mainObj.put("error","Khong tim thay statusType");
        return new ObjectWebDataservice<JSONObject>(mainObj);
    }

}
