"use strict";

// Class Definition
var KTLoginGeneral = function () {
    var baseUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
    var login = $('#kt_login');


    var showErrorMsg = function (form, type, msg) {
        var alert = $('<div class="kt-alert kt-alert--outline alert alert-' + type + ' alert-dismissible" role="alert">\
        <!-- <button type="button" class="close" data-dismiss="alert" aria-label="Close">x</button> -->\
			<span></span>\
		</div>');

        form.find('.alert').remove();
        alert.prependTo(form);
        //alert.animateClass('fadeIn animated');
        KTUtil.animateClass(alert[0], 'fadeIn animated');
        alert.find('span').html(msg);
    }

    // Private Functions
    var displaySignUpForm = function () {
        login.removeClass('kt-login--forgot');
        login.removeClass('kt-login--signin');

        login.addClass('kt-login--signup');
        KTUtil.animateClass(login.find('.kt-login__signup')[0], 'flipInX animated');
    }

    var displaySignInForm = function () {
        login.removeClass('kt-login--forgot');
        login.removeClass('kt-login--signup');

        login.addClass('kt-login--signin');
        KTUtil.animateClass(login.find('.kt-login__signin')[0], 'flipInX animated');
        setTimeout(()=>{
            login.find('.alert').remove();
        }, 5000);
        //login.find('.kt-login__signin').animateClass('flipInX animated');
    }

    var displayForgotForm = function () {
        login.removeClass('kt-login--signin');
        login.removeClass('kt-login--signup');

        login.addClass('kt-login--forgot');
        //login.find('.kt-login--forgot').animateClass('flipInX animated');
        KTUtil.animateClass(login.find('.kt-login__forgot')[0], 'flipInX animated');
        setTimeout(()=>{
            login.find('.alert').remove();
        }, 5000);

    }

    var handleFormSwitch = function () {
        $('#kt_login_forgot').click(function (e) {
            e.preventDefault();
            displayForgotForm();
        });

        $('#kt_login_forgot_cancel').click(function (e) {
            e.preventDefault();
            displaySignInForm();
        });

        $('#kt_login_signup').click(function (e) {
            e.preventDefault();
            displaySignUpForm();
        });

        $('#kt_login_signup_cancel').click(function (e) {
            e.preventDefault();
            displaySignInForm();
        });
    }

    var handleSignInFormSubmit = function () {
        $('#kt_login_signin_submit').click(function (e) {
            // alert(baseUrl + '/login');
            e.preventDefault();
            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    email: {
                        required: true,
                        email: true
                    },
                    password: {
                        required: true
                    }
                },
                messages: {
                    email: {
                        required: "Email is required",
                        email: "Please enter valid email address only"
                    },
                    password: {
                        required: "Password is required",
                    }
                },
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);

            form.ajaxSubmit({
                url: baseUrl + 'login',
                success: function(response, status, xhr, $form) {
                    // console.log(xhr);
                    // console.log(response);
                    if (response.result.status == '500') {
                        // similate 2s delay
                        setTimeout(function() {
                            btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                            showErrorMsg(form, 'danger', 'Authentication failed. Email & Password incorrect!');
                        }, 2000);
                    } else {
                        // similate 2s delay
                        setTimeout(function() {
                            btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                            showErrorMsg(form, 'success', response.message);
                            window.location.replace(baseUrl + 'dashboard');
                        }, 2000);
                    }
                	
                }
            });
        });
    }

    var handleSignUpFormSubmit = function () {
        $('#kt_login_signup_submit').click(function (e) {
            e.preventDefault();

            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    fullname: {
                        required: true
                    },
                    email: {
                        required: true,
                        email: true
                    },
                    password: {
                        required: true
                    },
                    rpassword: {
                        required: true
                    },
                    agree: {
                        required: true
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);

            form.ajaxSubmit({
                url: '',
                success: function (response, status, xhr, $form) {
                    // similate 2s delay
                    setTimeout(function () {
                        btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                        form.clearForm();
                        form.validate().resetForm();

                        // display signup form
                        displaySignInForm();
                        var signInForm = login.find('.kt-login__signin form');
                        signInForm.clearForm();
                        signInForm.validate().resetForm();

                        showErrorMsg(signInForm, 'success', 'Thank you. To complete your registration please check your email.');
                    }, 2000);
                }
            });
        });
    }

    var handleForgotFormSubmit = function () {
        // $('#kt_login_forgot_submit').click(function (e) {
        //     e.preventDefault();

        //     var btn = $(this);
        //     var form = $(this).closest('form');

        //     form.validate({
        //         rules: {
        //             email: {
        //                 required: true,
        //                 email: true
        //             }
        //         },
        //         messages: {
        //             email: {
        //                 required: "Email is required",
        //                 email: "Please enter valid email address only"
        //             }
        //         },
        //     });

        //     if (!form.valid()) {
        //         return;
        //     }

        //     var data = form.serialize();
        //     btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);


        //     form.ajaxSubmit({
        //         url: baseUrl + 'user/forgotpassword',
        //         type: 'post',
		// 		data: data,
		// 		dataType: "json",
        //         success: function (response, status, xhr, $form) {
        //             if (response.result.status == 200) { 
		// 				setTimeout(function() {
		// 					btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false); // remove
		// 					form.clearForm(); // clear form
		// 					form.validate().resetForm(); // reset validation states
		
		// 					// display signup form
		// 					displaySignInForm();
		// 					var signInForm = login.find('.kt-login__signin form');
		// 					signInForm.clearForm();
		// 					signInForm.validate().resetForm();
		// 					showErrorMsg(signInForm, 'success', 'Cool! Password recovery instruction has been sent to your email.');
		// 				}, 2000);
		// 			}
		// 			else if(response.result.status == 500){ 
		// 				setTimeout(function() {
		// 					btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false); // remove
		// 					form.clearForm(); // clear form
		// 					// display signup form
		// 					displaySignInForm();
		// 					var signInForm = login.find('.kt-login__signin form');
		// 					signInForm.clearForm();
		// 					signInForm.validate().resetForm();
		// 					showErrorMsg(signInForm, 'error',response.message);
		// 				}, 2000);
		// 			}
        //         }
        //     });
        // });

        $('#kt_login_forgot_submit').click(function(e) {
            e.preventDefault();

            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    email: {
                        required: true,
                        email: true
                    }
                }
            });

            if (!form.valid()) {
                return;
            }
            var data = form.serialize();
          //  console.log(data,"data");
            btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);
            $(".kt-alert").remove();
            //console.log("Test")
            form.ajaxSubmit({
				url: baseUrl + 'user/forgotpassword',
				type: 'post',
				data: data,
				dataType: "json",
				success: function(response, status, xhr, $form) { 
                    // console.log(response,"RRRRRRRRRRRRRRRrr");
                   //alert(JSON.stringify(response));
					if (response.result.status == 200) {
						setTimeout(function() {
							btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false); // remove
							form.clearForm(); // clear form
							form.validate().resetForm(); // reset validation states
		
							// display signup form
							displaySignInForm();
							var signInForm = login.find('.kt-login__signin form');
							signInForm.clearForm();
							signInForm.validate().resetForm();
							showErrorMsg(signInForm, 'success', 'Cool! New password has been sent to your email.');
						}, 2000);
					} else if(response.result.status == 500) { 
						setTimeout(function() {
							btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false); // remove
							form.clearForm(); // clear form
                            
							// display signup form
							displaySignInForm();
							var signInForm = login.find('.kt-login__signin');
							signInForm.clearForm();
							signInForm.validate().resetForm();
							showErrorMsg(signInForm, 'danger', 'User Not Found!');
						}, 2000);

					}
				}
			});
        });
    }

    // Public Functions
    return {
        // public functions
        init: function () {
            handleFormSwitch();
            handleSignInFormSubmit();
            handleSignUpFormSubmit();
            handleForgotFormSubmit();
        }
    };
}();

// Class Initialization
jQuery(document).ready(function () {
    KTLoginGeneral.init();
});