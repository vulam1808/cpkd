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

package com.ita.cpkd.report;

import java.util.Map;

import javax.inject.Named;

import com.inet.xportal.report.ReportService;
import com.inet.xportal.web.exception.WebOSBOException;

/**
 *
 */
@Named("fnexceldataserviceita")
public class FnExcelDataservice implements ReportService {
    /*
     * (non-Javadoc)
     *
     * @see com.inet.xportal.report.ReportService#invoke(java.util.Map)
     */
    @Override
    public Object invoke(final Map<String, Object> params) throws WebOSBOException {
        return new FnExcelCtx();
    }
}