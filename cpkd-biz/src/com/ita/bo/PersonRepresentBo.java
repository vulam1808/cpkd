package com.ita.bo;

import com.inet.xportal.nosql.web.bf.MagicContentBF;
import com.inet.xportal.nosql.web.bo.MagicContentBO;
import com.inet.xportal.web.context.ContentContext;
import com.ita.model.PersonRepresent;


import javax.inject.Inject;

/**
 * Created by HS on 14/9/2016.
 */
public class PersonRepresentBo extends MagicContentBO<PersonRepresent> {

    /**
     * Create {@link AccountBo} instance
     *
     * @param contentBf the given {@link MagicContentBF}
     */
    @Inject
    protected PersonRepresentBo(@ContentContext(context = "itaNoSqlContext") MagicContentBF contentBf) {
        super(contentBf, "personrepresent");
    }

    @Override
    protected Class<PersonRepresent> getClassConvetor() {
        return PersonRepresent.class;
    }
}
