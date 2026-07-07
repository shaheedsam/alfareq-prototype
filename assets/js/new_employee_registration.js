toastr.options = {
  closeButton: true,
  progressBar: true,
  newestOnTop: true,
  positionClass: 'toast-top-right',
  preventDuplicates: true,
  timeOut: 3200
};

function showToast(type, message) {
  if (typeof toastr[type] === 'function') {
    toastr[type](message);
  }
}

function goTab(n) {
  [1, 2, 3].forEach(function (i) {
    var panel = document.getElementById('tp' + i);
    if (panel) {
      panel.classList.toggle('d-none', i !== n);
    }
  });

  document.querySelectorAll('.nav-link[data-tab]').forEach(function (link) {
    var active = parseInt(link.dataset.tab, 10) === n;
    link.classList.toggle('active', active);
    link.classList.toggle('active-tab', active);
    link.classList.toggle('border-bottom', active);
    link.classList.toggle('rounded-0', active);
    link.classList.toggle('bg-transparent', true);
    link.classList.toggle('text-secondary', !active);
    link.classList.toggle('border-0', !active);
    link.classList.toggle('shadow-none', true);
    link.classList.toggle('fw-semibold', active);
    link.classList.toggle('fw-normal', !active);
  });
}

goTab(1);

function sync(sourceId, targetId) {
  var source = document.getElementById(sourceId);
  var target = document.getElementById(targetId);
  if (source && target) {
    target.selectedIndex = source.selectedIndex;
  }
}

function previewPhoto(input) {
  var file = input.files[0];
  if (!file) {
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    showToast('warning', 'Photo is too large. Max size is 2MB.');
    input.value = '';
    return;
  }

  var reader = new FileReader();
  reader.onload = function (event) {
    var image = document.getElementById('profile-photo-preview');
    var placeholder = document.getElementById('profile-photo-placeholder');
    var removeButton = document.getElementById('btn-remove-photo');
    if (image && placeholder && removeButton) {
      image.src = event.target.result;
      image.classList.remove('d-none');
      placeholder.classList.add('d-none');
      removeButton.classList.remove('d-none');
      showToast('success', 'Profile photo uploaded successfully.');
    }
  };
  reader.readAsDataURL(file);
}

function removePhoto(silent) {
  var input = document.getElementById('profile-photo-input');
  var image = document.getElementById('profile-photo-preview');
  var placeholder = document.getElementById('profile-photo-placeholder');
  var removeButton = document.getElementById('btn-remove-photo');

  if (input) input.value = '';
  if (image) {
    image.src = '';
    image.classList.add('d-none');
  }
  if (placeholder) placeholder.classList.remove('d-none');
  if (removeButton) removeButton.classList.add('d-none');
  if (!silent) showToast('info', 'Profile photo removed.');
}

function handleStatusChange() {
  var status = document.getElementById('status').value;
  var container = document.getElementById('status-extra-container');
  var badge = document.getElementById('status-extra-badge');

  ['panel-unpaid-leave', 'panel-secondment', 'panel-study', 'panel-transfer', 'panel-termination'].forEach(function (panelId) {
    var panel = document.getElementById(panelId);
    if (panel) {
      panel.classList.add('d-none');
    }
  });

  if (!status || status === 'Active') {
    if (container) container.classList.add('d-none');
    return;
  }

  if (container) container.classList.remove('d-none');
  if (badge) badge.textContent = status;

  var targetPanel = '';
  if (status === 'Internal Secondment' || status === 'External Secondment') {
    targetPanel = 'panel-secondment';
  } else if (status === 'Study Leave In Oman' || status === 'Study Leave Outside Oman') {
    targetPanel = 'panel-study';
  } else if (status === 'Unpaid Leave') {
    targetPanel = 'panel-unpaid-leave';
  } else if (status === 'External Transfer') {
    targetPanel = 'panel-transfer';
  } else if (status === 'End Of Service' || status === 'Suspended') {
    targetPanel = 'panel-termination';
  }

  if (targetPanel) {
    var activePanel = document.getElementById(targetPanel);
    if (activePanel) {
      activePanel.classList.remove('d-none');
    }
  }
}

function getActiveStatusFields() {
  var status = document.getElementById('status').value;
  if (!status || status === 'Active') return [];

  if (status === 'Internal Secondment' || status === 'External Secondment') {
    return ['secondment-to', 'secondment-from', 'secondment-to-date'];
  }
  if (status === 'Study Leave In Oman' || status === 'Study Leave Outside Oman') {
    return ['study-institute', 'study-major', 'study-from', 'study-to'];
  }
  if (status === 'Unpaid Leave') {
    return ['leave-from', 'leave-to'];
  }
  if (status === 'External Transfer') {
    return ['transfer-to', 'transfer-decision'];
  }
  if (status === 'End Of Service' || status === 'Suspended') {
    return ['status-reason', 'status-reason-from'];
  }
  return [];
}

var areasData = {
  Muscat: { en: ['Seeb', 'Muttrah', 'Bausher', 'Muscat City', 'Qurayyat'], ar: ['السيب', 'مطرح', 'بوشر', 'مسقط', 'قريات'] },
  Dhofar: { en: ['Salalah', 'Thumrait', 'Mirbat', 'Rakhyut'], ar: ['صلالة', 'ثمريت', 'مرباط', 'رخيوت'] },
  'Batinah North': { en: ['Sohar', 'Shinas', 'Liwa', 'Saham'], ar: ['صحار', 'شناص', 'لوى', 'صحم'] },
  'Batinah South': { en: ['Rustaq', 'Nakhal', 'Awabi'], ar: ['الرستاق', 'نخل', 'عوابي'] },
  Dakhliyah: { en: ['Nizwa', 'Bahla', 'Adam', 'Manah'], ar: ['نزوى', 'بهلاء', 'آدم', 'منح'] }
};

function updateArea() {
  var gov = document.getElementById('gov').value;
  var area = document.getElementById('area');
  var areaAr = document.getElementById('area-ar');

  area.innerHTML = '<option value="">&lt;&lt; SELECT &gt;&gt;</option>';
  areaAr.innerHTML = '<option value="">-- اختر --</option>';

  if (gov && areasData[gov]) {
    areasData[gov].en.forEach(function (value, index) {
      var option = document.createElement('option');
      option.textContent = value;
      area.appendChild(option);

      var optionArabic = document.createElement('option');
      optionArabic.textContent = areasData[gov].ar[index];
      areaAr.appendChild(optionArabic);
    });
  }

  area.onchange = function () { sync('area', 'area-ar'); };
  areaAr.onchange = function () { sync('area-ar', 'area'); };
}

var t1 = ['civil-id', 'join-date', 'staff-num', 'dob', 'mawred', 'name-en', 'name-ar', 'category', 'designation', 'position', 'gender', 'nationality', 'department', 'section', 'grade', 'budget', 'status'];
var t2 = ['marital', 'religion', 'gov', 'area', 'subarea', 'emergency-phone', 'phone', 'email'];

function validate(ids, errId) {
  var bad = 0;
  ids.forEach(function (id) {
    var element = document.getElementById(id);
    if (!element) return;
    var empty = !element.value.trim();
    element.classList.toggle('is-invalid', empty);
    if (empty) bad++;
  });

  var bar = document.getElementById(errId);
  if (bad) {
    var message = '⚠  Please complete all mandatory fields. (' + bad + ' field' + (bad > 1 ? 's' : '') + ' incomplete)';
    bar.textContent = message;
    bar.classList.remove('d-none');
    showToast('warning', message);
    return false;
  }

  bar.classList.add('d-none');
  return true;
}

function nextTab(from) {
  if (from === 1) {
    var fieldsToValidate = t1.concat(getActiveStatusFields());
    if (validate(fieldsToValidate, 'err1')) goTab(2);
  } else if (from === 2) {
    goTab(3);
  }
}

var qualList = [];
var qualSeq = 0;

function addQual() {
  var deg = document.getElementById('q-degree').value;
  var spec = document.getElementById('q-specialty').value;
  var sub = document.getElementById('q-subspecialty').value;
  var inst = document.getElementById('q-institute').value;
  var yr = document.getElementById('q-year').value.trim();
  var yearField = document.getElementById('q-year');

  if (yr && !/^\d{4}$/.test(yr)) {
    yearField.classList.add('is-invalid');
    var bar = document.getElementById('err3');
    var message = '⚠  Graduation year must be a 4-digit number (e.g. 2020).';
    bar.textContent = message;
    bar.classList.remove('d-none');
    showToast('warning', message);
    return;
  }

  yearField.classList.remove('is-invalid');
  document.getElementById('err3').classList.add('d-none');
  qualSeq++;
  showToast('success', 'Qualification added successfully.');
  qualList.push({ id: qualSeq, deg: deg, spec: spec, sub: sub, inst: inst, yr: yr });
  renderQualTable();

  ['q-degree', 'q-specialty', 'q-subspecialty', 'q-institute', 'q-degree-ar', 'q-specialty-ar', 'q-subspecialty-ar', 'q-institute-ar'].forEach(function (id) {
    var element = document.getElementById(id);
    if (element) {
      element.selectedIndex = 0;
      element.classList.remove('is-invalid');
    }
  });
  yearField.value = '';
}

function removeQual(id) {
  qualList = qualList.filter(function (qualification) { return qualification.id !== id; });
  renderQualTable();
}

function renderQualTable() {
  var tbody = document.getElementById('qual-tbody');
  document.getElementById('qual-count').textContent = qualList.length + ' record(s)';

  if (!qualList.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="qual-empty text-center py-3">No qualifications added yet — fill the form above and click Add.</td></tr>';
    return;
  }

  tbody.innerHTML = qualList.map(function (qualification, index) {
    return '<tr>' +
      '<td class="text-muted">' + (index + 1) + '</td>' +
      '<td><strong>' + qualification.deg + '</strong></td>' +
      '<td>' + qualification.spec + '</td>' +
      '<td class="text-secondary">' + qualification.sub + '</td>' +
      '<td><span class="badge text-bg-warning">' + qualification.inst + '</span></td>' +
      '<td class="fw-semibold text-success">' + qualification.yr + '</td>' +
      '<td><button class="btn btn-sm btn-link text-danger p-0" onclick="removeQual(' + qualification.id + ')">&#10005;</button></td>' +
    '</tr>';
  }).join('');
}

function doSubmit() {
  var fieldsToValidate = t1.concat(getActiveStatusFields());
  if (!validate(fieldsToValidate, 'err1')) {
    goTab(1);
    showToast('warning', 'Please complete all mandatory fields in Basic Information.');
    return;
  }

  var ref = 'Staff # ' + document.getElementById('staff-num').value +
    '  ·  Civil ID: ' + document.getElementById('civil-id').value +
    '  ·  ' + document.getElementById('name-en').value +
    '  ·  ' + (qualList.length > 0 ? qualList.length + ' qualification(s)' : 'No qualifications');

  document.getElementById('success-ref').textContent = ref;
  var successEl = document.getElementById('success-block');
  if (successEl) {
    successEl.classList.remove('d-none');
    successEl.scrollIntoView({ behavior: 'smooth' });
  }
  showToast('success', 'Employee registration completed successfully.');
}

function doLoad() {
  var c = document.getElementById('s-civil').value.trim();
  var w = document.getElementById('s-mawred').value.trim();
  var m = document.getElementById('s-mobile').value.trim();
  var p = document.getElementById('s-person').value.trim();
  if (!c && !w && !m && !p) {
    showToast('warning', 'Enter a Staff #, Civil ID, Mawred #, or Mobile to search.');
    return;
  }

  if (c === '10753522' || w === '123456' || m === '99214668' || p === 'EMP-001') {
    document.getElementById('civil-id').value = '10753522';
    document.getElementById('name-en').value = 'MAYA AWADH RASHID AL KINDI';
    document.getElementById('name-ar').value = 'مياء بنت عوض بن راشد الكندية';
    document.getElementById('dob').value = '1980-03-23';
    document.getElementById('mawred').value = '123456';
    document.getElementById('phone').value = '99214668';
    document.getElementById('emergency-phone').value = '99214668';
    document.getElementById('email').value = 'maya@moh.gov.om';
    document.getElementById('gender').value = 'Female';
    sync('gender', 'gender-ar');
    document.getElementById('nationality').value = 'Omani';
    sync('nationality', 'nationality-ar');
    document.getElementById('religion').value = 'Islam';
    sync('religion', 'religion-ar');
    document.getElementById('marital').value = 'Married';
    sync('marital', 'marital-ar');

    var image = document.getElementById('profile-photo-preview');
    var placeholder = document.getElementById('profile-photo-placeholder');
    var removeButton = document.getElementById('btn-remove-photo');
    if (image && placeholder && removeButton) {
      image.src = 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=150&auto=format&fit=crop';
      image.classList.remove('d-none');
      placeholder.classList.add('d-none');
      removeButton.classList.remove('d-none');
    }

    document.getElementById('found-text').textContent = 'Record found: Maya Awadh Rashid Al Kindi · Civil ID 10753522 · Mawred # 123456 · Personal details pre-filled.';
    document.getElementById('found-banner').classList.remove('d-none');
    document.getElementById('found-banner').classList.add('d-flex');
    showToast('success', 'Employee record loaded successfully.');
  } else {
    document.getElementById('found-banner').classList.add('d-none');
    showToast('info', 'No record found. Continue entering details manually.');
  }
}

function clearAll() {
  document.querySelectorAll('input').forEach(function (input) {
    input.value = '';
    input.classList.remove('is-invalid');
  });
  document.querySelectorAll('select').forEach(function (select) {
    select.selectedIndex = 0;
    select.classList.remove('is-invalid');
  });
  [1, 2, 3].forEach(function (n) {
    var error = document.getElementById('err' + n);
    if (error) error.classList.add('d-none');
  });
  document.getElementById('found-banner').classList.add('d-none');
  document.getElementById('success-block').classList.add('d-none');
  document.getElementById('area').innerHTML = '<option value="">&lt;&lt; SELECT &gt;&gt;</option>';
  document.getElementById('area-ar').innerHTML = '<option value="">-- اختر --</option>';
  removePhoto(true);
  handleStatusChange();
}

function resetAll() {
  qualList = [];
  qualSeq = 0;
  renderQualTable();
  clearAll();
  goTab(1);
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.nav-link[data-tab]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
    });
  });
});
