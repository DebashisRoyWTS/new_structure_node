// Class definition

var KTFormControls = function () {
    // Private functions

    var myProfileValidation = function () {
        $("#frmMyProfile").validate({
            // define validation rules
            rules: {
                first_name: {
                    required: true,
                    letterswithbasicpunc: true,
                    noSpace: true
                },
                last_name: {
                    required: true,
                    letterswithbasicpunc: true,
                    noSpace: true
                }
            },
            messages: {
                first_name: {
                    required: "Please enter your First Name",
                    letterswithbasicpunc: "Please enter alphabets only",
                  
                },
                last_name: {
                    required: "Please enter your Last Name",
                    letterswithbasicpunc: "Please enter alphabets only",
                   
                }
            },
            //display error alert on form submit  
            invalidHandler: function (event, validator) {
                KTUtil.scrollTop();
            },

            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }

    var prodCatValidation = function () {
        $("#frmProdCat").validate({
            // define validation rules
            rules: {
                title: {
                    required: true,
                   
                    noSpace: true
                },
            
            },
         
            //display error alert on form submit  
            invalidHandler: function (event, validator) {
                KTUtil.scrollTop();
            },

            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }

    var serviceSubCatValidation = function () {
        $("#serviceSubCat").validate({
            // define validation rules
            rules: {
                title: {
                    required: true,
                   
                    noSpace: true
                },
                parent: {
                    required: true,
                   
                 
                },
            
            },
         
            //display error alert on form submit  
            invalidHandler: function (event, validator) {
                KTUtil.scrollTop();
            },

            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }


    var servicesFormValidation = function () {
        $("#frmServices").validate({
            // define validation rules
            rules: {
                title: {
                    required: true,
                   
                    noSpace: true
                },
                category_id: {
                    required: true,
                   
                 
                },
                price: {
                    required: true,
                   
                   
                },
                badge_id: {
                    required: true,
                   
              
                },
                description: {
                    required: true,
                    noSpace: true
                   
              
                },
            
            },
            messages:{
                title: {
                    required: "This field is required"
                },
                price: {
                    required: "This field is required"
                },
            },
         
            //display error alert on form submit  
            invalidHandler: function (event, validator) {
                KTUtil.scrollTop();
            },

            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }


    var changePasswordValidation = function () {
        $("#changePasswordForm").validate({
            // define validation rules
            rules: {
                old_password: {
                    required: true,
                },
                password: {
                    required: true,
                    minlength: 6
                },
                password_confirm: {
                    required: true,
                    minlength: 6
                }
            },
            messages: {
                old_password: {
                    required: "Please enter your Old Password",
                },
                password: {
                    required: "Please enter your New Password",
                },
                password_confirm: {
                    required: "Make sure that you have entered the same Password here.",
                }
            },
            //display error alert on form submit  
            invalidHandler: function (event, validator) {
                KTUtil.scrollTop();
            },

            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }

    var editUserValidation = function () {
        // alert('hgfd');
        $("#editToppingsValidation").validate({

            // define validation rules
            rules: {
                full_name: {
                    required: true,
                    // letterswithbasicpunc: true
                },
                email: {
                    required: true,
                    // letterswithbasicpunc: true
                }
            },
            messages: {
                full_name: {
                    required: "Please enter full name"
                },
                email: {
                    required: "Please enter email"
                }
            },
            //display error alert on form submit  
            invalidHandler: function (event, validator) {
                KTUtil.scrollTop();
            },

            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }

    var editUserValidation = function () {
        $("#editUserValidation").validate({
            // define validation rules
            rules: {
                first_name: {
                    required: true,
                    letterswithbasicpunc: true
                },
                last_name: {
                    required: true,
                    letterswithbasicpunc: true
                },
                email: {
                    required: true,
                    email: true
                }
            },
            messages: {
                first_name: {
                    required: "Please enter first name",
                    letterswithbasicpunc: "Please enter valid first name"
                },
                last_name: {
                    required: "Please enter last name",
                    letterswithbasicpunc: "Please enter valid last name"
                },
                email: {
                    required: "Please enter email",
                    email: 'Please provide a Valid Email'
                }
            },
            //display error alert on form submit  
            invalidHandler: function (event, validator) {
                KTUtil.scrollTop();
            },
            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }

    var addUserValidation = function () {
        $("#addUserValidation").validate({
            // define validation rules
            rules: {
                first_name: {
                    required: true,
                    letterswithbasicpunc: true
                },
                last_name: {
                    required: true,
                    letterswithbasicpunc: true
                },
                email: {
                    required: true,
                    email: true
                },
                password: {
                    required: true,
                    minlength: 6
                }
            },
            messages: {
                first_name: {
                    required: "Please enter first name",
                    letterswithbasicpunc: "Please enter valid first name"
                },
                last_name: {
                    required: "Please enter last name",
                    letterswithbasicpunc: "Please enter valid last name"
                },
                email: {
                    required: "Please enter email",
                    email: 'Please provide a Valid Email'
                },
                password: {
                    required: "Please enter Password",
                    minlength: 'Min 6 digit password is Required'
                }
            },
            //display error alert on form submit  
            invalidHandler: function (event, validator) {
                KTUtil.scrollTop();
            },
            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }

    var EditCMSValidation = function () {
        $("#frmEditCMS").validate({

            // define validation rules
            rules: {
                title: {
                    required: true,
                    // letterswithbasicpunc: true
                }
            },
            messages: {
                title: {
                    required: "Please enter title"
                }
            },
            //display error alert on form submit  
            invalidHandler: function (event, validator) {
                KTUtil.scrollTop();
            },

            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }

    var FAQFrmValidation = function () {
        $("#frmFAQ").validate({
            rules: {
                question: {
                    required: true,
                },
                answer: {
                    required: true,
                }
            },
            messages: {
                question: {
                    required: "Please enter Question"
                },
                answer: {
                    required: "Please enter Answer"
                }
            },
            invalidHandler: function (event, validator) {
                //KTUtil.scrollTop();
            },

            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }

    var settingsFormValidation = function () {
        $("#frmSettings").validate({
            rules: {
                facebookLink: {
                    noSpace: true,
                    required: true,
                    url :true
                },
                youtubeLink: {
                    noSpace: true,
                    required: true,
                    url: true
                },
                twitterLink: {
                    noSpace: true,
                    required: true,
                    url :true
                },
                instagramLink: {
                    noSpace: true,
                    required: true,
                    url :true
                }
            },
            messages: {
                facebookLink: {
                    noSpace: "Cannot upload with only spaces"
                    
                },
                youtubeLink: {
                    noSpace: "Cannot upload with only spaces"
                },
                twitterLink: {
                    noSpace: "Cannot upload with only spaces"
                },
                instagramLink: {
                    noSpace: "Cannot upload with only spaces"
                },
            },
            invalidHandler: function (event, validator) {
                //KTUtil.scrollTop();
            },

            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }

    var BlogFrmValidation = function () {
        $("#frmBlog").validate({
            rules: {
                title: {
                    required: true,
                    noSpace:true
                },
               
                author_name: {
                    required: true,
                    noSpace: true
                }
            },
            messages: {
                title: {
                    required: "Please enter Title"
                },
               
                author_name: {
                    required: "Please enter Author Name"
                }
            },
            invalidHandler: function (event, validator) {
                //KTUtil.scrollTop();
            },

            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }

    var PartnerFrmValidation = function () {
        $("#frmPartner").validate({
            rules: {
                title: {
                    noSpace: true,
                    required: true,
                },
              
            },
            messages: {
                title: {
                    
                    required: "Please enter Title"
                },
              
            },
            invalidHandler: function (event, validator) {
                //KTUtil.scrollTop();
            },

            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }



    var TrainingValidation = function () {
        $("#trainingValidate").validate({
            // define validation rules
            rules: {
                title: {
                    required: true,
                },
                content: {
                    required: true,
                }
                
            },
            messages: {
                title: {
                    required: "Please enter the Training Title",
                },
                content: {
                    required: "Please enter the content for Training",
                } 
            },
            //display error alert on form submit  
            invalidHandler: function (event, validator) {
                KTUtil.scrollTop();
            },
            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }

    var EditTrainingValidation = function () {
        $("#trainingEditValidate").validate({
            // define validation rules
            rules: {
                title: {
                    required: true,
                    noSpace: true
                },
                content: {
                    required: true,
                    noSpace: true
                }
            },
            messages: {
                title: {
                    required: "Please enter the Training Title",
                },
                content: {
                    required: "Please enter the content for Training",
                } 
            },
            //display error alert on form submit  
            invalidHandler: function (event, validator) {
                KTUtil.scrollTop();
            },
            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }

    var BadgeValidation = function () {
        $("#frmBadge").validate({
            // define validation rules
            rules: {
                title: {
                    required: true,
                    noSpace: true
                }
            },
            messages: {
                title: {
                    required: "Please enter the badge title",
                }
            },
            //display error alert on form submit  
            invalidHandler: function (event, validator) {
                KTUtil.scrollTop();
            },
            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }
    var StudioValidation = function () {
        $("#studioValidate").validate({
            // define validation rules
            rules: {
                name: {
                    required: true,
                    noSpace: true

                },
                content: {
                    required: true,
                    noSpace: true

                },
                price: {
                    required: true,
                },
                location: {
                    required: true,
                    noSpace: true

                },
                image: {
                    required: true,
                },
                
            },
            messages: {
                title: {
                    required: "Please enter the Studio Name",
                },
                content: {
                    required: "Please enter the content for Studio",
                },
                price: {
                    required: "Please enter the price for Studio",
                },
                location: {
                    required: "Please enter the Studio's location",
                },
                image: {
                    required: "Please select the Image",
                }   
            },
            //display error alert on form submit  
            invalidHandler: function (event, validator) {
                KTUtil.scrollTop();
            },
            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }

    var StudioEditValidation = function () {
        $("#EditstudioValidate").validate({
            // define validation rules
            rules: {
                name: {
                    required: true,
                },
                content: {
                    required: true,
                },
                price: {
                    required: true,
                },
                location: {
                    required: true,
                }
            },
            messages: {
                title: {
                    required: "Please enter the Studio Name",
                },
                content: {
                    required: "Please enter the content for Studio",
                },
                price: {
                    required: "Please enter the price for Studio",
                },
                location: {
                    required: "Please enter the Studio's location",
                }  
            },
            //display error alert on form submit  
            invalidHandler: function (event, validator) {
                KTUtil.scrollTop();
            },
            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }

    var FrmsubmitValidation = function () {
        $("#frmsubvaild").validate({});
    }

    var EmailTemplateValidation = function () {
        jQuery.validator.addMethod("noSpace", function(value, element) { 
            return  value.trim() != ""; 
          }, "No space please and don't leave it empty");
        $("#frmEmailTemplate").validate({
            // define validation rules
            rules: {
                title: {
                    required: true,
                    noSpace: true
                },
                subject: {
                    required: true,
                    noSpace: true
                },
                description: {
                    required: true,
                    noSpace: true
                },
                
            },
            messages: {
                title: {
                    required: "Please enter the title",
                },
                subject: {
                    required: "Please enter the subject",
                },
                description: {
                    required: "Please enter the description",
                },
                
            },
            //display error alert on form submit  
            invalidHandler: function (event, validator) {
                KTUtil.scrollTop();
            },
            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }

    var AddProductValidation = function () {
        jQuery.validator.addMethod("noSpace", function(value, element) { 
            return  value.trim() != ""; 
          }, "No space please and don't leave it empty");
        $("#frmAddProd").validate({
            // define validation rules
            rules: {
                title: {
                    required: true,
                    noSpace: true
                },
                product_category: {
                    required: true,
                    noSpace: true
                },
                product_type: {
                    required: true,
                    noSpace: true
                },
                price: {
                    required: true,
                    noSpace: true
                },
                content: {
                    required: true,
                    noSpace: true
                },
                
            },
            messages: {
                title: {
                    required: "This field is required",
                },
                product_category: {
                    required: "This field is required",
                },
                product_type: {
                    required: "This field is required",
                },
                price: {
                    required: "This field is required",
                },
                content: {
                    required: "This field is required",
                },
                
            },
            //display error alert on form submit  
            invalidHandler: function (event, validator) {
                KTUtil.scrollTop();
            },
            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }

    var testimonialValidation = function () {
        jQuery.validator.addMethod("noSpace", function(value, element) { 
            return  value.trim() != ""; 
          }, "No space please and don't leave it empty");
        $("#frmTestimonial").validate({
            // define validation rules
            rules: {
                author: {
                    required: true,
                    noSpace: true
                },
              
                description: {
                    required: true,
                    noSpace: true
                },
                
            },
            messages: {
                author: {
                    required: "This field is required",
                },
                description: {
                    required: "This field is required",
                },
               
                
            },
            //display error alert on form submit  
            invalidHandler: function (event, validator) {
                KTUtil.scrollTop();
            },
            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }


    var blankSpaceNotAllow = function () {
        $("input").on("keypress", function (e) {
            var startPos = e.currentTarget.selectionStart;
            if (e.which === 32 && startPos == 0)
                e.preventDefault();
        })
    }

    var frmUserEdit = function () {
        $("#frmUserEdit").validate({
            // define validation rules
            rules: {
                first_name: {
                    required: true,
                    noSpace: true
                },
                last_name: {
                    required: true,
                    noSpace: true
                },
                email: {
                    required: true,
                    noSpace: true
                },
                // country_code: {
                //     required: true,
                // },
                phone: {
                    required: true,
                    noSpace: true
                },
                street: {
                    required: true,
                    noSpace: true
                },
                country: {
                    required: true,
                    noSpace: true
                },
                city: {
                    required: true,
                    noSpace: true
                },
                zipcode: {
                    required: true,
                    noSpace: true
                },
                // instagram_id: {
                //     required: true,
                // },
            },
            messages: {
                first_name: {
                    required: 'Firstname is required'
                },
                last_name: {
                    required: 'Lastname is required'
                },
                email: {
                    required: 'Email is required'
                },
                // country_code: {
                //     required: 'Country Code is required'
                // },
                phone: {
                    required: 'Phone is required'
                },
                street: {
                    required: 'Street is required'
                },
                country: {
                    required: 'Country is required'
                },
                city: {
                    required: 'City is required'
                },
                zipcode: {
                    required: 'Zipcode is required'
                },
                // instagram_id: {
                //     required: 'Instagram id is required'
                // },
            },
            //display error alert on form submit  
            invalidHandler: function (event, validator) {
                KTUtil.scrollTop();
            },
            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }

    var frmJobInput = function () {
        $("#frmJobInput").validate({
            // define validation rules
            rules: {
                title: {
                    required: true,
                    noSpace: true
                },
                job_category: {
                    required: true,
                 
                },
                isUrgent: {
                    required: true,
                   
                },
                // country_code: {
                //     required: true,
                // },
                job_type: {
                    required: true,
                  
                },
                location: {
                    required: true,
                    noSpace: true
                },
                company: {
                    required: true,
                    noSpace: true
                },
                position: {
                    required: true,
                    noSpace: true
                },
                experience: {
                    required: true,
                    noSpace: true
                },
                require_member:{
                    required: true
                },
                pay_upto: {
                    required: true,
                },
                content: {
                    required: true,
                },
            },
            messages: {
              
            },
            //display error alert on form submit  
            invalidHandler: function (event, validator) {
                KTUtil.scrollTop();
            },
            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }

    return {
        // public functions
        init: function () {
            settingsFormValidation();
            myProfileValidation();
            editUserValidation();
            changePasswordValidation();
            addUserValidation();
            editUserValidation();
            EditCMSValidation();
            FAQFrmValidation();
            BlogFrmValidation();
            PartnerFrmValidation();
            FrmsubmitValidation();
            TrainingValidation();
            EditTrainingValidation();
            StudioValidation();
            StudioEditValidation();
            frmUserEdit();
            EmailTemplateValidation();
            AddProductValidation();
            testimonialValidation();
            prodCatValidation();
            serviceSubCatValidation();
            servicesFormValidation();
            frmJobInput();
            BadgeValidation();

        }
    };
}();

jQuery(document).ready(function () {
    KTFormControls.init();
    $("#testform").validate({errorElement:"div",ignore:[]});

    // Allow only decimal number //
	$('.allownumericwithdecimal').on('input', function() {		
		this.value = this.value
		.replace(/[^\d.]/g, '')             // numbers and decimals only
		//.replace(/(^[\d]{2})[\d]/g, '$1')   // not more than 2 digits at the beginning
		.replace(/(\..*)\./g, '$1')         // decimal can't exist more than once
		.replace(/(\.[\d]{2})./g, '$1');    // not more than 4 digits after decimal
	});
});