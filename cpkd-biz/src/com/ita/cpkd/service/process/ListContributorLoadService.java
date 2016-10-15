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

import com.inet.xportal.nosql.web.data.SearchDTO;
import com.inet.xportal.web.WebConstant;
import com.inet.xportal.web.action.AbstractBaseAction;
import com.inet.xportal.web.annotation.XPortalDataService;
import com.inet.xportal.web.annotation.XPortalPageRequest;
import com.inet.xportal.web.exception.WebOSBOException;
import com.inet.xportal.web.interfaces.DataServiceMarker;
import com.inet.xportal.web.interfaces.ObjectWebDataservice;
import com.inet.xportal.web.interfaces.WebDataService;
import com.inet.xportal.web.util.XParamUtils;
import com.inet.xportal.xdb.persistence.JSONDB;
import com.inet.xportal.xdb.query.Query;
import com.inet.xportal.xdb.query.impl.QueryImpl;
import com.ita.cpkd.bo.HomeBusinessBo;
import com.ita.cpkd.bo.ListContributorBo;
import com.ita.cpkd.enums.EnumStatus;
import com.ita.cpkd.model.HomeBusiness;
import com.ita.cpkd.model.ListContributor;
import com.ita.cpkd.model.PersonRepresent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
@Named("ita_listcontributor_loadservice")
@XPortalDataService(roles = {"cpkd.master"}, description = "Danh Mục")

@XPortalPageRequest(uri = "ita/listcontributor/load", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)

public class ListContributorLoadService extends DataServiceMarker {
    protected static final Logger logger = LoggerFactory.getLogger(ListContributorLoadService.class);
    @Inject
    private ListContributorBo listContributorBo;

    @Override
    protected WebDataService service(AbstractBaseAction action, Map<String, Object> params)
            throws WebOSBOException {
        //District district = action.getModel(District.class);
        SearchDTO<ListContributor> lstContributor = new SearchDTO<ListContributor>();
        String idHomeBusiness = XParamUtils.getString("idHomeBusiness", params, "");
        String statusType = XParamUtils.getString("statusType", params, "");
        // TODO check your required data
        /*logger.debug("idHomeBusiness {}: ", idHomeBusiness);
        logger.debug("statusType {}: ", statusType);*/
        if(statusType.equals(EnumStatus.CAP_DOI.toString()))
        {
                Query<JSONDB> query = new QueryImpl<JSONDB>();
                query.field("changeBusiness_ID").equal(idHomeBusiness);
                lstContributor = listContributorBo.query((QueryImpl<JSONDB>) query);

        }
        else
        {
                Query<JSONDB> query = new QueryImpl<JSONDB>();
                query.field("homeBusiness_ID").equal(idHomeBusiness);
                lstContributor = listContributorBo.query((QueryImpl<JSONDB>) query);

        }


        // save account
        //district.setUuid(districtBo.add(district));
        //SearchDTO<ListContributor> result= listContributorBo.query();


        return new ObjectWebDataservice<SearchDTO<ListContributor>>(lstContributor);
    }

}
