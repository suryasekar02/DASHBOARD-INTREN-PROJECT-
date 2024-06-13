
function loadTable(url, tbodyId, dataTable) {
  $.getJSON(url,
    function (data) {
      $(dataTable).DataTable().destroy();
      $('#' + tbodyId).html(data.trs);
      initDataTable(dataTable);
    }
  );

}

function loadTableWithFilter(url, tbodyId, tfootId, dataTable, filterData) {
  $.getJSON(url, filterData,
    function (data) {
      $(dataTable).DataTable().destroy();
      $('#' + tbodyId).html(data.trs);
      $('#' + tfootId).html(data.tfoot);
      initDataTable(dataTable);
    }
  );

}


function addOneRecord(url, formId) {
  var form = document.getElementById(formId);
  var formData = new FormData(form);
  $.ajax({
    type: 'POST',
    url: url,
    data: formData,
    cache: false,
    contentType: false,
    processData: false,
    dataType: 'json',
    success: function (result) {
      if (result.status) {
        toastr.success(result.msg + ' successfully!', 'Success');
        $('#au_modal').modal('hide');
        refreshTable();
      } else {
        toastr.error('Something went wrong!', 'Error');
      }
    }
  });
}



function initDataTable(dataTable) {
  var table = $(dataTable).DataTable({
    language: {
      lengthMenu: '_MENU_'
    },
    rowReorder: {
      selector: 'td:nth-child(2)'
    },
    responsive: true,
    dom: 'Blfrtip',
    buttons: [{
      text: 'EXPORT',
      extend: 'collection',
      buttons: ['excel', 'csv', 'pdf', 'print'],
      className: 'px-3'
    },
    {
      text: '<i class="bi bi-arrow-repeat p-1" onclick="refreshTable()" style="font-size:12px"></i>'
    }
    ]
  });
}

function deleteIt(url) {
  $.ajax({
    type: "DELETE",
    url: url,
    dataType: "json",
    success: function (response) {
      if (response.isDeleted) {
        toastr.success('Deleted successfully!', 'Success');
        refreshTable();
      } else {
        toastr.error('Something went wrong!', 'Error');
      }
    }
  });
}