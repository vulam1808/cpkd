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
import com.inet.xportal.xdb.business.BaseDBStore;
import com.inet.xportal.xdb.persistence.JSONDB;
import com.inet.xportal.xdb.query.Query;
import com.inet.xportal.xdb.query.impl.QueryImpl;
import com.ita.cpkd.bo.HomeBusinessBo;
import com.ita.cpkd.bo.PersonRepresentBo;
import com.ita.cpkd.model.HomeBusiness;
import com.ita.cpkd.model.PersonRepresent;

import javax.inject.Inject;
import javax.inject.Named;
import java.util.Map;


/**
 * Created by HS on 13/09/2016.
 */
@Named("ita_personrepresent_loadservice")
@XPortalDataService(roles = {"cpkd.master"}, description = "Danh Mục")
@XPortalPageRequest(uri = "ita/personrepresent/load", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class PersonRepresentLoadService extends DataServiceMarker {
    @Inject
    private PersonRepresentBo personBo;
    private HomeBusinessBo homeBusinessBo;

    @Override
    protected WebDataService service(AbstractBaseAction action, Map<String, Object> params)
            throws WebOSBOException {
        //District district = action.getModel(District.class);
        PersonRepresent pes = new PersonRepresent();
        String taskID = XParamUtils.getString("taskID", params, "");


        HomeBusiness objHome = homeBusinessBo.loadHomeBusinessByTaskID(taskID);
        /*Query<JSONDB> query = new QueryImpl<JSONDB>();
        query.field("homeBusiness_ID").equal(objHome.getUuid());
        SearchDTO<PersonRepresent> lstPerson = personBo.query((QueryImpl<JSONDB>) query);*/
        if(objHome!=null) {
            pes = personBo.load(objHome.getPersonRepresent_ID());
            if (pes == null) {
                pes = new PersonRepresent();
            }
        }
       /* if(lstPerson.getTotal()>0)
        {
            pes = lstPerson.getItems().get(0);
        }*/
        return new ObjectWebDataservice<PersonRepresent>(pes);
    }
}
