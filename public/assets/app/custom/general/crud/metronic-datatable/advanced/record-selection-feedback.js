"use strict";

// Class definition
var KTDatatablereview = function () {
    // Private functions
    var options = {
        // datasource definition
        data: {
            type: 'remote',
            source: {
                read: {
                    url: `${location.protocol}//${window.location.host}/feedback/getall`,
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
                field: 'service',
                title: 'Service',
                width: 120,
                sortable: false,
                template: function (row) {
                    return row.service;
                },
            },
            {
                field: 'user',
                title: 'Feedback by',
                width: 130,
                sortable: true,
                template: function (row) {
                    return row.user ? row.user : 'N/A';
                },
            },
            {
                field: 'user_role',
                title: 'Role',
                width: 130,
                sortable: true,
                template: function (row) {
                    return row.user_role ? row.user_role : 'N/A';
                },
            },
            {
                field: 'rating',
                title: 'Rating',
                width: 90,
                textAlign: 'center',
                sortable: false,
                template: function (row) {
                    return `${row.rating ? row.rating: 0} <i class="flaticon-star"></i>`;
                },
            },
            {
                field: 'createdAt',
                title: 'Date',
                width: 110,
                sortable: false,
                template: function (row) {
                    return row.createdAt;
                },
            },
            {
                field: 'Actions',
                title: 'Actions',
                sortable: false,
                width: 100,
                overflow: 'visible',
                textAlign: 'left',
                autoHide: false,
                template: function (row) {
                    return '\
                    \<a href="' + location.protocol + "//" + window.location.host + '/feedback/view/' + row._id + '" class="btn btn-sm btn-clean btn-icon btn-icon-sm" title="Details">\
                        <i class="flaticon-eye"></i>\
                    </a>\
                    \
                ';
                },
            }
        ],
    };

    // basic demo
    var reviewSelector = function () {

        options.search = {
            input: $('#generalSearch'),
        };

        var datatable = $('#feedbackRecordSelection').KTDatatable(options);

        $('#kt_form_user_role').on('change', function () {
            datatable.search($(this).val(), 'Role');
        });

        $('#kt_form_user_role,#kt_form_type').selectpicker();

        $("[data-field='createdAt']").css("cursor", "default");
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

    };



    return {
        // public functions
        init: function () {
            reviewSelector();
        },
    };
}();

jQuery(document).ready(function () {
    KTDatatablereview.init();
});