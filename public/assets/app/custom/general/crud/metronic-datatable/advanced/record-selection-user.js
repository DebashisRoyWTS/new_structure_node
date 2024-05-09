"use strict";
var tzone = $("#tzone").val();
if (!tzone) {
    tzone = sessionStorage.getItem("logged_user_tzone");
}
// Class definition
var KTDatatableUser = function () {
    // Private functions
    var options = {
        // datasource definition
        data: {
            type: 'remote',
            source: {
                read: {
                    url: `${location.protocol}//${window.location.host}/user/getall?zone=${tzone}`,
                },
            },
            pageSize: 10,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            loading: true
        },

        // layout definition
        layout: {
            scroll: true, // enable/disable datatable scroll both horizontal and
            // vertical when needed.
            height: 500, // datatable's body's fixed height
            footer: false // display/hide footer
        },

        // column sorting
        sortable: true,

        pagination: true,

        // columns definition

        columns: [
            {
                field: 'profile_image',
                title: 'Image',
                width: 90,
                sortable: false,
                class: 'profile_image',
                template: function (row) {
                    if(row.user_type == 'Technician'){
                        if (row.business_image) {
                            return `<img style="max-height: 45px" src = "${window.location.protocol}//${window.location.host}/uploads/user/business_image/${row.business_image}">`;
                        }else if (row.profile_image) {
                            return `<img style="max-height: 45px" src = "${window.location.protocol}//${window.location.host}/uploads/user/profile_pic/${row.profile_image}">`;
                        } else {
                            return `<img style="max-height: 45px" src = "${window.location.protocol}//${window.location.host}/uploads/no-image.png">`;
                        }
                        
                    }else{
                        if (row.profile_image) {
                            return `<img style="max-height: 45px" src = "${window.location.protocol}//${window.location.host}/uploads/user/profile_pic/${row.profile_image}">`;
                        } else {
                            return `<img style="max-height: 45px" src = "${window.location.protocol}//${window.location.host}/uploads/no-image.png">`;
                        }
                        
                    }
                }
            },

            {
                field: 'full_name',
                title: 'Name',
                // overflow: 'visible',
                sortable: true,
                width: 150,
                template: function (row) {
                    if (!row.first_name && !row.last_name) {
                        return 'N/A';
                    } else {
                        let name = row.first_name + ' ' + row.last_name;
                        return name;
                    }
                },
            },
            {
                field: 'email',
                title: 'Email',
                sortable: true,
                // overflow: 'visible',
                width: 200,
                // callback function support for column rendering
                template: function (row) {
                    return row.email ? row.email : 'N/A';
                },
            },
            {
                field: 'user_type',
                title: 'User Type',
                sortable: true,
                // overflow: 'visible',
                width: 100,
                // callback function support for column rendering
                template: function (row) {
                    return row.user_type ? row.user_type: 'N/A';
                },
            },

            {
                field: 'isActive',
                title: 'Status',
                sortable: false,
                width: 70,
                // callback function support for column rendering
                template: function (row) {
                    var status = {
                        "true": {
                            'title': 'Active',
                            'class': 'kt-badge--success'
                        },
                        "false": {
                            'title': 'Inactive',
                            'class': ' kt-badge--danger'
                        },
                        "banned": {
                            'title': 'Banned',
                            'class': ' kt-badge--brand'
                        },
                    };
                    return '<span class="kt-badge ' + status[(row.isBanned ? 'banned' : row.isActive)].class +
                        ' kt-badge--inline kt-badge--pill KTUserStatusUpdate onHover curserpointer" data-id="' + row._id + '" data-status="' + (row.isBanned ? 'banned' : row.isActive) + '">' + status[(row.isBanned ? 'banned' : row.isActive)].title +
                        '</span>';
                },
            },
            {
                field: 'account_verified',
                title: 'Account Verified',
                sortable: false,
                width: 150,
                class: 'text-center',
                // callback function support for column rendering
                template: function (row) {
                    var status = {
                        'true': {
                            'title': 'Yes',
                            'class': 'kt-badge--success'
                        },
                        'false': {
                            'title': 'No',
                            'class': ' kt-badge--danger'
                        }
                    };
                    return '<span class="kt-badge ' + status[row.account_verified].class +
                        ' kt-badge--inline kt-badge--pill KTUserVerified onHover curserpointer" data-id="' + row._id + '" data-status="' + (row.account_verified) + '">' + status[(row.account_verified)].title +
                        '</span>';
                },
            },
            {
                field: 'Actions',
                title: 'Actions',
                sortable: false,
                // width: 80,
                overflow: 'visible',
                textAlign: 'center',
                autoHide: false,
                template: function (row) {
                    return '\
                        \<a href="' + location.protocol + "//" + window.location.host + '/user/edit/' + row._id + '" class="btn btn-sm btn-clean btn-icon btn-icon-sm" title="Edit">\
                            <i class="flaticon-edit"></i>\
                        </a>\
                        \<a href="' + location.protocol + "//" + window.location.host + '/user/reset-password/' + row._id + '" class="btn btn-sm btn-clean btn-icon btn-icon-sm" title="Reset Password">\
                            <i class="fas fa-envelope"></i>\
                        </a>\
                        \<a id="del-' + row._id + '" href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-sm ktDelete" title="Delete">\
                            <i class="flaticon-delete"></i>\
                        </a>\
                    ';

                    //<button class="dropdown-item action view" type="button" data-url="${window.location.protocol}//${window.location.host}/user/view/${row._id}">View</button>
                },
            },

        ],
    };

    // basic demo
    var userSelector = function () {

        options.search = {
            input: $('#generalSearch'),
            delay: 1500
        };

        var datatable = $('#usersRecordSelection').KTDatatable(options);

        $('#kt_form_status').on('change', function () {
            datatable.search($(this).val(), 'Status');
        });

        $('#kt_form_role').on('change', function () {
            datatable.search($(this).val(), 'user_type');
        });

        $(document).ready(function(e){
            
         
       
            setTimeout(()=>{
            let role = $('#kt_form_role').val();
            console.log(role ,'--------------role');
            if(role == 'Technician'){
                datatable.search(role, 'user_type');}
            if(role == 'Customer'){
                datatable.search(role, 'user_type');}
           
        },400)
     
    
    })
        $('#kt_form_role').on('ready', function () {
            datatable.search($(this).val(), 'user_type');
        });
     

        $('#kt_form_status,#kt_form_role').selectpicker();

        $("[data-field='profile_image']").css("cursor", "default");
        $("[data-field='isActive']").css("cursor", "default");
        $("[data-field='Actions']").css("cursor", "default");

        datatable.on(
            'kt-datatable--on-check kt-datatable--on-uncheck kt-datatable--on-layout-updated',
            function (e) {
                var checkedNodes = datatable.rows('.kt-datatable__row--active').nodes();
                var count = checkedNodes.length;
                $('#kt_datatable_selected_number').html(count);
                if (count > 0) {
                    $('#kt_datatable_group_action_form').collapse('show');
                } else {
                    $('#kt_datatable_group_action_form').collapse('hide');
                }
            });

        $('#kt_modal_fetch_id').on('show.bs.modal', function (e) {
            var ids = datatable.rows('.kt-datatable__row--active').
                nodes().
                find('.kt-checkbox--single > [type="checkbox"]').
                map(function (i, chk) {
                    return $(chk).val();
                });
            var c = document.createDocumentFragment();
            for (var i = 0; i < ids.length; i++) {
                var li = document.createElement('li');
                li.setAttribute('data-id', ids[i]);
                li.innerHTML = 'Selected record ID: ' + ids[i];
                c.appendChild(li);
            }
            $(e.target).find('.kt-datatable_selected_ids').append(c);
        }).on('hide.bs.modal', function (e) {
            $(e.target).find('.kt-datatable_selected_ids').empty();
        });

        $(document).on('click', '.ktDelete', function() {
            var elemID = $(this).attr('id').replace('del-', '');
            swal.fire({
                title: 'Are you sure?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            }).then(function(result) {
                if (result.value) {
                    window.location.href = `${location.protocol}//${window.location.host}/user/delete/${elemID}`;
                }
            });
        });

        $(document).on('click', '.KTUserStatusUpdate', function () {
            var elemID = $(this).data('id');
            var status = $(this).data('status');
            var inputs = new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (status === 'banned') {
                        let options = {
                            "banned": "Banned",
                            "true": "Active",
                            "false": "Inactive"
                        }
                        return resolve(options);
                    } else if (status === true) {
                        let options = {
                            "true": "Active",
                            "false": "Inactive",
                            "banned": "Banned"
                        }
                        return resolve(options);
                    } else {
                        let options = {
                            "false": "Inactive",
                            "true": "Active",
                            "banned": "Banned"
                        }
                        return resolve(options);
                    }
                }, 200);
            });
            swal.fire({
                title: 'Are you sure?',
                type: 'warning',
                input: 'select',
                inputOptions: inputs,
                showCancelButton: true,
                confirmButtonText: 'Yes, change it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            }).then(function (result) {
                if (result.value) {
                    window.location.href = `${window.location.protocol}//${window.location.host}/user/status-change/${elemID}?status=${result.value}`;
                }
            });
        });

        $(document).on('click', '.KTUserVerified', function () {
            var elemID = $(this).data('id');
            var status = $(this).data('status');
            var inputs = new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (status === true) {
                        let options = {
                            "true": "Yes",
                            "false": "No"
                        }
                        return resolve(options);
                    } else {
                        let options = {
                            "false": "No",
                            "true": "Yes"
                        }
                        return resolve(options);
                    }
                }, 200);
            });
            swal.fire({
                title: 'Are you sure?',
                type: 'warning',
                input: 'select',
                inputOptions: inputs,
                showCancelButton: true,
                confirmButtonText: 'Yes, change it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            }).then(function (result) {
                if (result.value) {
                    window.location.href = `${window.location.protocol}//${window.location.host}/user/verify-status-change/${elemID}?status=${result.value}`;
                }
            });
        });

        $(document).on('click', '.action', function (e) {
            let optionUrl = $(this).attr('data-url');
            if ($(this).hasClass('deleteUser')) {
                swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, delete it!',
                    cancelButtonText: 'No, cancel!',
                    reverseButtons: true
                }).then(function (result) {
                    if (result.value) {
                        window.location.href = optionUrl;
                    }
                });
            } else {
                window.location.href = optionUrl;
            }
        });

    };



    return {
        // public functions
        init: function () {
            userSelector();
        },
    };
}();

jQuery(document).ready(function () {
    KTDatatableUser.init();
});

function numFormatter(num) {
    if(num > 999 && num < 1000000){
        return (num/1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million 
    }else if(num > 1000000){
        return (num/1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
    }else if(num < 900){
        return num; // if value < 1000, nothing to do
    }
}

function countDecimals (n) {
    if(Math.floor(n.valueOf()) === n.valueOf()) return 0;
    if (n.toString().match(/\./gi)) {
        return n.toString().split(".")[1].length || 0;
    } else {
        return 0;
    }
}