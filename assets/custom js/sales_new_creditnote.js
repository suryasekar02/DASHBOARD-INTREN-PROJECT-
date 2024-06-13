

function addAddress() {
  let street = $('#bStreet').text();
  let cityAndState = $('#bCityState').text();
  let zipcode = $('#bzipcode').text();
  $('input[name="billing_address"]').val(street + '\n' + cityAndState + '\n' + zipcode);
  let S_street = $('#sStreet').text();
  let S_cityAndState = $('#sCityState').text();
  let S_zipcode = $('#szipcode').text();
  $('input[name="shipping_address"]').val(S_street + '\n' + S_cityAndState + '\n' + S_zipcode);
}

function ApplyAddress() {
  $('#bStreet').text($('#bill_street').val());
  $('#bCityState').text($('#bill_city').val() + ',' + $('#bill_state').val());
  $('#bzipcode').text($('#bill_country').val() + ',' + $('#bill_zipcode').val());
  $('#sStreet').text($('#ship_street').val());
  $('#sCityState').text($('#ship_city').val() + ',' + $('#ship_state').val());
  $('#szipcode').text($('#ship_country').val() + ',' + $('#ship_zipcode').val());
  $('#billEditModal').modal('hide');
  addAddress();
}

// important reusable function 
//  function to set selected value in selectpicker  - written by DJ
function setSelectValue(elemnetID, value) {
  let selectElemet = document.getElementById(elemnetID);
  let options = selectElemet.options;
  for (let i = 0; i < options.length; i++) {
    if (options[i].text == value) {
      selectElemet.selectedIndex = i;
      break;
    }
  }
  $('#' + elemnetID).selectpicker('refresh');
}


function fillItemInfo(item) {
  let mainRow = $('tr#main_row');
  mainRow.find('#description').val(item.description);
  mainRow.find('#long_description').val(item.long_description);
  mainRow.find('#unit').val(item.unit);
  mainRow.find('#rate').val(item.price);
  setMultipleSelectValue('no_tax', [item.tax_1, item.tax_2]);
}

function setMultipleSelectValue(elemnetID, valueArray) {
  let selectElemet = document.getElementById(elemnetID);
  let options = selectElemet.options;
  for (let i = 0; i < options.length; i++) {
    let match = 0;
    for (let j = 0; j < valueArray.length; j++) {
      if (options[i].value == valueArray[j]) {
        options[i].selected = true;
        match++;
      }
      if (match == 0) {
        options[i].selected = false;
      }
    }
  }
  $('#' + elemnetID).selectpicker('refresh');
}
function pushItem() {
  let mainRow = $('tr#main_row');
  
  if(mainRow.find('#description').val() == '' || mainRow.find('#long_description').val() == ''){
      if(mainRow.find('#description').val() == ''){
          mainRow.find('#description').addClass('is-invalid');
      }
      if(mainRow.find('#long_description').val() == ''){
          mainRow.find('#long_description').addClass('is-invalid');
      }
      return;
  }else{
      if(mainRow.find('#description').hasClass('is-invalid')){
      mainRow.find('#description').removeClass('is-invalid');
      }
      if(mainRow.find('#long_description').hasClass('is-invalid')){
      mainRow.find('#long_description').removeClass('is-invalid');
      }
  }
  
  let item = {
    description: mainRow.find('#description').val(),
    long_description: mainRow.find('#long_description').val(),
    quantity: mainRow.find('#quantity').val(),
    unit: mainRow.find('#unit').val(),
    rate: mainRow.find('#rate').val(),
    tax: mainRow.find('#no_tax').val(),
    amount: (Number(mainRow.find('#quantity').val()) * Number(mainRow.find('#rate').val())).toFixed(2)
  };
  // console.log(item);
  appendItems(item);
  $('#add-new-item').selectpicker('val','');
  
  mainRow.find('#description').val('');
  mainRow.find('#long_description').val('');
  mainRow.find('#unit').val('');
  mainRow.find('#rate').val('');
  $('#no_tax').selectpicker('val','');
}

function appendItems(item) {
  let tr = `<tr class="childRow">
                <td class="handle-icon ">
                  <i class="bi bi-grip-vertical"></i>
                </td>
                <td><textarea form="creditnoteform" name="description[]" class="form-control txtarea" rows="4" placeholder="Description">${item.description}</textarea></td>
                <td><textarea form="creditnoteform" name="long_description[]" rows="4" placeholder="Long Description" class="form-control txtarea">${item.long_description}</textarea></td>
                <td> 
                  <input type="number" form="creditnoteform" oninput="setAmount(event)" name="quantity[]" value="${item.quantity}" min="0" class="blacktdinp form-control">
                  <input type="text" form="creditnoteform" name="unit[]" value="${item.unit}" class="blacktdinp form-control " style="border:none!important;text-align: right;" placeholder="Unit">
                </td>
                <td> <input type="number" form="creditnoteform" oninput="setAmount(event)" name="rate[]" value="${item.rate}" min="0" placeholder="Rate" class="blacktdinp form-control blkselectheight"></td>
                <td> ${getSelectElement(item.tax)}
                </td>
                <td class="amounttdalign">
                  <input type="hidden" form="creditnoteform" name="amount[]" value="${item.amount}" ><span class="amtext"> ${item.amount}</span>
                  <span class="taxHolder"></span>
                </td>
                <td class="check-mark"><button class="btn btn-danger pull-left  table-button removeTR"><i class="fa fa-trash"></i></button></td>
              </tr>`;
  $('#item_body').append(tr);
  $('.selectpicker').selectpicker('refresh');
  setSubTotal();
}

$(document).on('click', '.removeTR', function () {
  $(this).closest('.childRow').remove();
  setSubTotal();
});

function setSubTotal() {
  let amount = document.getElementsByName('amount[]');
  let sub_total = 0;
  for (let index = 0; index < amount.length; index++) {
    sub_total += Number(amount[index].value);
  }
  document.getElementById('sbtotal').innerHTML = sub_total.toFixed(2);
  $('input[name="sub_total"]').val(sub_total.toFixed(2));
  $('select[name="taxes"]').change();

}

function setAmount(e) {
  let qty = e.target.closest('.childRow').querySelector('[name="quantity[]"]').value;
  let rate = e.target.closest('.childRow').querySelector('[name="rate[]"]').value;
  amount = qty * rate;
  e.target.closest('.childRow').querySelector('[name="amount[]"]').value = amount.toFixed(2);
  e.target.closest('.childRow').querySelector('.amtext').innerText = amount.toFixed(2);
  setSubTotal();
}

function setTax(e) {
  let amount = e.target.closest('.childRow').querySelector('[name="amount[]"]').value;
  let select = e.target.closest('.childRow').querySelector('[name="taxes"]');
  let taxes = $(select).val();
  let taxesInputs = [];
  for (const taxId of taxes) {
    for (const tax of tax_array) {
      if (taxId == tax.id) {
        taxAmount = amount * (Number(tax.percentage) / 100);
        taxesInputs.push(`<input type="hidden" name="${tax.name}(${tax.percentage}%)" value="${taxAmount}" class="taxInputs">`);
      }
    }
  }
  e.target.closest('.childRow').querySelector('span.taxHolder').innerHTML = taxesInputs.join(' ');
  calcTax();
}

function calcDiscount() {
  let discountType = $('select#__discount').val();
  if (discountType == 'before_tax') {
    let subTotal = Number($('input[name="sub_total"]').val());
    calcDisc(subTotal);
  } else if (discountType == 'after_tax') {
    let subTotal = Number($('input[name="sub_total"]').val());
    let taxTotal = Number($('input[name="tax_amount"]').val());
    calcDisc(subTotal + taxTotal);
  } else {
    $('input[name="discount_percent"]').val('0');
    $('span.discount-total').html('0');
    $('input[name="discount-amount"]').val('0');
    setTotalAmount();
  }
  function calcDisc(total) {
    let discountPercentage = Number($('input[name="discount_percent"]').val());
    let selectElementValue = $('select.discount-select').val();
    let discount = 0;
    if (selectElementValue == 'PC') {
      discount = total * (discountPercentage / 100);
    } else {
      discount = discountPercentage;
    }
    $('span.discount-total').html(discount.toFixed(2));
    $('input[name="discount_amount"]').val(discount.toFixed(2));
    setTotalAmount();
  }
}

function calcTax() {
  let inputs = document.getElementsByClassName('taxInputs');
  let taxTotal = 0;
  for (let index = 0; index < inputs.length; index++) {
    taxTotal += Number(inputs[index].value);
  }
  $('input[name="tax_amount"]').val(taxTotal.toFixed(2));
  $('span#test_show_tax').html(taxTotal.toFixed(2));
  calcDiscount();
}

function setTotalAmount() {
  let subTotal = Number($('input[name="sub_total"]').val());
  let discountAmount = Number($('input[name="discount_amount"]').val());
  let taxTotal = Number($('input[name="tax_amount"]').val());
  let total = subTotal + taxTotal - discountAmount;
  $('span#total').html( total.toFixed(2));
  $('input[name="total"]').val(total.toFixed(2));
  $('input[name="Atotal"]').val(total.toFixed(2));
}

function checkDiscountType() {
  let discountType = $('select#__discount').val();
  if (discountType !== 'notax') {
    calcDiscount();
  } else {
    alert('Please select discount type above.');
    $('input[name="discount_percent"]').val('0');
    // $('select#__discount').focus();
  }
}

function setAdjustments(value) {
  let total = Number($('input[name="Atotal"]').val());
  $('span#adjment').html(value);
  $('input[name="adjustment_amount"]').val(value);
  $('input[name="total"]').val((total + (Number(value))).toFixed(2));
  $('span#total').html((total + (Number(value))).toFixed(2));
}