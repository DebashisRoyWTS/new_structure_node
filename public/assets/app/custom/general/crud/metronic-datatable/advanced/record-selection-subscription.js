"use strict";
// Class definition
var KTDatatableIngredients = function () {
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
                    url: `${window.location.protocol}//${window.location.host}/subscription/getall`,
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
            field: 'user',
            title: 'User',
            width: 280,
            sortable: false,
            template: function (row) {
                return row.name+"<br>"+row.email;
            }
        }, 
        {
            field: 'subscription_name',
            title: 'Subscription Plan',
            width: 120,
            sortable: false,
            template: function (row) {
                console.log(row.subscription_name);
                return row.subscription_name;
            }
        },        
        {
            field: 'subscription_amount',
            title: 'Amount',
            width: 70,
            textAlign: "right",
            sortable: false,
            template: function (row) {
                return formatter.format(row.subscription_amount);
            }
        },
        {
            field: 'subscription_frequency',
            title: 'Frequency',
            width: 90,
            sortable: false,
            template: function (row) {
                console.log(row);

                if(row.subscription_frequency == 'quarter'){   
                    return 'per 3 months';
                }else if(row.subscription_frequency == 'half'){
                    return 'per 6 months';
                }else{
                    return 'per '+row.subscription_frequency;
                }
                
            }
        },
        {
            field: 'subscription_start_date',
            title: 'Start Date',
            width: 85,
            sortable: false,
            template: function (row) {
                return moment(row.subscription_start_date).format("MM-DD-YYYY");
            }
        },
        {
            field: 'current_period_end_date',
            title: 'Renew Date',
            width: 85,
            sortable: false,
            template: function (row) {
                if(row.current_period_end_date!="N/A"){
                    return moment(row.current_period_end_date).format("MM-DD-YYYY");
                }
                else{
                    return "N/A";
                }
            }
        },
        {
            field: 'status',
            title: 'Status',
            width: 80,
            sortable: false,
            template: function (row) {
                return row.status;
            }
        }
        // {
        //     field: 'Actions',
        //     title: 'Actions',
        //     sortable: false,            
        //     overflow: 'visible',
        //     textAlign: 'left',
        //     autoHide: false,
        //     template: function (row) {
        //         if(row.can_refund=='yes'){
        //             return '<span class="kt-badge kt-badge--warning kt-badge--inline kt-badge--pill KTSubscriptionCancel onHover curserpointer" data-id="'+row._id+'">Cancel & Refund</span>';
        //         }
        //     },
        // }
    ],
    };

    // basic demo
    var ingredientsSelector = function () {
        options.search = {
            input: $('#generalSearch'),
        };

        var datatable = $('#subscriptionRecordSelection').KTDatatable(options);

        $('#kt_form_status').on('change', function () {
            datatable.search($(this).val(), 'Status');
        });

        $('#searchDate').on('change', function () {
            datatable.search($(this).val(), 'Date');
        });

        $('#kt_form_status,#kt_form_type').selectpicker();

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

        $(document).on('click', '.KTSubscriptionCancel', function(){
            var elemID = $(this).data('id');
            swal.fire({
                title: 'Are you sure?',
                text: "You want to cancel the subscription and refund the first payment!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                reverseButtons: true
            }).then(function(result){
                if (result.value) {
                    window.location.href = `http://${window.location.host}/subscription/unsubscribe/${elemID}/refund`;
                }
            });
          });
    };

    return {
        init: function () {
            ingredientsSelector();
        },
    };
}();

jQuery(document).ready(function () {
    KTDatatableIngredients.init();
});