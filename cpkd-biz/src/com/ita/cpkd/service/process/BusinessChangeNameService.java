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
import com.ita.cpkd.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.inject.Named;
import java.util.Map;


/**
 * Created by HS on 13/09/2016.
 */
@Named("ita_business_changenamebusiness")
@XPortalDataService(roles = {"cpkd.process"}, description = "Tạo hồ sơ")
@XPortalPageRequest(uri = "ita/homebusiness/changenamebusiness", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class BusinessChangeNameService extends DataServiceMarker {
    protected static final Logger logger = LoggerFactory.getLogger(BusinessChangeNameService.class);
    @Inject
    private BusinessDetailBo businessDetailBo;
    @Inject
    private ChangeBusinessBo changeBusinessBo;

    @Override
    protected WebDataService service(AbstractBaseAction action, Map<String, Object> params)
            throws WebOSBOException {
        //HomeBusiness arbmodel = action.getModel(HomeBusiness.class);
        String name = XParamUtils.getString("nameBusiness", params, "");
        String idHomeBusiness = XParamUtils.getString("idHomeBusiness", params, "");
        String idChangeBusiness = XParamUtils.getString("idChangeBusiness", params, "");

        // TODO check your required data
        logger.debug("nameBusiness {}", name);
        BusinessDetail detail = businessDetailBo.updateName(name, idHomeBusiness);
        ChangeBusiness change = changeBusinessBo.updateName(name, idChangeBusiness);


        return new ObjectWebDataservice<BusinessDetail>(detail);
    }

}
