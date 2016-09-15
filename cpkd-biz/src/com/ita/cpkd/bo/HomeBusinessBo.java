package com.ita.cpkd.bo;

import javax.inject.Inject;
import javax.inject.Named;


import com.inet.xportal.nosql.web.bf.MagicContentBF;
import com.inet.xportal.nosql.web.bo.MagicContentBO;
import com.inet.xportal.web.context.ContentContext;
import com.ita.cpkd.model.HomeBusiness;


/**
 * Created by LamLe on 9/7/2016.
 */
@Named("HomeBusinessBo")
public class HomeBusinessBo extends MagicContentBO<HomeBusiness> {

    /**
     * Create {@link AccountBo} instance
     *
     * @param contentBf the given {@link MagicContentBF}
     */
    @Inject
    protected HomeBusinessBo(@ContentContext(context = "itaNoSqlContext") MagicContentBF contentBf) {
        super(contentBf, "homeBusiness");
    }

    @Override
    protected Class<HomeBusiness> getClassConvetor() {
        return HomeBusiness.class;
    }
}
