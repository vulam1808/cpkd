package com.ita.bo;

import javax.inject.Inject;


import com.inet.xportal.nosql.web.bf.MagicContentBF;
import com.inet.xportal.nosql.web.bo.MagicContentBO;
import com.inet.xportal.web.context.ContentContext;
import com.ita.model.Province;

/**
 * Created by LamLe on 9/7/2016.
 */
public class ProvinceBo extends MagicContentBO<Province> {

    /**
     * Create {@link AccountBo} instance
     *
     * @param contentBf the given {@link MagicContentBF}
     */
    @Inject
    protected ProvinceBo(@ContentContext(context = "HelloworldNoSqlContext") MagicContentBF contentBf) {
        super(contentBf, "province");
    }

    @Override
    protected Class<Province> getClassConvetor() {
        return Province.class;
    }
}
