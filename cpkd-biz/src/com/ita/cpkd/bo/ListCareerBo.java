package com.ita.cpkd.bo;

import com.inet.xportal.nosql.web.bf.MagicContentBF;
import com.inet.xportal.nosql.web.bo.MagicContentBO;
import com.inet.xportal.nosql.web.data.SearchDTO;
import com.inet.xportal.web.context.ContentContext;
import com.inet.xportal.web.exception.WebOSBOException;
import com.inet.xportal.xdb.persistence.JSONDB;
import com.inet.xportal.xdb.query.Query;
import com.inet.xportal.xdb.query.impl.QueryImpl;
import com.ita.cpkd.model.ListCareer;

import javax.inject.Inject;
import java.util.List;

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
    public List<ListCareer> loadListCareerByHomeBusinessID(String homeBusinessID) throws WebOSBOException
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
        SearchDTO<ListCareer> datas = super.query((QueryImpl<JSONDB>) query);

        return datas.getItems();
    }
    public List<ListCareer> loadListCareerByChangeBusinessID(String changeBusinessID) throws WebOSBOException
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
        SearchDTO<ListCareer> datas = super.query((QueryImpl<JSONDB>) query);

        return datas.getItems();
    }
    @Override
    protected Class<ListCareer> getClassConvetor() {
        return ListCareer.class;
    }
}
