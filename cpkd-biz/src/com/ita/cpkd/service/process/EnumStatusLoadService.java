
package com.ita.cpkd.service.process;


import javax.inject.Inject;


import javax.inject.Named;
import java.util.ArrayList;
import java.util.List;
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
import com.ita.cpkd.bo.HomeBusinessBo;
import com.ita.cpkd.enums.EnumChangeInfo;
import com.ita.cpkd.enums.EnumStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * Created by HS on 13/09/2016.
 */
@Named("ita_enums_loadservice")

@XPortalDataService(roles = {"cpkd.view"}, description = "Xem hồ sơ")
@XPortalPageRequest(uri = "ita/enums/load", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)

public class EnumStatusLoadService extends DataServiceMarker {
    protected static final Logger logger = LoggerFactory.getLogger(EnumStatusLoadService.class);

    @Override
    protected WebDataService service(AbstractBaseAction action, Map<String, Object> params)
            throws WebOSBOException {
        //District district = action.getModel(District.class);
        String type = XParamUtils.getString("typeEnum", params, "");
        List<String> lstRs = new ArrayList<String>();

        /*logger.debug("typeEnum {}: compare CHANGE {}", type, type.equals("CHANGE"));*/
        if(type.equals("CHANGE"))
        {
            for (EnumChangeInfo d: EnumChangeInfo.values())
            {
                lstRs.add(d.toString());
            }
        }
        else if(type.equals("STATUS"))
        {
            for (EnumStatus d: EnumStatus.values())
            {
                lstRs.add(d.toString());
            }
        }

        // TODO check your required data
       /* Query<JSONDB> query = new QueryImpl<JSONDB>();
        query.field("code").equal(code);*/
        // save account
        //district.setUuid(districtBo.add(district));



        return new ObjectWebDataservice<List<String>>(lstRs);
    }
}
