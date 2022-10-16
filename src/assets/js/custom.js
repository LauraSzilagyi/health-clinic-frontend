let picker = null;
function removeDatePicker() {
    if (picker !== null){
      picker.destroy();
    }
}
function loadDatepicker(minDate, maxDate, disabledDates) {

  function sanitizeDisabledDate(disabledDates) {
    if (disabledDates === undefined) {
      return []
    } else {
      return disabledDates
    }
  }

  function sanitizeMinDate(minDate) {
    return minDate === undefined ? new Date() : minDate;
  }
  function sanitizeMaxDate(maxDate) {
    return maxDate === undefined ? new Date(): maxDate;
  }

  disabledDates = sanitizeDisabledDate(disabledDates)
  minDate = sanitizeMinDate(minDate)
  maxDate = sanitizeMaxDate(maxDate)

  picker = MCDatepicker.create({
    el: '#appointment-date',
    dateFormat: 'YYYY-MM-DD',
    context: document.body,
    autoClose: false,
    closeOndblclick: true,
    closeOnBlur: false,
    customOkBTN: 'OK',
    customClearBTN: 'Clear',
    customCancelBTN: 'CANCEL',
    firstWeekday: 0, // ex: 1 accept numbers 0-6;
    minDate: minDate,
    maxDate: maxDate,
    jumpToMinMax: true,
    jumpOverDisabled: true,
    disableDates: disabledDates, // ex: [new Date(2019,11, 25), new Date(2019, 11, 26)]
    allowedYears: [2022], // ex: [2022, 2023]
  })
}



