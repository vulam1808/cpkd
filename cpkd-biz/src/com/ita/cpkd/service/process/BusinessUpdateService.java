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

import javax.inject.Inject;
import javax.inject.Named;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


/**
 * Created by HS on 13/09/2016.
 */
@Named("ita_business_updateservice")
@XPortalDataService(roles = {"cpkd.process"}, description = "Tạo hồ sơ")
@XPortalPageRequest(uri = "ita/business/updateobject", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class BusinessUpdateService extends DataServiceMarker {
    @Inject
    private ChangeBusinessBo changeBusinessBo;
    @Inject
    private HomeBusinessBo homeBusinessBo;

    @Override
    protected WebDataService service(AbstractBaseAction action, Map<String, Object> params)
            throws WebOSBOException {
        String strStatusType = XParamUtils.getString("statusType", params, "");
        String ID = XParamUtils.getString("idHomeBusiness", params, "");
        if(strStatusType.equals(EnumStatus.CAP_DOI.toString()))
        {
            ChangeBusiness arbmodel = action.getModel(ChangeBusiness.class);

            changeBusinessBo.update(ID,arbmodel);

            return new ObjectWebDataservice<ChangeBusiness>(arbmodel);
        }
        else
        {
            HomeBusiness arbmodel = action.getModel(HomeBusiness.class);

            homeBusinessBo.update(ID,arbmodel);
            return new ObjectWebDataservice<HomeBusiness>(arbmodel);
        }



    }

}