package com.ita.cpkd.bo;

import javax.inject.Inject;
import javax.inject.Named;


import com.inet.xportal.nosql.web.bf.MagicContentBF;
import com.inet.xportal.nosql.web.bo.MagicContentBO;
import com.inet.xportal.web.context.ContentContext;
import com.ita.cpkd.model.ChangeBusiness;


/**
 * Created by LamLe on 9/7/2016.
 */
@Named("ChangeBusinessBo")
public class ChangeBusinessBo extends MagicContentBO<ChangeBusiness> {

    /**
     * Create {@link AccountBo} instance
     *
     * @param contentBf the given {@link MagicContentBF}
     */
    @Inject
    protected ChangeBusinessBo(@ContentContext(context = "itaNoSqlContext") MagicContentBF contentBf) {
        super(contentBf, "changeBusiness");
    }

    @Override
    protected Class<ChangeBusiness> getClassConvetor() {
        return ChangeBusiness.class;
    }
}
