package com.ita.cpkd.bo;

import com.inet.xportal.nosql.web.bf.MagicContentBF;
import com.inet.xportal.nosql.web.bo.MagicContentBO;
import com.inet.xportal.web.context.ContentContext;
import com.ita.cpkd.model.District;

import javax.inject.Inject;
import javax.inject.Named;

/**
 * Created by ACER on 9/7/2016.
 */
@Named("DistrictBo")
public class DistrictBo extends MagicContentBO<District> {

    /**
     * Create {@link AccountBo} instance
     *
     * @param contentBf the given {@link MagicContentBF}
     */
    @Inject
    protected DistrictBo(@ContentContext(context = "itaNoSqlContext") MagicContentBF contentBf) {
        super(contentBf, "district");
    }

    @Override
    protected Class<District> getClassConvetor() {
        return District.class;
    }
}
