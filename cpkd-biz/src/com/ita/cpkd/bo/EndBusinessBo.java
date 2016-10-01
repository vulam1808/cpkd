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

import java.util.ArrayList;
import java.util.List;


/**
 * Created by LamLe on 9/7/2016.
 */
@Named("EndBusinessBo")
public class EndBusinessBo extends MagicContentBO<EndBusiness> {

    /**
     * Create {@link AccountBo} instance
     *
     * @param contentBf the given {@link MagicContentBF}
     */
    @Inject
    protected EndBusinessBo(@ContentContext(context = "itaNoSqlContext") MagicContentBF contentBf) {
        super(contentBf, "endBusiness");
    }
    public EndBusiness addEndBusiness(EndBusiness objendBusiness) throws WebOSBOException
    {
        String uuid= super.add(objendBusiness);
        objendBusiness.setUuid(uuid);
        return objendBusiness;
    }
    public EndBusiness loadByID(String endBusinessID) throws WebOSBOException
    {
        EndBusiness objChange = super.load(endBusinessID);
        return objChange;
    }
    @Override
    protected Class<EndBusiness> getClassConvetor() {
        return EndBusiness.class;
    }
}
