/**
 * Created by ntvy on 8/28/14.
 */

$(function () {
    //$("#year").text(new Date().getFullYear());
	var $txtAccount = $('#account');
    var $txtUsername = $('#username');
    var $txtPassword = $('#password');
    var $userValidate = $('#username-validate');
    var $passwordValidate = $('#password-validate');
    var $domain = $('#domain');

    window.validate = function () {
        var __form = document.login;
        var __username = $txtAccount.val();
        var __password = $txtPassword.val();
        // clear error.
        $userValidate.empty();
        $passwordValidate.empty();
        if(__username == "" || __password ==""){// show error.
            if(__username == "") {
                $userValidate.text("Tài khoản không được để trống");
                $txtDisplayUsername.focus();
            }
            if(__password == "") {
                $passwordValidate.text("Mật khẩu không được để trống");
            }
            return false ;
        }
        if( (__username.indexOf("@") == -1)){
            __username = __username + $domain.text();
        }
        // setting username value.
        $txtUsername.val( __username.toLowerCase());
        // submit data.
        //Preventing Double Form Submission
        $('button[type="submit"]').prop('disabled', true).text('Đang xử lý...');
        $(window).on('keydown', function(event) {
        	return !(event.keyCode==13);
        });
        return true;
    };
    $(window).on('load', function(){
    	$txtAccount.focus();
    });
});