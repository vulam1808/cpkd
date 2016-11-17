package com.ita.cpkd.bo;



import javax.inject.Inject;
import javax.inject.Named;

import com.inet.xportal.web.interfaces.BeanInitiateInvoke;

/**
 * FrameCoreInitBO.
 *
 * @author Phong Tran
 * @version $Id: FrameCoreInitBO.java 9/8/2015 1:55 PM phongtt@inetcloud.vn
 *          $
 * @since 1.0
 */
@Named("FrameCoreInitBO")
public class FrameCoreInitBO  implements BeanInitiateInvoke {
    @Inject
    private TemplateExcelInitBO tempExcelBO;



    /*
	 * (non-Javadoc)
	 * @see com.inet.xportal.web.interfaces.BeanInitiateInvoke#init()
	 */
    @Override
    public void init() {

        // initiate template excel for sites
        tempExcelBO.init();
    }
}

