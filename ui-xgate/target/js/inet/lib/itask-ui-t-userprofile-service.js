// #PACKAGE: itask-ui-t-userprofile-service
// #MODULE: TRequestService
$(function () {
    iNet.ns("iNet.ui.UserProfile");

    iNet.ui.UserProfile = function () {
        this.id = 'userprofile-div';
        var self = this;
        var selfData = {
            dataReturn: {},
            profileID: ""
        };

        var resource = {
            task: iNet.resources.receiver.task,
            global: iNet.resources.global,
            errors: iNet.resources.errors,
            constant: iNet.resources.constant,
            validate: iNet.resources.validate
        };

        var url = {
            load: iNet.getUrl('onegate/userprofile/load'), //profileID
            update: iNet.getUrl('onegate/userprofile/update') //profileID
        };

        var $mask = {
            ajaxTask: $('#ajax-mask')
        };

        var $form = {
            UPViewContent: $('#userprofile-view-content'),

            UPInfo: $('#userprofile-info'),
            UPCitizen: $('#userprofile-citizen'),
            UPOrgan: $('#userprofile-organ'),

            UPContent: $('#userprofile-content'),            
            UPFullName: $('#userprofile-fullname'),
            UPBirthday: $('#userprofile-birthday'),
            UPIdentity: $('#userprofile-identity'),
            UPIdDateOfIssue: $('#userprofile-idDateOfIssue'),
            UPIdPlaceOfIssuse: $('#userprofile-idPlaceOfIssuse'),
            UPRegion: $('#userprofile-region'),
            UPNationality: $('#userprofile-nationality'),
            UPOtherNumber: $('#userprofile-otherNumber'),
            UPOtherDateOfIssue: $('#userprofile-otherDateOfIssue'),
            UPOtherPlaceOfIssuse: $('#userprofile-otherPlaceOfIssuse'),
            UPAddress1: $('#userprofile-address1'),
            UPAddress2: $('#userprofile-address2'),
            UPSmobile: $('#userprofile-smobile'),
            UPMale: $('#userprofile-sex-male'),
            UPFemale: $('#userprofile-sex-female'),
            UPEmail: $('#userprofile-email')
        };
        $form.UPCitizen.prop("checked", true);
        FormService.createDate($form.UPIdDateOfIssue);
        FormService.createDate($form.UPOtherDateOfIssue);

        var $button = {
            SAVE: $('#user-profile-save-btn'),
            BACK: $('#user-profile-back-btn')
        };

        var setHeight = function () {
            try {
                iNet.getLayout().$iframe.height($(iNet.getLayout().window).height() - 90);
            } catch (e) {
            }

            $form.UPViewContent.height($(window).height() - 45);
        };

        var displayContent = function($content, status){
            status = status || '';
            if ($content.hasClass('hide')){
                if (status != 'hide') { $content.removeClass('hide'); }
            } else {
                if (status != 'show') { $content.addClass('hide'); }
            }
        };

        var showProfile = function(profile){
            $form.UPContent.find('[data-profile="'+profile+'"]').show();
        };
        var hideProfile = function(profile){
            $form.UPContent.find('[data-profile="'+profile+'"]').hide();
        };
        var getUserProfile = function(validate){
            var __data = {
                address1: $form.UPAddress1.val(),
                address2: $form.UPAddress2.val(),
                birthday: $form.UPBirthday.val(),
                email: $form.UPEmail.val(),
                fullname: $form.UPFullName.val(),
                idDateOfIssue: $form.UPIdDateOfIssue.val(),
                identity: $form.UPIdentity.val(),
                idPlaceOfIssuse: $form.UPIdPlaceOfIssuse.val(),
                nationality: $form.UPNationality.val(),
                otherDateOfIssue: $form.UPOtherDateOfIssue.val(),
                otherNumber: $form.UPOtherNumber.val(),
                otherPlaceOfIssuse: $form.UPOtherPlaceOfIssuse.val(),
                region: $form.UPRegion.val(),
                mobile: $form.UPSmobile.val()
            };

            if ($form.UPCitizen.prop("checked")){
                __data.sex = "Nam";
                __data.company = "CN";
                if ($form.UPFemale.prop("checked")){
                    __data.sex = "Nu";
                }
            } else {
                __data.sex = "CP";
                __data.company = "DN";
                if ($form.UPFemale.prop("checked")){
                    __data.sex = "TNHH";
                }
            }

            if (validate){
                if (
                    iNet.isEmpty(__data.fullname) ||
                    iNet.isEmpty(__data.birthday) ||
                    iNet.isEmpty(__data.identity) ||
                        /*iNet.isEmpty(__data.idDateOfIssue) ||
                         iNet.isEmpty(__data.idPlaceOfIssuse) ||
                         iNet.isEmpty(__data.nationality) ||
                         iNet.isEmpty(__data.region) ||*/
                    iNet.isEmpty(__data.address1) /*||
                 iNet.isEmpty(__data.address2) ||
                 iNet.isEmpty(__data.mobile) ||
                 iNet.isEmpty(__data.email)*/
                ) {
                    self.notifyError(resource.constant.warning_title, String.format(resource.constant.warning_error, resource.task.userprofileInfo));
                    return {};
                }
            }

            return __data;
        };
        var setUserProfile = function(data){
            selfData.dataReturn = {};
            var __dataUserProfile = data || {};
            $form.UPAddress1.val(__dataUserProfile.address1 || "");
            $form.UPAddress2.val(__dataUserProfile.address2 || "");
            $form.UPBirthday.val(__dataUserProfile.birthday || "");
            $form.UPEmail.val(__dataUserProfile.email || "");
            $form.UPFullName.val(__dataUserProfile.fullname || "");
            $form.UPIdDateOfIssue.val(__dataUserProfile.idDateOfIssue || "");
            $form.UPIdentity.val(__dataUserProfile.identity || "");
            $form.UPIdPlaceOfIssuse.val(__dataUserProfile.idPlaceOfIssuse || "");
            $form.UPNationality.val(__dataUserProfile.nationality || resource.task.userprofileNationality);
            $form.UPOtherDateOfIssue.val(__dataUserProfile.otherDateOfIssue || "");
            $form.UPOtherNumber.val(__dataUserProfile.otherNumber || "");
            $form.UPOtherPlaceOfIssuse.val(__dataUserProfile.otherPlaceOfIssuse || "");
            $form.UPRegion.val(__dataUserProfile.region || ((selfData.profileType == "citizen") ? resource.task.userprofileRegion : ""));
            $form.UPSmobile.val(__dataUserProfile.mobile || "");
            $form.UPFemale.prop("checked", (__dataUserProfile.sex == "Nu" || __dataUserProfile.sex == "TNHH" || (__dataUserProfile.sex || "") == ""));
            if (!$form.UPFemale.prop("checked")) {
                $form.UPMale.prop("checked", true);
            }
            if (__dataUserProfile.company == "DN") {
                $form.UPOrgan.prop("checked", true);
                showProfile("organ");
                hideProfile("citizen");
            } else {
                $form.UPCitizen.prop("checked", true);
                showProfile("citizen");
                hideProfile("organ");
            }
        };
        var searchUserProfile = function(callback){
            var __params = getUserProfile(true);
            if (iNet.isEmpty(__params)){
                return;
            }

            $.postJSON(url.user_profile_search, __params, function (result) {
                var __result = result || {};
                console.log("user_profile result >>", __result, iNet.isFunction(callback));

                if (CommonService.isSuccess(__result)){
                    var __profileID = __result.uuid || "";

                    if (iNet.isFunction(callback)){
                        callback();
                    }
                } else {
                    $mask.ajaxTask.hide();
                    self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, __result.errors || []));
                }
            });
        };

        $form.UPCitizen.on('click', function(){
            selfData.profileType = "citizen";
            if ($form.UPRegion.val() == ""){
                $form.UPRegion.val(resource.task.userprofileRegion);
            }
            showProfile('citizen');
            hideProfile('organ');
        });
        $form.UPOrgan.on('click', function(){
            selfData.profileType = "organ";
            if ($form.UPRegion.val() == resource.task.userprofileRegion){
                $form.UPRegion.val("");
            }
            showProfile('organ');
            hideProfile('citizen');
        });

        $form.UPBirthday.on('change', function(event){
            if (!iNet.isEmpty($form.UPBirthday.val())){
                if (!FormService.validateDate($form.UPBirthday.val())){
                    $form.UPBirthday.val("");
                }
            }
        });
        $form.UPBirthday.on('keyup', function(event){
            if (!iNet.isEmpty($form.UPBirthday.val())){
                if (!FormService.validateDate($form.UPBirthday.val(), true)){
                    $form.UPBirthday.val("");
                }
            }
        });

        $button.SAVE.on('click', function(){
            var __params = getUserProfile(true);
            if (iNet.isEmpty(__params) || iNet.isEmpty(selfData.profileID)){
                return;
            }
            __params.profileID = selfData.profileID;

            $.postJSON(url.update, __params, function (result) {
                var __result = result || {};
                if (CommonService.isSuccess(__result)){
                    selfData.dataReturn = __result;
                    $button.BACK.trigger('click');
                } else {
                    self.notifyError(resource.constant.submit_title, self.getNotifyContent(resource.constant.submit_error, __result.errors || []));
                }
            });
        });
        $button.BACK.on('click', function(){
            if (!iNet.isEmpty(selfData.dataReturn)){
                self.fireEvent('back', selfData.dataReturn);
            } else {
                self.fireEvent('back');
            }
        }.createDelegate(this));

        this.setProfile = function(profileId){
            selfData.profileID = profileId || "";
            if (iNet.isEmpty(selfData.profileID)){
                $button.BACK.trigger('click');
                return;
            }
            $.postJSON(url.load, {profileID: profileId}, function (result) {
                var __result = result || {};
                if (CommonService.isSuccess(__result)){
                    setUserProfile(__result);
                }
            });
        };
        this.setData = function(userprofile){
            selfData.profileID = (userprofile || {}).uuid || "";
            if (iNet.isEmpty(selfData.profileID)){
                $button.BACK.trigger('click');
                return;
            }
            setUserProfile(userprofile);
        };

        //OTHER ==============================================
        $(iNet.getLayout()).on('resize', function () {
            setHeight();
        });

        setHeight();

        iNet.ui.UserProfile.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.UserProfile, iNet.ui.app.widget);
});
