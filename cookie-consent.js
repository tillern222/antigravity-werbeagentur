(function () {
  var STORAGE_KEY = 'ag_cookie_consent';
  var VERSION = '1';

  function getConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (data.version !== VERSION) return null;
      return data.choice;
    } catch (e) { return null; }
  }

  function saveConsent(choice) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        choice: choice,
        version: VERSION,
        timestamp: new Date().toISOString()
      }));
    } catch (e) {}
  }

  function loadGoogleFonts() {
    if (document.querySelector('link[href*="fonts.googleapis.com"]')) return;
    var head = document.head;

    var pc1 = document.createElement('link');
    pc1.rel = 'preconnect'; pc1.href = 'https://fonts.googleapis.com';
    head.appendChild(pc1);

    var pc2 = document.createElement('link');
    pc2.rel = 'preconnect'; pc2.href = 'https://fonts.gstatic.com';
    pc2.crossOrigin = 'anonymous';
    head.appendChild(pc2);

    var fonts = document.createElement('link');
    fonts.rel = 'stylesheet';
    fonts.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
    head.appendChild(fonts);

    var icons = document.createElement('link');
    icons.rel = 'stylesheet';
    icons.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap';
    head.appendChild(icons);
  }

  function hideBanner() {
    var el = document.getElementById('ag-cookie-banner');
    if (!el) return;
    el.style.transform = 'translateX(-50%) translateY(150%)';
    el.style.opacity = '0';
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 400);
  }

  function onAcceptAll() {
    saveConsent('all');
    loadGoogleFonts();
    hideBanner();
  }

  function onNecessaryOnly() {
    saveConsent('necessary');
    hideBanner();
  }

  function showBanner() {
    if (document.getElementById('ag-cookie-banner')) return;

    var banner = document.createElement('div');
    banner.id = 'ag-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'true');
    banner.setAttribute('aria-label', 'Cookie-Einstellungen');
    banner.style.cssText = [
      'position:fixed',
      'bottom:1.5rem',
      'left:50%',
      'transform:translateX(-50%)',
      'width:calc(100% - 2rem)',
      'max-width:62rem',
      'background:rgba(253,250,228,0.97)',
      'backdrop-filter:blur(24px)',
      '-webkit-backdrop-filter:blur(24px)',
      'border:1px solid rgba(28,28,15,0.08)',
      'border-radius:1.5rem',
      'padding:1.5rem 2rem',
      'box-shadow:0 8px 48px rgba(28,28,15,0.14)',
      'z-index:9999',
      'transition:transform .4s ease,opacity .4s ease',
      'font-family:"Plus Jakarta Sans",system-ui,-apple-system,sans-serif'
    ].join(';');

    banner.innerHTML = [
      '<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1.25rem">',
        '<div style="flex:1;min-width:260px">',
          '<p style="font-weight:700;color:#1c1c0f;font-size:0.95rem;margin:0 0 .4rem">',
            '🍪&nbsp; Diese Website verwendet Cookies',
          '</p>',
          '<p style="color:#484831;font-size:0.83rem;line-height:1.65;margin:0">',
            'Wir laden Schriften über <strong>Google Fonts</strong> (Google LLC, USA). ',
            'Dabei wird Ihre IP-Adresse an Google übermittelt. ',
            'Klicken Sie auf <em>„Alle akzeptieren"</em>, um dem zuzustimmen (Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;a DSGVO). ',
            'Bei <em>„Nur Notwendige"</em> werden keine Google-Dienste geladen. ',
            'Details in unserer <a href="datenschutz.html" style="color:#626200;text-decoration:underline;font-weight:600">Datenschutzerklärung</a>.',
          '</p>',
        '</div>',
        '<div style="display:flex;gap:.75rem;flex-wrap:wrap;align-items:center">',
          '<button id="ag-btn-necessary" style="',
            'padding:.6rem 1.5rem;border-radius:9999px;',
            'border:1.5px solid rgba(28,28,15,0.18);background:transparent;',
            'color:#484831;font-weight:600;font-size:.875rem;cursor:pointer;',
            'font-family:inherit;transition:background .15s,border-color .15s',
          '">Nur Notwendige</button>',
          '<button id="ag-btn-accept" style="',
            'padding:.6rem 1.5rem;border-radius:9999px;',
            'border:1.5px solid transparent;background:#ffff00;',
            'color:#1d1d00;font-weight:700;font-size:.875rem;cursor:pointer;',
            'font-family:inherit;transition:box-shadow .15s,transform .15s',
          '">Alle akzeptieren</button>',
        '</div>',
      '</div>'
    ].join('');

    document.body.appendChild(banner);

    var btnAccept = document.getElementById('ag-btn-accept');
    var btnNecessary = document.getElementById('ag-btn-necessary');

    btnAccept.addEventListener('mouseover', function () {
      this.style.boxShadow = '0 4px 18px rgba(98,98,0,0.28)';
      this.style.transform = 'scale(1.03)';
    });
    btnAccept.addEventListener('mouseout', function () {
      this.style.boxShadow = 'none';
      this.style.transform = 'scale(1)';
    });
    btnNecessary.addEventListener('mouseover', function () {
      this.style.background = 'rgba(28,28,15,0.05)';
    });
    btnNecessary.addEventListener('mouseout', function () {
      this.style.background = 'transparent';
    });

    btnAccept.addEventListener('click', onAcceptAll);
    btnNecessary.addEventListener('click', onNecessaryOnly);
  }

  // ── Init ──────────────────────────────────────────────
  var consent = getConsent();
  if (consent === 'all') {
    loadGoogleFonts();
  } else if (consent === null) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }
  // consent === 'necessary' → nothing loaded, banner stays hidden
})();
