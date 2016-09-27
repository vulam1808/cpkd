package com.ita.cpkd.bo;

import javax.inject.Inject;
import javax.inject.Named;


import com.inet.xportal.nosql.web.bf.MagicContentBF;
import com.inet.xportal.nosql.web.bo.MagicContentBO;
import com.inet.xportal.nosql.web.data.SearchDTO;
import com.inet.xportal.web.context.ContentContext;
import com.inet.xportal.web.exception.WebOSBOException;
import com.inet.xportal.web.util.JSONUtils;
import com.inet.xportal.xdb.persistence.JSONDB;
import com.inet.xportal.xdb.query.Query;
import com.inet.xportal.xdb.query.impl.QueryImpl;
import com.ita.cpkd.model.HomeBusiness;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * Created by LamLe on 9/7/2016.
 */
@Named("HomeBusinessBo")
public class HomeBusinessBo extends MagicContentBO<HomeBusiness> {
    protected static final Logger logger = LoggerFactory.getLogger(HomeBusinessBo.class);
    /**
     * Create {@link AccountBo} instance
     *
     * @param contentBf the given {@link MagicContentBF}
     */
    @Inject
    protected HomeBusinessBo(@ContentContext(context = "itaNoSqlContext") MagicContentBF contentBf) {
        super(contentBf, "homeBusiness");
    }
    public HomeBusiness loadHomeBusinessByTaskID(String taskID) throws WebOSBOException
    {
        /*Query<JSONDB> query = new QueryImpl<JSONDB>();
        query.field("taskID").equal(taskID);
        SearchDTO<HomeBusiness> datas = super.query((QueryImpl<JSONDB>) query);
        HomeBusiness objHome = new HomeBusiness();
        if(datas.getTotal()>0)
        {
             objHome = datas.getItems().get(0);
        }*/
        logger.debug("HomeBusiness getUuid {}: ", taskID);
        HomeBusiness objHome = super.load(taskID);

        return objHome;
    }
    @Override
    protected Class<HomeBusiness> getClassConvetor() {
        return HomeBusiness.class;
    }
}
