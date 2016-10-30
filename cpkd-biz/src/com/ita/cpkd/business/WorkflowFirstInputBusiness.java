//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package com.ita.cpkd.business;

import com.inet.workflow.web.model.TaskModel;
import com.inet.workflow.web.node.AbstractBusiness;
import com.inet.xportal.itask.bo.TaskHistoryBO;
import com.inet.xportal.itask.bo.TaskRequestBO;
import com.inet.xportal.itask.model.TaskHistory;
import com.inet.xportal.itask.model.TaskRequest;
import com.inet.xportal.nosql.web.data.SearchDTO;
import com.inet.xportal.xdb.query.impl.QueryImpl;
import com.ita.cpkd.enums.EnumProcess;
import com.ita.cpkd.lib.MergerDataXGate;
import javax.inject.Inject;
import javax.inject.Named;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Named("WorkflowFirstInputBusiness")
public class WorkflowFirstInputBusiness extends AbstractBusiness {
    protected static final Logger logger = LoggerFactory.getLogger(WorkflowFirstInputBusiness.class);
    @Inject
    private TaskRequestBO requestBO;
    @Inject
    private TaskHistoryBO historyBO;
    @Inject
    private MergerDataXGate mergerDataXGate;

    public WorkflowFirstInputBusiness() {
    }

    public void beforeVariableUpdate(TaskModel var1, boolean var2) {
        QueryImpl var3 = new QueryImpl();
        var3.field("taskID").equal(var1.getUuid());
        SearchDTO var4 = this.historyBO.query((QueryImpl)var3);
        logger.debug("TaskHistory  {}", Integer.valueOf(var4.getTotal()));
        if(var4.getTotal() > 0) {
            TaskHistory var5 = (TaskHistory)var4.getItems().get(0);
            TaskRequest var6 = (TaskRequest)this.requestBO.load(var5.getRequestID());
            logger.debug("TaskRequest  {}", var6.getUuid());
            this.mergerDataXGate.addNewTask(var6.getRequestData(), var6.getUuid());
        }

    }

    public void afterVariableUpdate(TaskModel var1, boolean var2) {
        QueryImpl var3 = new QueryImpl();
        var3.field("taskID").equal(var1.getUuid());
        SearchDTO var4 = this.historyBO.query((QueryImpl)var3);
        logger.debug("afterVariableUpdate TaskHistory  {}", Integer.valueOf(var4.getTotal()));
        if(var4.getTotal() > 0) {
            TaskHistory var5 = (TaskHistory)var4.getItems().get(0);
            TaskRequest var6 = (TaskRequest)this.requestBO.load(var5.getRequestID());
            logger.debug("afterVariableUpdate TaskRequest  {}", var6.getUuid());
            String var7 = this.mergerDataXGate.updateStatus(var6.getRequestData(), var6.getUuid());
            if(var7.equals(EnumProcess.DONE.toString())) {
                ;
            }
        }

    }
}
