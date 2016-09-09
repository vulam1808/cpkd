/*****************************************************************
 Copyright 2015 by Duyen Tang (tttduyen@inetcloud.vn)

 Licensed under the iNet Solutions Corp.,;
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.inetcloud.vn/licenses

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 *****************************************************************/
package com.ita.service.master;

import java.util.Map;

import javax.inject.Inject;
import javax.inject.Named;


import com.inet.xportal.nosql.web.data.SearchDTO;
import com.ita.bo.DistrictBo;
import com.inet.xportal.web.WebConstant;
import com.inet.xportal.web.action.AbstractBaseAction;
import com.inet.xportal.web.annotation.XPortalDataService;
import com.inet.xportal.web.annotation.XPortalPageRequest;
import com.inet.xportal.web.exception.WebOSBOException;
import com.inet.xportal.web.interfaces.DataServiceMarker;
import com.inet.xportal.web.interfaces.ObjectWebDataservice;
import com.inet.xportal.web.interfaces.WebDataService;
import com.ita.bo.ProvinceBo;
import com.ita.model.District;
import com.ita.model.Province;

/**
 * SaveService.
 *
 * @author Duyen Tang
 * @version $Id: SaveService.java 2015-04-20 11:09:38z tttduyen $
 *
 * @since 1.0
 */
@Named("ita_province_saveservice")
@XPortalDataService(roles = {"cpkd.master"}, description = "Danh M?c")
@XPortalPageRequest(uri = "ita/province/save", model = "com.ita.model.Province", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class ProvinceSaveService extends DataServiceMarker {
    @Inject
    private ProvinceBo provinceBo;

    @Override
    protected WebDataService service(AbstractBaseAction action, Map<String, Object> params)
            throws WebOSBOException {
        Province province = action.getModel(Province.class);

        // TODO check your required data

        // save account
        //district.setUuid(districtBo.add(district));
        String uuid= provinceBo.add(province);
        province.setUuid(uuid);


        return new ObjectWebDataservice<Province>(province);
    }

}
