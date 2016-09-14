package com.ita.bo;

import com.inet.xportal.nosql.web.bf.MagicContentBF;
import com.inet.xportal.nosql.web.bo.MagicContentBO;
import com.inet.xportal.web.context.ContentContext;
import com.ita.model.Career;

import javax.inject.Inject;

/**
 * Created by HS on 13/09/2016.
 */
public class CareerBo extends MagicContentBO<Career> {
    /**
     * Create {@link AccountBo} instance
     *
     * @param contentBf the given {@link MagicContentBF}
     */
    @Inject
    protected CareerBo(@ContentContext(context = "itaNoSqlContext") MagicContentBF contentBf) {
        super(contentBf, "career");
    }

    @Override
    protected Class<Career> getClassConvetor() {
        return Career.class;
    }
}
