
$('#add_item_form').formValidation({
  framework: 'bootstrap',
  fields: {
    description: {
      validators: {
        notEmpty: {
          message: 'This field is required'
        }
      }
    },
    price: {
      validators: {
        notEmpty: {
          message: 'This field is required'
        }
      }
    }
  }
}).on('success.form.fv', function (e) {
  e.preventDefault();
  var form = document.querySelector('#add_item_form');
  var formData = new FormData(form);
  $.ajax({
    type: 'POST',
    url: form.action,
    data: formData,
    cache: false,
    contentType: false,
    processData: false,
    dataType: 'json',
    success: function (result) {
      if (result.sts) {
        toastr.success('Item Added successfully!', 'Success');
        $('#add-new-item').load(result.url, function () {
          $('select#add-new-item').selectpicker('refresh');
        });
      } else {
        toastr.error('Oops! something went wrong', 'Error');
      }
      $('#add-new-item-modal').modal('hide');
    }
  });

});

$('#newCustomer').formValidation({
  framework: 'bootstrap',
  fields: {
    company: {
      validators: {
        notEmpty: {
          message: 'This field is required'
        }
      }
    },
    email: {
      validators: {
        notEmpty: {
          message: 'This field is required'
        }
      }
    },
    mobile_number: {
      validators: {
        notEmpty: {
          message: 'This field is required'
        }
      }
    }
  }
}).on('success.form.fv', function (e) {
  e.preventDefault();
  var form = this;
  var formData = new FormData(form);
  $.ajax({
    type: 'POST',
    url: form.action,
    data: formData,
    cache: false,
    contentType: false,
    processData: false,
    dataType: 'json',
    success: function (result) {
      if (result.sts) {
        toastr.success('Customer successfully!', 'Success');
        $('select[name="customer_id"]').load(result.url, function () {
          $('select[name="customer_id"]').selectpicker('refresh');
        });
        form.reset();
      } else {
        toastr.error('Oops! something went wrong', 'Error');
      }
      $('#addCustomer').modal('hide');
    }
  });
});

//--------------------
$('#user-icon').click(function () {
  $(".accordion-content").show();
});

$('#shipAddress').change(function () {
  if (this.checked) {
    $(".accordion-content").show();
  } else {
    $(".accordion-content").hide();
  }
});

// to set today date in input type="date"
$(function () {
  $('[name="quantity_unit"]').change(function () {
    $('#changeQty').text(this.value);
  });

});

// Initialize Sortable for the table body
const tbody = document.querySelector("#items-table tbody");
const sortable = new Sortable(tbody, {
  animation: 150,
  ghostClass: "sortable-ghost",
  handle: ".handle-icon",
});
//---------------------


// modal script for bill and items

function showBillModal() {
  $('#billEditModal').modal('show', {
    backdrop: 'true'
  });
}

function showItemModal() {
  $('#add-new-item-modal').find('#add_item_form').trigger('reset');
  $('select.selectpicker').selectpicker('refresh');
  $('#add-new-item-modal').modal('show', {
    backdrop: 'true'
  });
}

function ApplyAddress() {
  const bill = {
    street: $('#bill_street').val(),
    city: $('#bill_city').val(),
    state: $('#bill_state').val(),
    country: $('#bill_country').val(),
    zipcode: $('#bill_zipcode').val()
  };

  const ship = {
    street: $('#ship_street').val(),
    city: $('#ship_city').val(),
    state: $('#ship_state').val(),
    country: $('#ship_country').val(),
    zipcode: $('#ship_zipcode').val()
  };

  $('#bStreet').text(`${bill.street || '--'}`);
  $('#bCityState').text(`${bill.city || '--'}, ${bill.state || '--'}`);
  $('#bzipcode').text(`${bill.country || '--'}, ${bill.zipcode || '--'}`);

  $('#sStreet').text(`${ship.street || '--'}`);
  $('#sCityState').text(`${ship.city || '--'}, ${ship.state || '--'}`);
  $('#szipcode').text(`${ship.country || '--'}, ${ship.zipcode || '--'}`);

  $('#billEditModal').modal('hide');

  // Store address in hidden input fields
  $('input[name="bill_address"]').val(`${bill.street},${bill.city},${bill.state},${bill.country},${bill.zipcode}`);
  $('input[name="ship_address"]').val(`${ship.street},${ship.city},${ship.state},${ship.country},${ship.zipcode}`);
}

//  script to get billing and shipping address from server -  written by DJ
function getBillAndShipAddress(url, customerId) {
  if (customerId != '' && customerId != 'add_new_customer') {
    $.ajax({
      url: url + '/' + customerId,
      type: 'POST',
      dataType: 'json',
      processData: false,
      contentType: false,
      success: function (result) {
        const billing = result['billing'];
        const shipping = result['shipping'];

        if (billing) {
          //to set billing and shipping value of customer to span elemnt
          $('#bStreet').text(`${billing['street'] || '--'}`);
          $('#bCityState').text(`${billing['city'] || '--'}, ${billing['state'] || '--'}`);
          $('#bzipcode').text(`${billing['country'] || '--'}, ${billing['zipcode'] || '--'}`);
          $('#sStreet').text(`${shipping['street'] || '--'}`);
          $('#sCityState').text(`${shipping['city'] || '--'}, ${shipping['state'] || '--'}`);
          $('#szipcode').text(`${shipping['country'] || '--'}, ${shipping['zipcode'] || '--'}`);

          //to set billing and shipping value of customer to edit modal
          $('#bill_street').val(`${billing['street']}`);
          $('#bill_city').val(`${billing['city']}`);
          $('#bill_state').val(`${billing['state']}`);
          $('#bill_zipcode').val(`${billing['zipcode']}`);
          $('select#bill_country').selectpicker('val', `${billing['country']}`);
          $('#ship_street').val(`${shipping['street']}`);
          $('#ship_city').val(`${shipping['city']}`);
          $('#ship_state').val(`${shipping['state']}`);
          $('#ship_zipcode').val(`${shipping['zipcode']}`);
          $('select#ship_country').selectpicker('val', `${shipping['country']}`);

          //to send address to server stored in hidden input
          $('input[name="bill_address"]').val(`${billing['street']},${billing['city']},${billing['state']},${billing['country']},${billing['zipcode']}`);
          $('input[name="ship_address"]').val(`${shipping['street']},${shipping['city']},${shipping['state']},${shipping['country']},${shipping['zipcode']}`);
        } else {
          emptyAddressField();
        }
      }
    });
  } else if (customerId == '') {
    emptyAddressField();
  } else if (customerId == 'add_new_customer') {
    $('#addCustomer').modal('show', {
      backdrop: 'true'
    });
    emptyAddressField();
  } else {
    console.log(`${customerId} is Wrong option value`);
  }
}
// to empty all address filelds
function emptyAddressField() {
  const fields = ['#bStreet', '#bCityState', '#bzipcode', '#sStreet', '#sCityState', '#szipcode'];
  fields.forEach(field => $(field).text('--'));
  $('#bill_street, #bill_city, #bill_state, #bill_zipcode, #ship_street, #ship_city, #ship_state, #ship_zipcode').val('');
  $('select#bill_country, select#ship_country').selectpicker('val', '');
  $('input[name="billing_address"],input[name="shipping_address"]').val('');
}

// function to get item info from server 
function fetchItem(url, itemId) {
  if (itemId) {
    $.ajax({
      type: "GET",
      url: url + '/' + itemId,
      dataType: "json",
      success: function (response) {
        fillItemInfo(response);
      }
    });
  }
}

function fillItemInfo(item) {
  const mainRow = $('#items-table > #items_body > #main_row');
  const itemDesc = mainRow.find('#item_description');
  const itemLongDesc = mainRow.find('#item_long_description');
  const itemUnit = mainRow.find('#item_unit');
  const itemRate = mainRow.find('#item_rate');

  itemDesc.val(item.description);
  itemLongDesc.val(item.long_description);
  itemUnit.val(item.unit);
  itemRate.val(item.price);

  $('select#item_no_tax').selectpicker('val', item.tax.split(','));
}

function pushItem() {
  const mainRow = $('#items-table > #items_body > #main_row');
  const itemDesc = mainRow.find('#item_description').val();
  const itemLongDesc = mainRow.find('#item_long_description').val();
  const itemQt = mainRow.find('#item_quantity').val();
  const itemUnit = mainRow.find('#item_unit').val();
  const itemRate = mainRow.find('#item_rate').val();
  const itemTax = mainRow.find('#item_no_tax').val();

  if (itemDesc || itemLongDesc) {
    let item = {
      description: itemDesc,
      long_description: itemLongDesc,
      quantity: itemQt,
      unit: itemUnit,
      rate: itemRate,
      tax: itemTax
    }
    appendItem(item);
    $('#item_description,#item_long_description,#item_unit,#item_rate').val('');
    $('#item_quantity').val(1);
    $('#add-new-item,#item_no_tax').selectpicker('val', '');
    $('#no-item-alert').addClass('hide');
  }
}

function appendItem(item) {
  const tr = `<tr class="childRow">
              <td class="handle-icon ">
                <i class="bi bi-grip-vertical"></i>
              </td>
              <td><textarea name="description[]" class="form-control txtarea" rows="4" placeholder="Description">${item.description}</textarea></td>
              <td><textarea name="long_description[]" rows="4" placeholder="Long Description" class="form-control txtarea">${item.long_description}</textarea></td>
              <td> 
                <input type="number" oninput="setAmount(event)" name="quantity[]" value="${item.quantity}" min="1" class="blacktdinp form-control">
                <input type="text" name="unit[]" value="${item.unit}" class="blacktdinp form-control " style="border:none!important;text-align: right;" placeholder="Unit">
              </td>
              <td> <input type="number" oninput="setAmount(event)" name="rate[]" value="${item.rate}" min="0" placeholder="Rate" class="blacktdinp form-control blkselectheight"></td>
              <td> ${getSelectElement(item.tax)}</td>
              <td class="amounttdalign">
                <input type="hidden" name="amount[]" value="" ><span class="amtext"></span>
                <input type="hidden" name="tax_amount[]" value="0.00" >
              </td>
              <td class="check-mark"><button class="btn btn-danger pull-left  table-button removeTR"><i class="fa fa-trash"></i></button></td>
            </tr>`;
  $('#items-table > #items_body').append(tr);
  $('.selectpicker').selectpicker('refresh');
  $('input[name="quantity[]"]').trigger('input');
}
// remove tr from item table
$(document).on('click', '.removeTR', function () {
  $(this).closest('.childRow').remove();
  setSubTotal();
});

function setAmount(e) {
  const row = e.target.closest('.childRow');
  const quantityInput = row.querySelector('[name="quantity[]"]');
  const rateInput = row.querySelector('[name="rate[]"]');

  const quantity = parseFloat(quantityInput.value);
  const rate = parseFloat(rateInput.value);
  const amount = (quantity * rate).toFixed(2);

  row.querySelector('[name="amount[]"]').value = amount;
  row.querySelector('.amtext').innerText = amount;
  $(row.querySelector('select[id="taxes"]')).change();
}

function setTax(e) {
  const selectInput = e.currentTarget;
  const tableRow = selectInput.closest('.childRow');
  const itemAmount = parseFloat(tableRow.querySelector('[name="amount[]"]').value);
  const taxIds = Array.from(selectInput.selectedOptions, option => option.value);

  let taxAmount = 0;
  for (const tax of tax_array) {
    if (taxIds.includes(tax.id)) {
      taxAmount += itemAmount * (Number(tax.percentage) / 100);
    }
  }

  tableRow.querySelector('[name="tax_amount[]"]').value = taxAmount.toFixed(2);
  setSubTotal();
  $(selectInput).closest('td').find('input[name="tax[]"]').val($(selectInput).val());
}

function setSubTotal() {
  const allAmountInput = document.querySelectorAll('[name="amount[]"]');
  let subTotal = 0;
  for (const amountInput of allAmountInput) {
    subTotal += parseFloat(amountInput.value);
  }
  document.querySelector('[name="subTotal"]').value = subTotal.toFixed(2);
  document.querySelector('#show_subtotal').innerHTML = subTotal.toFixed(2);
  setTaxTotal();
  setDiscount();
  setTotal();
}

function setTaxTotal() {
  const allAmountInput = document.querySelectorAll('[name="tax_amount[]"]');
  let taxTotal = 0;
  for (const amountInput of allAmountInput) {
    taxTotal += parseFloat(amountInput.value);
  }
  document.querySelector('[name="taxTotal"]').value = taxTotal.toFixed(2);
  document.querySelector('#show_taxtotal').innerHTML = taxTotal.toFixed(2);
  setTotal();
}

function setDiscount(e) {
  const inputValue = parseFloat(document.querySelector('#discount-input').value);
  const selectValue = document.querySelector('#discount-select').value;
  const subTotal = parseFloat(document.querySelector('[name="subTotal"]').value);
  const taxTotal = parseFloat(document.querySelector('[name="taxTotal"]').value);
  const discountType = document.querySelector('[name="discount_type"]').value;

  const setDiscountTotal = (selectValue, inputValue, subTotal, taxTotal) => {
    let discountTotal = (selectValue == 'pc') ? ((subTotal + taxTotal) * (inputValue / 100)) : inputValue;
    document.querySelector('[name="discountTotal"]').value = discountTotal.toFixed(2);
    document.querySelector('#show_discount').innerHTML = discountTotal.toFixed(2);
    setTotal();
  }

  if (discountType == 'No Discount') {
    document.querySelector('#discount-input').value = 0;
    setDiscountTotal(selectValue, 0, subTotal, 0);
    (e.target == document.querySelector('#discount-input')) ? alert('please select discount type in advanced option') : false;
  } else if (discountType == 'After Tax') {
    setDiscountTotal(selectValue, inputValue, subTotal, taxTotal);
  } else if (discountType == 'Before Tax') {
    setDiscountTotal(selectValue, inputValue, subTotal, 0);
  } else {
    console.log('something is wrong');
  }
}

function setAdjustment() {
  const inputValue = parseFloat(document.querySelector('#adjustment-input').value);
  document.querySelector('[name="adjustmentTotal"]').value = inputValue.toFixed(2);
  document.querySelector('#show_adjustment').innerHTML = inputValue.toFixed(2);
  setTotal();
}

function setShipCharge() {
  const inputValue = parseFloat(document.querySelector('#ship-input').value);
  document.querySelector('[name="shipChargeTotal"]').value = inputValue.toFixed(2);
  document.querySelector('#show_shipcharge').innerHTML = inputValue.toFixed(2);
  setTotal();
}

function setTotal() {
  const subTotal = parseFloat(document.querySelector('[name="subTotal"]').value);
  const discountTotal = parseFloat(document.querySelector('[name="discountTotal"]').value);
  const taxTotal = parseFloat(document.querySelector('[name="taxTotal"]').value);
  const adjustmentTotal = parseFloat(document.querySelector('[name="adjustmentTotal"]').value);
  const shipChargeTotal = parseFloat(document.querySelector('[name="shipChargeTotal"]')?.value ?? 0);
  let total = (subTotal - discountTotal) + taxTotal + adjustmentTotal +shipChargeTotal;
  document.querySelector('[name="total"]').value = total.toFixed(2);
  document.querySelector('#show_total').innerHTML = total.toFixed(2);

}

function sendData(formElement) {
  const url = formElement.action;
  const formData = new FormData(formElement);
  $.ajax({
    type: "POST",
    url: url,
    data: formData,
    processData: false,
    contentType: false,
    cache: false,
    dataType: "json",
    success: function (response) {
      if (response.isSuccess) {
        toastr.success('Added Successfully');
      } else {
        toastr.error('Oops! Something went wrong');
      }
    }
  });
}