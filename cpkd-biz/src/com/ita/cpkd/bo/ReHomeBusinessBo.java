package com.ita.cpkd.bo;

import javax.inject.Inject;
import javax.inject.Named;


import com.inet.xportal.nosql.web.bf.MagicContentBF;
import com.inet.xportal.nosql.web.bo.MagicContentBO;
import com.inet.xportal.web.context.ContentContext;
import com.inet.xportal.web.exception.WebOSBOException;
import com.ita.cpkd.model.ChangeBusiness;
import com.ita.cpkd.model.EndBusiness;
import com.ita.cpkd.model.PauseBusiness;
import com.ita.cpkd.model.ReHomeBusiness;

import java.util.ArrayList;
import java.util.List;


/**
 * Created by LamLe on 9/7/2016.
 */
@Named("ReHomeBusinessBo")
public class ReHomeBusinessBo extends MagicContentBO<ReHomeBusiness> {

    /**
     * Create {@link AccountBo} instance
     *
     * @param contentBf the given {@link MagicContentBF}
     */
    @Inject
    protected ReHomeBusinessBo(@ContentContext(context = "itaNoSqlContext") MagicContentBF contentBf) {
        super(contentBf, "reHomeBusiness");
    }
    public ReHomeBusiness addReHomeBusiness(ReHomeBusiness objreHomeBusiness) throws WebOSBOException
    {
        String uuid= super.add(objreHomeBusiness);
        objreHomeBusiness.setUuid(uuid);
        return objreHomeBusiness;
    }
    public ReHomeBusiness loadByID(String reHomeBusinessID) throws WebOSBOException
    {
        ReHomeBusiness objre = super.load(reHomeBusinessID);
        return objre;
    }
    @Override
    protected Class<ReHomeBusiness> getClassConvetor() {
        return ReHomeBusiness.class;
    }
}
