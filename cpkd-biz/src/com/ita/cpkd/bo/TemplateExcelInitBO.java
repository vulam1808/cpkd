package com.ita.cpkd.bo;
/*
 * ****************************************************************
 *    Copyright 2015 by Phong Tran (phongtt@inetcloud.vn)
 *
 *    Licensed under the iNet Solutions Corp.,;
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.inetcloud.vn/licenses
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 *  ****************************************************************
 */



import com.ita.cpkd.FrameConstant;
import com.inet.xportal.nosql.web.bo.SiteBO;
import com.inet.xportal.nosql.web.bo.SubFirmProfileBO;
import com.inet.xportal.nosql.web.data.SearchDTO;
import com.inet.xportal.nosql.web.model.SiteDataModel;
import com.inet.xportal.nosql.web.model.SubFirmProfile;
import com.inet.xportal.report.bo.ReportTemplateBO;
import com.inet.xportal.report.model.ReportTemplate;
import com.inet.xportal.web.util.MimeTypeUtil;
import com.inet.xportal.web.util.ResourceUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.inject.Named;

/**
 * TemplateExcelInitBO.
 *
 * @author Phong Tran
 * @version $Id: TemplateExcelInitBO.java 9/8/2015 1:55 PM phongtt@inetcloud.vn
 *          $
 * @since 1.0
 */
@Named("ITATemplateExcelInitBO")
public class TemplateExcelInitBO {
    private static final Logger logger = LoggerFactory.getLogger(TemplateExcelInitBO.class);

    @Inject
    private ReportTemplateBO templateBO;

    @Inject
    private SiteBO siteBO;

    @Inject
    private SubFirmProfileBO subfirmBO;

    public void init() {
        // initiate report for sites
        final SearchDTO<SiteDataModel> result = siteBO.query();
        if (result != null && result.getTotal() > 0) {
            for (SiteDataModel siteItem : result.getItems()) {
                addReport(siteItem.getUuid(), siteItem.getName());
            }
        }

        // initiate report for sub-sites
        final SearchDTO<SubFirmProfile> subresult = subfirmBO.query();
        if (subresult != null && subresult.getTotal() > 0) {
            for (SubFirmProfile siteItem : subresult.getItems()) {
                addReport(siteItem.getUuid(), siteItem.getName());
            }
        }
    }

    /**
     * @param siteID
     * @param siteName
     */
    private void addReport(String siteID, String siteName) {
        logger.debug("init template with site: {}: {}", siteID, siteName);
        addTemplate(siteID,
                "License",
                "Report.xls",
                "License report!");
        addTemplate(siteID,
                "Summary4",
                "Report.xls",
                "Summary report!");
        addTemplate(siteID,
                "List",
                "Report.xls",
                "List report!");
        /*addTemplate(siteID,
                "Task",
                "Report.xls",
                "Task report!");

        addTemplate(siteID,
                "Record",
                "Report.xls",
                "Status of citizen applicant!");

        addTemplate(siteID,
                "Summary",
                "Report.xls",
                "Summary report!");

        addTemplate(siteID,
                "Detail",
                "Report.xls",
                "Detail report!");

        addTemplate(siteID,
                "ProcedureDetail",
                "Report.xls",
                "Procedure Detail report!");

        addTemplate(siteID,
                "CheckList",
                "Report.xls",
                "Check List report!");*/
    }

    /**
     * @param siteID
     * @param type
     * @param name
     * @param description
     */
    private void addTemplate(String siteID,
                             String type,
                             String name,
                             String description) {
        final ReportTemplate rpTemp = new ReportTemplate();
        rpTemp.setApplication(FrameConstant.FRAMECORE_APPLICATION);
        rpTemp.setModule(FrameConstant.FRAMECORE_MODULE);
        rpTemp.setType(type);
        rpTemp.setName(type + name);
        rpTemp.setDescription(description);
        rpTemp.setSite(siteID);

        String reportName = "EXCEL-TEMP/" + rpTemp.getName();

        final ReportTemplate rpSaved = templateBO.loadByApplication(siteID,
                FrameConstant.FRAMECORE_APPLICATION,
                FrameConstant.FRAMECORE_MODULE, type,
                type + name);

        if (rpSaved != null) {
            templateBO.remove(rpSaved.getUuid());
        }

        templateBO.add(rpTemp,
                ResourceUtil.getResourceAsInputStream(reportName),
                MimeTypeUtil.getMimeTypeByFile(reportName));
    }
}

