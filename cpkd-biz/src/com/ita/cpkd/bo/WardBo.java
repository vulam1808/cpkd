package com.ita.cpkd.bo;

import com.inet.xportal.nosql.web.bf.MagicContentBF;
import com.inet.xportal.nosql.web.bo.MagicContentBO;
import com.inet.xportal.web.context.ContentContext;

import com.ita.cpkd.model.Ward;

import javax.inject.Inject;
import javax.inject.Named;

/**
 * Created by ACER on 9/7/2016.
 */
@Named("WardBo")
public class WardBo extends MagicContentBO<Ward> {

    /**
     * Create {@link AccountBo} instance
     *
     * @param contentBf the given {@link MagicContentBF}
     */
    @Inject
    protected WardBo(@ContentContext(context = "itaNoSqlContext") MagicContentBF contentBf) {
        super(contentBf, "ward");
    }

    @Override
    protected Class<Ward> getClassConvetor() {
        return Ward.class;
    }
}
