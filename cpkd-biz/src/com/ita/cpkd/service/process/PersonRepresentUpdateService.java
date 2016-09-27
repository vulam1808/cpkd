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
import com.ita.cpkd.bo.ChangeBusinessBo;
import com.ita.cpkd.bo.HomeBusinessBo;
import com.ita.cpkd.bo.PersonRepresentBo;
import com.ita.cpkd.enums.EnumStatus;
import com.ita.cpkd.model.ChangeBusiness;
import com.ita.cpkd.model.HomeBusiness;
import com.ita.cpkd.model.PersonRepresent;

import javax.inject.Inject;
import javax.inject.Named;
import java.util.Map;


/**
 * Created by HS on 13/09/2016.
 */
@Named("ita_personrepresent_updateservice")
@XPortalDataService(roles = {"cpkd.master"}, description = "Danh Mục")
@XPortalPageRequest(uri = "ita/personrepresent/update", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class PersonRepresentUpdateService extends DataServiceMarker{

    @Inject
    private PersonRepresentBo personBo;
    @Inject
    private HomeBusinessBo homeBusinessBo;
    @Inject
    private ChangeBusinessBo changeBusinessBo;
    @Override
    protected WebDataService service(AbstractBaseAction action, Map<String, Object> params)
            throws WebOSBOException {
        PersonRepresent peronmodel = action.getModel(PersonRepresent.class);
        String idPersonRepresent = XParamUtils.getString("idPersonRepresent", params, "");
        String idHomeBusiness = XParamUtils.getString("idHomeBusiness", params, "");
        String statusType = XParamUtils.getString("statusType", params, "");
        //Neu da ton tai person thi update
        if(!idPersonRepresent.equals("")) {

            personBo.update(idPersonRepresent, peronmodel);
            peronmodel.setUuid(idPersonRepresent);
        }
        else
        {
            String uuid = personBo.add(peronmodel);
            peronmodel.setUuid(uuid);
            if(statusType.equals(EnumStatus.CAP_DOI.toString()))
            {

                ChangeBusiness objchange = new ChangeBusiness();
                objchange.setPersonRepresent_ID(uuid);
                changeBusinessBo.update(idHomeBusiness, objchange);

            }
            else
            {
                HomeBusiness objHome = new HomeBusiness();
                objHome.setPersonRepresent_ID(uuid);
                homeBusinessBo.update(idHomeBusiness,objHome);
            }
        }

        return new ObjectWebDataservice<PersonRepresent>(peronmodel);
    }
}
