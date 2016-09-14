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
import com.ita.cpkd.bo.CareerBo;

import javax.inject.Inject;
import javax.inject.Named;
import java.util.Map;


/**
 * Created by HS on 13/09/2016.
 */
@Named("ita_personrepresent_deleteservice")
@XPortalDataService(roles = {"cpkd.master"}, description = "Danh Mục")
@XPortalPageRequest(uri = "ita/personrepresent/delete", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class PersonRepresentDeleteService extends DataServiceMarker {
    @Inject
    private CareerBo careerBo;
    @Override
    protected WebDataService service(AbstractBaseAction action, Map<String, Object> params)
            throws WebOSBOException {
        //District district = action.getModel(District.class);
        String id = XParamUtils.getString("uuid", params, "");
        // TODO check your required data
       /* Query<JSONDB> query = new QueryImpl<JSONDB>();
        query.field("code").equal(code);*/
        // save account
        //district.setUuid(districtBo.add(district));
        careerBo.remove(id);


        return new ObjectWebDataservice<String>(id);
    }
}
