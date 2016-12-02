package com.ita.cpkd.report;


import com.inet.xportal.nosql.web.bo.SiteBO;

import com.inet.xportal.report.ReportService;
import com.inet.xportal.web.exception.WebOSBOException;
import com.inet.xportal.web.util.XParamUtils;
import com.ita.cpkd.bo.BusinessDetailBo;
import com.ita.cpkd.bo.HomeBusinessBo;
import com.mongodb.util.JSON;
import net.sf.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.inject.Named;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by ACER on 11/11/2016.
 */
@Named("reportlistexcel")
public class ReportListExcelDataService implements ReportService {
    private static final Logger logger = LoggerFactory.getLogger(ReportListExcelDataService.class);

    @Inject
    private BusinessDetailBo businessDetailBo;

    @Override
    public Object invoke(final Map<String, Object> params) throws WebOSBOException {
        try {
            logger.debug("preparing data ...........................................");
            final Map<String, Object> reports = new HashMap<String, Object>();

            String dateStart = XParamUtils.getString("dateStart", params);
            String dateEnd = XParamUtils.getString("dateEnd", params);
            String lstTypeTask = XParamUtils.getString("lstTypeTask", params);
            String lstAreaID = XParamUtils.getString("lstAreaID", params);

            List<JSONObject> obj =  businessDetailBo.loadTaskByStatusType(dateStart,dateEnd,lstTypeTask,lstAreaID);
            logger.debug("ReportListExcelDataService params: {} ", obj.size());



            reports.put("resultreport", obj);
            return reports;
        } catch (Throwable ex) {
            logger.warn("Report [onegatechecklistexcel] fail: {}", ex);
            return null;
        }
    }
}
