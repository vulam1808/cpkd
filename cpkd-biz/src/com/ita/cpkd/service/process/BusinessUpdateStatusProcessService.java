package com.ita.cpkd.service.process;

import com.inet.xportal.nosql.web.data.SearchDTO;
import com.inet.xportal.web.WebConstant;
import com.inet.xportal.web.action.AbstractBaseAction;
import com.inet.xportal.web.annotation.XPortalDataService;
import com.inet.xportal.web.annotation.XPortalPageRequest;
import com.inet.xportal.web.exception.WebOSBOException;
import com.inet.xportal.web.interfaces.DataServiceMarker;
import com.inet.xportal.web.interfaces.ObjectWebDataservice;
import com.inet.xportal.web.interfaces.WebDataService;
import com.inet.xportal.web.util.XParamUtils;
import com.inet.xportal.xdb.persistence.JSONDB;
import com.inet.xportal.xdb.query.Query;
import com.inet.xportal.xdb.query.impl.QueryImpl;
import com.ita.cpkd.bo.*;
import com.ita.cpkd.enums.EnumChangeInfo;
import com.ita.cpkd.enums.EnumProcess;
import com.ita.cpkd.enums.EnumStatus;
import com.ita.cpkd.model.*;
import net.sf.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.inject.Named;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


/**
 * Created by HS on 13/09/2016.
 */
@Named("ita_business_updatestatusprocessservice")
@XPortalDataService(roles = {"cpkd.process"}, description = "Xử lý hồ sơ")
@XPortalPageRequest(uri = "ita/businessprocess/updatestatus", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class BusinessUpdateStatusProcessService extends DataServiceMarker {
    protected static final Logger logger = LoggerFactory.getLogger(EnumStatusLoadService.class);

    @Inject
    private BusinessDetailBo businessDetailBo;

    @Override
    protected WebDataService service(AbstractBaseAction action, Map<String, Object> params)
            throws WebOSBOException {

        String idHomeBusiness = XParamUtils.getString("idHomeBusiness", params, "");
        String parent_ID = XParamUtils.getString("parent_ID", params, "");
        String status = XParamUtils.getString("statusProcess", params, "");
        String statusType = XParamUtils.getString("statusType", params, "");
        if(idHomeBusiness.equals(parent_ID))
        {
            parent_ID="";
        }
        if(status.equals(EnumProcess.PROCESS.toString()))
        {
            status = EnumProcess.PROCESS_TAX.toString();
        }
        else if(status.equals(EnumProcess.PROCESS_TAX.toString()))
        {
            status = EnumProcess.PROCESS_ID.toString();
        }
        else if(status.equals(EnumProcess.PROCESS_TAX.toString()))
        {
            status = EnumProcess.DONE.toString();
        }
        BusinessDetail obj =businessDetailBo.updateStatusProcess(statusType,status, idHomeBusiness, parent_ID);

        return new ObjectWebDataservice<BusinessDetail>(obj);
    }

}
