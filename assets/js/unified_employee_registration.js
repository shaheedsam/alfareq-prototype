const state = { gender: null, marital: null, prefilled: false };
const wilayahs = { Muscat: ['Seeb', 'Muttrah', 'Bausher', 'Muscat'], Dhofar: ['Salalah', 'Thumrait', 'Mirbat'], BatinahNorth: ['Sohar', 'Shinas', 'Liwa'] };

function goStep(n) {
  for (let i = 1; i <= 4; i++) {
    const panel = document.getElementById('panel-' + i);
    if (panel) panel.style.display = (i === n ? 'block' : 'none');
    const step = document.getElementById('s' + i);
    if (step) {
      step.classList.remove('active', 'done');
      if (i < n) step.classList.add('done');
      else if (i === n) step.classList.add('active');
    }
  }
  if (n === 4) buildReview();
}

function pick(type, val, btn) {
  state[type] = val;
  const group = document.getElementById(type + '-group');
  group.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function doLookup(type) {
  const val = document.getElementById('search-' + type).value.trim();
  if (!val) return;
  const mockCivil = '10753522';
  const mockMobile = '99214668';
  const found = (type === 'civil' && val === mockCivil) || (type === 'mobile' && val === mockMobile);
  const result = document.getElementById('lookup-result');
  if (found) {
    document.getElementById('lr-name').textContent = 'Maya Awadh Rashid Al Kindi';
    document.getElementById('lr-meta').textContent = 'Civil: 10753522 · DOB: 23/03/1980 · Female · Omani';
    result.classList.add('show');
    state.prefilled = true;
    prefillPersonal();
  } else {
    result.classList.remove('show');
    result.innerHTML = '<div class="lookup-result-label" style="color:#A32D2D"><i class="ti ti-alert-circle"></i> No record found — a new person will be created</div>';
    result.style.background = '#FCEBEB';
    result.style.borderColor = '#F7C1C1';
    result.classList.add('show');
  }
}

function prefillPersonal() {
  document.getElementById('civil').value = '10753522';
  document.getElementById('name-en').value = 'MAYA AWADH RASHID AL KINDI';
  document.getElementById('name-ar').value = 'مياء بنت عوض بن راشد الكندية';
  document.getElementById('dob').value = '1980-03-23';
  document.getElementById('phone').value = '99214668';
  document.getElementById('emergency-phone').value = '99214668';
  document.getElementById('religion').value = 'Islam';
  document.getElementById('nationality').value = 'Omani';
  pick('gender', 'FEMALE', document.querySelector('#gender-group .toggle-btn:nth-child(2)'));
  pick('marital', 'MARRIED', document.querySelector('#marital-group .toggle-btn:nth-child(2)'));
  const pill = document.getElementById('person-status-pill');
  pill.textContent = 'Existing record';
  pill.className = 'status-pill pill-existing';
}

function updateWilayah(gov) {
  const wilayah = document.getElementById('wilayah');
  wilayah.innerHTML = '<option value="">— select —</option>';
  const key = gov.replace(' ', '');
  if (wilayahs[key]) {
    wilayahs[key].forEach(w => {
      const option = document.createElement('option');
      option.textContent = w;
      wilayah.appendChild(option);
    });
  }
}

function rv(id) {
  return document.getElementById(id)?.value || '—';
}

function buildReview() {
  const personal = document.getElementById('review-personal');
  const employment = document.getElementById('review-employment');
  const pFields = [
    ['Civil number', rv('civil')], ['Full name (EN)', rv('name-en')],
    ['Full name (AR)', rv('name-ar') || '—'], ['Date of birth', rv('dob')],
    ['Gender', state.gender || '—'], ['Marital status', state.marital || '—'],
    ['Religion', rv('religion')], ['Nationality', rv('nationality')],
    ['Phone', rv('phone')], ['Email', rv('email') || '—']
  ];
  const eFields = [
    ['Staff number', rv('staff-num')], ['Mawred number', rv('mawred') || '—'],
    ['Date of joining', rv('join-date')], ['Staff type', rv('staff-type')],
    ['Designation', rv('designation')], ['Speciality', rv('speciality') || '—'],
    ['Budget', rv('budget') || '—'], ['Grade', rv('grade') || '—']
  ];

  personal.innerHTML = pFields.map(([label, value]) => `<div class="field-group"><label>${label}</label><div style="font-size:13px;color:var(--color-text-primary);padding:5px 0;border-bottom:0.5px solid var(--color-border-tertiary)">${value}</div></div>`).join('');
  employment.innerHTML = eFields.map(([label, value]) => `<div class="field-group"><label>${label}</label><div style="font-size:13px;color:var(--color-text-primary);padding:5px 0;border-bottom:0.5px solid var(--color-border-tertiary)">${value}</div></div>`).join('');
}

function doSubmit() {
  const button = document.getElementById('submit-btn');
  button.disabled = true;
  button.textContent = 'Registering…';
  setTimeout(() => {
    document.getElementById('form-main').style.display = 'none';
    const success = document.getElementById('success-card');
    success.classList.add('show');
    const staffNumber = rv('staff-num') || 'EMP-XXXX';
    const civilNumber = rv('civil') || '—';
    document.getElementById('success-ref').textContent = staffNumber + ' · Civil ' + civilNumber;
    document.querySelectorAll('.step').forEach(step => { step.classList.remove('active'); step.classList.add('done'); });
  }, 900);
}

function resetForm() {
  document.getElementById('form-main').style.display = 'block';
  document.getElementById('success-card').classList.remove('show');
  document.querySelectorAll('input').forEach(input => input.value = '');
  document.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
  document.querySelectorAll('.toggle-btn').forEach(button => button.classList.remove('active'));
  document.getElementById('lookup-result').classList.remove('show');
  state.gender = null;
  state.marital = null;
  state.prefilled = false;
  const pill = document.getElementById('person-status-pill');
  pill.textContent = 'New record';
  pill.className = 'status-pill pill-new';
  goStep(1);
}
