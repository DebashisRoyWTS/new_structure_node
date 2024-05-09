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
                    url: `${location.protocol}//${window.location.host}/training/getall`,
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
                field: 'title',
                title: 'Title',
                // overflow: 'visible',
                sortable: true,
                // width: 120,
                template: function(row) {
                    return row.title;
                },
            },
            {
                field: 'publish_date',
                title: 'Publish Date',
                width: 100,
                sortable: true,
                template: function (row) {
                    console.log(row)
                    return moment(row.publish_date).format("MM-DD-YYYY");
                },
            },
            {
                field: 'full_name',
                title: 'Service Provider',
                sortable: false,
                template: '{{full_name}}',
                width: 120
            },
            {
                field: 'status',
                title: 'Status',
                sortable: false,
                width: 100,
                // callback function support for column rendering
                template: function(row) {
                    var status = {
                        "Active": {
                            'title': 'Active',
                            'class': 'kt-badge--success'
                        },
                        "Inactive": {
                            'title': 'Inactive',
                            'class': ' kt-badge--danger'
                        },
                    };
                    return '<span class="kt-badge ' + status[row.status].class +
                        ' kt-badge--inline kt-badge--pill trainingStatusUpdate onHover curserpointer" data-id="' + row._id + '">' + status[row.status].title +
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
                        \<a href="' + location.protocol + "//" + window.location.host + '/training/edit/' + row._id + '" class="btn btn-sm btn-clean btn-icon btn-icon-sm" title="Edit">\
                            <i class="flaticon-edit"></i>\
                        </a>\
                        \<a id="del-' + row._id + '" href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-sm trainerDelete" title="Delete">\
                            <i class="flaticon-delete"></i>\
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

        var datatable = $('#trainingManagementListing').KTDatatable(options);

        $('#training_kt_form_status').on('change', function() {
            datatable.search($(this).val(), 'Status');
        });

        $('#training_kt_form_status').selectpicker();

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

        $(document).on('click', '.trainingStatusUpdate', function() {
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
                    window.location.href = `${window.location.protocol}//${window.location.host}/training/status-change/${elemID}`;
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