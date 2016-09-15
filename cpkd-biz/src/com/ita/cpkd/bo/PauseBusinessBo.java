package com.ita.cpkd.bo;

import javax.inject.Inject;
import javax.inject.Named;


import com.inet.xportal.nosql.web.bf.MagicContentBF;
import com.inet.xportal.nosql.web.bo.MagicContentBO;
import com.inet.xportal.web.context.ContentContext;
import com.ita.cpkd.model.PauseBusiness;


/**
 * Created by LamLe on 9/7/2016.
 */
@Named("PauseBusinessBo")
public class PauseBusinessBo extends MagicContentBO<PauseBusiness> {

    /**
     * Create {@link AccountBo} instance
     *
     * @param contentBf the given {@link MagicContentBF}
     */
    @Inject
    protected PauseBusinessBo(@ContentContext(context = "itaNoSqlContext") MagicContentBF contentBf) {
        super(contentBf, "pauseBusiness");
    }

    @Override
    protected Class<PauseBusiness> getClassConvetor() {
        return PauseBusiness.class;
    }
}
