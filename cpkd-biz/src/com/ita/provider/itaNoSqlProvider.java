/*****************************************************************
   Copyright 2015 by Duyen Tang (tttduyen@inetcloud.vn)

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
package com.ita.provider;

import com.inet.xportal.nosql.web.provider.NoSQLDeployProvider;
import com.inet.xportal.web.annotation.XPortalBigData;
import com.inet.xportal.web.context.ApplicationContext;

/**
 * itaNoSqlProvider.
 *
 * @author Duyen Tang
 * @version $Id: itaNoSqlProvider.java 2015-04-20 10:41:17z tttduyen $
 *
 * @since 1.0
 */
@ApplicationContext(context = "itaNoSqlProvider")
@XPortalBigData(context = "ita")
public class itaNoSqlProvider extends NoSQLDeployProvider {

}
