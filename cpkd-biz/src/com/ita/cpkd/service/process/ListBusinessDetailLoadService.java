
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
import com.ita.cpkd.enums.EnumProcess;
import com.ita.cpkd.model.BusinessDetail;
import com.ita.cpkd.model.Details;
import net.sf.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.inject.Named;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


/**
 * Created by HS on 13/09/2016.
 */
@Named("ita_listbusinessdetail_loadservice")
@XPortalDataService(roles = {"cpkd.master"}, description = "Danh Mục")
@XPortalPageRequest(uri = "ita/listbusinessdetail/load",  result = WebConstant.ACTION_XSTREAM_JSON_RESULT)

public class ListBusinessDetailLoadService extends DataServiceMarker {
    protected static final Logger logger = LoggerFactory.getLogger(ListBusinessDetailLoadService.class);
    @Inject
    private BusinessDetailBo businessDetailBo;

    @Override
    protected WebDataService service(AbstractBaseAction action, Map<String, Object> params)
            throws WebOSBOException {
        List<JSONObject> obj = new ArrayList<JSONObject>();
        try {
            String act = XParamUtils.getString("act", params);
            logger.debug("act {}", act);

            if (act.equals(EnumProcess.PROCESS.toString())) {
                obj = businessDetailBo.loadListTaskProcess(EnumProcess.PROCESS.toString());
                //BusinessDetail item = businessDetailBo.load("57f2665b703f902f0c8944f9");

            }
            else if (act.equals(EnumProcess.PROCESS_ID.toString())) {
                obj = businessDetailBo.loadListTaskProcess(EnumProcess.PROCESS_ID.toString());
                //BusinessDetail item = businessDetailBo.load("57f2665b703f902f0c8944f9");

            }
            else if (act.equals(EnumProcess.PROCESS_TAX.toString())) {
                obj = businessDetailBo.loadListTaskProcess(EnumProcess.PROCESS_TAX.toString());
                //BusinessDetail item = businessDetailBo.load("57f2665b703f902f0c8944f9");

            }
            else if (act.equals(EnumProcess.DONE.toString())) {
                obj = businessDetailBo.loadListTaskProcess(EnumProcess.DONE.toString());
                //BusinessDetail item = businessDetailBo.load("57f2665b703f902f0c8944f9");

            }

        }
        catch (Throwable ex) {
                logger.warn("The expway service fail: {}", ex);
        }
        //logger.debug("obj {}", obj);
        return new ObjectWebDataservice<List<JSONObject>>(obj);

    }
}
