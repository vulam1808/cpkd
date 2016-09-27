package com.ita.cpkd.bo;

import javax.inject.Inject;
import javax.inject.Named;


import com.inet.xportal.nosql.web.bf.MagicContentBF;
import com.inet.xportal.nosql.web.bo.MagicContentBO;
import com.inet.xportal.nosql.web.data.SearchDTO;
import com.inet.xportal.web.context.ContentContext;
import com.inet.xportal.web.exception.WebOSBOException;
import com.inet.xportal.xdb.persistence.JSONDB;
import com.inet.xportal.xdb.query.Query;
import com.inet.xportal.xdb.query.impl.QueryImpl;
import com.ita.cpkd.model.ChangeBusiness;
import com.ita.cpkd.model.HomeBusiness;


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
    public ChangeBusiness loadByHomeBusinessID(String idHomeBusiness) throws WebOSBOException
    {
        Query<JSONDB> query = new QueryImpl<JSONDB>();
        query.field("homeBusiness_ID").equal(idHomeBusiness);
        SearchDTO<ChangeBusiness> datas = super.query((QueryImpl<JSONDB>) query);
        ChangeBusiness objChange = new ChangeBusiness();
        if(datas.getTotal()>0)
        {
            objChange = datas.getItems().get(0);
        }

        return objChange;
    }
    @Override
    protected Class<ChangeBusiness> getClassConvetor() {
        return ChangeBusiness.class;
    }
}
