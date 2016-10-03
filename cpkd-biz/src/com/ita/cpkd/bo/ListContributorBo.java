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
import com.ita.cpkd.model.ListContributor;

import java.util.List;

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
    public List<ListContributor> loadListContributorByHomeBusinessID(String homeBusinessID) throws WebOSBOException
    {
        /*Query<JSONDB> query = new QueryImpl<JSONDB>();
        query.field("taskID").equal(taskID);
        SearchDTO<HomeBusiness> datas = super.query((QueryImpl<JSONDB>) query);
        HomeBusiness objHome = new HomeBusiness();
        if(datas.getTotal()>0)
        {
             objHome = datas.getItems().get(0);
        }*/
        Query<JSONDB> query = new QueryImpl<JSONDB>();
        query.field("homeBusiness_ID").equal(homeBusinessID);
        SearchDTO<ListContributor> datas = super.query((QueryImpl<JSONDB>) query);

        return datas.getItems();
    }
    public List<ListContributor> loadListContributorByChangeBusinessID(String changeBusinessID) throws WebOSBOException
    {
        /*Query<JSONDB> query = new QueryImpl<JSONDB>();
        query.field("taskID").equal(taskID);
        SearchDTO<HomeBusiness> datas = super.query((QueryImpl<JSONDB>) query);
        HomeBusiness objHome = new HomeBusiness();
        if(datas.getTotal()>0)
        {
             objHome = datas.getItems().get(0);
        }*/
        Query<JSONDB> query = new QueryImpl<JSONDB>();
        query.field("changeBusiness_ID").equal(changeBusinessID);
        SearchDTO<ListContributor> datas = super.query((QueryImpl<JSONDB>) query);

        return datas.getItems();
    }
    @Override
    protected Class<ListContributor> getClassConvetor() {
        return ListContributor.class;
    }
}
