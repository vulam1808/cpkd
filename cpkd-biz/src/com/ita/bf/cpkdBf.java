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
package com.ita.bf;

import javax.inject.Inject;
import javax.inject.Named;

import com.inet.xportal.nosql.web.bf.MagicContentBF;
import com.inet.xportal.nosql.web.provider.NoSQLConfigProvider;
import com.inet.xportal.web.context.ApplicationContext;
import com.inet.xportal.web.context.ContentContext;

/**
 * cpkdBf.
 *
 * @author lamle
 * @version $Id: cpkdBf.java 2015-04-20 14:18:24z tttduyen $
 *
 * @since 1.0
 */
@Named("cpkd-bf")
@ContentContext(context = "cpkdNoSqlContext")
public class cpkdBf extends MagicContentBF {

  /**
   * Create {@link cpkdBf} instance
   * 
   * @param provider the given {@link NoSQLConfigProvider}
   */
  @Inject
  protected cpkdBf(@ApplicationContext(context = "cpkdNoSqlProvider") NoSQLConfigProvider provider) {
    super(provider);
  }

}