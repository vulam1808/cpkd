package com.ita.cpkd.service.report;

/**
 * Created by ACER on 11/11/2016.
 */

import com.inet.xportal.web.interfaces.DataServiceMarker;
import com.inet.xportal.web.interfaces.ObjectWebDataservice;
import com.ita.cpkd.FrameConstant;

import com.inet.xportal.nosql.web.bo.SiteBO;

import com.inet.xportal.nosql.web.model.SiteDataModel;
import com.inet.xportal.report.bo.ReportTemplateBO;
import com.inet.xportal.report.dataservice.AbstractReportGenerator;
import com.inet.xportal.report.model.ReportTemplate;
import com.inet.xportal.web.WebConstant;
import com.inet.xportal.web.action.AbstractBaseAction;
import com.inet.xportal.web.annotation.XPortalDataService;
import com.inet.xportal.web.annotation.XPortalPageRequest;
import com.inet.xportal.web.exception.WebOSBOException;
import com.inet.xportal.web.interfaces.WebDataService;
import com.inet.xportal.web.util.XParamUtils;
import com.ita.cpkd.bo.BusinessDetailBo;
import com.ita.cpkd.enums.EnumProcess;
import net.sf.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.inject.Named;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * ReportListDataservice.
 *
 * @author Phong Tran
 * @version $Id: ReportGeneratorDataservice.java Jan 10, 2014 3:48:48 PM phongtt@inetcloud.vn $
 * @since 1.0
 */
@Named("reportlist")
@XPortalDataService(roles = {"cpkd.report"}, description = "Report")
@XPortalPageRequest(uri = "cpkd/reportlist", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class ReportListDataService extends DataServiceMarker {
    private static final Logger logger = LoggerFactory.getLogger(
            ReportListDataService.class);
    @Inject
    private BusinessDetailBo businessDetailBo;

    /*
     * (non-Javadoc)
     *
     * @see
     * com.inet.xportal.web.interfaces.DataServiceMarker#service(com.inet.xportal
     * .web.action.AbstractBaseAction, java.util.Map)
     */
    @Override
    protected WebDataService service(final AbstractBaseAction action, final Map<String, Object> params)
            throws WebOSBOException {


        List<JSONObject> obj = new ArrayList<JSONObject>();
        try {
            String dateStart = XParamUtils.getString("dateStart", params);
            String dateEnd = XParamUtils.getString("dateEnd", params);
            String lstTypeTask = XParamUtils.getString("lstTypeTask", params);
            String lstAreaID = XParamUtils.getString("lstAreaID", params);
            logger.debug("ReportListDataService params: {} , {} ", lstTypeTask,lstAreaID);
            logger.debug("ReportListDataService params: {} , {} ", dateStart,dateEnd);
            obj = businessDetailBo.loadTaskByStatusType(dateStart,dateEnd,lstTypeTask,lstAreaID);

        }
        catch (Throwable ex) {
            logger.warn("ReportListDataService fail: {}", ex);
        }
        //logger.debug("obj {}", obj);
        return new ObjectWebDataservice<List<JSONObject>>(obj);
    }
}

