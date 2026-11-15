'use strict';

function setupNavigation() {
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#main-nav');
  const header = document.querySelector('.site-header');
  function updateHeaderOffset() {
    const height = `${header.offsetHeight}px`;
    document.documentElement.style.setProperty('--header-height', height);
    document.documentElement.style.setProperty('--header-offset', height);
  }
  updateHeaderOffset();
  if ('ResizeObserver' in window) new ResizeObserver(updateHeaderOffset).observe(header);
  header.classList.add('menu-ready');
  menuButton.hidden = false;
  function closeMenu(returnFocus = false) {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = 'Меню';
    menuButton.setAttribute('aria-label', 'Открыть меню');
    if (returnFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => {
    const opened = menuButton.getAttribute('aria-expanded') !== 'true';
    navigation.classList.toggle('is-open', opened);
    menuButton.setAttribute('aria-expanded', String(opened));
    menuButton.textContent = opened ? 'Закрыть' : 'Меню';
    menuButton.setAttribute('aria-label', opened ? 'Закрыть меню' : 'Открыть меню');
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  window.matchMedia('(min-width: 801px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });
}

function setupBooking() {
  const form = document.querySelector('#booking-form');
  const result = document.querySelector('#form-result');
  const selectedService = document.querySelector('#selected-service');
  const serviceLabel = document.querySelector('#selected-service-label');
  const serviceSelect = document.querySelector('#service-choice');
  const fields = {
    name: document.querySelector('#client-name'),
    phone: document.querySelector('#client-phone'),
    car: document.querySelector('#car-brand'),
    problem: document.querySelector('#car-problem'),
    consent: document.querySelector('#client-consent')
  };
  const errors = Object.fromEntries(Object.keys(fields).map(key => [key, document.querySelector(`#${key}-error`)]));
  let hasSubmitted = false;

  function phoneDigits(value) {
    const digits = value.replace(/\D/g, '');
    return /^\+?[\d\s()\-]+$/.test(value.trim()) && /^[78]\d{10}$/.test(digits) ? digits : '';
  }
  function getError(key) {
    const field = fields[key];
    const value = field.value.trim();
    if (key === 'name') return value.length < 2 || value.length > 80 || !/\p{L}/u.test(value) ? 'Укажите имя: от 2 до 80 символов.' : '';
    if (key === 'phone') return phoneDigits(value) ? '' : 'Введите номер телефона в формате +7 (999) 123-45-67.';
    if (key === 'car') return value.length > 100 ? 'Сократите название марки и модели до 100 символов.' : '';
    if (key === 'problem') return value.length > 1500 ? 'Сократите комментарий до 1 500 символов.' : '';
    if (key === 'consent') return field.checked ? '' : 'Подтвердите согласие на проверку демонстрационной формы.';
    return '';
  }
  function validateField(key) {
    const message = getError(key);
    errors[key].textContent = message;
    fields[key].setAttribute('aria-invalid', String(Boolean(message)));
    return !message;
  }
  for (const [key, field] of Object.entries(fields)) {
    field.addEventListener(key === 'consent' ? 'change' : 'input', () => {
      result.hidden = true;
      if (hasSubmitted || field.getAttribute('aria-invalid') === 'true') validateField(key);
    });
    if (key !== 'consent') field.addEventListener('blur', () => {
      if (field.value.trim() || hasSubmitted) validateField(key);
    });
  }
  fields.phone.addEventListener('blur', () => {
    const digits = phoneDigits(fields.phone.value);
    if (digits) {
      fields.phone.value = `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`;
    }
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    hasSubmitted = true;
    let firstInvalid = null;
    for (const key of Object.keys(fields)) if (!validateField(key) && !firstInvalid) firstInvalid = fields[key];
    if (firstInvalid) { result.hidden = true; firstInvalid.focus(); return; }
    // Demonstration only: never transmit, persist or log any field values.
    result.textContent = 'Вы заполнили форму верно. Это демонстрационная версия: заявка не отправлена, автосервис не получил ваши данные.';
    result.hidden = false;
    result.focus({preventScroll: true});
    result.scrollIntoView({block: 'nearest'});
  });
  form.addEventListener('reset', () => {
    hasSubmitted = false;
    result.hidden = true;
    result.textContent = '';
    selectedService.hidden = true;
    serviceLabel.textContent = '';
    serviceSelect.value = '';
    for (const key of Object.keys(fields)) {
      fields[key].removeAttribute('aria-invalid');
      errors[key].textContent = '';
    }
  });
  function updateSelectedService() {
    const text = serviceSelect.value;
    serviceLabel.textContent = text ? `Вы выбрали: ${text}` : '';
    selectedService.hidden = !text;
    result.hidden = true;
  }
  serviceSelect.addEventListener('change', updateSelectedService);
  document.querySelector('#change-service').addEventListener('click', () => {
    serviceSelect.scrollIntoView({block: 'center'});
    serviceSelect.focus({preventScroll: true});
  });
  document.querySelectorAll('[data-service]').forEach(button => {
    button.addEventListener('click', () => {
      const text = button.dataset.service;
      serviceSelect.value = text;
      updateSelectedService();
      document.querySelector('#booking').scrollIntoView({block: 'start'});
      fields.name.focus({preventScroll: true});
    });
  });
  form.querySelector('[type="submit"]').disabled = false;
}

function setupLegalDocuments() {
  function openDocument(id) {
    const panel = document.getElementById(id);
    if (panel?.classList.contains('legal-document')) panel.open = true;
  }

  document.querySelectorAll('[data-document]').forEach(link => {
    link.addEventListener('click', () => openDocument(link.dataset.document));
  });
  window.addEventListener('hashchange', () => openDocument(location.hash.slice(1)));
  openDocument(location.hash.slice(1));
}

function setupScrollMotion(reducedMotion) {
  // One scroll update drives the background car and the photographs.
  // Read positions first, then write transforms; no continuous animation loop.
  const roadPath = document.querySelector('#drive-path');
  const roadCar = document.querySelector('#road-car');
  const carFront = document.querySelector('#car-front');
  const carRear = document.querySelector('#car-rear');
  const roadScene = document.querySelector('.road-scene');
  // Fixed hero/background frames do not need geometry reads on every scroll.
  const photos = [...document.querySelectorAll('.photo-frame img')]
    .filter(photo => !photo.closest('.hero-image, .about-background'));
  const pathLength = roadPath.getTotalLength();
  let roadScaleX = 1;
  let roadScaleY = 1;
  let scrollLimit = 1;
  let lastScroll = window.scrollY;
  let drivingDirection = 1;
  let scrollFrame = 0;
  let carPositioned = false;
  function placeCar(progress) {
    const distance = progress * pathLength;
    const point = roadPath.getPointAtLength(distance);
    const before = roadPath.getPointAtLength(Math.max(0, distance - 2));
    const after = roadPath.getPointAtLength(Math.min(pathLength, distance + 2));
    const tangentX = (after.x - before.x) * roadScaleX;
    const tangentY = (after.y - before.y) * roadScaleY;
    const tangentLength = Math.hypot(tangentX, tangentY) || 1;
    const angle = Math.atan2(tangentY, tangentX) * 180 / Math.PI - 90;
    // Screen-left lane when travelling down; screen-right lane when travelling up.
    const laneOffset = -80 * roadScaleX * drivingDirection;
    const x = point.x * roadScaleX + tangentY / tangentLength * laneOffset;
    const y = point.y * roadScaleY - tangentX / tangentLength * laneOffset;
    roadCar.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${angle}deg)`;
    carFront.hidden = drivingDirection < 0;
    carRear.hidden = drivingDirection >= 0;
    carPositioned = true;
  }
  function updateScrollMotion() {
    scrollFrame = 0;
    const current = window.scrollY;
    const delta = current - lastScroll;
    if (Math.abs(delta) > 1) drivingDirection = delta > 0 ? 1 : -1;
    lastScroll = current;
    if (reducedMotion.matches) {
      photos.forEach(photo => { photo.style.transform = 'none'; });
      if (!carPositioned) placeCar(.5);
      return;
    }
    const positions = photos.map(photo => photo.parentElement.getBoundingClientRect());
    placeCar(Math.min(1, Math.max(0, current / scrollLimit)));
    photos.forEach((photo, index) => {
      const bounds = positions[index];
      if (bounds.bottom < 0 || bounds.top > innerHeight) return;
      const distance = (bounds.top + bounds.height / 2 - innerHeight / 2) / innerHeight;
      // Stay inside the 4% overscan of scale(1.08), even on narrow phones.
      const maxOffset = Math.min(14, bounds.height * .035);
      const offset = Math.min(maxOffset, Math.max(-maxOffset, distance * -18));
      photo.style.transform = `translateY(${offset}px) scale(1.08)`;
    });
  }
  function requestScrollUpdate() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollMotion);
  }
  function measureScroll() {
    scrollLimit = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    roadScaleX = roadScene.clientWidth / 887;
    roadScaleY = roadScene.clientHeight / 1774;
    carPositioned = false;
    requestScrollUpdate();
  }
  window.addEventListener('scroll', requestScrollUpdate, {passive: true});
  window.addEventListener('resize', measureScroll);
  window.addEventListener('load', measureScroll);
  reducedMotion.addEventListener('change', requestScrollUpdate);
  photos.forEach(photo => photo.addEventListener('load', measureScroll));
  if ('ResizeObserver' in window) new ResizeObserver(measureScroll).observe(document.body);
  measureScroll();
}

function setupLiftAnimation(reducedMotion) {
  // Move only the car and lift arms, keeping the garage and fixed posts still.
  // The same original photograph stays fixed while only the headlight glow changes.
  const liftPhoto = document.querySelector('#lift-photo');
  const liftCanvas = document.querySelector('#lift-animation');
  const liftFigure = liftPhoto.closest('figure');
  let liftFrame = 0;
  let liftStarted = false;
  function finishLift() {
    cancelAnimationFrame(liftFrame);
    liftCanvas.hidden = true;
    liftPhoto.style.visibility = '';
    liftFigure.dataset.liftState = 'complete';
    liftFigure.dataset.headlights = 'off';
  }
  async function startLift() {
    if (liftStarted || reducedMotion.matches) return;
    liftStarted = true;
    const context = liftCanvas.getContext('2d');
    if (!context) return;
    try {
      const frames = await Promise.all(['garage', 'raised-off'].map(async name => {
        const picture = new Image();
        picture.src = `assets/lift/${name}.webp`;
        await picture.decode();
        return picture;
      }));
      if (reducedMotion.matches) { finishLift(); return; }
      const [garage, off] = frames;
      // Curved tyre contours exclude the floor between the wheels and lift arms.
      const carOutline = new Path2D('M 132 545 L 141 534 C 138 511 142 484 145 470 Q 149 458 156 450 L 156 432 Q 160 414 169 405 L 171 391 Q 177 370 192 354 Q 201 346 214 340 C 277 314 370 299 468 284 L 527 272 C 552 251 579 232 609 215 C 649 193 695 183 742 180 C 798 173 850 171 906 174 C 946 175 990 183 1020 200 C 1070 224 1114 261 1145 314 L 1150 320 Q 1179 320 1198 350 Q 1207 366 1207 388 Q 1207 423 1213 462 L 1216 487 Q 1215 521 1212 538 L 1200 542 L 1199 573 C 1192 609 1177 625 1154 624 C 1126 624 1109 604 1103 559 L 831 552 C 826 612 797 653 756 665 C 705 680 651 653 632 607 L 621 571 L 382 572 C 369 619 338 644 301 645 C 254 647 217 624 204 600 L 194 566 L 151 555 Q 140 551 132 545 Z');
      const armsOutline = new Path2D('M 465 570 L 623 570 L 622 580 L 469 579 Z M 837 562 L 893 559 L 910 548 L 1193 535 L 1222 525 L 1236 530 L 1238 583 L 1219 593 L 912 591 L 909 583 L 864 583 L 863 577 L 839 580 Z');
      const ledRings = new Path2D('M 499 360 L 505 377 L 518 383 L 538 381 L 548 359 M 590 350 L 595 369 L 602 376 L 618 376 L 626 353 M 176 383 L 175 398 L 188 398 L 199 387');
      function drawHeadlights(brightness) {
        context.save();
        context.globalAlpha = brightness;
        // All changing pixels stay within the lamps and their soft halo.
        context.beginPath();
        context.rect(155, 330, 530, 80);
        context.clip();
        for (const [x, y, radius] of [[529, 367, 42], [609, 360, 42], [185, 388, 23]]) {
          const glow = context.createRadialGradient(x, y, 1, x, y, radius);
          glow.addColorStop(0, 'rgba(255,255,255,.95)');
          glow.addColorStop(.24, 'rgba(226,242,255,.72)');
          glow.addColorStop(1, 'rgba(196,226,255,0)');
          context.fillStyle = glow;
          context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
        }
        context.lineWidth = 3;
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.strokeStyle = '#f5fbff';
        context.shadowColor = '#ceeaff';
        context.shadowBlur = 10;
        context.stroke(ledRings);
        context.restore();
      }
      const begun = performance.now();
      const flashes = [
        {end: 390, lit: true}, {end: 860, lit: false},
        {end: 1250, lit: true}, {end: 1720, lit: false},
        {end: 2110, lit: true}, {end: 2960, lit: false}
      ];
      liftPhoto.style.visibility = 'hidden';
      liftCanvas.hidden = false;
      function draw(now) {
        const elapsed = now - begun;
        if (reducedMotion.matches || elapsed >= 6260) { finishLift(); return; }
        if (elapsed < 3300) {
          const progress = Math.min(1, Math.max(0, (elapsed - 350) / 2600));
          const eased = progress * progress * (3 - 2 * progress);
          context.drawImage(garage, 0, 0);
          context.save();
          context.translate(0, 190 * (1 - eased));
          context.clip(carOutline);
          context.drawImage(off, 0, 0);
          context.restore();
          context.save();
          context.translate(0, 190 * (1 - eased));
          context.clip(armsOutline);
          context.drawImage(off, 0, 0);
          context.restore();
          // The right fixed post stays in front of the moving arm endpoint.
          context.drawImage(off, 1230, 0, 218, 1086, 1230, 0, 218, 1086);
          if (elapsed >= 2950) {
            context.save();
            context.globalAlpha = (elapsed - 2950) / 350;
            context.drawImage(off, 0, 0);
            context.restore();
          }
          liftFigure.dataset.liftState = progress === 0 ? 'ground' : progress < 1 ? 'lifting' : 'raised';
          liftFigure.dataset.headlights = 'off';
        } else {
          const flashTime = elapsed - 3300;
          const flashIndex = flashes.findIndex(flash => flashTime < flash.end);
          const flash = flashes[flashIndex];
          const lit = Boolean(flash?.lit);
          context.drawImage(off, 0, 0);
          if (lit) {
            const flashStart = flashIndex === 0 ? 0 : flashes[flashIndex - 1].end;
            const phase = (flashTime - flashStart) / (flash.end - flashStart);
            drawHeadlights(Math.sin(Math.PI * phase));
          }
          liftFigure.dataset.liftState = 'blinking';
          liftFigure.dataset.headlights = lit ? 'on' : 'off';
        }
        liftFrame = requestAnimationFrame(draw);
      }
      liftFrame = requestAnimationFrame(draw);
    } catch {
      // A missing frame must never hide the fallback photograph.
      finishLift();
    }
  }
  if ('IntersectionObserver' in window) {
    const liftObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        liftObserver.disconnect();
        startLift();
      }
    }, {threshold: .2});
    liftObserver.observe(liftPhoto);
  } else startLift();
  reducedMotion.addEventListener('change', event => { if (event.matches) finishLift(); });
  window.addEventListener('pagehide', finishLift);
}

function setupContentReveals(reducedMotion) {
  // Animate visible content once. Nothing waits in a hidden state for this observer.
  if ('IntersectionObserver' in window && typeof Element.prototype.animate === 'function') {
    const reveals = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        reveals.unobserve(entry.target);
        if (reducedMotion.matches) return;
        const element = entry.target;
        const isImage = element.tagName === 'FIGURE';
        const start = isImage ? {opacity: .65, transform: 'scale(.97)'}
          : element.tagName === 'DETAILS' ? {opacity: .5, transform: 'translateX(20px)'}
            : {opacity: .5, transform: 'translateY(24px)'};
        element.animate([start, {opacity: 1, transform: 'none'}], {
          duration: isImage ? 900 : 650,
          delay: Number(element.dataset.revealOrder || 0) * 75,
          easing: 'cubic-bezier(.22,1,.36,1)'
        });
      });
    }, {threshold: .12});
    document.querySelectorAll('section').forEach(section => {
      section.querySelectorAll('[data-reveal]').forEach((element, index) => {
        element.dataset.revealOrder = String(index % 3);
        reveals.observe(element);
      });
    });
    reducedMotion.addEventListener('change', event => {
      if (event.matches) document.getAnimations().forEach(animation => animation.cancel());
    });
  }
}

setupNavigation();
setupBooking();
setupLegalDocuments();
document.querySelector('#current-year').textContent = String(new Date().getFullYear());

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
setupScrollMotion(reducedMotion);
setupLiftAnimation(reducedMotion);
setupContentReveals(reducedMotion);
