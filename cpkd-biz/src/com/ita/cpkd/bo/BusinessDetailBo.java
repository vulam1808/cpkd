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
package com.ita.cpkd.bo;

import javax.inject.Inject;
import javax.inject.Named;

import com.inet.xportal.nosql.web.data.SearchDTO;
import com.inet.xportal.web.exception.WebOSBOException;
import com.inet.xportal.xdb.persistence.JSONDB;
import com.inet.xportal.xdb.query.Query;
import com.inet.xportal.xdb.query.impl.QueryImpl;
import com.ita.cpkd.enums.EnumStatus;
import com.ita.cpkd.model.Account;
import com.inet.xportal.nosql.web.bf.MagicContentBF;
import com.inet.xportal.nosql.web.bo.MagicContentBO;
import com.inet.xportal.web.context.ContentContext;
import com.ita.cpkd.model.BusinessDetail;
import com.ita.cpkd.model.Detail;
import com.ita.cpkd.model.HomeBusiness;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * AccountBo.
 *
 * @author Duyen Tang
 * @version $Id: AccountBo.java 2015-04-20 11:04:45z tttduyen $
 *
 * @since 1.0
 */
@Named("BusinessDetail")
public class BusinessDetailBo extends MagicContentBO<BusinessDetail> {

    /**
     * Create {@link AccountBo} instance
     *
     * @param contentBf the given {@link MagicContentBF}
     */
    @Inject
    protected BusinessDetailBo(@ContentContext(context = "itaNoSqlContext") MagicContentBF contentBf) {
        super(contentBf, "businessDetail");
    }
    public BusinessDetail loadBusinessDetailByTaskID(String taskID) throws WebOSBOException {
       /* Date abc = new Date(0l);
        abc.get*/
        BusinessDetail obj =new BusinessDetail();
        Query<JSONDB> query = new QueryImpl<JSONDB>();
        query.field("taskProcessID").equal(taskID);
        SearchDTO<BusinessDetail> datas = super.query((QueryImpl<JSONDB>) query);
        if(datas.getTotal()>0)
        {
            obj = datas.getItems().get(0);
        }
        return obj;
    }
    public BusinessDetail loadBusinessDetailByHomeBusinessID(String homeBusinessID) throws WebOSBOException
    {
        /*Query<JSONDB> query = new QueryImpl<JSONDB>();
        query.field("taskID").equal(taskID);
        SearchDTO<HomeBusiness> datas = super.query((QueryImpl<JSONDB>) query);
        HomeBusiness objHome = new HomeBusiness();
        if(datas.getTotal()>0)
        {
             objHome = datas.getItems().get(0);
        }*/
        Query<JSONDB> query = new QueryImpl<JSONDB>();
        query.field("homeBusiness_ID").equal(homeBusinessID);
        SearchDTO<BusinessDetail> datas = super.query((QueryImpl<JSONDB>) query);
        BusinessDetail objdetail = new BusinessDetail();
        if(datas.getTotal()>0)
        {
            objdetail = datas.getItems().get(0);
        }
        return objdetail;
    }
    public BusinessDetail checkName(String name) throws WebOSBOException
    {
        Query<JSONDB> query = new QueryImpl<JSONDB>();
        query.field("nameBusiness").equal(name);
        SearchDTO<BusinessDetail> datas = super.query((QueryImpl<JSONDB>) query);
        BusinessDetail objdetail = new BusinessDetail();
        if(datas.getTotal()>0)
        {
            objdetail = datas.getItems().get(0);
        }
        return objdetail;
    }
    public BusinessDetail saveBusinessDetail(String nameBusiness,String homeBusinessID,String taskID,String status, Detail objdetail) throws WebOSBOException
    {
        /*Query<JSONDB> query = new QueryImpl<JSONDB>();
        query.field("taskID").equal(taskID);
        SearchDTO<HomeBusiness> datas = super.query((QueryImpl<JSONDB>) query);
        HomeBusiness objHome = new HomeBusiness();
        if(datas.getTotal()>0)
        {
             objHome = datas.getItems().get(0);
        }*/

        Query<JSONDB> query = new QueryImpl<JSONDB>();
        query.field("homeBusiness_ID").equal(homeBusinessID);
        SearchDTO<BusinessDetail> datas = super.query((QueryImpl<JSONDB>) query);
        BusinessDetail objbusinessDetail = new BusinessDetail();
        if(datas.getTotal()>0)
        {
            objbusinessDetail = datas.getItems().get(0);
            String uuid = objbusinessDetail.getUuid();
            objbusinessDetail.setTaskProcessID(taskID);
            if(status.equals(EnumStatus.CAP_DOI.toString()))
            {
                List<Detail> lst =objbusinessDetail.getList_changeBusiness_ID();
                if(lst==null)
                    lst = new ArrayList<Detail>();
                lst.add(objdetail);
                objbusinessDetail.setList_changeBusiness_ID(lst);
                //Set name thay doi
                if(nameBusiness != null || !nameBusiness.isEmpty() ) {
                    objbusinessDetail.setNameBusiness(nameBusiness);
                }
                super.update(uuid,objbusinessDetail);
            }
            else if(status.equals(EnumStatus.TAM_NGUNG.toString()))
            {
                List<Detail> lst =objbusinessDetail.getList_pauseBusiness_ID();
                if(lst==null)
                    lst = new ArrayList<Detail>();
                lst.add(objdetail);
                objbusinessDetail.setList_pauseBusiness_ID(lst);
                super.update(uuid,objbusinessDetail);
            }
            else if(status.equals(EnumStatus.CHAM_DUT.toString()))
            {
                List<Detail> lst =objbusinessDetail.getList_endBusiness_ID();
                if(lst==null)
                    lst = new ArrayList<Detail>();
                lst.add(objdetail);
                objbusinessDetail.setList_endBusiness_ID(lst);
                super.update(uuid,objbusinessDetail);

            }
            objbusinessDetail.setUuid(uuid);
        }
        else
        {
            if(nameBusiness != null || !nameBusiness.isEmpty() ) {
                objbusinessDetail.setNameBusiness(nameBusiness);
            }
            objbusinessDetail.setHomeBusiness_ID(homeBusinessID);
            objbusinessDetail.setTaskProcessID(taskID);
            String uuid = super.add(objbusinessDetail);
            objbusinessDetail.setUuid(uuid);
        }
        return objbusinessDetail;
    }
    @Override
    protected Class<BusinessDetail> getClassConvetor() {
        return BusinessDetail.class;
    }
}
