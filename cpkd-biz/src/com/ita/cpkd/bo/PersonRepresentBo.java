package com.ita.cpkd.bo;

import com.inet.xportal.nosql.web.bf.MagicContentBF;
import com.inet.xportal.nosql.web.bo.MagicContentBO;
import com.inet.xportal.web.context.ContentContext;
import com.inet.xportal.web.context.WebContext;
import com.inet.xportal.web.exception.WebOSBOException;
import com.ita.cpkd.enums.EnumStatus;
import com.ita.cpkd.model.ChangeBusiness;
import com.ita.cpkd.model.HomeBusiness;
import com.ita.cpkd.model.PersonRepresent;


import javax.inject.Inject;
import javax.inject.Named;

/**
 * Created by HS on 14/9/2016.
 */
@Named("PersonRepresentBo")
public class PersonRepresentBo extends MagicContentBO<PersonRepresent> {


    /**
     * Create {@link AccountBo} instance
     *
     * @param contentBf the given {@link MagicContentBF}
     */
    @Inject
    protected PersonRepresentBo(@ContentContext(context = "itaNoSqlContext") MagicContentBF contentBf) {
        super(contentBf, "personrepresent");
    }
    public PersonRepresent loadPersonRepresentByID(String id) throws WebOSBOException
    {
        PersonRepresent objperson = super.load(id);
        return objperson;
    }
    public PersonRepresent updateHomeBusinessByID(PersonRepresent peronmodel,String idHomeBusiness,String idPersonRepresent) throws WebOSBOException
    {

        if(!idPersonRepresent.equals("")) {

            super.update(idPersonRepresent, peronmodel);
            peronmodel.setUuid(idPersonRepresent);
        }
        else
        {
            String uuid = super.add(peronmodel);
            peronmodel.setUuid(uuid);

                HomeBusiness objHome = new HomeBusiness();
                objHome.setPersonRepresent_ID(uuid);
                WebContext.INSTANCE.cache().getBean(HomeBusinessBo.class).update(idHomeBusiness, objHome);

        }
        return peronmodel;
    }
    public PersonRepresent updateChangeBusinessByID(PersonRepresent peronmodel,String idHomeBusiness,String idPersonRepresent) throws WebOSBOException
    {

        if(!idPersonRepresent.equals("")) {

            super.update(idPersonRepresent, peronmodel);
            peronmodel.setUuid(idPersonRepresent);
        }
        else
        {
            String uuid = super.add(peronmodel);
            peronmodel.setUuid(uuid);

                ChangeBusiness objchange = new ChangeBusiness();
                objchange.setPersonRepresent_ID(uuid);
            WebContext.INSTANCE.cache().getBean(ChangeBusinessBo.class).update(idHomeBusiness, objchange);
        }
        return peronmodel;
    }

    @Override
    protected Class<PersonRepresent> getClassConvetor() {
        return PersonRepresent.class;
    }
}
