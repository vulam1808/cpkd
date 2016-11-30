package com.ita.cpkd.report;

import com.inet.xportal.web.annotation.XPortalViewFunction;
import com.ita.cpkd.enums.EnumStatus;
import org.apache.shiro.util.StringUtils;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

/**
 * FnExcelCtx.
 *
 * @author Phong Tran
 * @version $Id: FnExcelCtx.java 9/23/2015 9:45 AM phongtt@inetcloud.vn $
 * @since 1.0
 */
@XPortalViewFunction(name="fnitacore")
public class FnExcelCtx {

    public String convertStatusType( String pattern) {
       if(pattern.equals(EnumStatus.CAP_DOI.toString()))
       {
           return "Cấp đổi";
       }
       else if(pattern.equals(EnumStatus.CAP_MOI.toString()))
       {
           return "Cấp mới";
       }
       else if(pattern.equals(EnumStatus.CHAM_DUT.toString()))
       {
           return "Chấm dứt hoạt động";
       }
       else if(pattern.equals(EnumStatus.TAM_NGUNG.toString()))
       {
           return "Tạm ngưng";
       }
       else if(pattern.equals(EnumStatus.CAP_LAI.toString()))
       {
           return "Cấp lại";
       }
        return "";
    }
    /**
     *
     * @param date
     * @param pattern
     * @return
     */
    public String longToDate(long date, String pattern) {
        return format(new Date(date), pattern);
    }

    /**
     *
     * @param strdate
     * @return
     */
    public Date longToDate(String strdate) {
        long date = Long.parseLong(strdate);
        if (date > 0)
            return new Date(date);
        else
            return null;
    }

    private String format(Date date, String pattern) {
        if (date == null) {
            return null;
        } else {
            if (!StringUtils.hasLength(pattern)) {
                pattern = "yyyy-MM-dd\'T\'HH:mm:ssZ";
            }

            SimpleDateFormat dateFormat = new SimpleDateFormat(pattern);
            dateFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
            StringBuffer buffer = new StringBuffer(dateFormat.format(date));
            return buffer.insert(buffer.length() - 2, ':').toString();
        }
    }
}

