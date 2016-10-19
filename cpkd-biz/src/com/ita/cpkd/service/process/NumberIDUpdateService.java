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
import com.ita.cpkd.bo.BusinessDetailBo;
import com.ita.cpkd.bo.ChangeBusinessBo;
import com.ita.cpkd.bo.HomeBusinessBo;
import com.ita.cpkd.bo.PersonRepresentBo;
import com.ita.cpkd.enums.EnumStatus;
import com.ita.cpkd.model.BusinessDetail;
import com.ita.cpkd.model.ChangeBusiness;
import com.ita.cpkd.model.HomeBusiness;
import com.ita.cpkd.model.PersonRepresent;

import javax.inject.Inject;
import javax.inject.Named;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


/**
 * Created by HS on 13/09/2016.
 */
@Named("ita_numberidbusiness_updateservice")
@XPortalDataService(roles = {"cpkd.process"}, description = "Tạo hồ sơ")
@XPortalPageRequest(uri = "ita/business/updatenumberid", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class NumberIDUpdateService extends DataServiceMarker {
    @Inject
    private BusinessDetailBo businessDetailBo;
    @Inject
    private HomeBusinessBo homeBusinessBo;

    @Override
    protected WebDataService service(AbstractBaseAction action, Map<String, Object> params)
            throws WebOSBOException {
        String numberid = XParamUtils.getString("numberBusiness", params, "");
        String ID = XParamUtils.getString("idHomeBusiness", params, "");

        BusinessDetail detail = businessDetailBo.loadBusinessDetailByHomeBusinessID(ID);
        detail.setNumberBusiness(numberid);
        businessDetailBo.update(detail.getUuid(), detail);

        HomeBusiness home = homeBusinessBo.load(ID);
        home.setNumberBusiness(numberid);
        homeBusinessBo.update(ID,home);

        return new ObjectWebDataservice<HomeBusiness>(home);




    }

}