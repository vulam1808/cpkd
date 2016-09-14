package com.ita.cpkd.bo;

import javax.inject.Inject;
import javax.inject.Named;


import com.inet.xportal.nosql.web.bf.MagicContentBF;
import com.inet.xportal.nosql.web.bo.MagicContentBO;
import com.inet.xportal.web.context.ContentContext;
import com.ita.cpkd.model.Province;

/**
 * Created by LamLe on 9/7/2016.
 */
@Named("ProvinceBo")
public class ProvinceBo extends MagicContentBO<Province> {

    /**
     * Create {@link AccountBo} instance
     *
     * @param contentBf the given {@link MagicContentBF}
     */
    @Inject
    protected ProvinceBo(@ContentContext(context = "itaNoSqlContext") MagicContentBF contentBf) {
        super(contentBf, "province");
    }

    @Override
    protected Class<Province> getClassConvetor() {
        return Province.class;
    }
}
