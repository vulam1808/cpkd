
package com.ita.cpkd.service.process;

import com.inet.xportal.web.WebConstant;
import com.inet.xportal.web.action.AbstractBaseAction;
import com.inet.xportal.web.annotation.XPortalDataService;
import com.inet.xportal.web.annotation.XPortalPageRequest;
import com.inet.xportal.web.exception.WebOSBOException;
import com.inet.xportal.web.interfaces.DataServiceMarker;
import com.inet.xportal.web.interfaces.ObjectWebDataservice;
import com.inet.xportal.web.interfaces.WebDataService;
import com.ita.cpkd.bo.PauseBusinessBo;
import com.ita.cpkd.model.PauseBusiness;

import javax.inject.Inject;
import javax.inject.Named;
import java.util.Map;


/**
 * Created by HS on 13/09/2016.
 */
@Named("ita_pausebusiness_saveservice")

@XPortalDataService(roles = {"cpkd.create"}, description = "Tạo hồ sơ")
@XPortalPageRequest(uri = "ita/pausebusiness/save", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class PauseBusinessNewService extends DataServiceMarker{

    @Inject
    private PauseBusinessBo pausebusinessBo;

    @Override
    protected WebDataService service(AbstractBaseAction action, Map<String, Object> params)
            throws WebOSBOException {
        PauseBusiness arbmodel = action.getModel(PauseBusiness.class);

        // TODO check your required data

        // save account
        //district.setUuid(districtBo.add(district));

        String uuid= pausebusinessBo.add(arbmodel);
        arbmodel.setUuid(uuid);

        return new ObjectWebDataservice<PauseBusiness>(arbmodel);
    }

}
