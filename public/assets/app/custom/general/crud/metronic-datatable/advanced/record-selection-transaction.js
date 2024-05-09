"use strict";
// Class definition
var KTDatatableMealTypes = function () {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    })
    // Private functions
    var options = {
        // datasource definition
        data: {
            type: 'remote',
            source: {
                read: {
                    url: `${location.protocol}//${window.location.host}/transaction/getall`,
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
                field: 'trans_date',
                title: 'Date',
                sortable: true,
                width: 100,
                template: function (row) {
                    return moment(row.trans_date).format("MM-DD-YYYY");
                }
            },
            {
                field: 'trans_amount',
                title: 'Amount',
                sortable: true,
                width: 100,
                //textAlign: 'right',
                template: function(row){
                    if(row.trans_type=="Refund"){
                        return '<span style="color:red">'+formatter.format(row.trans_amount)+'</span>';
                    }
                    else{
                        return '<span style="color:green">'+formatter.format(row.trans_amount)+'</span>';
                    }
                }
            },
            {
                field: 'payment_type',
                title: 'Payment Type',
                sortable: false,
                width: 150,
                //textAlign: 'right',
                template: function(row){
                    if(row.payment_type=="Debit"){
                        return '<span style="color:red">Debit</span>';
                    }
                    else{
                        return '<span style="color:green">Credit</span>';
                    }
                }
            },
            {                
                field: 'trans_type',
                title: 'Transaction Type',
                sortable: true,
                template: '{{trans_type}}',
                width: 200
            },
            {
                field: 'user_full_name',
                title: 'User Name',
                sortable: true,
                template: '{{user_full_name}}',
                width: 200
            },
            {
                field: 'user_email',
                title: 'User Email',
                sortable: true,
                template: '{{user_email}}',
                width: 280
            }
            ],
    };

    // basic demo
    var mealTypesSelector = function () {

        options.search = {
            input: $('#generalSearch'),
        };

        var datatable = $('#transactionRecordSelection').KTDatatable(options);

        $('#kt_form_status').on('change', function () {
            datatable.search($(this).val(), 'Status');
        });

        $('#searchDate').on('change', function () {
            datatable.search($(this).val(), 'Date');
        });

        $('#kt_trans_type').on('change', function () {
            datatable.search($(this).val(), 'Transaction_type');
        });

        $('#kt_form_status,#kt_form_type, #kt_trans_type').selectpicker();

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
            swal.fire({
                title: 'Are you sure?',
                // text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, change it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            }).then(function (result) {
                if (result.value) {
                    window.location.href = `${window.location.protocol}//${window.location.host}/transaction/status-change/${elemID}`;
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
                    window.location.href = `${location.protocol}//${window.location.host}/transaction/delete/${elemID}`;
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