"use strict";
// Class definition
var KTDatatableMealTypes = function () {
    // Private functions
    var options = {
        // datasource definition
        data: {
            type: 'remote',
            source: {
                read: {
                    url: `${location.protocol}//${window.location.host}/job-report/getall`,
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
                field: 'jobData',
                title: 'Title',
                sortable: false,
                width: 250,
                template: function (row) {
                   // console.log('row', row);
                    if (row.jobData === null) {
                        return 'N/A'
                    } else {

                  
                    return row.jobData.title ? row.jobData.title : 'N/A';
                }
                }
            },
            {
                field: 'job_info.job_type',
                title: 'Type',
                sortable: false,
                width: 80,
                template: function (row) {
                    if (row.job_type === null) {
                        return 'N/A'
                    } else {

                  
                    return row.jobData.job_type ? row.jobData.job_type : 'N/A';
                }
                 
                }
            },
            {
                field: 'reportUserData',
                title: 'Reported By',
                sortable: true,
                width: 150,
                template: function (row) {
                    console.log(row);
                    if (row.reportUserData === null) {
                        return 'N/A'
                    } else {

                  
                    return row.reportUserData.full_name ? row.reportUserData.full_name  : 'N/A';
                }
                   
                }
            },
            {
                field: 'createdAt',
                title: 'Reported Date',
                width: 100,
                sortable: true,
                template: function (row) {
                    return moment(row.createdAt).format("MM-DD-YYYY");
                },
            },
            {
                field: 'status',
                title: 'Status',
                sortable: false,
                width: 80,
                textAlign: 'center',
                // callback function support for column rendering
                template: function (row) {
                    var status = {
                        "Accept": {
                            'title': 'Accepted',
                            'class': 'kt-badge--success'
                        },
                        "Reject": {
                            'title': 'Rejected',
                            'class': ' kt-badge--danger'
                        },
                        "Pending": {
                            'title': 'Pending',
                            'class': ' kt-badge--brand'
                        },
                    };
                    return '<span class="kt-badge ' + status[row.status].class +
                        ' kt-badge--inline kt-badge--pill KTStatusUpdate onHover" data-id="' + row._id + '" >' + status[row.status].title +
                        '</span>';
                },
            }, {
                field: 'Actions',
                title: 'Actions',
                sortable: false,
                width: 80,
                overflow: 'visible',
                textAlign: 'center',
                autoHide: false,
                template: function (row) {
                    return '\<a href="' + location.protocol + "//" + window.location.host + '/job-report/view/' + row._id + '" class="btn btn-sm btn-clean btn-icon btn-icon-sm" title="Details">\
                    <i class="flaticon-eye"></i>\
                </a>\
                \<a id="del-' + row._id + '" href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-sm ktDelete" title="Delete">\
                        <i class="flaticon-delete"></i>\
                    </a>\
                ';
                },
            }],
    };

    // basic demo
    var mealTypesSelector = function () {

        options.search = {
            input: $('#generalSearch'),
        };

        var datatable = $('#dataRecordSelection').KTDatatable(options);

        $('#kt_form_status').on('change', function () {
            datatable.search($(this).val(), 'Status');
        });

        $('#kt_form_status').selectpicker();

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
        $(document).on('click', '.KTStatusUpdate', function () {
            var elemID = $(this).data('id');
            var status = $(this).data('status');
            var inputs = new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (status === 'Pending') {
                        let options = {
                            "Pending": "Pending",
                            "Accept": "Accept",
                            "Reject": "Reject"
                        }
                        return resolve(options);
                    } else if (status === true) {
                        let options = {
                            "Accept": "Accept",
                            "Reject": "Reject",
                            "Pending": "Pending"
                        }
                        return resolve(options);
                    } else {
                        let options = {
                            "Reject": "Reject",
                            "Accept": "Accept",
                            "Pending": "Pending"
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
                    window.location.href = `${window.location.protocol}//${window.location.host}/job-report/status-change/${elemID}?status=${result.value}`;
                }
            });
        })
        $(document).on('click', '.ktDelete', function () {
            var elemID = $(this).attr('id').replace('del-', '');
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
                    window.location.href = `${location.protocol}//${window.location.host}/job-report/delete/${elemID}`;
                }
            });
        });
    };



    return {
        // public functions
        init: function () {
            mealTypesSelector();
        },
    };
}();

jQuery(document).ready(function () {
    KTDatatableMealTypes.init();
});