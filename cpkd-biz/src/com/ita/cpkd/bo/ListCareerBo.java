package com.ita.cpkd.bo;

import com.inet.xportal.nosql.web.bf.MagicContentBF;
import com.inet.xportal.nosql.web.bo.MagicContentBO;
import com.inet.xportal.web.context.ContentContext;
import com.ita.cpkd.model.ListCareer;

import javax.inject.Inject;

/**
 * Created by HS on 13/09/2016.
 */
public class ListCareerBo extends MagicContentBO<ListCareer> {
    /**
     * Create {@link AccountBo} instance
     *
     * @param contentBf the given {@link MagicContentBF}
     */
    @Inject
    protected ListCareerBo(@ContentContext(context = "itaNoSqlContext") MagicContentBF contentBf) {
        super(contentBf, "listcareer");
    }

    @Override
    protected Class<ListCareer> getClassConvetor() {
        return ListCareer.class;
    }
}
