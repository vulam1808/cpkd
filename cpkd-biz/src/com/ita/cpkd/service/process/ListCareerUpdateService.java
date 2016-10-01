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
import com.ita.cpkd.bo.ListCareerBo;
import com.ita.cpkd.model.ListCareer;

import javax.inject.Inject;
import javax.inject.Named;
import java.util.Map;

/**
 * SaveService.
 *
 * @author Duyen Tang
 * @version $Id: SaveService.java 2015-04-20 11:09:38z tttduyen $
 *
 * @since 1.0
 */
@Named("ita_listcareer_updateservice")
@XPortalDataService(roles = {"cpkd.master"}, description = "Danh Mục")

@XPortalPageRequest(uri = "ita/listcareer/update", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)

public class ListCareerUpdateService extends DataServiceMarker {
    @Inject
    private ListCareerBo listContributorBo;

    @Override
    protected WebDataService service(AbstractBaseAction action, Map<String, Object> params)
            throws WebOSBOException {
        ListCareer arbmodel = action.getModel(ListCareer.class);
        String id = XParamUtils.getString("uuid", params, "");
        // TODO check your required data

        // save account
        //district.setUuid(districtBo.add(district));
        listContributorBo.update(id,arbmodel);
        arbmodel.setUuid(id);

        return new ObjectWebDataservice<ListCareer>(arbmodel);
    }

}
