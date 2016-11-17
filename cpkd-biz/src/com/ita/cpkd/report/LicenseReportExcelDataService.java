package com.ita.cpkd.report;

import com.inet.xportal.module.web.model.FirmProfileModel;
import com.inet.xportal.nosql.web.bo.SiteBO;
import com.inet.xportal.nosql.web.bo.SubFirmProfileBO;
import com.inet.xportal.nosql.web.data.SearchDTO;
import com.inet.xportal.nosql.web.model.SiteDataModel;
import com.inet.xportal.nosql.web.model.SubFirmProfile;
import com.inet.xportal.report.ReportService;
import com.inet.xportal.web.context.WebContext;
import com.inet.xportal.web.exception.WebOSBOException;
import com.inet.xportal.web.util.SecurityUtil;
import com.inet.xportal.web.util.XParamUtils;
import com.ita.cpkd.bo.HomeBusinessBo;
import net.sf.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.inject.Named;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by ACER on 11/11/2016.
 */
@Named("reportlicenseexcel")
public class LicenseReportExcelDataService implements ReportService {
    private static final Logger logger = LoggerFactory.getLogger(LicenseReportExcelDataService.class);
    @Inject
    private SiteBO siteBO;
    @Inject
    private HomeBusinessBo homeBusinessBo;

    @Override
    public Object invoke(final Map<String, Object> params) throws WebOSBOException {
        try {
            logger.debug("preparing data ...........................................");
            final Map<String, Object> reports = new HashMap<String, Object>();

            String reportID = XParamUtils.getString("templateID", params);
            logger.debug("templateID : {} ", reportID);

            String orgID = XParamUtils.getString("orgID", params);
            logger.debug("Organization ID : {} ", orgID);

            String siteID = XParamUtils.getString("siteID", params);
            logger.debug("Site/subfirm ID : {} ", siteID);

            String homeBusinessID = XParamUtils.getString("homeBusinessID", params);
            homeBusinessBo.loadReportLicenseByHomeBusinessID(homeBusinessID);
            reports.put("report", homeBusinessID);
            final SiteDataModel siteData = siteBO.load(siteID);



            final SubFirmProfile firmData = WebContext.INSTANCE.cache()
                    .getBean(SubFirmProfileBO.class)
                    .load(siteID);

            if (firmData != null) {
                reports.put("sitereport", firmData);
            } else {
                reports.put("sitereport", siteData);
            }

            JSONObject paramsreport = new JSONObject();
            for (String key : params.keySet()) {
                paramsreport.put(key, params.get(key));
            }

            long printDate = System.currentTimeMillis();
            paramsreport.put("printDate", printDate);
            paramsreport.put("printDay", new SimpleDateFormat("dd").format(new Date(printDate)));
            paramsreport.put("printMonth", new SimpleDateFormat("MM").format(new Date(printDate)));
            paramsreport.put("printYear", new SimpleDateFormat("yyyy").format(new Date(printDate)));

            paramsreport.put("usercode", SecurityUtil.getPrincipal());
            paramsreport.put("username", SecurityUtil.getAlias());
            reports.put("paramsreport", paramsreport);




            return reports;
        } catch (Throwable ex) {
            logger.warn("Report [onegatechecklistexcel] fail: {}", ex);
            return null;
        }
    }
}
