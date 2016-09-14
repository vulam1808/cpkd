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
package com.ita.cpkd.bo;

import javax.inject.Inject;
import javax.inject.Named;

import com.ita.cpkd.model.Account;
import com.inet.xportal.nosql.web.bf.MagicContentBF;
import com.inet.xportal.nosql.web.bo.MagicContentBO;
import com.inet.xportal.web.context.ContentContext;

/**
 * AccountBo.
 *
 * @author Duyen Tang
 * @version $Id: AccountBo.java 2015-04-20 11:04:45z tttduyen $
 *
 * @since 1.0
 */
@Named("AccountBo")
public class AccountBo extends MagicContentBO<Account> {

  /**
   * Create {@link AccountBo} instance
   * 
   * @param contentBf the given {@link MagicContentBF}
   */
  @Inject
  protected AccountBo(@ContentContext(context = "itaNoSqlContext") MagicContentBF contentBf) {
    super(contentBf, "account");
  }

  @Override
  protected Class<Account> getClassConvetor() {
    return Account.class;
  }
}
