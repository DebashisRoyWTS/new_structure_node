"use strict";
// Class definition
var KTDatatableFaq = function() {
    // Private functions
    var options = {
        // datasource definition
        data: {
            type: 'remote',
            source: {
                read: {
                    url: `${location.protocol}//${window.location.host}/booking/getall`,
                },
            },
            pageSize: 10,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
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
                field: 'serviceData.title',
                title: 'Service Name',
                sortable: true,
                width: 150,
                template: function (row) {
                    console.log(row);
                    return row.serviceData[0].title;
                }
            },

            {
                field: 'customerData.full_name',
                title: 'User Name',
                sortable: true,
                width: 150,
                template: function (row) {
                    return row.customerData.full_name;
                }
            },

            {
                field: 'booking_date',
                title: 'Booking Date',
                sortable: true,
                // template: '{{full_name}}',
                // width: 120
                template: function(row) {
                    return moment(row['booking_date']).format('MM-DD-YYYY')
                },
            },

            // {
            //     field: 'booking_time',
            //     title: 'Booking Time',
            //     sortable: true,
            //     // template: '{{full_name}}',
            //     // width: 120
            //     template: function(row) {
            //         return row.booking_time;
            //     },            
            // },

            {
                field: 'price',
                title: 'Booking Price($)',
                sortable: true,
                // template: '{{price}}',
                width: 100,
                template: function (row) {
                    return row.serviceData.price;
                }
            },

            {
                field: 'provider_status',
                title: 'Provider Status',
                sortable: false,
                width: 100,
                // callback function support for column rendering
                template: function(row) {
                    var status = {
                        "Pending": {
                            'title': 'Pending',
                            'class': 'kt-badge--warning'
                        },
                        "Complete": {
                            'title': 'Complete',
                            'class': ' kt-badge--success'
                        },
                        "Incomplete": {
                            'title': 'Incomplete',
                            'class': ' kt-badge--danger'
                        }
                    };
                    return '<span class="kt-badge ' + status[row.provider_status].class +
                        ' kt-badge--inline kt-badge--pill trainingStatusUpdate onHover curserpointer" data-id="' + row._id + '">' + status[row.provider_status].title +
                        '</span>';
                },
            }, 
            {
                field: 'Actions',
                title: 'Actions',
                sortable: false,
                width: 80,
                overflow: 'visible',
                textAlign: 'center',
                autoHide: false,
                template: function (row) {
                    return '\
                        \<a href="' + location.protocol + "//" + window.location.host + '/booking/view/' + row._id + '" class="btn btn-sm btn-clean btn-icon btn-icon-sm" title="Eye">\
                        <i class="flaticon-eye"></i>\
                    </a>\
                    ';
                },
            },
    
        ],
    };

    // basic demo
    var mealMasterRecordSelection = function() {

        options.search = {
            input: $('#generalSearch'),
        };

        var datatable = $('#bookingRecordSelection').KTDatatable(options);

        // $('#booking_kt_form_status').on('change', function() {
        //     datatable.search($(this).val(), 'Status');
        // });

        // $('#booking_kt_form_status').selectpicker();

        $('#userStatus_form_status').on('change', function() {
            datatable.search($(this).val(), 'user_status');
        });

        $('#userStatus_form_status').selectpicker();

        datatable.on(
            'kt-datatable--on-check kt-datatable--on-uncheck kt-datatable--on-layout-updated',
            function(e) {
                var checkedNodes = datatable.rows('.kt-datatable__row--active').nodes();
                var count = checkedNodes.length;
                $('#kt_datatable_selected_number').html(count);
                if (count > 0) {
                    $('#kt_datatable_group_action_form').collapse('show');
                } else {
                    $('#kt_datatable_group_action_form').collapse('hide');
                }
            });

        $('#kt_modal_fetch_id').on('show.bs.modal', function(e) {
            var ids = datatable.rows('.kt-datatable__row--active').
            nodes().
            find('.kt-checkbox--single > [type="checkbox"]').
            map(function(i, chk) {
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
        }).on('hide.bs.modal', function(e) {
            $(e.target).find('.kt-datatable_selected_ids').empty();
        });

        $(document).on('click', '.trainerDelete', function() {
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
                    window.location.href = `${location.protocol}//${window.location.host}/training/delete/${elemID}`;
                }
            });
        });

        $(document).on('click', '.bookingStatusUpdate', function() {
            var elemID = $(this).data('id');
            swal.fire({
                title: 'Are you sure?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, change it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            }).then(function(result) {
                if (result.value) {
                    window.location.href = `${window.location.protocol}//${window.location.host}/booking/status-change/${elemID}`;
                }
            });
        });

    };



    return {
        // public functions
        init: function() {
            mealMasterRecordSelection();
        },
    };
}();

jQuery(document).ready(function() {
    KTDatatableFaq.init();
});