//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package com.ita.cpkd.lib;

import com.inet.xportal.nosql.web.data.SearchDTO;
import com.inet.xportal.xdb.query.impl.QueryImpl;
import com.ita.cpkd.bo.BusinessDetailBo;
import com.ita.cpkd.bo.ChangeBusinessBo;
import com.ita.cpkd.bo.EndBusinessBo;
import com.ita.cpkd.bo.HomeBusinessBo;
import com.ita.cpkd.bo.PauseBusinessBo;
import com.ita.cpkd.enums.EnumProcess;
import com.ita.cpkd.enums.EnumStatus;
import com.ita.cpkd.model.BusinessDetail;
import com.ita.cpkd.model.ChangeBusiness;
import com.ita.cpkd.model.Details;
import com.ita.cpkd.model.EndBusiness;
import com.ita.cpkd.model.HomeBusiness;
import com.ita.cpkd.model.PauseBusiness;
import javax.inject.Inject;
import javax.inject.Named;
import net.sf.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Named("MergerDataXGate")
public class MergerDataXGate {
    protected static final Logger logger = LoggerFactory.getLogger(MergerDataXGate.class);
    @Inject
    private HomeBusinessBo homeBusinessBo;
    @Inject
    private ChangeBusinessBo changeBusinessBo;
    @Inject
    private PauseBusinessBo pauseBusinessBo;
    @Inject
    private EndBusinessBo endBusinessBo;
    @Inject
    private BusinessDetailBo businessDetailBo;

    public MergerDataXGate() {
    }

    public String updateStatus(JSONObject var1, String var2) {
        String var3 = checkKeyJson(var1, "statusType");
        String var4 = "";
        String var5 = "";
        String var6 = "";
        QueryImpl var7;
        SearchDTO var8;
        if(var3.equals(EnumStatus.CAP_MOI.toString())) {
            var7 = new QueryImpl();
            var7.field("taskID").equal(var2);
            var8 = this.homeBusinessBo.query((QueryImpl)var7);
            if(var8.getTotal() > 0) {
                HomeBusiness var9 = (HomeBusiness)var8.getItems().get(0);
                var4 = var9.getUuid();
                var6 = this.getStatusNext(var3, var9.getStatusProcess());
                var9.setStatusProcess(var6);
                this.homeBusinessBo.updateHomeBusiness(var9.getUuid(), var9);
            }
        } else if(var3.equals(EnumStatus.CAP_DOI.toString())) {
            var7 = new QueryImpl();
            var7.field("taskID").equal(var2);
            var8 = this.changeBusinessBo.query((QueryImpl)var7);
            if(var8.getTotal() > 0) {
                ChangeBusiness var10 = (ChangeBusiness)var8.getItems().get(0);
                var4 = var10.getHomeBusiness_ID();
                var5 = var10.getUuid();
                var6 = this.getStatusNext(var3, var10.getStatusProcess());
                var10.setStatusProcess(var6);
                this.changeBusinessBo.update(var10.getUuid(), var10);
            }
        } else if(var3.equals(EnumStatus.TAM_NGUNG.toString())) {
            var7 = new QueryImpl();
            var7.field("taskID").equal(var2);
            var8 = this.pauseBusinessBo.query((QueryImpl)var7);
            if(var8.getTotal() > 0) {
                PauseBusiness var11 = (PauseBusiness)var8.getItems().get(0);
                var4 = var11.getHomeBusiness_ID();
                var5 = var11.getUuid();
                var6 = this.getStatusNext(var3, var11.getStatusProcess());
                var11.setStatusProcess(var6);
                this.pauseBusinessBo.update(var11.getUuid(), var11);
            }
        } else if(var3.equals(EnumStatus.CHAM_DUT.toString())) {
            var7 = new QueryImpl();
            var7.field("taskID").equal(var2);
            var8 = this.endBusinessBo.query((QueryImpl)var7);
            if(var8.getTotal() > 0) {
                EndBusiness var12 = (EndBusiness)var8.getItems().get(0);
                var4 = var12.getHomeBusiness_ID();
                var5 = var12.getUuid();
                var6 = this.getStatusNext(var3, var12.getStatusProcess());
                var12.setStatusProcess(var6);
                this.endBusinessBo.update(var12.getUuid(), var12);
            }
        }

        this.businessDetailBo.updateStatusProcess(var3, var6, var4, var5);
        return var6;
    }

    public String getStatusNext(String var1, String var2) {
        String var3 = var2;
        if(var1.equals(EnumStatus.CAP_MOI.toString())) {
            if(var2.equals(EnumProcess.PROCESS.toString())) {
                var3 = EnumProcess.PROCESS_TAX.toString();
            } else if(var2.equals(EnumProcess.PROCESS_TAX.toString())) {
                var3 = EnumProcess.PROCESS_ID.toString();
            } else if(var2.equals(EnumProcess.PROCESS_ID.toString())) {
                var3 = EnumProcess.DONE.toString();
            }
        } else {
            var3 = EnumProcess.DONE.toString();
        }

        return var3;
    }

    public void addNewTask(JSONObject var1, String var2) {
        try {
            String var3 = checkKeyJson(var1, "statusType");
            logger.debug("addNewTask  statusType{}", var3);
            if(var3.equals(EnumStatus.CAP_MOI.toString())) {
                HomeBusiness var4 = mergerDataHomeBusiness(var1, var2, var3, EnumProcess.PROCESS.toString());
                logger.debug("addNewTask  HomeBusiness{}", JSONObject.fromObject(var4));

                try {
                    logger.error("homeBusinessBo {}", this.homeBusinessBo);
                    var4 = this.homeBusinessBo.addHomeBusiness(var4);
                } catch (Throwable var11) {
                    logger.error("add Home Business fail {}", var11);
                }

                logger.debug("addNewTask  HomeBusinessID{}", var4.getUuid());
                if(var2 == null || var2.equals("")) {
                    var2 = var4.getUuid();
                }

                BusinessDetail var5 = this.businessDetailBo.saveBusinessDetail(var4.getNameBusiness(), var4.getUuid(), var2, var3, new Details());
                logger.debug("addNewTask  saveBusinessDetail{}", var5.getUuid());
            } else if(var3.equals(EnumStatus.CAP_DOI.toString())) {
                ChangeBusiness var13 = mergerDataChangeBusiness(var1, var2, EnumProcess.PROCESS.toString());
                String var14 = var13.getHomeBusiness_ID();
                HomeBusiness var6 = new HomeBusiness();
                var6.setStatusType(var3);
                this.homeBusinessBo.updateHomeBusiness(var14, var6);
                String var7 = checkKeyJson(var1, "infoChange");
                ChangeBusiness var8 = this.changeBusinessBo.addChangeBusiness(var13, var7);
                String var9 = var8.getUuid();
                Details var10 = new Details();
                var10.setParent_ID(var9);
                var10.setStatusProcess(EnumProcess.PROCESS.toString());
                if(var2 == null || var2.equals("")) {
                    var2 = var8.getUuid();
                }

                this.businessDetailBo.saveBusinessDetail(var8.getNameBusiness(), var14, var2, var3, var10);
            } else {
                String var19;
                HomeBusiness var20;
                String var21;
                Details var22;
                if(var3.equals(EnumStatus.CHAM_DUT.toString())) {
                    EndBusiness var15 = mergerDataEndBusiness(var1, var2, EnumProcess.PROCESS.toString());
                    EndBusiness var16 = this.endBusinessBo.addEndBusiness(var15);
                    var19 = var16.getHomeBusiness_ID();
                    var20 = new HomeBusiness();
                    var20.setStatusType(var3);
                    this.homeBusinessBo.updateHomeBusiness(var19, var20);
                    var21 = var16.getUuid();
                    var22 = new Details();
                    var22.setParent_ID(var21);
                    var22.setStatusProcess(EnumProcess.PROCESS.toString());
                    if(var2 == null || var2.equals("")) {
                        var2 = var16.getUuid();
                    }

                    this.businessDetailBo.saveBusinessDetail((String)null, var19, var2, var3, var22);
                } else if(var3.equals(EnumStatus.TAM_NGUNG.toString())) {
                    PauseBusiness var17 = mergerDataPauseBusiness(var1, var2, EnumProcess.PROCESS.toString());
                    PauseBusiness var18 = this.pauseBusinessBo.addPauseBusiness(var17);
                    var19 = var18.getHomeBusiness_ID();
                    var20 = new HomeBusiness();
                    var20.setStatusType(var3);
                    this.homeBusinessBo.updateHomeBusiness(var19, var20);
                    var21 = var18.getUuid();
                    var22 = new Details();
                    var22.setParent_ID(var21);
                    var22.setStatusProcess(EnumProcess.PROCESS.toString());
                    if(var2 == null || var2.equals("")) {
                        var2 = var18.getUuid();
                    }

                    this.businessDetailBo.saveBusinessDetail((String)null, var19, var2, var3, var22);
                }
            }
        } catch (Exception var12) {
            logger.debug("addNewTask  Exception{}", var12.getMessage());
        }

    }

    public static HomeBusiness mergerDataHomeBusiness(JSONObject var0, String var1, String var2, String var3) {
        HomeBusiness var4 = new HomeBusiness();
        var4.setNameBusiness(checkKeyJson(var0, "nameBusiness"));
        var4.setAreaBusiness_ID(checkKeyJson(var0, "areaBusiness_ID"));
        var4.setAddress(checkKeyJson(var0, "address"));
        var4.setProvince_ID(checkKeyJson(var0, "province_ID"));
        var4.setDistrict_ID(checkKeyJson(var0, "district_ID"));
        var4.setWard_ID(checkKeyJson(var0, "ward_ID"));
        var4.setPhone(checkKeyJson(var0, "phone"));
        var4.setFax(checkKeyJson(var0, "fax"));
        var4.setEmail(checkKeyJson(var0, "email"));
        var4.setWebsite(checkKeyJson(var0, "website"));
        var4.setTaskID(var1);
        var4.setStatusType(var2);
        var4.setDateSubmit(Long.toString(System.currentTimeMillis()));
        var4.setStatusProcess(var3);
        return var4;
    }

    public static ChangeBusiness mergerDataChangeBusiness(JSONObject var0, String var1, String var2) {
        ChangeBusiness var3 = new ChangeBusiness();
        var3.setHomeBusiness_ID(checkKeyJson(var0, "homebusinessID"));
        var3.setTaskID(var1);
        var3.setDateSubmit(Long.toString(System.currentTimeMillis()));
        var3.setStatusProcess(var2);
        return var3;
    }

    public static PauseBusiness mergerDataPauseBusiness(JSONObject var0, String var1, String var2) {
        PauseBusiness var3 = new PauseBusiness();
        var3.setHomeBusiness_ID(checkKeyJson(var0, "homebusinessID"));
        var3.setDayofPause(checkKeyJson(var0, "dayofPause"));
        var3.setDateStart(checkKeyJson(var0, "dateStart"));
        var3.setReason(checkKeyJson(var0, "pauseReason"));
        var3.setTaskID(var1);
        var3.setDateSubmit(Long.toString(System.currentTimeMillis()));
        var3.setStatusProcess(var2);
        return var3;
    }

    public static EndBusiness mergerDataEndBusiness(JSONObject var0, String var1, String var2) {
        EndBusiness var3 = new EndBusiness();
        var3.setHomeBusiness_ID(checkKeyJson(var0, "homebusinessID"));
        var3.setDateEnd(checkKeyJson(var0, "dateEnd"));
        var3.setReason(checkKeyJson(var0, "endReason"));
        var3.setTaskID(var1);
        var3.setDateSubmit(Long.toString(System.currentTimeMillis()));
        var3.setStatusProcess(var2);
        return var3;
    }

    private static String checkKeyJson(JSONObject var0, String var1) {
        String var2 = "";
        if(var0.has(var1)) {
            var2 = var0.getString(var1);
        }

        return var2;
    }
}
