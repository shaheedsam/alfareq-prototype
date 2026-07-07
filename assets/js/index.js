let currentImageZoom = 1;
let currentTranslateX = 0;
let currentTranslateY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let dragStartTranslateX = 0;
let dragStartTranslateY = 0;

function applyImageZoom() {
  const image = document.getElementById('currentFormImage');
  const shell = document.querySelector('.modal-image-shell');
  const value = document.getElementById('modalZoomValue');
  if (image) {
    image.style.setProperty('--image-zoom', currentImageZoom);
    image.style.setProperty('--image-translate-x', currentTranslateX + 'px');
    image.style.setProperty('--image-translate-y', currentTranslateY + 'px');
  }
  if (shell) {
    shell.classList.toggle('zoomed', currentImageZoom > 1);
  }
  if (value) {
    value.textContent = Math.round(currentImageZoom * 100) + '%';
  }
}

function adjustImageZoom(step) {
  currentImageZoom = Math.min(2, Math.max(0.9, Number((currentImageZoom + step).toFixed(2))));
  if (currentImageZoom <= 1) {
    currentTranslateX = 0;
    currentTranslateY = 0;
  }
  applyImageZoom();
}

function resetImageZoom() {
  currentImageZoom = 1;
  currentTranslateX = 0;
  currentTranslateY = 0;
  applyImageZoom();
}

function startImageDrag(event) {
  if (currentImageZoom <= 1) return;
  event.preventDefault();
  isDragging = true;
  dragStartX = event.clientX;
  dragStartY = event.clientY;
  dragStartTranslateX = currentTranslateX;
  dragStartTranslateY = currentTranslateY;
  const shell = document.querySelector('.modal-image-shell');
  const image = document.getElementById('currentFormImage');
  if (shell) shell.classList.add('dragging');
  if (image) image.classList.add('dragging-image');
}

function dragImage(event) {
  if (!isDragging) return;
  event.preventDefault();
  currentTranslateX = dragStartTranslateX + (event.clientX - dragStartX);
  currentTranslateY = dragStartTranslateY + (event.clientY - dragStartY);
  applyImageZoom();
}

function endImageDrag() {
  if (!isDragging) return;
  isDragging = false;
  const shell = document.querySelector('.modal-image-shell');
  const image = document.getElementById('currentFormImage');
  if (shell) shell.classList.remove('dragging');
  if (image) image.classList.remove('dragging-image');
}

function openCurrentFormModal() {
  const modal = document.getElementById('currentFormModal');
  if (modal) {
    resetImageZoom();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeCurrentFormModal(event) {
  const modal = document.getElementById('currentFormModal');
  if (!modal) return;
  if (event && event.target !== modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
  resetImageZoom();
}

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    closeCurrentFormModal();
  }
});

const imageShell = document.querySelector('.modal-image-shell');
const imageElement = document.getElementById('currentFormImage');
if (imageShell) {
  imageShell.addEventListener('mousedown', startImageDrag);
  imageShell.addEventListener('mousemove', dragImage);
  imageShell.addEventListener('mouseup', endImageDrag);
  imageShell.addEventListener('mouseleave', endImageDrag);
}
if (imageElement) {
  imageElement.addEventListener('mouseup', endImageDrag);
}
document.addEventListener('mousemove', dragImage);
document.addEventListener('mouseup', endImageDrag);

applyImageZoom();
