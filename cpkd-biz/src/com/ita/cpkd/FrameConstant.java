/*****************************************************************
   Copyright 2015 by Hien Nguyen (hiennguyen@inetcloud.vn)

   Licensed under the iNet Solutions Corp.,;
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.inetcloud.vn/licenses

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 *****************************************************************/
package com.ita.cpkd;

/**
 * FrameConstant.
 *
 * @author Hien Nguyen
 * @version $Id: FrameConstant.java Apr 15, 2015 1:21:24 PM nguyen_dv $
 *
 * @since 1.0
 */
public interface FrameConstant {
	public static final String FRAMECODE_NAME = "cloud-cmmapp";
	public static final String FRAMECORE_APPLICATION = "CPKD Solutions";
	public static final String FRAMECORE_MODULE = "CPKD Report";

	public static final String ROLE_ADMIN = "$xgate_admin";
	public static final String ROLE_RECEIVER = "$receiver";
	public static final String ROLE_PROCESSOR = "$process_user";
	public static final String ROLE_MANAGEMENT = "$management";

	public static final String ROLE_USER_REPORT = "$userreport";
	
	// the link of project redirect
	public static final String FRAMECORE_REDIRECT_PAYMENT = "FRAMECORE_REDIRECT_PAYMENT";
	public final static String FRAMECORE_LOCAL_PROCEDURE = "NEXP";

	//key for taskID when receiver
	public final static String FRAMECORE_XGATE_RECEIVER = "xgate.receiver";

	//some key of requestData
	public static final String organId = "organId";

	// default data service transfer
	public static final String TICKET_RESULT_PARAMETER = "requestID";
	public static final String TASK_REQUEST_ID = "taskRequestID";
	public static final String REPLY_FOR_ORGID = "replyForOrgID";
	public static final String BRIEFCASE_TYPE = "briefcaseType";
	public static final String XGATE_PLACE_RECEIVER = "receiverPlace";
	public static final String XGATE_PLACE_SUBMIT = "XGATE-PLACE-SUBMIT";


	// data transfer to organ other
	public static final String TRANSFER_DATA = "transferData";
	public static final String TRANSFER_ORGAN = "organ";
	public static final String TRANSFER_NOTE = "note";
	public static final String TRANSFER_TIME = "time";
	public static final String TRANSFER_REPLY = "reply";

	// data for refuse request by organ
	public static final String REFUSE_DATA = "refuseData";
	public static final String REFUSE_REQUEST = "isRefuse";
	public static final String REFUSE_ORGAN = "refuseOrgan";
	public static final String REFUSE_NOTE = "refuseNote";
	public static final String REFUSE_TIME = "refuseTime";

	// data from additional request
	public static final String ADDITIONAL_REQUESTCODE = "requestCode";
	
	// plugin file
	public final static String PLUGIN_PROFILE = "service.profile";

	// key data from metaform into igate package
	public static final String IGATE_PLACE_SUBMIT = "IGATE_PLACE_SUBMIT";
	public static final String IGATE_RECORD_CODE = "recordCode";

	public static final String IGATE_UR_FULLNAME = "USER_PROFILE_FULLNAME";
	public static final String IGATE_UR_ADDRESS = "USER_PROFILE_ADDRESS";
	public static final String IGATE_UR_PHONE = "USER_PROFILE_PHONE";
	public static final String IGATE_UR_BIRTHDAY = "USER_PROFILE_BIRTHDAY";
	public static final String IGATE_UR_IDENTITY = "USER_PROFILE_IDENTITY";
	public static final String IGATE_UR_IDDATEOFISSUE = "USER_PROFILE_IDDATEOFISSUE";
	public static final String IGATE_UR_IDPLACEOFISSUE = "USER_PROFILE_IDPLACEOFISSUE";
	public static final String IGATE_UR_EMAIL = "USER_PROFILE_EMAIL";

	public static final String IGATE_REQUEST_RECEIPT_NO = "REQUEST_RECEIPT_NO";
	public static final String IGATE_REQUEST_SERIAL_NO = "REQUEST_SERIAL_NO";
	public static final String IGATE_PROCEDURE_ID = "PROCEDURE_ID";
	public static final String IGATE_PROCEDURE_NAME = "PROCEDURE_NAME";
	public static final String IGATE_INDUSTRY_CODE = "INDUSTRY_CODE";

	//Status using mscore api
	public static final String MSCORE_SUBMIT = "MSCORE_SUBMIT";
	public static final String MSCORE_UPDATE = "MSCORE_UPDATE";
	public static final String MSCORE_DELETE = "MSCORE_DELETE";
}
