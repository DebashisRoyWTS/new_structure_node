$(function () {
  "use strict";
  var dtUserTable = $("#dataTable");
  // Users List datatable
  if (dtUserTable.length) {
    dtUserTable.DataTable({
      paging: true,
      sorting: true,
      serverSide: true,
      ajax: {
        url: `${window.location.protocol}//${window.location.host}/blog/getall`,
        method: "post",
      },
      columns: [
        { data: "title" },
        { data: "date" },
        { data: "writer" },
        { data: "image" },
        { data: "content" },
        {
          data: null,
          render: function (data, type, row, meta) {
            return `<button class="btn btn-primary edit-btn" data-id="${row._id}">Edit</button>`;
          },
        },
        {
          data: null,
          render: function (data, type, row, meta) {
            return `<button class="btn btn-danger delete-btn" data-id="${row._id}">Delete</button>`;
          },
        },
      ],
    });
  }

  $(document).on("click", ".add-new", function () {
    window.location.href = `${window.location.protocol}//${window.location.host}/blog/create`;
  });

  $(document).on("click", ".edit-btn", function () {
    var blogId = $(this).data("id");
    window.location.href = `${window.location.protocol}//${window.location.host}/blog/edit/${blogId}`;
  });

  $(document).on("click", ".delete-btn", function () {
    var elemID = $(this).data("id");
    if (confirm("Are you sure you want to delete this item?")) {
      window.location.href = `${location.protocol}//${window.location.host}/blog/delete/${elemID}`;
    }
  });
});
