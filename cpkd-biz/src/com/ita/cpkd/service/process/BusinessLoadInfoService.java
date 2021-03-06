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
import com.ita.cpkd.bo.BusinessDetailBo;
import com.ita.cpkd.bo.ChangeBusinessBo;
import com.ita.cpkd.bo.HomeBusinessBo;
import com.ita.cpkd.bo.PersonRepresentBo;
import com.ita.cpkd.enums.EnumStatus;
import com.ita.cpkd.model.BusinessDetail;
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
@Named("ita_business_loadinforvice")
@XPortalDataService(roles = {"cpkd"}, description = "CPKD")
@XPortalPageRequest(uri = "ita/homebusiness/loadinfo", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class BusinessLoadInfoService extends DataServiceMarker {
    protected static final Logger logger = LoggerFactory.getLogger(BusinessLoadInfoService.class);
    @Inject
    private HomeBusinessBo homeBusinessBo;
    @Inject
    private BusinessDetailBo businessDetailBo;
    @Override
    protected WebDataService service(AbstractBaseAction action, Map<String, Object> params)
            throws WebOSBOException {
        JSONObject mainObj = new JSONObject();
        String homeBusinessID = XParamUtils.getString("homeBusinessID", params, "");
        logger.debug("homeBusinessID {} ", homeBusinessID);
        mainObj = homeBusinessBo.loadBusinessInfoByHomeBusinessID(homeBusinessID);
        //logger.debug("homeBusinessID {} ", mainObj);
        //Test

        return new ObjectWebDataservice<JSONObject>(mainObj);
    }

}
