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
import com.ita.cpkd.bo.ChangeBusinessBo;
import com.ita.cpkd.bo.HomeBusinessBo;
import com.ita.cpkd.bo.PersonRepresentBo;
import com.ita.cpkd.enums.EnumStatus;
import com.ita.cpkd.model.ChangeBusiness;
import com.ita.cpkd.model.HomeBusiness;
import com.ita.cpkd.model.PersonRepresent;
import net.sf.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.inject.Named;
import java.util.Map;


/**
 * Created by HS on 13/09/2016.
 */
@Named("ita_homebusiness_loadprocessservice")
@XPortalDataService(roles = {"cpkd.process"}, description = "Xử lý hồ sơ")
@XPortalPageRequest(uri = "ita/homebusiness/loadprocess", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class BusinessLoadProcessService extends DataServiceMarker {
    protected static final Logger logger = LoggerFactory.getLogger(EnumStatusLoadService.class);
    @Inject
    private HomeBusinessBo homeBusinessBo;
    @Inject
    private ChangeBusinessBo changeBusinessBo;
    @Inject
    private PersonRepresentBo personRepresentBo;
    @Override
    protected WebDataService service(AbstractBaseAction action, Map<String, Object> params)
            throws WebOSBOException {
        JSONObject mainObj = new JSONObject();
        String taskID = XParamUtils.getString("taskID", params, "");
        // TODO check your required data
        HomeBusiness objHome = homeBusinessBo.loadHomeBusinessByTaskID(taskID);
        if(objHome!=null)
        {
            String status = objHome.getStatusType();
            logger.debug("getStatusType {}", status);
            mainObj.put("statusType", status);
            if(status.equals(EnumStatus.CAP_DOI.toString()))
            {
                ChangeBusiness objChange = changeBusinessBo.loadByHomeBusinessID(objHome.getUuid());
                logger.debug("objChange uuid {}", objChange.getUuid());
                mainObj.put("idHomeBusiness", objChange.getUuid());
                mainObj.put("HomeBusiness", objChange);
                String idPerson = objChange.getPersonRepresent_ID();
                //Lấy thong tin nguoi dai dien
                if(idPerson!=null) {
                    PersonRepresent objperson = personRepresentBo.loadPersonRepresentByID(idPerson);
                    mainObj.put("PersonRepresent", objperson);
                }
            }
            else {
                logger.debug("objHome uuid {}", objHome.getUuid());
                mainObj.put("idHomeBusiness", objHome.getUuid());
                mainObj.put("HomeBusiness", objHome);
                String idPerson = objHome.getPersonRepresent_ID();
                //logger.debug("idPerson uuid {}", idPerson);
                //Lấy thong tin nguoi dai dien
                if(idPerson!=null) {
                    PersonRepresent objperson = personRepresentBo.loadPersonRepresentByID(idPerson);
                    mainObj.put("PersonRepresent", objperson);
                }
            }
            //logger.debug("idPerson uuid {}", "sadsad");
        }
        return new ObjectWebDataservice<JSONObject>(mainObj);
    }

}
