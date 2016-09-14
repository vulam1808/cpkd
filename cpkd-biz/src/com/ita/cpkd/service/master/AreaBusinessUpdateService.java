
package com.ita.cpkd.service.master;

import javax.inject.Inject;


import javax.inject.Named;
import java.util.Map;
import com.inet.xportal.web.WebConstant;
import com.inet.xportal.web.action.AbstractBaseAction;
import com.inet.xportal.web.annotation.XPortalDataService;
import com.inet.xportal.web.annotation.XPortalPageRequest;
import com.inet.xportal.web.exception.WebOSBOException;
import com.inet.xportal.web.interfaces.DataServiceMarker;
import com.inet.xportal.web.interfaces.ObjectWebDataservice;
import com.inet.xportal.web.interfaces.WebDataService;
import com.inet.xportal.web.util.XParamUtils;

import com.ita.cpkd.bo.AreaBusinessBo;
import com.ita.cpkd.model.AreaBusiness;



/**
 * Created by HS on 13/09/2016.
 */
@Named("ita_areabusiness_updateservice")
@XPortalDataService(roles = {"cpkd.master"}, description = "Danh Mục")
@XPortalPageRequest(uri = "ita/areabusiness/update", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class AreaBusinessUpdateService extends DataServiceMarker{

    @Inject
    private AreaBusinessBo areabusinessBo;
    @Override
    protected WebDataService service(AbstractBaseAction action, Map<String, Object> params)
            throws WebOSBOException {
        AreaBusiness areabusinessmodel = action.getModel(AreaBusiness.class);
        String id = XParamUtils.getString("uuid", params, "");
        // TODO check your required data

        // save account
        //district.setUuid(districtBo.add(district));
        areabusinessBo.update(id,areabusinessmodel);
        areabusinessmodel.setUuid(id);

        return new ObjectWebDataservice<AreaBusiness>(areabusinessmodel);
    }
}
