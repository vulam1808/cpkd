package com.ita.cpkd.service.master;

import com.inet.xportal.web.WebConstant;
import com.inet.xportal.web.action.AbstractBaseAction;
import com.inet.xportal.web.annotation.XPortalDataService;
import com.inet.xportal.web.annotation.XPortalPageRequest;
import com.inet.xportal.web.exception.WebOSBOException;
import com.inet.xportal.web.interfaces.DataServiceMarker;
import com.inet.xportal.web.interfaces.ObjectWebDataservice;
import com.inet.xportal.web.interfaces.WebDataService;
import com.ita.cpkd.bo.CareerBo;
import com.ita.cpkd.model.Career;

import javax.inject.Inject;
import javax.inject.Named;
import java.util.Map;


/**
 * Created by HS on 13/09/2016.
 */
@Named("ita_career_saveservice")
@XPortalDataService(roles = {"cpkd.master"}, description = "Danh Mục")
@XPortalPageRequest(uri = "ita/career/save", model = "com.ita.cpkd.model.Career", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class CareerSaveService extends DataServiceMarker {
    @Inject
    private CareerBo careerBo;

    @Override
    protected WebDataService service(AbstractBaseAction action, Map<String, Object> params)
            throws WebOSBOException {
        Career arbmodel = action.getModel(Career.class);

        // TODO check your required data

        // save account
        //district.setUuid(districtBo.add(district));
        String uuid= careerBo.add(arbmodel);
        arbmodel.setUuid(uuid);

        return new ObjectWebDataservice<Career>(arbmodel);
    }

}
