package com.ita.cpkd.bo;

import javax.inject.Inject;
import javax.inject.Named;


import com.inet.xportal.nosql.web.bf.MagicContentBF;
import com.inet.xportal.nosql.web.bo.MagicContentBO;
import com.inet.xportal.web.context.ContentContext;
import com.ita.cpkd.model.EndBusiness;


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

    @Override
    protected Class<EndBusiness> getClassConvetor() {
        return EndBusiness.class;
    }
}
