package com.ita.service.master;

import com.inet.xportal.web.WebConstant;
import com.inet.xportal.web.action.AbstractBaseAction;
import com.inet.xportal.web.annotation.XPortalDataService;
import com.inet.xportal.web.annotation.XPortalPageRequest;
import com.inet.xportal.web.exception.WebOSBOException;
import com.inet.xportal.web.interfaces.DataServiceMarker;
import com.inet.xportal.web.interfaces.ObjectWebDataservice;
import com.inet.xportal.web.interfaces.WebDataService;
import com.inet.xportal.web.util.XParamUtils;
import com.ita.bo.CareerBo;
import com.ita.model.Career;

import javax.inject.Inject;
import javax.inject.Named;
import java.util.Map;


/**
 * Created by HS on 13/09/2016.
 */
@Named("ita_career_updateservice")
@XPortalDataService(roles = {"cpkd.master"}, description = "Danh Muc")
@XPortalPageRequest(uri = "ita/career/update", model = "com.ita.model.Career", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class CareerUpdateService extends DataServiceMarker{

    @Inject
    private CareerBo careerBo;
    @Override
    protected WebDataService service(AbstractBaseAction action, Map<String, Object> params)
            throws WebOSBOException {
        Career areabusinessmodel = action.getModel(Career.class);
        String id = XParamUtils.getString("uuid", params, "");
        // TODO check your required data

        // save account
        //district.setUuid(districtBo.add(district));
        careerBo.update(id,areabusinessmodel);
        areabusinessmodel.setUuid(id);

        return new ObjectWebDataservice<Career>(areabusinessmodel);
    }
}
