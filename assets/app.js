(function () {
  var C = window.AG_CONFIG || {};

  // Media slots: stay blank until the file exists in /media.
  document.querySelectorAll('.slot').forEach(function (el) {
    var v = el.getAttribute('data-video'), i = el.getAttribute('data-img'), alt = el.getAttribute('data-alt') || '';
    if (v) {
      var vid = document.createElement('video');
      vid.muted = true; vid.loop = true; vid.playsInline = true; vid.autoplay = true; vid.preload = 'metadata';
      vid.setAttribute('muted', ''); vid.setAttribute('playsinline', ''); vid.setAttribute('aria-label', alt);
      vid.addEventListener('loadeddata', function () { el.appendChild(vid); el.classList.add('has'); vid.play().catch(function () {}); }, { once: true });
      vid.src = v;
    } else if (i) {
      var img = new Image(); img.alt = alt; img.loading = 'lazy'; img.decoding = 'async';
      img.onload = function () { el.appendChild(img); el.classList.add('has'); };
      img.src = i;
    }
  });

  // Meta Pixel (only if an ID is set).
  if (C.metaPixelId) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', C.metaPixelId); fbq('track', 'PageView');
  }

  var main = document.querySelector('main[data-package]');
  var form = document.getElementById('enquire');
  if (!main || !form) return;
  var pkg = JSON.parse(main.getAttribute('data-package'));
  if (window.fbq) fbq('track', 'ViewContent', { content_name: pkg.name, content_category: pkg.level });

  var nameEl = form.elements.name, emailEl = form.elements.email;
  var btn = form.querySelector('button[type=submit]'), hint = form.querySelector('.hint');
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function check() {
    var n = nameEl.value.trim(), e = emailEl.value.trim();
    var okN = n.length >= 2, okE = EMAIL.test(e);
    btn.disabled = !(okN && okE);
    hint.textContent = okN && okE ? 'WhatsApp opens with your enquiry. Tap send to reach us.'
      : (!n && !e ? 'Fill in both fields to continue.' : (!okN ? 'Add your name to continue.' : 'Add a valid email to continue.'));
    nameEl.setAttribute('aria-invalid', n && !okN ? 'true' : 'false');
    emailEl.setAttribute('aria-invalid', e && !okE ? 'true' : 'false');
    return okN && okE;
  }
  // Hide the sticky phone button while the form itself is on screen.
  var bar = document.querySelector('.mbar');
  if (bar && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { bar.classList.toggle('off', en[0].isIntersecting); }).observe(form);
  }

  nameEl.addEventListener('input', check); emailEl.addEventListener('input', check);
  check();

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (!check()) return;
    var n = nameEl.value.trim(), e = emailEl.value.trim();
    var q = new URLSearchParams(location.search);
    var msg = 'Hi AutoGlow, I am interested in ' + pkg.level + ': ' + pkg.name + ' (' + pkg.price + ').\n\nName: ' + n + '\nEmail: ' + e + '\n\nPlease share the details and availability.';
    var url = 'https://wa.me/' + String(C.whatsappNumber || '919825020746').replace(/\D/g, '') + '?text=' + encodeURIComponent(msg);

    // Save the lead even if they never tap send in WhatsApp.
    if (C.leadEndpoint) {
      var body = JSON.stringify({ name: n, email: e, package: pkg.level + ': ' + pkg.name, price: pkg.price, page: location.pathname,
        utm_source: q.get('utm_source') || '', utm_campaign: q.get('utm_campaign') || '', utm_content: q.get('utm_content') || '' });
      try {
        if (navigator.sendBeacon) navigator.sendBeacon(C.leadEndpoint, new Blob([body], { type: 'application/json' }));
        else fetch(C.leadEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body, keepalive: true });
      } catch (x) {}
    }
    if (window.fbq) fbq('track', 'Lead', { content_name: pkg.name, content_category: pkg.level });

    // Same tab works best inside the Instagram and Facebook in-app browsers.
    setTimeout(function () { window.location.href = url; }, 150);
  });
})();
