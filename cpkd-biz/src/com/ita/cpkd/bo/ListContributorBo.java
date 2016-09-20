package com.ita.cpkd.bo;

import javax.inject.Inject;
import javax.inject.Named;


import com.inet.xportal.nosql.web.bf.MagicContentBF;
import com.inet.xportal.nosql.web.bo.MagicContentBO;
import com.inet.xportal.web.context.ContentContext;
import com.ita.cpkd.model.ListContributor;

/**
 * Created by LamLe on 9/7/2016.
 */
@Named("ListContributorBo")
public class ListContributorBo extends MagicContentBO<ListContributor> {

    /**
     * Create {@link AccountBo} instance
     *
     * @param contentBf the given {@link MagicContentBF}
     */
    @Inject
    protected ListContributorBo(@ContentContext(context = "itaNoSqlContext") MagicContentBF contentBf) {
        super(contentBf, "listcontributor");
    }

    @Override
    protected Class<ListContributor> getClassConvetor() {
        return ListContributor.class;
    }
}
