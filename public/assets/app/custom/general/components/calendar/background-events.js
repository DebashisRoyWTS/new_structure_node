"use strict";

var KTCalendarBackgroundEvents = function() {

    return {
        //main function to initiate the module
        init: function() {
            
            // var todayDate = moment().startOf('day');
            // var YM = todayDate.format('YYYY-MM');
            // var YESTERDAY = todayDate.clone().subtract(1, 'day').format('YYYY-MM-DD');
            // var TODAY = todayDate.format('YYYY-MM-DD');
            // var TOMORROW = todayDate.clone().add(1, 'day').format('YYYY-MM-DD');

            let viewAs = '0';
            let currentTimezone = moment.tz.guess();
            // console.log(currentTimezone);

            $.ajax({
                type: "GET",
                dataType: 'json',
                // data: {phone: hasPhoneNumber, countryShort: countryCode},
                url: `${window.location.protocol}//${window.location.host}/calendar/getallcount?viewas=${viewAs}`,
                success: function (success) {
                    if (success) {
                        $('#completedTaskCount').text(numFormatter(success.completedTask));
                        $('#completedWorkCount').text(numFormatter(success.completedWork));
                        $('#scheduledTaskCount').text(numFormatter(success.scheduledTask));
                        $('#scheduledWorkCount').text(numFormatter(success.scheduledWork));
                    }
                }
            });


            $('#kt_sub_user_id_sch').on('change', ()=>{
              
                viewAs = $('#kt_sub_user_id_sch').val();
                
                $.ajax({
                    type: "GET",
                    dataType: 'json',
                    // data: {phone: hasPhoneNumber, countryShort: countryCode},
                    url: `${window.location.protocol}//${window.location.host}/calendar/getallcount?viewas=${viewAs}`,
                    success: function (success) {
                        if (success) {
                            $('#completedTaskCount').text(numFormatter(success.completedTask));
                            $('#completedWorkCount').text(numFormatter(success.completedWork));
                            $('#scheduledTaskCount').text(numFormatter(success.scheduledTask));
                            $('#scheduledWorkCount').text(numFormatter(success.scheduledWork));
                        }
                    }
                });

                $('#kt_calendar').fullCalendar('destroy');
                $('#kt_calendar').fullCalendar({
                    isRTL: KTUtil.isRTL(),
                    header: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'month,agendaWeek,agendaDay,listWeek'
                    },
                    height: 'parent',
                    // contentHeight: 'auto',
                    editable: false,
                    eventLimit: false, // allow "more" link when too many events
                    navLinks: true,
                    nowIndicator: true,
                    weekNumbers: false,
                    businessHours: false, // display business hours
                    dayPopoverFormat: "dddd, MMMM D",
                    timezoneParam: currentTimezone,
                    // timeZone: 'local',
                    events: `${location.protocol}//${window.location.host}/calendar/getall?viewas=${viewAs}`,
                    loading: function( isLoading, view ) {
                        if (isLoading) {
                            $('#calendarLoader').css("display", "block");
                        } else {
                            $('#calendarLoader').css("display", "none");
                        }
                    },
                    eventRender: function(event, element) {
                        let desc = event.description.replace( /(<([^>]+)>)/ig, '');
                        if (desc.length>200) {
                            desc = desc.substr(0, 200).concat(' . . .');
                        }
                        if (element.hasClass('fc-day-grid-event')) {
                            element.data('content', desc);
                            element.data('placement', 'top');
                            KTApp.initPopover(element);
                        } else if (element.hasClass('fc-time-grid-event')) {
                            element.find('.fc-title').append('<div class="fc-description">' + desc + '</div>'); 
                        } else if (element.find('.fc-list-item-title').length !== 0) {
                            element.find('.fc-list-item-title').append('<div class="fc-description">' + desc + '</div>'); 
                        }
                    },

                    eventClick: function(calEvent, jsEvent, view) {
                        // if (calEvent.type=='task') {
                        //     $.ajax({
                        //         type: "Get",
                        //         dataType: 'json',
                        //         // data: {phone: hasPhoneNumber, countryShort: countryCode},
                        //         url: `${window.location.protocol}//${window.location.host}/tasks/details-modal/${calEvent.id}`,
                        //         success: function (success) {
                        //             if (success && success.status == 200) {
                        //                 let taskDetails = success.task;
                        //                 let assignedManagers = success.assignedManagers;
                        //                 if (taskDetails.isCompleted) {
                        //                     let options = '';
                        //                     if (assignedManagers.length>0) {
                        //                         for (let x of assignedManagers) {
                        //                             if (x._id.toString()==taskDetails.manager.toString()) {
                        //                                 options = options + `${x.full_name + ' (' + x.email + ')'}`;
                        //                             }
                        //                         }
                        //                     }
        
                        //                     let modal = `<div id="myModal" class="modal fade" role="dialog">
                        //                         <div class="modal-dialog modal-lg">
            
                        //                             <!-- Modal content-->
                        //                             <div class="modal-content">
                        //                                 <form class="kt-form kt-form--label-right" enctype="multipart/form-data" id="formCreateTasks" action="${window.location.protocol}//${window.location.host}/tasks/update?viewCal=true" method="POST">
                        //                                 <div class="modal-header">
                        //                                     <h4 class="modal-title">View Task</h4>
                        //                                     <button type="button" class="close" data-dismiss="modal"></button>
                        //                                 </div>
                        //                                 <div class="modal-body">
                        //                                         <div class="kt-portlet__body">
                        //                                             <div class="form-group row">
                        //                                                 <div class="col-lg-12">
                        //                                                     <label>Title:</label>
                        //                                                     <input type="text" name="title" id="title" class="form-control required" readonly placeholder="Enter Title" value="${taskDetails.title}">
                        //                                                 </div>
                        //                                                 <div class="col-lg-6" style="display:none">
                        //                                                     <label>Manager:</label>
                        //                                                     <div class="controls">
                        //                                                         <input type="text" name="manager" id="manager" class="form-control required" readonly placeholder="Enter Manager" value="${options}">
                        //                                                     </div>
                        //                                                 </div>
                        //                                             </div>
                        //                                             <div class="form-group row">
                        //                                                 <div class="col-lg-12">
                        //                                                     <label>Description:</label>
                        //                                                     <textarea name="description" id="description" rows="3" class="form-control" readonly placeholder="Enter Description">${taskDetails.description}</textarea>
                        //                                                 </div>
                        //                                             </div>
                        //                                             <div class="form-group row">
                        //                                                 <div class="col-lg-3">
                        //                                                     <label>Start Date:</label>
                        //                                                     <input type="text" name="start" class="form-control required" readonly autocomplete="off" placeholder="Enter Start Date" value="${taskDetails.start?moment(taskDetails.start).tz(currentTimezone).format('dddd, MM/DD/YYYY'):""}">
                        //                                                 </div>
                        //                                                 <div class="col-lg-3">
                        //                                                     <label>Start Time:</label>
                        //                                                     <input type="text" name="start_time" class="form-control required" readonly autocomplete="off" placeholder="Enter Start Time" value="${taskDetails.start?moment(taskDetails.start).tz(currentTimezone).format('hh:mm A'):""}">
                        //                                                 </div>
                        //                                                 <div class="col-lg-3">
                        //                                                     <label>End Date:</label>
                        //                                                     <input type="text" name="end" class="form-control required" readonly autocomplete="off" placeholder="Enter End Date" value="${taskDetails.end?moment(taskDetails.end).tz(currentTimezone).format('dddd, MM/DD/YYYY'):""}">
                        //                                                 </div>
                        //                                                 <div class="col-lg-3">
                        //                                                     <label>End Time:</label>
                        //                                                     <input type="text" name="end_time" class="form-control required" readonly autocomplete="off" placeholder="Enter End Time" value="${taskDetails.end?moment(taskDetails.end).tz(currentTimezone).format('hh:mm A'):""}">
                        //                                                 </div>
                        //                                             </div>
                                            
                        //                                         </div>
                        //                                         <div class="kt-portlet__foot">
                        //                                             <div class="kt-form__actions">
                        //                                                 <div class="row">
                        //                                                     <div class="col-lg-6">
                        //                                                         <input type="hidden" name="id" value="${calEvent.id}">
                        //                                                     </div>
                        //                                                 </div>
                        //                                             </div>
                        //                                         </div>
                        //                                 </div>
                        //                                 <div class="modal-footer">
                        //                                     <button type="button" class="btn btn-default" id="closeModalButton" data-dismiss="modal">Close</button>
                        //                                 </div>
                        //                                 </form>
                        //                             </div>
            
                        //                         </div>
                        //                     </div>`;
            
                        //                     $(modal).modal('show');
                                            
                        //                 } else {
                        //                     let options = '';
                        //                     if (assignedManagers.length>0) {
                        //                         for (let x of assignedManagers) {
                        //                             if (x._id.toString()==taskDetails.manager.toString()) {
                        //                                 options = options + `<option value="${x._id}" selected>${x.full_name + ' (' + x.email + ')'}</option>`;
                        //                             } else {
                        //                                 options = options + `<option value="${x._id}">${x.full_name + ' (' + x.email + ')'}</option>`;
                        //                             }
                        //                         }
                        //                     }
                        //                     let isComplete = '';
                        //                     if (taskDetails.isCompleted==true) {
                        //                         isComplete = `
                        //                         <option value="false">No</option>
                        //                         <option value="true" selected>Yes</option>
                        //                         `;
                        //                     } else {
                        //                         isComplete = `
                        //                         <option value="false" selected>No</option>
                        //                         <option value="true">Yes</option>
                        //                         `;
                        //                     }
        
                        //                     let modal = `<div id="myModal" class="modal fade" role="dialog">
                        //                         <div class="modal-dialog modal-lg">
            
                        //                             <!-- Modal content-->
                        //                             <div class="modal-content">
                        //                                 <form class="kt-form kt-form--label-right" enctype="multipart/form-data" id="formCreateTasks" action="${window.location.protocol}//${window.location.host}/tasks/update?viewCal=true" method="POST">
                        //                                 <div class="modal-header">
                        //                                     <h4 class="modal-title">Edit Task</h4>
                        //                                     <button type="button" class="close" data-dismiss="modal"></button>
                        //                                 </div>
                        //                                 <div class="modal-body">
                        //                                         <div class="kt-portlet__body">
                        //                                             <div class="form-group row">
                        //                                                 <div class="col-lg-12">
                        //                                                     <label>Title:</label>
                        //                                                     <input type="text" name="title" id="title" class="form-control required" required placeholder="Enter Title" value="${taskDetails.title}">
                        //                                                 </div>
                        //                                                 <div class="col-lg-6" style="display:none">
                        //                                                     <label>Manager:</label>
                        //                                                     <div class="controls">
                        //                                                         <select class="form-control required" id="manager" name="manager" data-live-search="true">
                        //                                                             <option value="" disabled>Select Manager</option>
                        //                                                             ${options}
                        //                                                         </select>
                        //                                                     </div>
                        //                                                 </div>
                        //                                             </div>
                        //                                             <div class="form-group row">
                        //                                                 <div class="col-lg-12">
                        //                                                     <label>Description:</label>
                        //                                                     <textarea name="description" id="description" rows="3" class="form-control" placeholder="Enter Description">${taskDetails.description}</textarea>
                        //                                                 </div>
                        //                                             </div>
                        //                                             <div class="form-group row">
                        //                                                 <div class="col-lg-3">
                        //                                                     <label>Start Date:</label>
                        //                                                     <input type="text" name="start" id="taskStartDate" class="form-control required" autocomplete="off" placeholder="Enter Start Date" value="${taskDetails.start?moment(taskDetails.start).tz(currentTimezone).format('dddd, MM/DD/YYYY'):""}">
                        //                                                 </div>
                        //                                                 <div class="col-lg-3 timediv">
                        //                                                     <label>Start Time:</label>
                        //                                                     <input type="text" name="start_time" id="startTime" class="form-control required" autocomplete="off" placeholder="Enter Start Time" value="${taskDetails.start?moment(taskDetails.start).tz(currentTimezone).format('hh:mm A'):""}">
                        //                                                 </div>
                        //                                                 <div class="col-lg-3 timediv">
                        //                                                     <label>End Date:</label>
                        //                                                     <input type="text" name="end" id="taskEndDate" class="form-control required" autocomplete="off" placeholder="Enter End Date" value="${taskDetails.end?moment(taskDetails.end).tz(currentTimezone).format('dddd, MM/DD/YYYY'):""}">
                        //                                                 </div>
                        //                                                 <div class="col-lg-3 timediv">
                        //                                                     <label>End Time:</label>
                        //                                                     <input type="text" name="end_time" id="endTime" class="form-control required" autocomplete="off" placeholder="Enter End Time" value="${taskDetails.end?moment(taskDetails.end).tz(currentTimezone).format('hh:mm A'):""}">
                        //                                                 </div>
                        //                                             </div>
                        //                                             <div class="form-group row">
                        //                                                 <div class="col-lg-4">
                        //                                                     <label>Completed?</label>
                        //                                                     <div class="controls">
                        //                                                         <select class="form-control" id="isCompleted" name="isCompleted">
                        //                                                             ${isComplete}
                        //                                                         </select>
                        //                                                     </div>
                        //                                                 </div>
                        //                                             </div>
                                            
                        //                                         </div>
                        //                                         <div class="kt-portlet__foot">
                        //                                             <div class="kt-form__actions">
                        //                                                 <div class="row">
                        //                                                     <div class="col-lg-6">
                        //                                                         <input type="hidden" name="id" value="${calEvent.id}">
                        //                                                     </div>
                        //                                                 </div>
                        //                                             </div>
                        //                                         </div>
                        //                                 </div>
                        //                                 <div class="modal-footer">
                        //                                     <button type="button" class="btn btn-default" id="closeModalButton" data-dismiss="modal">Close</button>
                        //                                     <button type="submit" class="btn btn-primary" id="updateModalButton">Update</button>
                        //                                 </div>
                        //                                 </form>
                        //                             </div>
            
                        //                         </div>
                        //                     </div>`;
            
                        //                     $(modal).modal('show');
                        //                 }
                                        
                        //             } else {
                        //                 alert('Something went wrong!');
                        //             }
                        //         }
                        //     });
                        // } else {
                            $.ajax({
                                type: "Get",
                                dataType: 'json',
                                // data: {phone: hasPhoneNumber, countryShort: countryCode},
                                url: `${window.location.protocol}//${window.location.host}/workorders/fetch-details/${calEvent.id}`,
                                success: function (success) {
                                    if (success && success.status == 200) {
                                        let allnote=success.allnotes
                                        let workorders = success.workorders;
                                        let assignedManagers = success.assignedManagers;
                                        let quickbook_customer = success.allCustomers;
                                        let activeManagers = success.activeManagers;
                                        if (workorders.isCompleted) {
                                            let options = '';
                                            if (activeManagers.length>0) {
                                                for (let x of activeManagers) {
                                                    if (inArray(assignedManagers, x._id.toString())) {
                                                        options = (options.length>0?options + '<br>': options) + `${x.full_name + ' (' + x.email + ')'}`;
                                                    }
                                                }
                                            }
    
                                            let quickbook_options = '';
                                            if (quickbook_customer.length>0) {
                                                for (let x of quickbook_customer) {
                                                    if (workorders.customer_id && x._id.toString()==workorders.customer_id.toString()) {
                                                        quickbook_options = quickbook_options + `${x.parentCustomerId?x.fullyQualifiedName + ' <Sub-Customer>':x.fullyQualifiedName + ' <Customer>'}`;
                                                    }
                                                }
                                            }
    
                                            let modal = `<div id="myWorkOrderModal" class="modal fade" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                                                <div class="modal-dialog modal-lg">
                                                    <!-- Modal content-->
                                                    <div class="modal-content">
                                                        <form class="kt-form kt-form--label-right" enctype="multipart/form-data" id="formEditWorkorders" action="${window.location.protocol}//${window.location.host}/workorders/update?viewCal=true" method="POST">
                                                        <div class="modal-header">
                                                            <h4 class="modal-title">View Work Order</h4>
                                                            <button type="button" class="close" data-dismiss="modal"></button>
                                                        </div>
                                                        <div class="modal-body" >
                                                                <div class="kt-portlet__body">
                                                                    <div class="form-group row">
                                                                        <div class="col-lg-6">
                                                                            <label>Address:</label>
                                                                            <input type="text" name="address" id="address" class="form-control required" readonly placeholder="Enter Address" value="${workorders.address}">
                                                                        </div>
                                                                        <div class="col-lg-2">
                                                                        </div>
                                                                        <div class="col-lg-4 col-sm-4 col-md-4 col-xs-4 mt-4">
                                                                        <input [disabled]="isDisabled" type="checkbox" name="quickbook_customer" onclick="return false;" onkeydown="return false;"  id="quickbook_customer" class="form-control required" ${workorders.quickbook_customer?'checked':''}  value="true" disabled>
                                                                         <label style="display-inline-block;white-space:nowrap;">Customer from QuickBooks?</label>
                                                                       </div>
                                                                    </div>
                                                                    <div class="form-group row quickBookCustomer">
                                                                        <div class="col-lg-6">
                                                                            <label>Customer:</label>
                                                                            <input type="text" name="customer_id" id="customer_id" class="form-control required" readonly placeholder="Enter Customer" value="${quickbook_options}">
                                                                        </div>
                                                                    </div>
                                                                    <div class="form-group row manualCustomer">
                                                                        <div class="col-lg-3">
                                                                            <label>Customer Name:</label>
                                                                            <input type="text" name="client_name" id="client_name" class="form-control required" readonly placeholder="Enter Customer Name" value="${workorders.client_name}">
                                                                        </div>
                                                                        <div class="col-lg-3">
                                                                            <label>Customer Email:</label>
                                                                            <input type="email" name="client_email" id="client_email" class="form-control required" readonly placeholder="Enter Customer Email" value="${workorders.client_email}">
                                                                        </div>
                                                                        <div class="col-lg-3">
                                                                            <label>Customer Phone:</label>
									                                        <input type="hidden" name="countryShort" id="countryShort" value="US">
                                                                            <input type="text" name="client_phone" id="client_phone" class="form-control" readonly placeholder="Enter Customer Phone" value="${workorders.client_phone}">
                                                                        </div>
                                                                        <div class="col-lg-3">
                                                                            <label>Customer Company:</label>
                                                                            <input type="text" name="client_company" id="client_company" class="form-control required" readonly placeholder="Enter Customer Company" value="${workorders.client_company}">
                                                                        </div>
                                                                    </div>
                                                                    <div class="form-group row">
                                                                        <div class="col-lg-12">
                                                                            <label>Description:</label>
                                                                            <textarea name="desc" id="descriptions" rows="3" class="form-control ckeditor required" readonly placeholder="Enter Description">${workorders.description}</textarea>
                                                                        </div>
                                                                    </div>
                                                                    <div class="form-group row">
                                                                        <div class="col-lg-6">
                                                                            <label>Start Date:</label>
                                                                            <input type="text" name="start" class="form-control required" autocomplete="off" readonly placeholder="Enter Start Date" value="${workorders.start?moment(workorders.start).tz(currentTimezone).format('dddd, MM/DD/YYYY'):""}">
                                                                        </div>
                                                                        <div class="col-lg-6">
                                                                            <label>Start Time:</label>
                                                                            <input type="text" name="start_time" class="form-control required" autocomplete="off" readonly placeholder="Enter Start Time" value="${workorders.start?moment(workorders.start).tz(currentTimezone).format('hh:mm A'):""}">
                                                                        </div>
                                                                    </div>
                                                                    <div class="form-group row">
                                                                        <div class="col-lg-6">
                                                                            <label>End Date:</label>
                                                                            <input type="text" name="end" class="form-control required" autocomplete="off" readonly placeholder="Enter End Date" value="${workorders.end?moment(workorders.end).tz(currentTimezone).format('dddd, MM/DD/YYYY'):""}">
                                                                        </div>
                                                                        <div class="col-lg-6">
                                                                            <label>End Time:</label>
                                                                            <input type="text" name="end_time" class="form-control required" autocomplete="off" readonly placeholder="Enter End Time" value="${workorders.end?moment(workorders.end).tz(currentTimezone).format('hh:mm A'):""}">
                                                                        </div>
                                                                    </div>
                                                                    <div class="form-group row">
                                                                        <div class="col-lg-12">
                                                                            <label>Manager:</label>
                                                                            <div class="controls">
                                                                                ${options}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="kt-portlet__foot">
                                                                    <div class="kt-form__actions">
                                                                        <div class="row">
                                                                            <div class="col-lg-6">
                                                                                <input type="hidden" name="id" value="${calEvent.id}">
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                        </div>
                                                        <div class="modal-footer">
                                                            <button type="button" class="btn btn-default" id="closeWorkModalButton" data-dismiss="modal">Close</button>
                                                        </div>
                                                        </form>
                                                    </div>
            
                                                </div>
                                            </div>`;
    
                                            $(modal).modal('show');
                                        } else {
                                            let options = '';
                                            if (activeManagers.length>0) {
                                                for (let x of activeManagers) {
                                                    if (inArray(assignedManagers, x._id.toString())) {
                                                        options = options + `<option value="${x._id}" selected>${x.full_name + ' (' + x.email + ')'}</option>`;
                                                    } else {
                                                        options = options + `<option value="${x._id}">${x.full_name + ' (' + x.email + ')'}</option>`;
                                                    }
                                                }
                                            }
                                            let quickbook_options = '';
                                            if (quickbook_customer.length>0) {
                                                for (let x of quickbook_customer) {
                                                    if (workorders.customer_id && x._id.toString()==workorders.customer_id.toString()) {
                                                        quickbook_options = quickbook_options + `<option value="${x._id}" selected>${x.parentCustomerId?' ' + x.fullyQualifiedName + ' <Sub-Customer>':x.fullyQualifiedName + ' <Customer>'}</option>`;
                                                    } else {
                                                        quickbook_options = quickbook_options + `<option value="${x._id}">${x.parentCustomerId?' ' + x.fullyQualifiedName + ' <Sub-Customer>':x.fullyQualifiedName + ' <Customer>'}</option>`;
                                                    }
                                                }
                                            }
                                            // let isComplete = '';
                                            // if (workorders.isCompleted==true) {
                                            //     isComplete = `
                                            //     <option value="false">No</option>
                                            //     <option value="true" selected>Yes</option>
                                            //     `;
                                            // } else {
                                            //     isComplete = `
                                            //     <option value="false" selected>No</option>
                                            //     <option value="true">Yes</option>
                                            //     `;
                                            // }

                                               let noteData=[];
                                             allnote.map(data=>{
                                      
                                        noteData= noteData+`
                                        <div class="col-md-10 col-sm-10 col-lg-10  d-flex mt-1">
                                                    <input type='hidden' name='notes_id[]' value="${data._id}">
                                                    <input type="text" name="notes[]" id="${data._id}" class="form-control mb-2 mr-1" placeholder="Enter Notes" value="${data.note}">
                                                    <button type="button" id="${data._id}"  class="deleteMe btn btn-danger mb-2 pull-right" >Remove</button>
                                           </div>
                                          `});
        
                                            let modal = `<div id="myWorkOrderModal" class="modal fade" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                                                <div class="modal-dialog modal-lg">
                                                    <!-- Modal content-->
                                                    <div class="modal-content">
                                                        <form class="kt-form kt-form--label-right" enctype="multipart/form-data" id="formEditWorkorders" action="${window.location.protocol}//${window.location.host}/workorders/update?viewCal=true" method="POST">
                                                        <div class="modal-header">
                                                            <h4 class="modal-title">Edit Work Order</h4>
                                                            <button type="button" class="close" data-dismiss="modal"></button>
                                                        </div>
                                                        <div class="modal-body">
                                                                <div class="kt-portlet__body">
                                                                    <div class="form-group row">
                                                                        <div class="col-lg-6">
                                                                            <label>Address:</label>
                                                                            <input type="text" name="address" id="address" class="form-control required" required placeholder="Enter Address" value="${workorders.address}">
                                                                        </div>
                                                                        <div class="col-lg-2">
                                                                        </div>
                                                                        <div class="col-lg-4 col-sm-4 col-md-4 col-xs-4 mt-4">
                                                                         <input type="checkbox" name="quickbook_customer" id="quickbook_customer" class="form-control required" ${workorders.quickbook_customer?'checked':''} value="true">
                                                                         <label style="display-inline-block;white-space:nowrap;">Customer from QuickBooks?</label>
                                                                        </div>
                                                                    </div>
                                                                    <div class="form-group row quickBookCustomer">
                                                                        <div class="col-lg-6">
                                                                            <label>Customer:</label>
                                                                            <select name="customer_id" id="customer_id" class="form-control required selectCustomer" data-live-search="true" title="Please Select">
                                                                                <option value="" disabled>Please Select Customer</option>
                                                                                ${quickbook_options}
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    <div class="form-group row manualCustomer">
                                                                        <div class="col-lg-3">
                                                                            <label>Customer Name:</label>
                                                                            <input type="text" name="client_name" id="client_name" class="form-control required" required placeholder="Enter Customer Name" value="${workorders.client_name}">
                                                                        </div>
                                                                        <div class="col-lg-3">
                                                                            <label>Customer Email:</label>
                                                                            <input type="email" name="client_email" id="client_email" class="form-control required" required placeholder="Enter Customer Email" value="${workorders.client_email}">
                                                                        </div>
                                                                        <div class="col-lg-3">
                                                                            <label>Customer Phone:</label>
									                                        <input type="hidden" name="countryShort" id="countryShort" value="US">
                                                                            <input type="text" name="client_phone" id="client_phone" class="form-control" placeholder="Enter Customer Phone" value="${workorders.client_phone}">
                                                                        </div>
                                                                        <div class="col-lg-3">
                                                                            <label>Customer Company:</label>
                                                                            <input type="text" name="client_company" id="client_company" class="form-control required" required placeholder="Enter Customer Company" value="${workorders.client_company}">
                                                                        </div>
                                                                    </div>
                                                                    <div class="form-group row">
                                                                        <div class="col-lg-12">
                                                                            <label>Description:</label>
                                                                            <textarea name="desc" id="descriptions" rows="3" class="form-control ckeditor required" placeholder="Enter Description">${workorders.description}</textarea>
                                                                        </div>
                                                                    </div>
                                                                    <div class="form-group row">
                                                                        <div class="col-lg-3">
                                                                            <label>Start Date:</label>
                                                                            <input type="text" name="start" id="taskStartDate" class="form-control required" autocomplete="off" placeholder="Enter Start Date" value="${workorders.start?moment(workorders.start).tz(currentTimezone).format('dddd, MM/DD/YYYY'):""}">
                                                                        </div>
                                                                        <div class="col-lg-3 timediv">
                                                                            <label>Start Time:</label>
                                                                            <input type="text" name="start_time" id="startTime" class="form-control required" autocomplete="off" placeholder="Enter Start Time" value="${workorders.start?moment(workorders.start).tz(currentTimezone).format('hh:mm A'):""}">
                                                                        </div>
                                                                        <div class="col-lg-3 timediv">
                                                                            <label>End Date:</label>
                                                                            <input type="text" name="end" id="taskEndDate" class="form-control required" autocomplete="off" placeholder="Enter End Date" value="${workorders.end?moment(workorders.end).tz(currentTimezone).format('dddd, MM/DD/YYYY'):""}">
                                                                        </div>
                                                                        <div class="col-lg-3 timediv">
                                                                            <label>End Time:</label>
                                                                            <input type="text" name="end_time" id="endTime" class="form-control required" autocomplete="off" placeholder="Enter End Time" value="${workorders.end?moment(workorders.end).tz(currentTimezone).format('hh:mm A'):""}">
                                                                        </div>
                                                                    </div>
                                                                    <div class="form-group row">
                                                                        <div class="col-lg-12">
                                                                            <label>Manager:</label>
                                                                            <div class="controls">
                                                                                <select class="form-control selectMultipleManager required" name="manager[]" data-live-search="true">
                                                                                    <option value="" disabled>Assign Manager</option>
                                                                                    ${options}
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="form-group row">
                                                                    <div class="col-md-12 col-sm-12 col-lg-12 mb-2" id="testDivs">
                                                                    <span class="label mr-2">Notes:</span>
                                                                       <input id="buttonAdd" type="button" value="Add Notes+" class="btn btn-success btn-shadow-hover"/>  
                                                                    </div>
                                                                 </div>
                                                                    <div class="form-group row" >
							                                      <div id="TextBoxContainer"  class="col-md-10 col-sm-10 col-lg-10">
                                                                   
                                                                  </div>
                                                                          
                                                                    ${noteData} 
                                                                
                                                              
                                                                </div>
                                                                <div class="kt-portlet__foot">
                                                                    <div class="kt-form__actions">
                                                                        <div class="row">
                                                                            <div class="col-lg-6">
                                                                                <input type="hidden" name="id" value="${calEvent.id}">
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                        </div>
                                                        <div class="modal-footer">
                                                            <button type="button" class="btn btn-default" id="closeWorkModalButton" data-dismiss="modal">Close</button>
                                                            <button type="submit" class="btn btn-primary" id="updateWorkModalButton">Update</button>
                                                        </div>
                                                        </form>
                                                    </div>
            
                                                </div>
                                            </div>`;
        
                                            $(modal).modal('show');
                                        }
                                        
    
                                    } else {
                                        alert('Something went wrong!');
                                    }
                                }
                            });
                        // }
                    }
                });
            });

            $('#kt_calendar').fullCalendar({
                isRTL: KTUtil.isRTL(),
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay,listWeek'
                },
                height: 'parent',
                // contentHeight: 'auto',
                editable: false,
                eventLimit: false, // allow "more" link when too many events
                navLinks: true,
                nowIndicator: true,
                weekNumbers: false,
                businessHours: false, // display business hours
                dayPopoverFormat: "dddd, MMMM D",
                // timeZone: 'local',
                timezoneParam: currentTimezone,
                events: `${location.protocol}//${window.location.host}/calendar/getall?viewas=${viewAs}`,
                loading: function( isLoading, view ) {
                    if (isLoading) {
                        $('#calendarLoader').css("display", "block");
                    } else {
                        $('#calendarLoader').css("display", "none");
                    }
                },
                eventRender: function(event, element) {
                    let desc = event.description.replace( /(<([^>]+)>)/ig, '');
                    if (desc.length>200) {
                        desc = desc.substr(0, 200).concat(' . . .');
                    }
                    if (element.hasClass('fc-day-grid-event')) {
                        element.data('content', desc);
                        element.data('placement', 'top');
                        KTApp.initPopover(element);
                    } else if (element.hasClass('fc-time-grid-event')) {
                        element.find('.fc-title').append('<div class="fc-description">' + desc + '</div>'); 
                    } else if (element.find('.fc-list-item-title').length !== 0) {
                        element.find('.fc-list-item-title').append('<div class="fc-description">' + desc + '</div>'); 
                    }
                },
                eventClick: function(calEvent, jsEvent, view) {
                    
                    // if (calEvent.type=='task') {
                    //     $.ajax({
                    //         type: "Get",
                    //         dataType: 'json',
                    //         // data: {phone: hasPhoneNumber, countryShort: countryCode},
                    //         url: `${window.location.protocol}//${window.location.host}/tasks/details-modal/${calEvent.id}`,
                    //         success: function (success) {
                    //             if (success && success.status == 200) {
                    //                 let taskDetails = success.task;
                    //                 let assignedManagers = success.assignedManagers;
                    //                 if (taskDetails.isCompleted) {
                    //                     let options = '';
                    //                     if (assignedManagers.length>0) {
                    //                         for (let x of assignedManagers) {
                    //                             if (x._id.toString()==taskDetails.manager.toString()) {
                    //                                 options = options + `${x.full_name + ' (' + x.email + ')'}`;
                    //                             }
                    //                         }
                    //                     }
    
                    //                     let modal = `<div id="myModal" class="modal fade" role="dialog">
                    //                         <div class="modal-dialog modal-lg">
        
                    //                             <!-- Modal content-->
                    //                             <div class="modal-content">
                    //                                 <form class="kt-form kt-form--label-right" enctype="multipart/form-data" id="formCreateTasks" action="${window.location.protocol}//${window.location.host}/tasks/update?viewCal=true" method="POST">
                    //                                 <div class="modal-header">
                    //                                     <h4 class="modal-title">View Task</h4>
                    //                                     <button type="button" class="close" data-dismiss="modal"></button>
                    //                                 </div>
                    //                                 <div class="modal-body">
                    //                                         <div class="kt-portlet__body">
                    //                                             <div class="form-group row">
                    //                                                 <div class="col-lg-12">
                    //                                                     <label>Title:</label>
                    //                                                     <input type="text" name="title" id="title" class="form-control required" readonly placeholder="Enter Title" value="${taskDetails.title}">
                    //                                                 </div>
                    //                                                 <div class="col-lg-6" style="display:none">
                    //                                                     <label>Manager:</label>
                    //                                                     <div class="controls">
                    //                                                         <input type="text" name="manager" id="manager" class="form-control required" readonly placeholder="Enter Manager" value="${options}">
                    //                                                     </div>
                    //                                                 </div>
                    //                                             </div>
                    //                                             <div class="form-group row">
                    //                                                 <div class="col-lg-12">
                    //                                                     <label>Description:</label>
                    //                                                     <textarea name="description" id="description" rows="3" class="form-control" readonly placeholder="Enter Description">${taskDetails.description}</textarea>
                    //                                                 </div>
                    //                                             </div>
                    //                                             <div class="form-group row">
                    //                                                 <div class="col-lg-3">
                    //                                                     <label>Start Date:</label>
                    //                                                     <input type="text" name="start" class="form-control required" readonly autocomplete="off" placeholder="Enter Start Date" value="${taskDetails.start?moment(taskDetails.start).tz(currentTimezone).format('dddd, MM/DD/YYYY'):""}">
                    //                                                 </div>
                    //                                                 <div class="col-lg-3">
                    //                                                     <label>Start Time:</label>
                    //                                                     <input type="text" name="start_time" class="form-control required" readonly autocomplete="off" placeholder="Enter Start Time" value="${taskDetails.start?moment(taskDetails.start).tz(currentTimezone).format('hh:mm A'):""}">
                    //                                                 </div>
                    //                                                 <div class="col-lg-3">
                    //                                                     <label>End Date:</label>
                    //                                                     <input type="text" name="end" class="form-control required" readonly autocomplete="off" placeholder="Enter End Date" value="${taskDetails.end?moment(taskDetails.end).tz(currentTimezone).format('dddd, MM/DD/YYYY'):""}">
                    //                                                 </div>
                    //                                                 <div class="col-lg-3">
                    //                                                     <label>End Time:</label>
                    //                                                     <input type="text" name="end_time" class="form-control required" readonly autocomplete="off" placeholder="Enter End Time" value="${taskDetails.end?moment(taskDetails.end).tz(currentTimezone).format('hh:mm A'):""}">
                    //                                                 </div>
                    //                                             </div>
                                        
                    //                                         </div>
                    //                                         <div class="kt-portlet__foot">
                    //                                             <div class="kt-form__actions">
                    //                                                 <div class="row">
                    //                                                     <div class="col-lg-6">
                    //                                                         <input type="hidden" name="id" value="${calEvent.id}">
                    //                                                     </div>
                    //                                                 </div>
                    //                                             </div>
                    //                                         </div>
                    //                                 </div>
                    //                                 <div class="modal-footer">
                    //                                     <button type="button" class="btn btn-default" id="closeModalButton" data-dismiss="modal">Close</button>
                    //                                 </div>
                    //                                 </form>
                    //                             </div>
        
                    //                         </div>
                    //                     </div>`;
        
                    //                     $(modal).modal('show');
                    //                 } else {
                    //                     let options = '';
                    //                     if (assignedManagers.length>0) {
                    //                         for (let x of assignedManagers) {
                    //                             if (x._id.toString()==taskDetails.manager.toString()) {
                    //                                 options = options + `<option value="${x._id}" selected>${x.full_name + ' (' + x.email + ')'}</option>`;
                    //                             } else {
                    //                                 options = options + `<option value="${x._id}">${x.full_name + ' (' + x.email + ')'}</option>`;
                    //                             }
                    //                         }
                    //                     }
                    //                     let isComplete = '';
                    //                     if (taskDetails.isCompleted==true) {
                    //                         isComplete = `
                    //                         <option value="false">No</option>
                    //                         <option value="true" selected>Yes</option>
                    //                         `;
                    //                     } else {
                    //                         isComplete = `
                    //                         <option value="false" selected>No</option>
                    //                         <option value="true">Yes</option>
                    //                         `;
                    //                     }
    
                    //                     let modal = `<div id="myModal" class="modal fade" role="dialog">
                    //                         <div class="modal-dialog modal-lg">
        
                    //                             <!-- Modal content-->
                    //                             <div class="modal-content">
                    //                                 <form class="kt-form kt-form--label-right" enctype="multipart/form-data" id="formCreateTasks" action="${window.location.protocol}//${window.location.host}/tasks/update?viewCal=true" method="POST">
                    //                                 <div class="modal-header">
                    //                                     <h4 class="modal-title">Edit Task</h4>
                    //                                     <button type="button" class="close" data-dismiss="modal"></button>
                    //                                 </div>
                    //                                 <div class="modal-body">
                    //                                         <div class="kt-portlet__body">
                    //                                             <div class="form-group row">
                    //                                                 <div class="col-lg-12">
                    //                                                     <label>Title:</label>
                    //                                                     <input type="text" name="title" id="title" class="form-control required" required placeholder="Enter Title" value="${taskDetails.title}">
                    //                                                 </div>
                    //                                                 <div class="col-lg-6" style="display:none">
                    //                                                     <label>Manager:</label>
                    //                                                     <div class="controls">
                    //                                                         <select class="form-control required" id="manager" name="manager" data-live-search="true">
                    //                                                             <option value="" disabled>Select Manager</option>
                    //                                                             ${options}
                    //                                                         </select>
                    //                                                     </div>
                    //                                                 </div>
                    //                                             </div>
                    //                                             <div class="form-group row">
                    //                                                 <div class="col-lg-12">
                    //                                                     <label>Description:</label>
                    //                                                     <textarea name="description" id="description" rows="3" class="form-control" placeholder="Enter Description">${taskDetails.description}</textarea>
                    //                                                 </div>
                    //                                             </div>
                    //                                             <div class="form-group row">
                    //                                                 <div class="col-lg-3">
                    //                                                     <label>Start Date:</label>
                    //                                                     <input type="text" name="start" id="taskStartDate" class="form-control required" autocomplete="off" placeholder="Enter Start Date" value="${taskDetails.start?moment(taskDetails.start).tz(currentTimezone).format('dddd, MM/DD/YYYY'):""}">
                    //                                                 </div>
                    //                                                 <div class="col-lg-3 timediv">
                    //                                                     <label>Start Time:</label>
                    //                                                     <input type="text" name="start_time" id="startTime" class="form-control required" autocomplete="off" placeholder="Enter Start Time" value="${taskDetails.start?moment(taskDetails.start).tz(currentTimezone).format('hh:mm A'):""}">
                    //                                                 </div>
                    //                                                 <div class="col-lg-3 timediv">
                    //                                                     <label>End Date:</label>
                    //                                                     <input type="text" name="end" id="taskEndDate" class="form-control required" autocomplete="off" placeholder="Enter End Date" value="${taskDetails.end?moment(taskDetails.end).tz(currentTimezone).format('dddd, MM/DD/YYYY'):""}">
                    //                                                 </div>
                    //                                                 <div class="col-lg-3 timediv">
                    //                                                     <label>End Time:</label>
                    //                                                     <input type="text" name="end_time" id="endTime" class="form-control required" autocomplete="off" placeholder="Enter End Time" value="${taskDetails.end?moment(taskDetails.end).tz(currentTimezone).format('hh:mm A'):""}">
                    //                                                 </div>
                    //                                             </div>
                    //                                             <div class="form-group row">
                    //                                                 <div class="col-lg-4">
                    //                                                     <label>Completed?</label>
                    //                                                     <div class="controls">
                    //                                                         <select class="form-control" id="isCompleted" name="isCompleted">
                    //                                                             ${isComplete}
                    //                                                         </select>
                    //                                                     </div>
                    //                                                 </div>
                    //                                             </div>
                                        
                    //                                         </div>
                    //                                         <div class="kt-portlet__foot">
                    //                                             <div class="kt-form__actions">
                    //                                                 <div class="row">
                    //                                                     <div class="col-lg-6">
                    //                                                         <input type="hidden" name="id" value="${calEvent.id}">
                    //                                                     </div>
                    //                                                 </div>
                    //                                             </div>
                    //                                         </div>
                    //                                 </div>
                    //                                 <div class="modal-footer">
                    //                                     <button type="button" class="btn btn-default" id="closeModalButton" data-dismiss="modal">Close</button>
                    //                                     <button type="submit" class="btn btn-primary" id="updateModalButton">Update</button>
                    //                                 </div>
                    //                                 </form>
                    //                             </div>
        
                    //                         </div>
                    //                     </div>`;
        
                    //                     $(modal).modal('show');
                    //                 }
                                    
                    //             } else {
                    //                 alert('Something went wrong!');
                    //             }
                    //         }
                    //     });
                    // } else {
                        $.ajax({
                            type: "Get",
                            dataType: 'json',
                            // data: {phone: hasPhoneNumber, countryShort: countryCode},
                            url: `${window.location.protocol}//${window.location.host}/workorders/fetch-details/${calEvent.id}`,
                            success: function (success) {
                                if (success && success.status == 200) {
                                    let allnotes=success.allnotes
                                  
                                    let workorders = success.workorders;
                                    let assignedManagers = success.assignedManagers;
                                    let quickbook_customer = success.allCustomers;
                                    let activeManagers = success.activeManagers;
                                    if (workorders.isCompleted) {
                                        let options = '';
                                        if (activeManagers.length>0) {
                                            for (let x of activeManagers) {
                                                if (inArray(assignedManagers, x._id.toString())) {
                                                    options = (options.length>0?options + '<br>': options) + `${x.full_name + ' (' + x.email + ')'}`;
                                                }
                                            }
                                        }

                                        let quickbook_options = '';
                                        if (quickbook_customer.length>0) {
                                            for (let x of quickbook_customer) {
                                                if (workorders.customer_id && x._id.toString()==workorders.customer_id.toString()) {
                                                    quickbook_options = quickbook_options + `${x.parentCustomerId?x.fullyQualifiedName + ' <Sub-Customer>':x.fullyQualifiedName + ' <Customer>'}`;
                                                }
                                            }
                                        }

                                        let modal = `<div id="myWorkOrderModal" class="modal fade" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                                            <div class="modal-dialog modal-lg">
                                                <!-- Modal content-->
                                                <div class="modal-content">
                                                    <form class="kt-form kt-form--label-right" enctype="multipart/form-data" id="formEditWorkorders" action="${window.location.protocol}//${window.location.host}/workorders/update?viewCal=true" method="POST">
                                                    <div class="modal-header">
                                                        <h4 class="modal-title">View Work Order</h4>
                                                        <button type="button" class="close" data-dismiss="modal"></button>
                                                    </div>
                                                    <div class="modal-body">
                                                            <div class="kt-portlet__body">
                                                                <div class="form-group row">
                                                                    <div class="col-lg-6">
                                                                        <label>Address:</label>
                                                                        <input type="text" name="address" id="address" class="form-control required" readonly placeholder="Enter Address" value="${workorders.address}">
                                                                    </div>
                                                                    <div class="col-lg-2">
                                                                    </div>
                                                                    <div class="col-lg-4 col-sm-4 col-md-4 col-xs-4 mt-4">
                                                                    <input type="checkbox" name="quickbook_customer" onclick="return false;" onkeydown="return false;"  id="quickbook_customer" class="form-control required" ${workorders.quickbook_customer?'checked':''}  value="true" disabled>
                                                                       <label style="display-inline-block;white-space:nowrap;">Customer from QuickBooks?</label>
                                                                  </div>
                                                                </div>
                                                                <div class="form-group row quickBookCustomer">
                                                                    <div class="col-lg-6">
                                                                        <label>Customer:</label>
                                                                        <input [disabled]="isDisabled" type="text" name="customer_id" id="customer_id" class="form-control required" readonly placeholder="Enter Customer" value="${quickbook_options}">
                                                                    </div>
                                                                </div>
                                                                <div class="form-group row manualCustomer">
                                                                    <div class="col-lg-3">
                                                                        <label>Customer Name:</label>
                                                                        <input type="text" name="client_name" id="client_name" class="form-control required" readonly placeholder="Enter Customer Name" value="${workorders.client_name}">
                                                                    </div>
                                                                    <div class="col-lg-3">
                                                                        <label>Customer Email:</label>
                                                                        <input type="email" name="client_email" id="client_email" class="form-control required" readonly placeholder="Enter Customer Email" value="${workorders.client_email}">
                                                                    </div>
                                                                    <div class="col-lg-3">
                                                                        <label>Customer Phone:</label>
									                                    <input type="hidden" name="countryShort" id="countryShort" value="US">
                                                                        <input type="text" name="client_phone" id="client_phone" class="form-control" readonly placeholder="Enter Customer Phone" value="${workorders.client_phone}">
                                                                    </div>
                                                                    <div class="col-lg-3">
                                                                        <label>Customer Company:</label>
                                                                        <input type="text" name="client_company" id="client_company" class="form-control required" readonly placeholder="Enter Customer Company" value="${workorders.client_company}">
                                                                    </div>
                                                                </div>
                                                                <div class="form-group row">
                                                                    <div class="col-lg-12">
                                                                        <label>Description:</label>
                                                                        <textarea name="desc" id="descriptions" rows="3" class="form-control ckeditor required" readonly placeholder="Enter Description">${workorders.description}</textarea>
                                                                    </div>
                                                                </div>
                                                                <div class="form-group row">
                                                                    <div class="col-lg-6">
                                                                        <label>Start Date:</label>
                                                                        <input type="text" name="start" class="form-control required" autocomplete="off" readonly placeholder="Enter Start Date" value="${workorders.start?moment(workorders.start).tz(currentTimezone).format('dddd, MM/DD/YYYY'):""}">
                                                                    </div>
                                                                    <div class="col-lg-6">
                                                                        <label>Start Time:</label>
                                                                        <input type="text" name="start_time" class="form-control required" autocomplete="off" readonly placeholder="Enter Start Time" value="${workorders.start?moment(workorders.start).tz(currentTimezone).format('hh:mm A'):""}">
                                                                    </div>
                                                                </div>
                                                                <div class="form-group row">
                                                                    <div class="col-lg-6">
                                                                        <label>End Date:</label>
                                                                        <input type="text" name="end" class="form-control required" autocomplete="off" readonly placeholder="Enter End Date" value="${workorders.end?moment(workorders.end).tz(currentTimezone).format('dddd, MM/DD/YYYY'):""}">
                                                                    </div>
                                                                    <div class="col-lg-6">
                                                                        <label>End Time:</label>
                                                                        <input type="text" name="end_time" class="form-control required" autocomplete="off" readonly placeholder="Enter End Time" value="${workorders.end?moment(workorders.end).tz(currentTimezone).format('hh:mm A'):""}">
                                                                    </div>
                                                                </div>
                                                                <div class="form-group row">
                                                                    <div class="col-lg-12">
                                                                        <label>Manager:</label>
                                                                        <div class="controls">
                                                                            ${options}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="kt-portlet__foot">
                                                                <div class="kt-form__actions">
                                                                    <div class="row">
                                                                        <div class="col-lg-6">
                                                                            <input type="hidden" name="id" value="${calEvent.id}">
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                    </div>
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn btn-default" id="closeWorkModalButton" data-dismiss="modal">Close</button>
                                                    </div>
                                                    </form>
                                                </div>
        
                                            </div>
                                        </div>`;

                                        $(modal).modal('show');
                                    } else {
                                        let options = '';
                                        if (activeManagers.length>0) {
                                            for (let x of activeManagers) {
                                                if (inArray(assignedManagers, x._id.toString())) {
                                                    options = options + `<option value="${x._id}" selected>${x.full_name + ' (' + x.email + ')'}</option>`;
                                                } else {
                                                    options = options + `<option value="${x._id}">${x.full_name + ' (' + x.email + ')'}</option>`;
                                                }
                                            }
                                        }
                                        let quickbook_options = '';
                                        if (quickbook_customer.length>0) {
                                            for (let x of quickbook_customer) {
                                                if (workorders.customer_id && x._id.toString()==workorders.customer_id.toString()) {
                                                    quickbook_options = quickbook_options + `<option value="${x._id}" selected>${x.parentCustomerId?' ' + x.fullyQualifiedName + ' <Sub-Customer>':x.fullyQualifiedName + ' <Customer>'}</option>`;
                                                } else {
                                                    quickbook_options = quickbook_options + `<option value="${x._id}">${x.parentCustomerId?' ' + x.fullyQualifiedName + ' <Sub-Customer>':x.fullyQualifiedName + ' <Customer>'}</option>`;
                                                }
                                            }
                                        }
                                        // let isComplete = '';
                                        // if (workorders.isCompleted==true) {
                                        //     isComplete = `
                                        //     <option value="false">No</option>
                                        //     <option value="true" selected>Yes</option>
                                        //     `;
                                        // } else {
                                        //     isComplete = `
                                        //     <option value="false" selected>No</option>
                                        //     <option value="true">Yes</option>
                                        //     `;
                                        // }
                                        let notesData=[];
                                        allnotes.map(data=>{
                                      
                                        notesData= notesData+`<div class="col-lg-10 col-sm-10 col-md-10  d-flex">
                                                    <input type='hidden' name='notes_id[]' value="${data._id}">
                                                    <input type="text" name="notes[]" id="${data._id}" class="form-control answer_input_edit mb-2 mr-1" placeholder="Enter Notes" value="${data.note}">
                                                    <button type="button" id="${data._id}"  class="deleteMe btn btn-danger mb-2" >Remove</button>
                                            </div>
                                          `});
                                        
    
                                        let modal = `<div id="myWorkOrderModal" class="modal fade" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                                            <div class="modal-dialog modal-lg">
                                                <!-- Modal content-->
                                                <div class="modal-content">
                                                    <form class="kt-form kt-form--label-right" enctype="multipart/form-data" id="formEditWorkorders" action="${window.location.protocol}//${window.location.host}/workorders/update?viewCal=true" method="POST">
                                                    <div class="modal-header">
                                                        <h4 class="modal-title">Edit Work Order</h4>
                                                        <button type="button" class="close" data-dismiss="modal"></button>
                                                    </div>
                                                    <div class="modal-body">
                                                            <div class="kt-portlet__body">
                                                                <div class="form-group row">
                                                                    <div class="col-lg-6">
                                                                        <label>Address:</label>
                                                                        <input type="text" name="address" id="address" class="form-control required" required placeholder="Enter Address" value="${workorders.address}">
                                                                    </div>
                                                                    <div class="col-lg-2">
                                                                    </div>
                                                                    <div class="col-lg-4 col-sm-4 col-md-4 col-xs-4 mt-4">
                                                                        <input type="checkbox" name="quickbook_customer" id="quickbook_customer" class="form-control required" ${workorders.quickbook_customer?'checked':''} value="true">
                                                                         <label style="display-inline-block;white-space:nowrap;">Customer from QuickBooks?</label>

                                                                        </div>
                                                                </div>
                                                                <div class="form-group row quickBookCustomer">
                                                                    <div class="col-lg-6">
                                                                        <label>Customer:</label>
                                                                        <select name="customer_id" id="customer_id" class="form-control required selectCustomer" data-live-search="true" title="Please Select">
                                                                            <option value="" disabled>Please Select Customer</option>
                                                                            ${quickbook_options}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div class="form-group row manualCustomer">
                                                                    <div class="col-lg-3">
                                                                        <label>Customer Name:</label>
                                                                        <input type="text" name="client_name" id="client_name" class="form-control required" required placeholder="Enter Customer Name" value="${workorders.client_name}">
                                                                    </div>
                                                                    <div class="col-lg-3">
                                                                        <label>Customer Email:</label>
                                                                        <input type="email" name="client_email" id="client_email" class="form-control required" required placeholder="Enter Customer Email" value="${workorders.client_email}">
                                                                    </div>
                                                                    <div class="col-lg-3">
                                                                        <label>Customer Phone:</label>
									                                    <input type="hidden" name="countryShort" id="countryShort" value="US">
                                                                        <input type="text" name="client_phone" id="client_phone" class="form-control" placeholder="Enter Customer Phone" value="${workorders.client_phone}">
                                                                    </div>
                                                                    <div class="col-lg-3">
                                                                        <label>Customer Company:</label>
                                                                        <input type="text" name="client_company" id="client_company" class="form-control required" required placeholder="Enter Customer Company" value="${workorders.client_company}">
                                                                    </div>
                                                                </div>
                                                                <div class="form-group row">
                                                                    <div class="col-lg-12">
                                                                        <label>Description:</label>
                                                                        <textarea name="desc" id="descriptions" rows="3" class="form-control ckeditor required" placeholder="Enter Description">${workorders.description}</textarea>
                                                                    </div>
                                                                </div>
                                                                <div class="form-group row">
                                                                    <div class="col-lg-3">
                                                                        <label>Start Date:</label>
                                                                        <input type="text" name="start" id="taskStartDate" class="form-control required" autocomplete="off" placeholder="Enter Start Date" value="${workorders.start?moment(workorders.start).tz(currentTimezone).format('dddd, MM/DD/YYYY'):""}">
                                                                    </div>
                                                                    <div class="col-lg-3 timediv">
                                                                        <label>Start Time:</label>
                                                                        <input type="text" name="start_time" id="startTime" class="form-control required" autocomplete="off" placeholder="Enter Start Time" value="${workorders.start?moment(workorders.start).tz(currentTimezone).format('hh:mm A'):""}">
                                                                    </div>
                                                                    <div class="col-lg-3 timediv">
                                                                        <label>End Date:</label>
                                                                        <input type="text" name="end" id="taskEndDate" class="form-control required" autocomplete="off" placeholder="Enter End Date" value="${workorders.end?moment(workorders.end).tz(currentTimezone).format('dddd, MM/DD/YYYY'):""}">
                                                                    </div>
                                                                    <div class="col-lg-3 timediv">
                                                                        <label>End Time:</label>
                                                                        <input type="text" name="end_time" id="endTime" class="form-control required" autocomplete="off" placeholder="Enter End Time" value="${workorders.end?moment(workorders.end).tz(currentTimezone).format('hh:mm A'):""}">
                                                                    </div>
                                                                </div>
                                                                <div class="form-group row">
                                                                    <div class="col-lg-12">
                                                                        <label>Manager:</label>
                                                                        <div class="controls">
                                                                            <select class="form-control selectMultipleManager required" name="manager[]" data-live-search="true">
                                                                                <option value="" disabled>Assign Manager</option>
                                                                                ${options}
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                              
                                                                <div class="form-group row">
                                                                <div class="col-md-10 col-sm-10 col-lg-10 mb-2" id="testDivz">
                                                                <span class="label mr-2">Notes:</span>
                                                                   <input id="buttonAdd" type="button" value="Add Notes+" class="btn btn-success btn-shadow-hover"/>  
                                                                </div>
                                                             </div>
                                                                <div class="form-group row" >
                                                              <div id="TextBoxContainer"  class="col-md-10 col-sm-10 col-lg-10">
                                                               
                                                              </div>
                                                            
                                                           
                                                                ${notesData} 
                                                            
                                                            </div>
                                                            <div class="kt-portlet__foot">
                                                                <div class="kt-form__actions">
                                                                    <div class="row">
                                                                        <div class="col-lg-6">
                                                                            <input type="hidden" name="id" value="${calEvent.id}">
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                    </div>
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn btn-default" id="closeWorkModalButton" data-dismiss="modal">Close</button>
                                                        <button type="submit" class="btn btn-primary" id="updateWorkModalButton">Update</button>
                                                    </div>
                                                    </form>
                                                </div>
        
                                            </div>
                                        </div>`;
    
                                        $(modal).modal('show');
                                    }
                                    

                                } else {
                                    alert('Something went wrong!');
                                }
                            }
                        });
                    // }
                }
            });

        }
    };
}();

jQuery(document).ready(function() {
    KTCalendarBackgroundEvents.init();
});

$('#updateWorkModalButton').on('click', ()=>{
    // $('.modal').modal('hide');
    $("#myWorkOrderModal").remove();
});

$('#updateModalButton').on('click', ()=>{
    // $('.modal').modal('hide');
    $("#myModal").remove();
});

function inArray (array, ch) {
    let obj = _.find(array, (obj) => (obj == ch.toString()))
    if (obj != undefined) {
        return true;
    } else {
        return false;
    }
}

function numFormatter (num) {
    if(num > 999 && num < 1000000){
        return (num/1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million 
    }else if(num > 1000000){
        return (num/1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
    }else if(num < 900){
        return num; // if value < 1000, nothing to do
    }
}

$(window).on('hidden.bs.modal', function() { 
    $("#myWorkOrderModal").remove();
    $("#myModal").remove();
    $('.datetimepicker').remove();
    $('.datepicker').remove();
    //  location.reload();
});
$(window).on('shown.bs.modal', function() { 
    $('.selectMultipleManager').select2();
    $('.selectCustomer').select2();

    $(document).on('keyup', '#client_phone',()=>{
        let countryCode = $('#countryCode').find(':selected').attr('data-code');
        if (!countryCode) {
            countryCode = 'US';
        }
        if (countryCode) {
            let phoneNumber = new libphonenumber.AsYouType(countryCode).input($('#client_phone').val());
            if (phoneNumber) {
                $('#client_phone').val(phoneNumber);
                $.ajax({
                    type: "POST",
                    dataType: 'json',
                    data: {phone: phoneNumber, countryShort: countryCode},
                    url: `${window.location.protocol}//${window.location.host}/validate/phone`,
                    success: function (success) {
                        if (success == true) {
                            $('#phoneValid').show();
                            $('#phoneValid').text('✔');
                        } else {
                            $('#phoneValid').show();
                            $('#phoneValid').text('❌');
                        }
                    }
                });
            } else {
                $('#phoneValid').hide();
            }
        }
    });

    if ($('#quickbook_customer').is(':checked')) {
        $('#quickBookCustomer').show();
        $('#manualCustomer').hide();
        $('#client_company').prop('required',false);
        $('#client_name').prop('required',false);
        $('#client_email').prop('required',false);
        $('#client_phone').prop('required',false);
        $('.quickBookCustomer').show();
        $('.manualCustomer').hide();
        
    } else {
        $('#quickBookCustomer').hide();
        $('#manualCustomer').show();
        $('.quickBookCustomer').hide();
        $('.manualCustomer').show();
    }

    $('#quickbook_customer').on('click', ()=>{
        if ($('#quickbook_customer').is(':checked')) {
            $('#quickBookCustomer').show();
            $('#manualCustomer').hide();
            $('.quickBookCustomer').show();
            $('.manualCustomer').hide();
        } else {
            $('#quickBookCustomer').hide();
            $('#manualCustomer').show();
            $('.quickBookCustomer').hide();
            $('.manualCustomer').show();
        }
    });

    // $(function () {

        $("#taskStartDate").datetimepicker({
            format: 'DD, mm/dd/yyyy',
            autoclose: true,
            startDate: '-0d',
            todayBtn: true,
            zIndexOffset: 100,
            todayHighlight: true,
            startView: 2,
            maxView: 2,
            minView: 2
        });

        $('#taskStart').datetimepicker({
            format: 'yyyy-mm-dd HH:ii P',
            showMeridian: true,
            todayBtn: true,
            autoclose: true,
            startDate: '-0d',
        });

        $('#taskStart2').datetimepicker({
            format: 'yyyy-mm-dd HH:ii P',
            showMeridian: true,
            todayBtn: true,
            autoclose: true,
            startDate: '-0d',
        });

        let startDateTime = $("#taskStart").val();
        if (startDateTime) {
            $('#taskEnd').datetimepicker('remove');
            $('#taskEndDiv').show();
            $('#taskEnd').datetimepicker({
                format: 'yyyy-mm-dd HH:ii P',
                showMeridian: true,
                autoclose: true,
                startDate: new Date(moment(startDateTime, 'YYYY-MM-DD hh:mm A').format()),
            });
        } else {
            $('#taskEndDiv').hide();
        }

        let startDateTime2 = $("#taskStart2").val();
        if (startDateTime2) {
            $('#taskEnd2').datetimepicker('remove');
            $('#taskEndDiv2').show();
            $('#taskEnd2').datetimepicker({
                format: 'yyyy-mm-dd HH:ii P',
                showMeridian: true,
                autoclose: true,
                startDate: new Date(moment(startDateTime2, 'YYYY-MM-DD hh:mm A').format()),
            });
        } else {
            $('#taskEndDiv2').hide();
        }

        $('#taskStart').on('change', ()=>{
            let strtDateTime = $("#taskStart").val();
            if (strtDateTime) {
                $('#taskEnd').datetimepicker('remove');
                $('#taskEndDiv').show();
                $('#taskEnd').datetimepicker({
                    format: 'yyyy-mm-dd HH:ii P',
                    showMeridian: true,
                    autoclose: true,
                    startDate: new Date(moment(strtDateTime, 'YYYY-MM-DD hh:mm A').format()),
                });
            } else {
                $('#taskEndDiv').hide();
            }
        });

        $('#taskStart2').on('change', ()=>{
            let strtDateTime2 = $("#taskStart2").val();
            if (strtDateTime2) {
                $('#taskEnd2').datetimepicker('remove');
                $('#taskEndDiv2').show();
                $('#taskEnd2').datetimepicker({
                    format: 'yyyy-mm-dd HH:ii P',
                    showMeridian: true,
                    autoclose: true,
                    startDate: new Date(moment(strtDateTime2, 'YYYY-MM-DD hh:mm A').format()),
                });
            } else {
                $('#taskEndDiv2').hide();
            }
        });

        $(document).ready(()=>{
            let startTime2 = $('#startTime').val();
            let taskEndDate2 = $('#taskEndDate').val();
            let strtDate = $("#taskStartDate").val();
            if (strtDate) {
                let taskStartTime = $('#techieStartTime').val();
                let techieEndTime = $('#techieEndTime').val();
                $('#startTimeDiv').show();
                $('.timediv').show();
                if (taskStartTime) {
                    $('#techieStartTime').datetimepicker('remove');
                    $('#techieStartTime').datetimepicker({
                        format: 'HH:ii P',
                        showMeridian: true,
                        autoclose: true,
                        forceParse: true,
                        startDate: new Date(moment(strtDate, 'MM/DD/YYYY').format()),
                        endDate: new Date(moment(strtDate + ' 11:59 PM', 'MM/DD/YYYY hh:mm A').format()),
                        // initialDate: new Date(moment(strtDate + ' ' + taskStartTime, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DD hh:mm A')),
                        startView: 1,
                        maxView: 0,
                        minView: 0
                    });
                    $('#techieEndTime').datetimepicker('remove');
                    $('#techieEndTime').datetimepicker({
                        format: 'HH:ii P',
                        showMeridian: true,
                        autoclose: true,
                        forceParse: true,
                        startDate: new Date(moment(strtDate + ' ' + taskStartTime, 'MM/DD/YYYY hh:mm A').format()),
                        endDate: new Date(moment(strtDate + ' 11:59 PM', 'MM/DD/YYYY hh:mm A').format()),
                        // initialDate: new Date(moment(strtDate + ' ' + techieEndTime, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DD hh:mm A')),
                        startView: 1,
                        maxView: 0,
                        minView: 0
                    });
                }

                $('#startTime').datetimepicker('remove');
                $('#startTime').datetimepicker({
                    format: 'HH:ii P',
                    showMeridian: true,
                    autoclose: true,
                    minuteStep: 30,
                    // initialDate: new Date(strtDate),
                    startDate: new Date(strtDate),
                    endDate: new Date(moment(strtDate + ' 11:59 PM', 'MM/DD/YYYY hh:mm A').format()),
                    startView: 1,
                    maxView: 1,
                    minView: 1
                });
                $("#taskEndDate").datetimepicker('remove');
                $("#taskEndDate").datetimepicker({
                    format: 'DD, mm/dd/yyyy',
                    autoclose: true,
                    startDate: new Date(strtDate),
                    todayBtn: true,
                    zIndexOffset: 100,
                    todayHighlight: true,
                    startView: 2,
                    maxView: 2,
                    minView: 2
                });
                if (taskEndDate2) {
                    if (moment(strtDate, 'dddd, MM/DD/YYYY').isBefore(moment(taskEndDate2, 'dddd, MM/DD/YYYY').format())) {
                        $('#endTime').datetimepicker('remove');
                        $('#endTime').datetimepicker({
                            format: 'HH:ii P',
                            showMeridian: true,
                            autoclose: true,
                            // initialDate: new Date(taskStartDate),
                            minuteStep: 30,
                            // initialDate: new Date(strtDate),
                            startDate: new Date(moment(taskEndDate2, 'dddd, MM/DD/YYYY').format()),
                            endDate: new Date(moment(taskEndDate2 + ' 11:59 PM', 'dddd, MM/DD/YYYY hh:mm A').format()),
                            startView: 1,
                            maxView: 0,
                            minView: 0
                        });
                    } else {
                        $('#endTime').datetimepicker('remove');
                        $('#endTime').datetimepicker({
                            format: 'HH:ii P',
                            showMeridian: true,
                            autoclose: true,
                            // initialDate: new Date(taskStartDate),
                            minuteStep: 30,
                            // initialDate: new Date(strtDate),
                            startDate: new Date(moment(taskEndDate2 + ' ' + startTime2, 'dddd, MM/DD/YYYY hh:mm A').format()),
                            endDate: new Date(moment(taskEndDate2 + ' 11:59 PM', 'dddd, MM/DD/YYYY hh:mm A').format()),
                            startView: 1,
                            maxView: 0,
                            minView: 0
                        });
                    }
                }
            } else {
                $('#startTimeDiv').hide();
                $('.timediv').hide();
            }
        });
        

        $('#taskStartDate').on('change', ()=>{
            let taskStartDate = $('#taskStartDate').val();
            if (taskStartDate) {
                let currenttime = moment().format();
                let timeCalc = moment(taskStartDate).format();
                if (moment(taskStartDate).isSame(moment().format("YYYY-MM-DD"))) {
                    timeCalc = moment(timeCalc).add(parseInt(moment(currenttime).format('HH')), 'hours').add(parseInt(moment(currenttime).format('mm')), 'minutes').format();
                }
                $('#startTimeDiv').show();
                $('.timediv').show();
                $('#techieStartTime').datetimepicker('remove');
                $('#techieStartTime').datetimepicker({
                    format: 'HH:ii P',
                    showMeridian: true,
                    autoclose: true,
                    forceParse: true,
                    // initialDate: new Date(taskStartDate),
                    startDate: new Date(timeCalc),
                    endDate: new Date(moment(taskStartDate + ' 11:59 PM', 'dddd, MM/DD/YYYY hh:mm A').format()),
                    startView: 1,
                    maxView: 0,
                    minView: 0,
                });
                // $('#techieEndTime').datetimepicker('remove');
                // $('#techieEndTime').datetimepicker({
                // 	format: 'HH P',
                // 	showMeridian: true,
                // 	autoclose: true,
                // 	initialDate: new Date(taskStartDate),
                // 	startView: 1,
                // 	maxView: 0,
                // 	minView: 0
                // });
                $('#startTime').datetimepicker('remove');
                $('#startTime').datetimepicker({
                    format: 'HH:ii P',
                    showMeridian: true,
                    autoclose: true,
                    // initialDate: new Date(taskStartDate),
                    minuteStep: 30,
                    // initialDate: new Date(strtDate),
                    startDate: new Date(timeCalc),
                    endDate: new Date(moment(taskStartDate + ' 11:59 PM', 'dddd, MM/DD/YYYY hh:mm A').format()),
                    startView: 1,
                    maxView: 0,
                    minView: 0
                });
                $("#taskEndDate").datetimepicker('remove');
                $("#taskEndDate").datetimepicker({
                    format: 'DD, mm/dd/yyyy',
                    autoclose: true,
                    startDate: new Date(timeCalc),
                    todayBtn: true,
                    zIndexOffset: 100,
                    todayHighlight: true,
                    startView: 2,
                    maxView: 2,
                    minView: 2
                });
            } else {
                $('#startTimeDiv').hide();
                $('.timediv').hide();
            }
        });

        $('#taskEndDate').on('change', ()=>{
            let taskStartDate = $('#taskStartDate').val();
            let startTime = $('#startTime').val();
            let taskEndDate = $('#taskEndDate').val();
            if (taskEndDate) {
                if (moment(taskStartDate, 'dddd, MM/DD/YYYY').isBefore(moment(taskEndDate, 'dddd, MM/DD/YYYY').format())) {
                    $('#endTime').datetimepicker('remove');
                    $('#endTime').datetimepicker({
                        format: 'HH:ii P',
                        showMeridian: true,
                        autoclose: true,
                        // initialDate: new Date(taskStartDate),
                        minuteStep: 30,
                        // initialDate: new Date(strtDate),
                        startDate: new Date(moment(taskEndDate, 'dddd, MM/DD/YYYY').add(30, 'minutes').format()),
                        endDate: new Date(moment(taskEndDate + ' 11:59 PM', 'dddd, MM/DD/YYYY hh:mm A').format()),
                        startView: 1,
                        maxView: 0,
                        minView: 0
                    });
                } else {
                    $('#endTime').datetimepicker('remove');
                    $('#endTime').datetimepicker({
                        format: 'HH:ii P',
                        showMeridian: true,
                        autoclose: true,
                        // initialDate: new Date(taskStartDate),
                        minuteStep: 30,
                        // initialDate: new Date(strtDate),
                        startDate: new Date(moment(taskEndDate + ' ' + startTime, 'dddd, MM/DD/YYYY hh:mm A').add(30, 'minutes').format()),
                        endDate: new Date(moment(taskEndDate + ' 11:59 PM', 'dddd, MM/DD/YYYY hh:mm A').format()),
                        startView: 1,
                        maxView: 0,
                        minView: 0
                    });
                }
            }
        });

        $('#techieStartTime').on('change', ()=>{
            $('#techieEndTime').val('');
            let taskStartDate = $('#taskStartDate').val();
            let taskStartTime = $('#techieStartTime').val();
            $('#techieEndTime').datetimepicker('remove');
            $('#techieEndTime').datetimepicker({
                format: 'HH:ii P',
                showMeridian: true,
                autoclose: true,
                forceParse: true,
                // initialDate: new Date(taskStartDate + ' ' + taskStartTime),
                startDate: new Date(moment(taskStartDate + ' ' + taskStartTime, 'MM/DD/YYYY hh:mm A').format()),
                endDate: new Date(moment(taskStartDate + ' 11:59 PM', 'MM/DD/YYYY hh:mm A').format()),
                startView: 1,
                maxView: 0,
                minView: 0,
            });
        });


        // $(document).on('click', '.deleteMe', function () {
        //     var elemID = $(this).attr('id');
        //     swal.fire({
        //         title: 'Are you sure?',
        //         text: "You won't be able to revert this!",
        //         type: 'warning',
        //         showCancelButton: true,
        //         confirmButtonText: 'Yes, delete it!',
        //         cancelButtonText: 'No, cancel!',
        //         reverseButtons: true
        //     }).then(function (result) {
        //         if (result.value) {
        //             window.location.href = `${window.location.protocol}//${window.location.host}/workorders/notes-delete/${elemID}`;
        //         }
        //     });
        // });
        $(document).on('click', '.deleteMe', function () {
            var elemID = $(this).attr('id');
            var remove =$(this).closest("div");
        $.ajax({
            type: "POST",
            dataType: 'json',
            data:{notesid:elemID},
            url: `${window.location.protocol}//${window.location.host}/workorders/notes-delete`,
            success: function (success) {
                if (success) {
                     remove.remove();
                }
                else{
                    alert("something went wrong!")
                }
            }
        });
    });
        CKEDITOR.replace( 'desc');

});