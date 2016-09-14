package com.ita.cpkd.bo;

import com.inet.xportal.nosql.web.bf.MagicContentBF;
import com.inet.xportal.nosql.web.bo.MagicContentBO;
import com.inet.xportal.web.context.ContentContext;
import com.ita.cpkd.model.AreaBusiness;

import javax.inject.Inject;
import javax.inject.Named;

/**
 * Created by HS on 13/09/2016.
 */
@Named("AreaBusinessBo")
public class AreaBusinessBo extends MagicContentBO<AreaBusiness> {
    /**
     * Create {@link AccountBo} instance
     *
     * @param contentBf the given {@link MagicContentBF}
     */
    @Inject
    protected AreaBusinessBo(@ContentContext(context = "itaNoSqlContext") MagicContentBF contentBf) {
        super(contentBf, "areabusiness");
    }

    @Override
    protected Class<AreaBusiness> getClassConvetor() {
        return AreaBusiness.class;
    }
}
