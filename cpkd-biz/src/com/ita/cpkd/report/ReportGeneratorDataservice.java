package com.ita.cpkd.report;

/**
 * Created by ACER on 11/11/2016.
 */

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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.inject.Named;
import java.util.Map;

/**
 * ReportGeneratorDataservice.
 *
 * @author Phong Tran
 * @version $Id: ReportGeneratorDataservice.java Jan 10, 2014 3:48:48 PM phongtt@inetcloud.vn $
 * @since 1.0
 */
@Named("ITAexcelgenerator")
@XPortalDataService(roles = {"cpkd.report"}, description = "Excel service")
@XPortalPageRequest(uri = "cpkd/excel/generator", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class ReportGeneratorDataservice extends AbstractReportGenerator {
    private static final Logger logger = LoggerFactory.getLogger(
            ReportGeneratorDataservice.class);

    @Inject
    private ReportTemplateBO templateBO;
    @Inject
    private SiteBO siteBO;

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


        String application = FrameConstant.FRAMECORE_APPLICATION;
        String module = FrameConstant.FRAMECORE_MODULE;
        String type = XParamUtils.getString("type", params);

        String file = type + "Report.xls";

        logger.debug("ReportGeneratorDataservice {} begin", file);

        //site,application,module,type,name
        ReportTemplate rpTemp = templateBO.loadByApplication(action.getSiteID(), application, module, type, file);
        logger.debug("ReportTemplate {} is loading!", rpTemp);

        final SiteDataModel siteModel = siteBO.load(action.getSiteID());

        params.put("templateID", rpTemp.getUuid());
        params.put("orgID", siteModel.getOrganiId());
        params.put("siteID", siteModel.getUuid());

        logger.debug("export excel for siteID {} with templateID {}", siteModel.getUuid(), rpTemp.getUuid());
        logger.debug("orgID {}", siteModel.getOrganiId());

        // get site object from this request
        WebDataService rsl = super.service(action, params);

        logger.debug("ReportGeneratorDataservice: {}", rsl);
        return rsl;
    }
}

