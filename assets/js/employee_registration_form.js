const areasData = {
  Muscat: { en: ['Seeb', 'Muttrah', 'Bausher', 'Muscat City', 'Qurayyat'], ar: ['السيب', 'مطرح', 'بوشر', 'مسقط', 'قريات'] },
  Dhofar: { en: ['Salalah', 'Thumrait', 'Mirbat', 'Rakhyut'], ar: ['صلالة', 'ثمريت', 'مرباط', 'رخيوت'] },
  'Batinah North': { en: ['Sohar', 'Shinas', 'Liwa', 'Saham'], ar: ['صحار', 'شناص', 'لوى', 'صحم'] },
  'Batinah South': { en: ['Rustaq', 'Nakhal', 'Awabi'], ar: ['الرستاق', 'نخل', 'عوابي'] },
  Dakhliyah: { en: ['Nizwa', 'Bahla', 'Adam', 'Manah'], ar: ['نزوى', 'بهلاء', 'آدم', 'منح'] }
};

function sync(sourceId, targetId) {
  const source = document.getElementById(sourceId);
  const target = document.getElementById(targetId);
  if (source && target) target.selectedIndex = source.selectedIndex;
}

function updateArea() {
  const gov = document.getElementById('gov').value;
  const area = document.getElementById('area');
  const areaAr = document.getElementById('area-ar');
  area.innerHTML = '<option value="">&lt;&lt; SELECT &gt;&gt;</option>';
  areaAr.innerHTML = '<option value="">إختر</option>';
  if (gov && areasData[gov]) {
    areasData[gov].en.forEach((value, index) => {
      const option = document.createElement('option');
      option.textContent = value;
      area.appendChild(option);
      const optionArabic = document.createElement('option');
      optionArabic.textContent = areasData[gov].ar[index];
      areaAr.appendChild(optionArabic);
    });
  }
  area.onchange = () => sync('area', 'area-ar');
  areaAr.onchange = () => sync('area-ar', 'area');
}

function goTab(n) {
  [1, 2].forEach(i => {
    const tabNav = document.getElementById('tnav' + i);
    const panel = document.getElementById('tp' + i);
    if (tabNav) tabNav.classList.toggle('active', i === n);
    if (panel) panel.classList.toggle('active', i === n);
  });
}

const t1 = ['civil-id', 'join-date', 'staff-num', 'dob', 'mawred', 'name-en', 'name-ar', 'category', 'designation', 'position', 'gender', 'nationality', 'department', 'section', 'grade', 'budget', 'status'];
const t2 = ['marital', 'religion', 'gov', 'area', 'subarea', 'emergency-phone', 'phone', 'email'];

function validate(ids, errId) {
  let bad = 0;
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const empty = !el.value.trim();
    el.classList.toggle('err', empty);
    if (empty) bad++;
  });
  const bar = document.getElementById(errId);
  if (bad) {
    bar.textContent = '⚠ Please complete all mandatory fields. (' + bad + ' field' + (bad > 1 ? 's' : '') + ' incomplete)';
    bar.classList.add('show');
    return false;
  }
  bar.classList.remove('show');
  return true;
}

function nextTab() {
  if (validate(t1, 'err1')) goTab(2);
}

function doSubmit() {
  if (!validate(t2, 'err2')) return;
  const ref = 'Staff # ' + document.getElementById('staff-num').value + ' · Civil ID: ' + document.getElementById('civil-id').value + ' · ' + document.getElementById('name-en').value;
  document.getElementById('success-ref').textContent = ref;
  document.getElementById('success-block').classList.add('show');
}

function doLoad() {
  const c = document.getElementById('s-civil').value.trim();
  const m = document.getElementById('s-mobile').value.trim();
  if (c === '10753522' || m === '99214668') {
    document.getElementById('civil-id').value = '10753522';
    document.getElementById('name-en').value = 'MAYA AWADH RASHID AL KINDI';
    document.getElementById('name-ar').value = 'مياء بنت عوض بن راشد الكندية';
    document.getElementById('dob').value = '1980-03-23';
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
    document.getElementById('found-text').textContent = 'Record found: Maya Awadh Rashid Al Kindi · Civil ID 10753522 · pre-filled.';
    document.getElementById('found-banner').classList.add('show');
  } else {
    alert('No record found. Continue entering details manually.');
  }
}

function clearAll() {
  document.querySelectorAll('input').forEach(input => {
    input.value = '';
    input.classList.remove('err');
  });
  document.querySelectorAll('select').forEach(select => {
    select.selectedIndex = 0;
    select.classList.remove('err');
  });
  ['err1', 'err2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = '';
      el.classList.remove('show');
    }
  });
  document.getElementById('found-banner').classList.remove('show');
  document.getElementById('success-block').classList.remove('show');
  document.getElementById('area').innerHTML = '<option value="">&lt;&lt; SELECT &gt;&gt;</option>';
  document.getElementById('area-ar').innerHTML = '<option value="">إختر</option>';
}
