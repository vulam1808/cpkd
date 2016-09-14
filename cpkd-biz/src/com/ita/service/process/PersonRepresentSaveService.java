package com.ita.service.process;

import com.inet.xportal.web.WebConstant;
import com.inet.xportal.web.action.AbstractBaseAction;
import com.inet.xportal.web.annotation.XPortalDataService;
import com.inet.xportal.web.annotation.XPortalPageRequest;
import com.inet.xportal.web.exception.WebOSBOException;
import com.inet.xportal.web.interfaces.DataServiceMarker;
import com.inet.xportal.web.interfaces.ObjectWebDataservice;
import com.inet.xportal.web.interfaces.WebDataService;
import com.ita.bo.PersonRepresentBo;
import com.ita.model.PersonRepresent;

import javax.inject.Inject;
import javax.inject.Named;
import java.util.Map;


/**
 * Created by HS on 13/09/2016.
 */
@Named("ita_personrepresent_saveservice")
@XPortalDataService(roles = {"cpkd.master"}, description = "Danh Mục")
@XPortalPageRequest(uri = "ita/personrepresent/save", model = "com.ita.model.PersonRepresent", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class PersonRepresentSaveService extends DataServiceMarker {
    @Inject
    private PersonRepresentBo personRepresentBo;

    @Override
    protected WebDataService service(AbstractBaseAction action, Map<String, Object> params)
            throws WebOSBOException {
        PersonRepresent arbmodel = action.getModel(PersonRepresent.class);

        // TODO check your required data

        // save account
        //district.setUuid(districtBo.add(district));
        String uuid= personRepresentBo.add(arbmodel);
        arbmodel.setUuid(uuid);

        return new ObjectWebDataservice<PersonRepresent>(arbmodel);
    }

}
