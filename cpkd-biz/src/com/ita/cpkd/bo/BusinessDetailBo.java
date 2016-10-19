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
import com.inet.xportal.web.context.WebContext;
import com.inet.xportal.web.exception.WebOSBOException;
import com.inet.xportal.xdb.persistence.JSONDB;
import com.inet.xportal.xdb.query.Query;
import com.inet.xportal.xdb.query.impl.QueryImpl;
import com.ita.cpkd.enums.EnumProcess;
import com.ita.cpkd.enums.EnumStatus;
import com.ita.cpkd.model.*;
import com.inet.xportal.nosql.web.bf.MagicContentBF;
import com.inet.xportal.nosql.web.bo.MagicContentBO;
import com.inet.xportal.web.context.ContentContext;
import net.sf.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
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
    //protected static final Logger logger = LoggerFactory.getLogger(BusinessDetailBo.class);
    private static final Logger logger = LoggerFactory.getLogger(BusinessDetailBo.class);
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
                    obj.put("nameBusiness", item.getNameBusiness());
                    obj.put("ID", item.getHomeBusiness_ID());
                    obj.put("statusType", EnumStatus.CAP_MOI.toString());
                    break;
                } else {
                    List<Details> lstchange = item.getList_changeBusiness_ID();
                    if (lstchange != null) {
                        for (Object childNode : lstchange) {
                            JSONObject fromObject = JSONObject.fromObject(childNode);
                            Details dt = (Details) JSONObject.toBean(fromObject,
                                    Details.class);
                            String _dttaskID=dt.getTaskID();
                            if(_dttaskID==null)
                            {
                                _dttaskID = dt.getParent_ID()==null?"":dt.getParent_ID();
                            }
                            if (_dttaskID.equals(taskID)) {
                                obj.put("nameBusiness", item.getNameBusiness());
                                obj.put("ID", dt.getParent_ID());
                                obj.put("statusType", EnumStatus.CAP_DOI.toString());
                                break;
                            }
                        }
                    }
                    List<Details> lstpause = item.getList_pauseBusiness_ID();
                    if (lstpause != null) {
                        for (Object childNode : lstpause) {
                            JSONObject fromObject = JSONObject.fromObject(childNode);
                            Details dt = (Details) JSONObject.toBean(fromObject,
                                    Details.class);
                            String _dttaskID=dt.getTaskID();
                            if(_dttaskID==null)
                            {
                                _dttaskID = dt.getParent_ID()==null?"":dt.getParent_ID();
                            }
                            if (_dttaskID.equals(taskID)) {
                                obj.put("nameBusiness", item.getNameBusiness());
                                obj.put("ID", dt.getParent_ID());
                                obj.put("statusType", EnumStatus.TAM_NGUNG.toString());
                                break;
                            }
                        }
                    }
                    List<Details> lstend = item.getList_endBusiness_ID();
                    if (lstend != null) {
                        for (Object childNode : lstend) {
                            JSONObject fromObject = JSONObject.fromObject(childNode);
                            Details dt = (Details) JSONObject.toBean(fromObject,
                                    Details.class);
                            String _dttaskID=dt.getTaskID();
                            if(_dttaskID==null)
                            {
                                _dttaskID = dt.getParent_ID()==null?"":dt.getParent_ID();
                            }
                            if (_dttaskID.equals(taskID)) {
                                obj.put("nameBusiness", item.getNameBusiness());
                                obj.put("ID", dt.getParent_ID());
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
            return  objdetail;
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
    public BusinessDetail updateStatusProcess(String statusType,String status,String homeBusinessID,String prant_id) throws WebOSBOException
    {


        Query<JSONDB> query = new QueryImpl<JSONDB>();
        query.field("homeBusiness_ID").equal(homeBusinessID);
        SearchDTO<BusinessDetail> datas = super.query((QueryImpl<JSONDB>) query);
        BusinessDetail objbusinessDetail = new BusinessDetail();
        if(datas.getTotal()>0)
        {
            objbusinessDetail = datas.getItems().get(0);
            String uuid = objbusinessDetail.getUuid();
            if(statusType.equals(EnumStatus.CAP_MOI.toString())) {
                /*if (prant_id == null || prant_id.isEmpty()) {*/
                    objbusinessDetail.setStatusProcess(status);
                    super.update(uuid, objbusinessDetail);
                    return objbusinessDetail;
                //}
            }
            else if(statusType.equals(EnumStatus.CAP_DOI.toString())) {
                List<Details> lstChange = objbusinessDetail.getList_changeBusiness_ID();
                if (lstChange != null) {
                    List<Details> lstDetail = new ArrayList<Details>();
                    for (Object childNode : lstChange) {
                        JSONObject fromObject = JSONObject.fromObject(childNode);
                        Details item = (Details) JSONObject.toBean(fromObject,
                                Details.class);
                        String parentID = item.getTaskID();
                        if (parentID.equals(prant_id)) {
                            item.setStatusProcess(status);
                            lstDetail.add(item);
                            logger.debug("lstChange Count 2: {}", lstChange.size());

                        }
                        else {
                            lstDetail.add(item);
                        }
                    }
                    objbusinessDetail.setList_changeBusiness_ID(lstDetail);
                    //break;
                    super.update(uuid, objbusinessDetail);
                    return objbusinessDetail;
                }
            }
            else if(statusType.equals(EnumStatus.TAM_NGUNG.toString())) {
                List<Details> lstPause = objbusinessDetail.getList_pauseBusiness_ID();
                if (lstPause != null) {
                    List<Details> lstDetail = new ArrayList<Details>();
                    for (Object childNode : lstPause) {
                        JSONObject fromObject = JSONObject.fromObject(childNode);
                        Details item = (Details) JSONObject.toBean(fromObject,
                                Details.class);
                        String parentID = item.getTaskID();
                        if (parentID.equals(prant_id)) {
                            item.setStatusProcess(status);
                            lstDetail.add(item);
                            //break;

                        }
                        else {
                            lstDetail.add(item);
                        }
                    }
                    objbusinessDetail.setList_pauseBusiness_ID(lstDetail);
                    super.update(uuid, objbusinessDetail);
                    return objbusinessDetail;
                }
            }
            else if(statusType.equals(EnumStatus.CHAM_DUT.toString())) {
                List<Details> lstEnd = objbusinessDetail.getList_endBusiness_ID();
                if (lstEnd != null) {
                    List<Details> lstDetail = new ArrayList<Details>();
                    for (Object childNode : lstEnd) {
                        JSONObject fromObject = JSONObject.fromObject(childNode);
                        Details item = (Details) JSONObject.toBean(fromObject,
                                Details.class);
                        String parentID = item.getTaskID();
                        if (parentID.equals(prant_id)) {
                            item.setStatusProcess(status);
                            //break;
                            lstDetail.add(item);
                        }
                        else {
                            lstDetail.add(item);
                        }
                    }
                    objbusinessDetail.setList_endBusiness_ID(lstDetail);
                    super.update(uuid, objbusinessDetail);
                    return objbusinessDetail;
                }
            }


        }

        return objbusinessDetail;
    }
    public List<JSONObject> loadListTaskProcess(String status)
    {
        List<JSONObject> lstObj =new ArrayList<JSONObject>();
        //Lay danh sach nguoi dai dien
        List<PersonRepresent> lstper = new ArrayList<PersonRepresent>();
        SearchDTO<PersonRepresent> objper = WebContext.INSTANCE.cache().getBean(PersonRepresentBo.class).query();
        if(objper.getTotal()>0)
        {
            lstper = objper.getItems();
        }

        //Lay ds quan huyen
        List<Ward> lstward = new ArrayList<Ward>();
        SearchDTO<Ward> objWard = WebContext.INSTANCE.cache().getBean(WardBo.class).query();
        if(objWard.getTotal()>0)
        {
            lstward = objWard.getItems();
        }
        //Lay ds AreaBusiness
        List<AreaBusiness> lstareaBusiness = new ArrayList<AreaBusiness>();
        SearchDTO<AreaBusiness> objAreaBusiness = WebContext.INSTANCE.cache().getBean(AreaBusinessBo.class).query();
        if(objAreaBusiness.getTotal()>0)
        {
            lstareaBusiness = objAreaBusiness.getItems();
        }
        //Lay ds HomeBusiness
       // HomeBusiness objBusiness = WebContext.INSTANCE.cache().getBean(HomeBusinessBo.class).load(item.getHomeBusiness_ID());
        SearchDTO<BusinessDetail> datas = super.query();
        if(datas.getTotal()>0)
        {

            for (BusinessDetail item : datas.getItems())
            {
                String _itemStatus = item.getStatusProcess()!=null?item.getStatusProcess():"";
                //Kiem tra trang thai
                if(_itemStatus.equals(status))
                {
                    JSONObject obj = setObjectTaskProcess(item.getTaskID(), EnumStatus.CAP_MOI.toString(), status, item, lstward, lstper, lstareaBusiness);
                    obj.put("dateSubmit",item.getDateSubmit());
                    lstObj.add(obj);
                    //continue;
                }
                else
                {
                    List<Details> lstChange =item.getList_changeBusiness_ID();
                    if(lstChange!=null && lstChange.size() > 0) {
                        for (Object childNode : lstChange) {
                            JSONObject fromObject = JSONObject.fromObject(childNode);
                            Details dt = (Details) JSONObject.toBean(fromObject,
                                    Details.class);
                            if(dt==null)
                            {
                                continue;
                            }
                            String _stPro = dt.getStatusProcess()!=null?dt.getStatusProcess():"";
                            if(_stPro.equals(status)) {
                                JSONObject obj = setObjectTaskProcess(dt.getTaskID(),EnumStatus.CAP_DOI.toString(),status,item,lstward,lstper,lstareaBusiness);
                                obj.put("parent_ID",dt.getParent_ID());
                                obj.put("dateSubmit",dt.getDateSubmit());
                                lstObj.add(obj);

                                //break;
                            }

                        }
                    }
                    List<Details> lstPause =item.getList_pauseBusiness_ID();
                    if(lstPause!=null ) {
                        for (Object childNode : lstPause) {
                            JSONObject fromObject = JSONObject.fromObject(childNode);
                            Details dt = (Details) JSONObject.toBean(fromObject,
                                    Details.class);
                            String _stPro = dt.getStatusProcess()!=null?dt.getStatusProcess():"";
                            if(_stPro.equals(status)) {
                                JSONObject obj = setObjectTaskProcess(dt.getTaskID(),EnumStatus.TAM_NGUNG.toString(),status,item,lstward,lstper,lstareaBusiness);
                                obj.put("parent_ID",dt.getParent_ID());
                                obj.put("dateSubmit", dt.getDateSubmit());
                                lstObj.add(obj);
                                //break;
                            }

                        }

                    }
                    List<Details> lstEnd =item.getList_endBusiness_ID();
                    if(lstEnd!=null ) {
                        for (Object childNode : lstEnd) {
                            JSONObject fromObject = JSONObject.fromObject(childNode);
                            Details dt = (Details) JSONObject.toBean(fromObject,
                                    Details.class);
                            String _stPro = dt.getStatusProcess()!=null?dt.getStatusProcess():"";
                            if(_stPro.equals(status)) {
                                JSONObject obj = setObjectTaskProcess(dt.getTaskID(),EnumStatus.CHAM_DUT.toString(),status,item,lstward,lstper,lstareaBusiness);
                                obj.put("parent_ID",dt.getParent_ID());
                                obj.put("dateSubmit",dt.getDateSubmit());
                                lstObj.add(obj);
                                //break;
                            }
                        }
                    }
                }
            }


        }

        return lstObj;
    }
    private JSONObject setObjectTaskProcess(String taskID,String statusType,String statusProcess,BusinessDetail item,List<Ward> lstward ,List<PersonRepresent> lstper,List<AreaBusiness> lstareaBusiness) throws WebOSBOException
    {
        JSONObject obj =new JSONObject();
        HomeBusiness objBusiness = WebContext.INSTANCE.cache().getBean(HomeBusinessBo.class).load(item.getHomeBusiness_ID());
        if(objBusiness==null)
        {
            return obj;
        }
        obj.put("name",item.getNameBusiness()!=null?item.getNameBusiness():"");
        obj.put("address",objBusiness.getAddress()!=null?objBusiness.getAddress():"");
        String strward= "";
        if(objBusiness.getWard_ID() !=null && lstward!=null)
        {
            for (Ward _ward : lstward)
            {
                if(_ward.getUuid().equals(objBusiness.getWard_ID()))
                {
                    strward = _ward.getName()!=null?_ward.getName():"";
                }
            }
        }
        obj.put("ward",strward);
        String strAreaBusiness= "";
        if(objBusiness.getAreaBusiness_ID() !=null && lstareaBusiness!=null)
        {
            for (AreaBusiness _area : lstareaBusiness)
            {
                if(_area.getUuid().equals(objBusiness.getAreaBusiness_ID()))
                {
                    strAreaBusiness = _area.getArea()!=null?_area.getArea():"";
                }
            }
        }
        obj.put("areaBusiness",strAreaBusiness);
        String strPer= "";
        if(objBusiness.getAreaBusiness_ID() !=null && lstper!=null)
        {
            for (PersonRepresent _per : lstper)
            {
                if(_per.getUuid().equals(objBusiness.getPersonRepresent_ID()))
                {
                    strPer = _per.getNameRepresent()!=null?_per.getNameRepresent():"";
                }
            }
        }
        obj.put("namePeprensent",strPer);
        obj.put("statusProcess",statusProcess);
        obj.put("statusType",statusType);
        obj.put("taxCode",item.getTaxCode()!=null?item.getTaxCode():"");
        obj.put("numberBusiness",item.getNumberBusiness()!=null?item.getNumberBusiness():"");
        obj.put("idHomeBusiness",item.getHomeBusiness_ID());
        obj.put("taskID",taskID);

        return obj;
    }
    public BusinessDetail saveBusinessDetail(String nameBusiness,String homeBusinessID,String taskID,String status, Details objdetail) throws WebOSBOException
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
            objdetail.setDateSubmit(Long.toString(System.currentTimeMillis()));
            if(status.equals(EnumStatus.CAP_DOI.toString()))
            {
                List<Details> lst =objbusinessDetail.getList_changeBusiness_ID();
                if(lst==null)
                    lst = new ArrayList<Details>();
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
                List<Details> lst =objbusinessDetail.getList_pauseBusiness_ID();
                if(lst==null)
                    lst = new ArrayList<Details>();
                lst.add(objdetail);
                objbusinessDetail.setList_pauseBusiness_ID(lst);
                super.update(uuid,objbusinessDetail);
            }
            else if(status.equals(EnumStatus.CHAM_DUT.toString()))
            {
                List<Details> lst =objbusinessDetail.getList_endBusiness_ID();
                if(lst==null)
                    lst = new ArrayList<Details>();
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
            objbusinessDetail.setStatusProcess(EnumProcess.PROCESS.toString());
            objbusinessDetail.setHomeBusiness_ID(homeBusinessID);
            objbusinessDetail.setTaskID(taskID);
            objbusinessDetail.setDateSubmit(Long.toString(System.currentTimeMillis()));
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
