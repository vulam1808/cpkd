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
import net.sf.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
@Named("BusinessDetailBo")
public class BusinessDetailBo extends MagicContentBO<BusinessDetail> {
    protected static final Logger logger = LoggerFactory.getLogger(BusinessDetailBo.class);
    /**
     * Create {@link AccountBo} instance
     *
     * @param contentBf the given {@link MagicContentBF}
     */
    @Inject
    protected BusinessDetailBo(@ContentContext(context = "itaNoSqlContext") MagicContentBF contentBf) {
        super(contentBf, "businessDetail");
    }
    public JSONObject loadBusinessDetailByTaskID(String taskID) throws WebOSBOException {
       /* Date abc = new Date(0l);
        abc.get*/
        JSONObject obj =new JSONObject();
        /*Query<JSONDB> query = new QueryImpl<JSONDB>();
        query.field("taskID").equal(taskID);*/
        SearchDTO<BusinessDetail> result = super.query();
        if (result != null && result.getTotal() > 0) {
            for (BusinessDetail item : result.getItems()) {
                String _taskID=item.getTaskID();
                if(_taskID==null)
                {
                    _taskID = item.getHomeBusiness_ID()==null?"":item.getHomeBusiness_ID();
                }
                if (_taskID.equals(taskID)) {
                    obj.put("homebusiness_ID", item.getHomeBusiness_ID());
                    obj.put("statusType", EnumStatus.CAP_MOI.toString());
                    break;
                } else {
                    List<Detail> lstchange = item.getList_changeBusiness_ID();
                    if (lstchange != null) {
                        for (Detail dt : lstchange) {
                            String _dttaskID=dt.getTaskID();
                            if(_dttaskID==null)
                            {
                                _dttaskID = dt.getParent_ID()==null?"":dt.getParent_ID();
                            }
                            if (_dttaskID.equals(taskID)) {
                                obj.put("homebusiness_ID", dt.getParent_ID());
                                obj.put("statusType", EnumStatus.CAP_DOI.toString());
                                break;
                            }
                        }
                    }
                    List<Detail> lstpause = item.getList_pauseBusiness_ID();
                    if (lstpause != null) {
                        for (Detail dt : lstpause) {
                            String _dttaskID=dt.getTaskID();
                            if(_dttaskID==null)
                            {
                                _dttaskID = dt.getParent_ID()==null?"":dt.getParent_ID();
                            }
                            if (_dttaskID.equals(taskID)) {
                                obj.put("homebusiness_ID", dt.getParent_ID());
                                obj.put("statusType", EnumStatus.TAM_NGUNG.toString());
                                break;
                            }
                        }
                    }
                    List<Detail> lstend = item.getList_endBusiness_ID();
                    if (lstend != null) {
                        for (Detail dt : lstend) {
                            String _dttaskID=dt.getTaskID();
                            if(_dttaskID==null)
                            {
                                _dttaskID = dt.getParent_ID()==null?"":dt.getParent_ID();
                            }
                            if (_dttaskID.equals(taskID)) {
                                obj.put("homebusiness_ID", dt.getParent_ID());
                                obj.put("statusType", EnumStatus.CHAM_DUT.toString());
                                break;
                            }
                        }
                    }
                }
            }
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
            //logger.debug("nameBusiness 2 {}", objdetail.getNameBusiness());
        }
        return objdetail;
    }
    public BusinessDetail updateName(String name, String idHomeBusiness) throws WebOSBOException
    {
        Query<JSONDB> query = new QueryImpl<JSONDB>();
        query.field("homeBusiness_ID").equal(idHomeBusiness);
        SearchDTO<BusinessDetail> datas = super.query((QueryImpl<JSONDB>) query);
        BusinessDetail objdetail = new BusinessDetail();

        if(datas.getTotal()>0)
        {

            objdetail = datas.getItems().get(0);
            objdetail.setNameBusiness(name);
            super.update(objdetail.getUuid(), objdetail);
            //logger.debug("nameBusiness 2 {}", objdetail.getNameBusiness());
        }
        return objdetail;
    }
    public BusinessDetail updateStatusProcess(String status,String homeBusinessID,String prant_id) throws WebOSBOException
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
            if(prant_id == null || prant_id.isEmpty())
            {
                objbusinessDetail.setStatusProcess(status);
                super.update(uuid,objbusinessDetail);
                return objbusinessDetail;
            }
            List<Detail> lstChange =objbusinessDetail.getList_changeBusiness_ID();
            if(lstChange!=null )
            {
                for(Detail item : lstChange)
                {
                    String parentID = item.getTaskID();
                    if(parentID == prant_id)
                    {
                        item.setStatusProcess(status);
                        //break;
                        super.update(uuid,objbusinessDetail);
                        return objbusinessDetail;
                    }
                }
            }
            List<Detail> lstPause =objbusinessDetail.getList_pauseBusiness_ID();
            if(lstPause!=null )
            {
                for(Detail item : lstPause)
                {
                    String parentID = item.getTaskID();
                    if(parentID == prant_id)
                    {
                        item.setStatusProcess(status);
                        //break;
                        super.update(uuid,objbusinessDetail);
                        return objbusinessDetail;
                    }
                }
            }
            List<Detail> lstEnd =objbusinessDetail.getList_endBusiness_ID();
            if(lstEnd!=null )
            {
                for(Detail item : lstEnd)
                {
                    String parentID = item.getTaskID();
                    if(parentID == prant_id)
                    {
                        item.setStatusProcess(status);
                        //break;
                        super.update(uuid,objbusinessDetail);
                        return objbusinessDetail;
                    }
                }
            }


        }

        return objbusinessDetail;
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
            objdetail.setTaskID(taskID);
            if(status.equals(EnumStatus.CAP_DOI.toString()))
            {
                List<Detail> lst =objbusinessDetail.getList_changeBusiness_ID();
                if(lst==null)
                    lst = new ArrayList<Detail>();
                lst.add(objdetail);
                objbusinessDetail.setList_changeBusiness_ID(lst);
                //Set name thay doi
                /*if(nameBusiness != null || !nameBusiness.isEmpty() ) {
                    objbusinessDetail.setNameBusiness(nameBusiness);
                }*/
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
            objbusinessDetail.setTaskID(taskID);
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
