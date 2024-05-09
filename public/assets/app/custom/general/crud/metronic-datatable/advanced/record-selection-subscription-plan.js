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
                    url: `${window.location.protocol}//${window.location.host}/subscription-plan/getall`,
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
            field: 'name',
            title: 'Name',
            width: 200,
            sortable: false,
            template: function (row) {
                return row.name;
            }
        },
        {
            field: 'duration',
            title: 'Duration',
            width: 150,
            sortable: false,
            template: function (row) {
                if(row.frequency == 'half'){
                    return 'per 6 months';
                }else if(row.frequency == 'quarter'){
                    return 'per 3 months';
                }else if(row.frequency == 'free'){
                    return 'free';
                }else{
                    return 'per '+row.frequency;
                }  
            }
        },
        {
            field: 'price',
            title: 'Price',
            width: 150,
            sortable: false,
            template: function (row) {
                return formatter.format(row.price);
            }
        },
        // {
        //     field: 'isFree',
        //     title: 'Is Free',
        //     sortable: false,
        //     width: 200,
        //     textAlign: 'center',
        //     // callback function support for column rendering
        //     template: function (row) {
        //         if(row.isFree == true){
        //             return '<span class="kt-badge kt-badge--inline kt-badge--brand kt-badge--pill onHover" >Yes</span>';
        //         }else{
        //             return '<span class="kt-badge kt-badge--inline kt-badge--danger kt-badge--pill onHover" >No</span>';
        //         }
        //     },
        // }, 
        {
            field: 'Actions',
            title: 'Actions',
            sortable: false,
            overflow: 'visible',
            textAlign: 'left',
            width: 120,
            autoHide: false,
            template: function (row) {
                return '\
                    \<a href="'+window.location.protocol+'//'+ window.location.host + '/subscription-plan/edit/' + row._id + '" class="btn btn-sm btn-clean btn-icon btn-icon-sm" title="Edit">\
                        <i class="flaticon-edit"></i>\
                    </a>\
                    \<a id="del-' + row._id + '" href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-sm ktDelete" title="Delete">\
                        <i class="flaticon-delete"></i>\
                    </a>\
                ';
            },
        }
    ],
    };

    // basic demo
    var ingredientsSelector = function () {
        options.search = {
            input: $('#generalSearch'),
        };

        var datatable = $('#subscriptionPlanRecordSelection').KTDatatable(options);

        $('#kt_form_status').on('change', function () {
            datatable.search($(this).val(), 'Status');
        });

        $('#kt_form_type').on('change', function () {
            datatable.search($(this).val().toLowerCase(), 'Type');
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

        $(document).on('click', '.KTStatusUpdate', function () {
            var elemID = $(this).data('id');
            swal.fire({
                title: 'Are you sure?',
                // text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes,change it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            }).then(function (result) {
                if (result.value) {
                    window.location.href = `${window.location.protocol}//${window.location.host}/subscription-plan/status-change/${elemID}`;
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
                    window.location.href = `${window.location.protocol}//${window.location.host}/subscription-plan/delete/${elemID}`;
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