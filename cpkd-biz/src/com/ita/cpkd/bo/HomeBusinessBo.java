package com.ita.cpkd.bo;

import javax.inject.Inject;
import javax.inject.Named;


import com.inet.xportal.nosql.web.bf.MagicContentBF;
import com.inet.xportal.nosql.web.bo.MagicContentBO;
import com.inet.xportal.nosql.web.data.SearchDTO;
import com.inet.xportal.web.context.ContentContext;
import com.inet.xportal.web.exception.WebOSBOException;
import com.inet.xportal.xdb.persistence.JSONDB;
import com.inet.xportal.xdb.query.Query;
import com.inet.xportal.xdb.query.impl.QueryImpl;
import com.ita.cpkd.enums.EnumChangeInfo;
import com.ita.cpkd.enums.EnumStatus;
import com.ita.cpkd.lib.Utility;
import com.ita.cpkd.model.*;
import net.sf.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


/**
 * Created by LamLe on 9/7/2016.
 */
@Named("HomeBusinessBo")
public class HomeBusinessBo extends MagicContentBO<HomeBusiness> {
    protected static final Logger logger = LoggerFactory.getLogger(HomeBusinessBo.class);
    @Inject
    private BusinessDetailBo businessDetailBo;
    @Inject
    private ChangeBusinessBo changeBusinessBo;
    @Inject
    private PauseBusinessBo pauseBusinessBo;
    @Inject
    private EndBusinessBo endBusinessBo;
    @Inject
    private PersonRepresentBo personRepresentBo;
    @Inject
    private DistrictBo districtBo;
    @Inject
    private ProvinceBo provinceBo;
    @Inject
    private WardBo wardBo;
    @Inject
    private AreaBusinessBo areaBusinessBo;
    @Inject
    private ListContributorBo listContributorBo;
    @Inject
    private ListCareerBo listCareerBo;
    @Inject
    private CareerBo careerBo;
    /**
     * Create {@link AccountBo} instance
     *
     * @param contentBf the given {@link MagicContentBF}
     */
    @Inject
    protected HomeBusinessBo(@ContentContext(context = "itaNoSqlContext") MagicContentBF contentBf) {
        super(contentBf, "homeBusiness");
    }


    /*public HomeBusiness loadHomeBusinessByTaskID(String taskID) throws WebOSBOException
    {
        *//*Query<JSONDB> query = new QueryImpl<JSONDB>();
        query.field("taskID").equal(taskID);
        SearchDTO<HomeBusiness> datas = super.query((QueryImpl<JSONDB>) query);
        HomeBusiness objHome = new HomeBusiness();
        if(datas.getTotal()>0)
        {
             objHome = datas.getItems().get(0);
        }*//*
        logger.debug("HomeBusiness getUuid {}: ", taskID);
        HomeBusiness objHome = super.load(taskID);

        return objHome;
    }*/
    public HomeBusiness addHomeBusiness(HomeBusiness objHomeBusiness) throws WebOSBOException
    {
        /*Query<JSONDB> query = new QueryImpl<JSONDB>();
        query.field("taskID").equal(taskID);
        SearchDTO<HomeBusiness> datas = super.query((QueryImpl<JSONDB>) query);
        HomeBusiness objHome = new HomeBusiness();
        if(datas.getTotal()>0)
        {
             objHome = datas.getItems().get(0);
        }*/


        // TODO check your required data

        // save account
        //district.setUuid(districtBo.add(district));
        String uuid= super.add(objHomeBusiness);
        objHomeBusiness.setUuid(uuid);

        return objHomeBusiness;
    }
    public HomeBusiness updateHomeBusiness(String uuid,HomeBusiness objHomeBusiness) throws WebOSBOException
    {
        super.update(uuid, objHomeBusiness);
        objHomeBusiness.setUuid(uuid);

        return objHomeBusiness;
    }

    public JSONObject loadBusinessProcessByTaskID(String taskID) throws WebOSBOException
    {
        JSONObject objDetail = businessDetailBo.loadBusinessDetailByTaskID(taskID);
        String ID = (String)objDetail.get("ID");
        String statusType=(String)objDetail.get("statusType");
        String nameBusiness=(String)objDetail.get("nameBusiness");

        JSONObject mainObj = new JSONObject();
        mainObj.put("nameBusiness", nameBusiness);
        if(statusType.equals(EnumStatus.CAP_MOI.toString()))
        {
            HomeBusiness objHome = super.load(ID);
            objHome = loadObjParent(objHome);
            mainObj.put("idHomeBusiness", ID);
            mainObj.put("objBusiness", objHome);
            mainObj.put("statusType", statusType);
        }
        else if(statusType.equals(EnumStatus.CAP_DOI.toString()))
        {
            ChangeBusiness objChange = changeBusinessBo.load(ID);
            HomeBusiness objHome = new HomeBusiness();
            objChange = loadObjParent(objHome,objChange);
            mainObj.put("idHomeBusiness", objChange.getHomeBusiness_ID());
            mainObj.put("objBusiness", objChange);
            mainObj.put("statusType", statusType);
        }
        else if(statusType.equals(EnumStatus.TAM_NGUNG.toString()))
        {
            PauseBusiness objHome = pauseBusinessBo.load(ID);
            //objHome = loadObjParent(objHome);
            mainObj.put("idHomeBusiness", objHome.getHomeBusiness_ID());
            mainObj.put("objBusiness", objHome);
            mainObj.put("statusType", statusType);
        }
        else if(statusType.equals(EnumStatus.CHAM_DUT.toString()))
        {
            EndBusiness objHome = endBusinessBo.load(ID);
            //objHome = loadObjParent(objHome);
            mainObj.put("idHomeBusiness", objHome.getHomeBusiness_ID());
            mainObj.put("objBusiness", objHome);
            mainObj.put("statusType", statusType);
        }

        return mainObj;
    }

    public JSONObject loadBusinessInfoByHomeBusinessID(String homeBusinessID) throws WebOSBOException
    {
        //logger.debug("begin loadBusinessInfoByTaskID {}", "abcd");
        JSONObject mainObj = new JSONObject();
        BusinessDetail objDetail = businessDetailBo.loadBusinessDetailByHomeBusinessID(homeBusinessID);
        mainObj.put("NameBusiness", objDetail.getNameBusiness());
        mainObj.put("taxCode", objDetail.getTaxCode()!=null?objDetail.getTaxCode():"");
        mainObj.put("numberBusiness", objDetail.getNumberBusiness()!=null?objDetail.getNumberBusiness():"");
        HomeBusiness objHome = super.load(homeBusinessID);
        objHome = loadObjParent(objHome);
        mainObj.put("HomeBusiness", objHome);
        List<Details> lstChange = objDetail.getList_changeBusiness_ID();
        int i = 0;
        if(lstChange != null) {
            //Utility.sortList(lstChange, "dateSubmit");
            logger.debug("sort ", lstChange);

            for (Object childNode : lstChange) {
                JSONObject fromObject = JSONObject.fromObject(childNode);
                Details item = (Details) JSONObject.toBean(fromObject,
                        Details.class);
                i++;
                ChangeBusiness objChange = changeBusinessBo.loadByID(item.getParent_ID());
                objChange = loadObjParent(objHome,objChange);
                mainObj.put("ChangeBusiness" + i, objChange);
            }
        }
        List<Details> lstPause = objDetail.getList_pauseBusiness_ID();
        if(lstPause != null) {
            //Utility.sortList(lstPause, "dateSubmit");
            i = 0;
            for (Object childNode : lstPause) {
                JSONObject fromObject = JSONObject.fromObject(childNode);
                Details item = (Details) JSONObject.toBean(fromObject,
                        Details.class);
                i++;
                PauseBusiness objChange = pauseBusinessBo.loadByID(item.getParent_ID());
                mainObj.put("PauseBusiness" + i, objChange);
            }
        }
        List<Details> lstEnd = objDetail.getList_endBusiness_ID();
        if(lstEnd != null) {
            //Utility.sortList(lstEnd, "dateSubmit");
            i = 0;
            for (Object childNode : lstEnd) {
                JSONObject fromObject = JSONObject.fromObject(childNode);
                Details item = (Details) JSONObject.toBean(fromObject,
                        Details.class);
                i++;
                EndBusiness objChange = endBusinessBo.loadByID(item.getParent_ID());
                mainObj.put("EndBusiness" + i, objChange);
            }
        }
        return mainObj;
    }
    public JSONObject loadReportLicenseByHomeBusinessID(String homeBusinessID) throws WebOSBOException
    {
        //logger.debug("begin loadBusinessInfoByTaskID {}", "abcd");
        JSONObject mainObj = new JSONObject();

        HomeBusiness obj = super.load(homeBusinessID);
        mainObj.put("numberBusiness", obj.getNumberBusiness());
        mainObj.put("nameBusiness", obj.getNameBusiness());
        String addressBusiness = obj.getAddress()!= null?obj.getAddress():"";
        mainObj.put("address", addressBusiness);
        //get ward
        String wardid = obj.getWard_ID();
        String nameward ="";
        if(wardid !=null)
        {
            Ward objWard = wardBo.load(wardid);
            nameward = objWard.getName();
        }
        mainObj.put("nameWard", nameward);
        if(!nameward.equals(""))
        {
            addressBusiness = addressBusiness+", "+ nameward;
        }

        //get district
        String districtid = obj.getDistrict_ID();
        String namedistrict ="";
        if(districtid !=null)
        {
            District objDistrict = districtBo.load(districtid);
            namedistrict = objDistrict.getName();
        }
        mainObj.put("nameDistrict", namedistrict);
        if(!namedistrict.equals(""))
        {
            addressBusiness = addressBusiness+", "+ namedistrict;
        }
        //get Province
        String provinceid = obj.getProvince_ID();
        String nameprovince ="";
        if(provinceid !=null)
        {
            Province objProvince = provinceBo.load(provinceid);
            nameprovince = objProvince.getName();
        }
        mainObj.put("nameProvince", nameprovince);
        if(nameprovince.equals(""))
        {
            addressBusiness = addressBusiness+", "+ nameprovince;
        }
        mainObj.put("addressBusiness", addressBusiness);
        mainObj.put("phoneBusiness", obj.getPhone()!= null?obj.getPhone():"");
        mainObj.put("faxBusiness", obj.getFax()!= null?obj.getFax():"");
        mainObj.put("emailBusiness", obj.getEmail()!= null?obj.getEmail():"");
        mainObj.put("websiteBusiness", obj.getWebsite()!= null?obj.getWebsite():"");

        //get nganh nghe kinh doanh
        String careerBusiness = "";
        List<ListCareer> lstCar = listCareerBo.loadListCareerByHomeBusinessID(obj.getUuid());
        if(lstCar!=null)
        {
            for (ListCareer childNode : lstCar) {
                Career objCareer = careerBo.load(childNode.getCareer_id());
                if(objCareer != null)
                {
                    if(careerBusiness.equals("")) {
                        careerBusiness = objCareer.getName();
                    }
                    else{
                        careerBusiness = careerBusiness+ ", "+ objCareer.getName();
                    }
                }


            }
        }
        //get von kinh doanh
        mainObj.put("capitalBusiness",obj.getBusinessCapital()!=null?obj.getBusinessCapital():"");

        //get nguoi dai dien
        PersonRepresent per = personRepresentBo.loadPersonRepresentByID(obj.getPersonRepresent_ID());
        //Ten nguoi dai dien
        mainObj.put("nameRepresent",per.getNameRepresent()!=null?per.getNameRepresent().toUpperCase():"");

        //Gioi tinh
        String sex = per.getGender()!=null?per.getGender():"";
        if(sex == "NAM")
        {
            mainObj.put("genderRepresent","Nam");
        }
        else if(sex == "NU")
        {
            mainObj.put("genderRepresent","Nữ");
        }
        //Ngay sinh
        String birthday = per.getBirthday()!=null?per.getBirthday():"";
        if(!birthday.equals("") && !birthday.equals("0"))
        {
            long val = Long.parseLong(birthday);
            Date date=new Date(val);
            SimpleDateFormat df2 = new SimpleDateFormat("dd/MM/yy");
            String dateText = df2.format(date);

            mainObj.put("birthdayRepresent",dateText);

        }

        //Dan toc
        mainObj.put("raceRepresent",per.getRace()!=null?per.getRace():"");

        //Chung minh nhan dan
        mainObj.put("cmndRepresent",per.getIdnumber());

        //ngay cap
        String cnmdDate = per.getIssueDate()!=null?per.getIssueDate():"";
        if(!cnmdDate.equals("") && !cnmdDate.equals("0"))
        {
            long val = Long.parseLong(cnmdDate);
            Date date=new Date(val);
            SimpleDateFormat df2 = new SimpleDateFormat("dd/MM/yy");
            String dateText = df2.format(date);

            mainObj.put("cmndDateRepresent",dateText);

        }
        //ho khau thuong tru
        mainObj.put("residenceRepresent",per.getAddressResidence()!=null?per.getAddressResidence():"");
        //cho o hien tai
        mainObj.put("currentRepresent",per.getAddressCurrent()!=null?per.getAddressCurrent():"");

        return mainObj;
    }
    public HomeBusiness loadObjParent(HomeBusiness objhome)
    {
        String personRepresent_ID = objhome.getPersonRepresent_ID();
        if(personRepresent_ID!=null)
        {
            PersonRepresent per = personRepresentBo.loadPersonRepresentByID(personRepresent_ID);
            if(per != null)
            {
                objhome.setObjPersonRepresent(per);
            }
        }
        String district_ID = objhome.getDistrict_ID();
        if(district_ID!=null)
        {
            District dis = districtBo.load(district_ID);
            if(dis != null)
            {
                objhome.setObjDistrict(dis);
            }
        }
        String province_ID = objhome.getProvince_ID();
        if(province_ID!=null)
        {
            Province pro = provinceBo.load(province_ID);
            if(pro != null)
            {
                objhome.setObjProvince(pro);
            }
        }
        String ward_ID = objhome.getWard_ID();
        if(ward_ID!=null)
        {
            Ward ward = wardBo.load(ward_ID);
            if(ward != null)
            {
                objhome.setObjWard(ward);
            }
        }
        String areaBusiness_ID = objhome.getAreaBusiness_ID();
        if(areaBusiness_ID!=null)
        {
            AreaBusiness area = areaBusinessBo.load(areaBusiness_ID);
            if(area != null)
            {
                objhome.setObjAreaBusiness(area);
            }
        }
        List<ListCareer> lstCar = listCareerBo.loadListCareerByHomeBusinessID(objhome.getUuid());
        if(lstCar!=null)
        {
            objhome.setLstObjCareer(lstCar);
        }
        List<ListContributor> lstCon = listContributorBo.loadListContributorByHomeBusinessID(objhome.getUuid());
        if(lstCon!=null)
        {
            objhome.setLstObjContributor(lstCon);
        }

        return objhome;
    }
    public ChangeBusiness loadObjParent(HomeBusiness objhome,ChangeBusiness objchange)
    {
        ChangeBusiness obj = loadHomeToChange(objhome, objchange);
        List<String> lstChange = objchange.getInfoChange();
        if(lstChange!=null)
        {
            for (String itemChange : lstChange) {
                if(itemChange.equals(EnumChangeInfo.change_tendangkykinhdoanh.toString()))
                {
                    String name = objchange.getNameBusiness();
                    if(name != null && !name.equals(""))
                    {
                        obj.setNameBusiness(name);
                    }

                }
                else  if(itemChange.equals(EnumChangeInfo.change_danhsachnganhnghe.toString())) {

                    List<ListCareer> lstCar = listCareerBo.loadListCareerByChangeBusinessID(objchange.getUuid());
                    if(lstCar!=null)
                    {
                        obj.setLstObjCareer(lstCar);
                    }
                }
                else  if(itemChange.equals(EnumChangeInfo.change_danhsachnguoigopvon.toString())) {

                    List<ListContributor> lstCon = listContributorBo.loadListContributorByChangeBusinessID(objchange.getUuid());
                    if(lstCon!=null)
                    {
                        obj.setLstObjContributor(lstCon);
                    }
                }
                else  if(itemChange.equals(EnumChangeInfo.change_vondieule.toString())) {

                    String strCashCapital = objchange.getCashCapital();
                    if(strCashCapital != null && !strCashCapital.equals(""))
                    {
                        obj.setCashCapital(strCashCapital);
                    }

                    String strAssetCapital = objchange.getAssetCapital();
                    if(strAssetCapital != null && !strAssetCapital.equals(""))
                    {
                        obj.setAssetCapital(strAssetCapital);
                    }

                    String strBusinessCapital = objchange.getBusinessCapital();
                    if(strBusinessCapital != null && !strBusinessCapital.equals(""))
                    {
                        obj.setBusinessCapital(strBusinessCapital);
                    }
                }
                else  if(itemChange.equals(EnumChangeInfo.change_nguoidaidien.toString())) {

                    String personRepresent_ID = objchange.getPersonRepresent_ID();
                    if(personRepresent_ID!=null)
                    {
                        obj.setPersonRepresent_ID(personRepresent_ID);
                        PersonRepresent per = personRepresentBo.loadPersonRepresentByID(personRepresent_ID);
                        if(per != null)
                        {
                            obj.setObjPersonRepresent(per);
                        }
                    }
                }
                else  if(itemChange.equals(EnumChangeInfo.change_thongtindangkykinhdoanh.toString())) {

                    String district_ID = objchange.getDistrict_ID();
                    if(district_ID!=null)
                    {
                        obj.setDistrict_ID(district_ID);
                        District dis = districtBo.load(district_ID);
                        if(dis != null)
                        {
                            obj.setObjDistrict(dis);
                        }
                    }
                    String province_ID = objchange.getProvince_ID();
                    if(province_ID!=null)
                    {
                        obj.setProvince_ID(province_ID);
                        Province pro = provinceBo.load(province_ID);
                        if(pro != null)
                        {
                            obj.setObjProvince(pro);
                        }
                    }
                    String ward_ID = objchange.getWard_ID();
                    if(ward_ID!=null)
                    {
                        obj.setWard_ID(ward_ID);
                        Ward ward = wardBo.load(ward_ID);
                        if(ward != null)
                        {
                            obj.setObjWard(ward);
                        }
                    }
                    String areaBusiness_ID = objchange.getAreaBusiness_ID();
                    if(areaBusiness_ID!=null)
                    {
                        obj.setAreaBusiness_ID(areaBusiness_ID);
                        AreaBusiness area = areaBusinessBo.load(areaBusiness_ID);
                        if(area != null)
                        {
                            obj.setObjAreaBusiness(area);
                        }
                    }

                    String strAddress = objchange.getAddress();
                    if(strAddress!=null)
                    {
                        obj.setAddress(strAddress);
                    }
                    String strPhone = objchange.getPhone();
                    if(strPhone!=null)
                    {
                        obj.setPhone(strPhone);
                    }
                    String strFax = objchange.getFax();
                    if(strFax!=null)
                    {
                        obj.setFax(strFax);
                    }
                    String strEmail = objchange.getEmail();
                    if(strEmail!=null)
                    {
                        obj.setEmail(strEmail);
                    }
                    String strWebsite = objchange.getWebsite();
                    if(strWebsite!=null)
                    {
                        obj.setWebsite(strWebsite);
                    }
                }
            }
        }
        return obj;
    }
    public ChangeBusiness loadHomeToChange(HomeBusiness objhome,ChangeBusiness objchange)
    {
        ChangeBusiness obj = new ChangeBusiness();
        obj.setUuid(objchange.getUuid());
        obj.setStatusProcess(objchange.getStatusProcess());
        obj.setInfoChange(objchange.getInfoChange());
        obj.setDateSubmit(objchange.getDateSubmit());
        obj.setTaskID(objchange.getTaskID());
        obj.setHomeBusiness_ID(objchange.getHomeBusiness_ID());

        obj.setNameBusiness(objhome.getNameBusiness() != null ? objhome.getNameBusiness() : "");
        if(objhome.getPersonRepresent_ID() != null)
        {
            obj.setPersonRepresent_ID(objhome.getPersonRepresent_ID());
            obj.setObjPersonRepresent(objhome.getObjPersonRepresent());
        }
        obj.setAddress(objhome.getAddress() != null ? objhome.getAddress() : "");

        if(objhome.getProvince_ID() != null)
        {
            obj.setProvince_ID(objhome.getProvince_ID());
            obj.setObjProvince(objhome.getObjProvince());
        }
        if(objhome.getDistrict_ID() != null)
        {
            obj.setProvince_ID(objhome.getDistrict_ID());
            obj.setObjDistrict(objhome.getObjDistrict());
        }
        if(objhome.getWard_ID() != null)
        {
            obj.setWard_ID(objhome.getWard_ID());
            obj.setObjWard(objhome.getObjWard());
        }

        obj.setPhone(objhome.getPhone() != null ? objhome.getPhone() : "");
        obj.setFax(objhome.getFax() != null ? objhome.getFax() : "");
        obj.setEmail(objhome.getEmail() != null ? objhome.getEmail() : "");
        obj.setWebsite(objhome.getWebsite() != null ? objhome.getWebsite() : "");
        obj.setTaxCode(objhome.getTaxCode() != null ? objhome.getTaxCode() : "");
        obj.setNumberBusiness(objhome.getNumberBusiness() != null ? objhome.getNumberBusiness() : "");
        obj.setCashCapital(objhome.getCashCapital() != null ? objhome.getCashCapital() : "");
        obj.setAssetCapital(objhome.getAssetCapital() != null ? objhome.getAssetCapital() : "");
        obj.setBusinessCapital(objhome.getBusinessCapital() != null ? objhome.getBusinessCapital() : "");
        if(objhome.getAreaBusiness_ID() != null)
        {
            obj.setAreaBusiness_ID(objhome.getAreaBusiness_ID());
            obj.setObjAreaBusiness(objhome.getObjAreaBusiness());
        }
        obj.setLstObjCareer(objhome.getLstObjCareer() != null ? objhome.getLstObjCareer() : new ArrayList<ListCareer>());
        obj.setLstObjContributor(objhome.getLstObjContributor() != null ? objhome.getLstObjContributor() : new ArrayList<ListContributor>());
        return obj;
    }

    @Override
    protected Class<HomeBusiness> getClassConvetor() {
        return HomeBusiness.class;
    }
}


