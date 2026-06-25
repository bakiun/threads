(() => {
  'use strict';

  const allowedHosts = ['www.threads.com', 'threads.com'];
  if (!allowedHosts.includes(location.hostname)) {
    console.error('Please run this script on threads.com!');
    alert('Open https://www.threads.com first, then paste this script again.');
    return;
  }

  const APP_ID = 'tu-app';
  const STYLE_ID = 'tu-style';
  const STORAGE_KEY = 'tu_state_v1';

  const DEV = false;
  function log(...args) {
    if (DEV) {
      console.log('[DEV]', ...args);
    }
  }

  const DEFAULT_TIMINGS = {
    scanDelayMin: 700,
    scanDelayMax: 1500,
    scanPauseEveryPages: 5,
    scanPauseMs: 8000,
  };

  const PANEL_WIDTH = 380;
  const PANEL_MARGIN = 18;
  const MAX_RETRIES = 3;

  const I18N = {
    en: {
      title: 'Threads Unfollower',
      subtitle: "See who doesn't follow you back",
      welcomeTitle: 'Ready when you are',
      welcomeBody:
        "We'll scan only the people you follow and use Threads' follow-back status to keep the scan fast. Nothing is changed on your account during the scan.",
      scanBtn: 'Scan now',
      scanning: 'Scanning',
      loadingFollowing: 'Loading the people you follow',
      completed: 'Completed',
      paused: 'Paused',
      pause: 'Pause',
      resume: 'Resume',
      cancel: 'Cancel',
      stop: 'Stop',
      ofTotal: '{current} of {total}',
      ofUnknown: '{current} so far',
      scanCompletedToast: '{count} non-followers found',
      scanFailed: 'Scan failed',
      retry: 'Try again',
      goBack: 'Back to results',
      search: 'Search by name or username',
      filterVerified: 'Verified',
      filterPrivate: 'Private',
      filterShowHidden: 'Hidden users',
      foundCount: '{count} non-followers',
      foundOne: '1 non-follower',
      foundNone: 'Nice — everyone you follow follows you back.',
      noMatches: 'No users match your filters.',
      hide: 'Hide',
      unhide: 'Unhide',
      hideTooltip: 'Hide from this list',
      unhideTooltip: 'Show again',
      openProfile: 'Open profile',
      copy: 'Copy',
      copiedToast: 'Copied {count} usernames',
      settings: 'Settings',
      settingsTitle: 'Timing settings',
      settingsBody:
        'Lower delays make Threads more likely to throttle or block your account. Keep these conservative.',
      minScanDelay: 'Min scan delay (ms)',
      maxScanDelay: 'Max scan delay (ms)',
      scanPauseEvery: 'Long pause every N pages',
      scanPauseLength: 'Long pause length (ms)',
      restoreDefaults: 'Restore defaults',
      save: 'Save',
      saved: 'Settings saved',
      cookieMissing: 'Could not read your login cookie. Make sure you are signed in.',
      csrfMissing: 'Could not read csrftoken cookie.',
      requestFailed: 'Request failed: {status}',
      tooManyRequests: 'Threads is rate-limiting requests. Try again later or increase delays in settings.',
      scanPause: 'Cooldown — {seconds}s',
      cooldownIn: 'Retry — {seconds}s',
      nextActionIn: 'Next action — {seconds}s',
      close: 'Close',
      minimize: 'Minimize',
      expand: 'Expand',
      langCode: 'TR',
      pillScanning: 'Scanning {current}/{total}',
      pillResults: '{count} non-followers',
      pillIdle: 'Open',
    },
    tr: {
      title: 'Threads Takip Etmeyenler',
      subtitle: 'Seni geri takip etmeyenleri gör',
      welcomeTitle: 'Hazır olduğunda başlat',
      welcomeBody:
        "Sadece takip ettiklerin taranır ve Threads'in geri takip durumuyla hızlıca kontrol edilir. Tarama sırasında hesabında hiçbir şey değişmez.",
      scanBtn: 'Taramayı başlat',
      scanning: 'Taranıyor',
      loadingFollowing: 'Takip ettiklerin yükleniyor',
      completed: 'Tamamlandı',
      paused: 'Duraklatıldı',
      pause: 'Duraklat',
      resume: 'Devam et',
      cancel: 'İptal',
      stop: 'Durdur',
      ofTotal: '{current} / {total}',
      ofUnknown: 'Şu ana kadar {current}',
      scanCompletedToast: '{count} takip etmeyen bulundu',
      scanFailed: 'Tarama başarısız',
      retry: 'Tekrar dene',
      goBack: 'Sonuçlara dön',
      search: 'İsim veya kullanıcı adı ara',
      filterVerified: 'Onaylı',
      filterPrivate: 'Gizli',
      filterShowHidden: 'Gizlenen kullanıcılar',
      foundCount: '{count} takip etmeyen',
      foundOne: '1 takip etmeyen',
      foundNone: 'Harika — takip ettiğin herkes seni takip ediyor.',
      noMatches: 'Filtrelerinle eşleşen kullanıcı yok.',
      hide: 'Gizle',
      unhide: 'Göster',
      hideTooltip: 'Bu listeden gizle',
      unhideTooltip: 'Tekrar göster',
      openProfile: 'Profili aç',
      copy: 'Kopyala',
      copiedToast: '{count} kullanıcı adı kopyalandı',
      settings: 'Ayarlar',
      settingsTitle: 'Hız ayarları',
      settingsBody: "Düşük gecikmeler Threads'in hesabını kısıtlamasına neden olabilir. Yavaş tut.",
      minScanDelay: 'Min tarama gecikmesi (ms)',
      maxScanDelay: 'Maks tarama gecikmesi (ms)',
      scanPauseEvery: 'Her N sayfada uzun mola',
      scanPauseLength: 'Uzun mola süresi (ms)',
      restoreDefaults: 'Varsayılana dön',
      save: 'Kaydet',
      saved: 'Ayarlar kaydedildi',
      cookieMissing: 'Giriş çerezi okunamadı. Giriş yaptığından emin ol.',
      csrfMissing: 'csrftoken çerezi okunamadı.',
      requestFailed: 'İstek başarısız: {status}',
      tooManyRequests: 'Threads istekleri kısıtlayabilir. Sonra dene veya ayarlardan gecikmeleri artır.',
      scanPause: 'Mola — {seconds} sn',
      cooldownIn: 'Yeniden deneme — {seconds} sn',
      nextActionIn: 'Sonraki işlem — {seconds} sn',
      close: 'Kapat',
      minimize: 'Küçült',
      expand: 'Aç',
      langCode: 'EN',
      pillScanning: 'Taranıyor {current}/{total}',
      pillResults: '{count} takip etmeyen',
      pillIdle: 'Aç',
    },
  };

  const SVG = {
    minimize:
      '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="3" y="7.25" width="10" height="1.5" rx="0.75" fill="currentColor"/></svg>',
    close:
      '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    gear: '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm6.7 2.5a6.7 6.7 0 0 0-.1-1.1l1.4-1.1-1.5-2.6-1.7.7a6.6 6.6 0 0 0-1.9-1.1L10.5 1h-3l-.4 1.8a6.6 6.6 0 0 0-1.9 1.1l-1.7-.7L1.9 5.8 3.3 6.9a6.7 6.7 0 0 0 0 2.2L1.9 10.2l1.5 2.6 1.7-.7a6.6 6.6 0 0 0 1.9 1.1L7.5 15h3l.4-1.8a6.6 6.6 0 0 0 1.9-1.1l1.7.7 1.5-2.6-1.4-1.1c.1-.4.1-.7.1-1.1z"/></svg>',
    open: '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3.5" y1="12.5" x2="12.5" y2="3.5"/><polyline points="7.5 3.5 12.5 3.5 12.5 8.5"/></svg>',
    sparkle:
      '<svg viewBox="0 0 24 24" width="36" height="36" aria-hidden="true"><path fill="currentColor" d="M12 2l1.8 5.4L19 9l-5.2 1.6L12 16l-1.8-5.4L5 9l5.2-1.6L12 2zm6 11l1 2.8L22 17l-3 .8L18 21l-1-3.2L14 17l3-1.2 1-2.8z"/></svg>',
    alert:
      '<svg viewBox="0 0 24 24" width="36" height="36" aria-hidden="true"><path fill="currentColor" d="M12 2 1 21h22L12 2zm0 6 7.5 13h-15L12 8zm-1 4v4h2v-4h-2zm0 5v2h2v-2h-2z"/></svg>',
    check:
      '<svg viewBox="0 0 16 16" width="36" height="36" aria-hidden="true"><path fill="currentColor" d="M14 4.5L6 12.5l-4-4L3 7.5l3 3 7-7z"/></svg>',
  };

  const persisted = loadStored();

  const state = {
    mode: 'idle', // 'idle', 'scanning', 'scanDone', 'results'
    scanPaused: false,
    scanCancelled: false,
    progress: { current: 0, total: 0, label: 'scanning', note: '' },
    waitUntil: 0,
    waitReason: '',
    users: [],
    hidden: new Set(persisted.hidden || []),
    search: '',
    filters: persisted.filters || {
      verified: true,
      showHidden: false,
    },
    timings: { ...DEFAULT_TIMINGS, ...(persisted.timings || {}) },
    panelPos: persisted.panelPos || null,
    minimized: Boolean(persisted.minimized),
    language: persisted.language === 'tr' ? 'tr' : 'en',
    error: '',
  };

  let countdownTimer = null;
  let toastTimer = null;

  function loadStored() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function persist() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          hidden: [...state.hidden],
          timings: state.timings,
          filters: state.filters,
          panelPos: state.panelPos,
          minimized: state.minimized,
          language: state.language,
        })
      );
    } catch {}
  }

  function t(key, vars) {
    const dict = I18N[state.language] || I18N.en;
    const template = dict[key] ?? I18N.en[key] ?? key;
    if (!vars) return template;
    return template.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? '');
  }

  function cleanupExisting() {
    if (typeof window.__tuCleanup === 'function') {
      try {
        window.__tuCleanup();
      } catch {}
    }
    document.getElementById(APP_ID)?.remove();
    document.getElementById(STYLE_ID)?.remove();
  }

  function injectStyles() {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function mount() {
    const root = document.createElement('div');
    root.id = APP_ID;
    document.body.appendChild(root);
    window.__tuCleanup = unmount;
    renderShell();
  }

  function unmount() {
    stopCountdown();
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }
    document.getElementById(APP_ID)?.remove();
    document.getElementById(STYLE_ID)?.remove();
    if (window.__tuCleanup === unmount) window.__tuCleanup = null;
  }

  function renderShell() {
    const root = document.getElementById(APP_ID);
    if (!root) return;
    if (state.minimized) {
      root.innerHTML = `
        <button class="iu-pill" data-action="expand" type="button" aria-label="${escapeAttr(t('expand'))}">
          <span class="iu-pill-dot ${pillStateClass()}"></span>
          <span data-pill-label>${escapeHTML(pillLabel())}</span>
        </button>
      `;
      root.querySelector("[data-action='expand']")?.addEventListener('click', () => setMinimized(false));
      applyPanelPosition();
      return;
    }
    root.innerHTML = `
      <section class="iu-panel" role="dialog" aria-label="${escapeAttr(t('title'))}">
        <header class="iu-header" data-drag>
          <div class="iu-brand">
            <span class="iu-brand-dot"></span>
            <div class="iu-brand-text">
              <strong>${escapeHTML(t('title'))}</strong>
              <span data-subtitle>${escapeHTML(t('subtitle'))}</span>
            </div>
          </div>
          <div class="iu-header-actions">
            <button type="button" data-action="settings" aria-label="${escapeAttr(t('settings'))}" title="${escapeAttr(t('settings'))}">${SVG.gear}</button>
            <button type="button" data-action="language" aria-label="${escapeAttr(t('langCode'))}" title="${escapeAttr(t('langCode'))}"><span data-lang>${escapeHTML(t('langCode'))}</span></button>
            <button type="button" data-action="minimize" aria-label="${escapeAttr(t('minimize'))}" title="${escapeAttr(t('minimize'))}">${SVG.minimize}</button>
            <button type="button" data-action="close" aria-label="${escapeAttr(t('close'))}" title="${escapeAttr(t('close'))}">${SVG.close}</button>
          </div>
        </header>
        <div class="iu-body" data-body></div>
      </section>
    `;
    bindHeader(root);
    bindDrag(root.querySelector('[data-drag]'));
    applyPanelPosition();
    renderBody();
  }

  function bindHeader(root) {
    root.querySelector("[data-action='close']")?.addEventListener('click', () => unmount());
    root.querySelector("[data-action='minimize']")?.addEventListener('click', () => setMinimized(true));
    root.querySelector("[data-action='settings']")?.addEventListener('click', showSettings);
    root.querySelector("[data-action='language']")?.addEventListener('click', toggleLanguage);
  }

  function applyPanelPosition() {
    const root = document.getElementById(APP_ID);
    if (!root) return;
    const node = root.querySelector('.iu-panel') || root.querySelector('.iu-pill');
    if (!node) return;
    const pos = state.panelPos;
    if (pos && Number.isFinite(pos.x) && Number.isFinite(pos.y)) {
      const max = panelBounds(node);
      node.style.left = clamp(pos.x, 0, max.x) + 'px';
      node.style.top = clamp(pos.y, 0, max.y) + 'px';
      node.style.right = 'auto';
      node.style.bottom = 'auto';
    } else {
      node.style.left = 'auto';
      node.style.top = 'auto';
      node.style.right = PANEL_MARGIN + 'px';
      node.style.bottom = PANEL_MARGIN + 'px';
    }
  }

  function panelBounds(node) {
    const rect = node.getBoundingClientRect();
    return {
      x: Math.max(0, window.innerWidth - rect.width),
      y: Math.max(0, window.innerHeight - rect.height),
    };
  }

  function bindDrag(handle) {
    if (!handle) return;
    const panel = handle.closest('.iu-panel');
    if (!panel) return;
    let startX = 0;
    let startY = 0;
    let originX = 0;
    let originY = 0;
    let dragging = false;

    handle.addEventListener('pointerdown', event => {
      if (event.target.closest('button')) return;
      dragging = true;
      const rect = panel.getBoundingClientRect();
      originX = rect.left;
      originY = rect.top;
      startX = event.clientX;
      startY = event.clientY;
      panel.style.left = originX + 'px';
      panel.style.top = originY + 'px';
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
      handle.setPointerCapture(event.pointerId);
      handle.classList.add('iu-dragging');
    });

    handle.addEventListener('pointermove', event => {
      if (!dragging) return;
      const max = panelBounds(panel);
      const x = clamp(originX + (event.clientX - startX), 0, max.x);
      const y = clamp(originY + (event.clientY - startY), 0, max.y);
      panel.style.left = x + 'px';
      panel.style.top = y + 'px';
    });

    const stop = event => {
      if (!dragging) return;
      dragging = false;
      handle.releasePointerCapture?.(event.pointerId);
      handle.classList.remove('iu-dragging');
      const rect = panel.getBoundingClientRect();
      state.panelPos = { x: rect.left, y: rect.top };
      persist();
    };
    handle.addEventListener('pointerup', stop);
    handle.addEventListener('pointercancel', stop);
  }

  function setMinimized(value) {
    state.minimized = Boolean(value);
    persist();
    renderShell();
  }

  function pillLabel() {
    if (state.mode === 'scanning') {
      return t('pillScanning', {
        current: state.progress.current,
        total: state.progress.total || '?',
      });
    }
    if ((state.mode === 'results' || state.mode === 'scanDone') && state.users.length) {
      return t('pillResults', {
        count: state.users.filter(u => !u.follows_viewer && !state.hidden.has(u.id)).length,
      });
    }
    return t('pillIdle');
  }

  function pillStateClass() {
    if (state.mode === 'scanning') return 'iu-pill-dot--active';
    if (state.error) return 'iu-pill-dot--error';
    return '';
  }

  function renderBody() {
    const body = document.querySelector(`#${APP_ID} [data-body]`);
    if (!body) return;
    if (state.mode === 'idle') {
      body.innerHTML = renderIdleView();
      bindIdle(body);
    } else {
      body.innerHTML = renderResultsView();
      bindResults(body);
    }
    if (state.mode === 'scanning') startCountdown();
    else stopCountdown();
  }

  function renderIdleView() {
    if (state.error) {
      return `
        <div class="iu-welcome">
          <div class="iu-welcome-icon iu-welcome-icon--error">${SVG.alert}</div>
          <h2>${escapeHTML(t('scanFailed'))}</h2>
          <p>${escapeHTML(state.error)}</p>
          <button type="button" class="iu-btn iu-btn--primary" data-action="scan">${escapeHTML(t('retry'))}</button>
        </div>
      `;
    }
    return `
      <div class="iu-welcome">
        <div class="iu-welcome-icon">${SVG.sparkle}</div>
        <h2>${escapeHTML(t('welcomeTitle'))}</h2>
        <p>${escapeHTML(t('welcomeBody'))}</p>
        <button type="button" class="iu-btn iu-btn--primary iu-btn--lg" data-action="scan">${escapeHTML(t('scanBtn'))}</button>
      </div>
    `;
  }

  function bindIdle(body) {
    body.querySelector("[data-action='scan']")?.addEventListener('click', startScan);
  }

  function renderResultsView() {
    const display = getDisplayUsers();
    const totalNonFollowers = state.users.filter(u => !u.follows_viewer && !state.hidden.has(u.id)).length;
    let summary;
    if (state.mode === 'scanning') {
      summary = t('scanning');
    } else {
      if (totalNonFollowers === 0) summary = t('foundNone');
      else if (totalNonFollowers === 1) summary = t('foundOne');
      else summary = t('foundCount', { count: totalNonFollowers });
    }

    let bottomBarHTML = '';
    if (state.mode === 'scanning') {
      const { current, total, label, note } = state.progress;
      const counter = total ? t('ofTotal', { current, total }) : t('ofUnknown', { current });
      bottomBarHTML = `
        <div class="iu-progress-bar-container">
          <div class="iu-progress-head">
            <h2 data-progress-label>${escapeHTML(state.scanPaused ? t('paused') : t(label))}</h2>
            <p data-progress-note>${escapeHTML(note)}</p>
          </div>
          <div class="iu-progress-meta">
            <span data-progress-counter>${escapeHTML(counter)}</span>
            <span data-countdown></span>
          </div>
          <div class="iu-progress-actions">
            <button type="button" class="iu-btn iu-btn--small" data-action="pause-scan">${escapeHTML(t(state.scanPaused ? 'resume' : 'pause'))}</button>
            <button type="button" class="iu-btn iu-btn--ghost iu-btn--small" data-action="cancel-scan">${escapeHTML(t('stop'))}</button>
          </div>
        </div>
      `;
    } else if (state.mode === 'scanDone') {
      bottomBarHTML = `
        <div class="iu-progress-bar-container">
          <div class="iu-progress-head">
            <h2 class="iu-text-success">${escapeHTML(t('scanCompletedToast', { count: totalNonFollowers }))}</h2>
            <p class="iu-text-success">${escapeHTML(t('completed'))}</p>
          </div>
          <div class="iu-progress-actions">
            <button type="button" class="iu-btn iu-btn--primary iu-btn--small" data-action="dismiss-status">${escapeHTML(t('goBack'))}</button>
          </div>
        </div>
      `;
    } else {
      bottomBarHTML = `
        <div class="iu-actionbar">
          <div class="iu-actionbar-right">
            <button type="button" class="iu-btn iu-btn--small" data-action="copy" ${display.length ? '' : 'disabled'}>${escapeHTML(t('copy'))}</button>
          </div>
        </div>
      `;
    }

    return `
      <div class="iu-results">
        <div class="iu-results-summary">${escapeHTML(summary)}</div>
        <div class="iu-search-row">
          <input
            class="iu-search"
            type="search"
            data-search
            placeholder="${escapeAttr(t('search'))}"
            value="${escapeAttr(state.search)}"
            autocomplete="off"
            spellcheck="false"
          >
        </div>
        <div class="iu-filters">
          ${filterChip('verified', t('filterVerified'))}
          ${filterChip('showHidden', t('filterShowHidden'))}
        </div>
        <div class="iu-list" data-list>${renderUserList(display)}</div>
        <div class="iu-bottom-bar-wrapper">${bottomBarHTML}</div>
      </div>
    `;
  }

  function filterChip(key, label) {
    const active = state.filters[key];
    return `
      <button type="button" class="iu-chip ${active ? 'iu-chip--on' : ''}" data-filter="${escapeAttr(key)}" aria-pressed="${active ? 'true' : 'false'}">
        <span class="iu-chip-tick">${active ? SVG.check : ''}</span>
        ${escapeHTML(label)}
      </button>
    `;
  }

  function renderUserList(display) {
    if (!display.length) {
      if (state.mode === 'scanning') {
        return `<div class="iu-list-empty">${escapeHTML(t('loadingFollowing'))}...</div>`;
      }
      return `<div class="iu-list-empty">${escapeHTML(t('noMatches'))}</div>`;
    }
    return display.map(renderUserRow).join('');
  }

  function renderUserRow(user) {
    const hidden = state.hidden.has(user.id);
    const tags = [];
    if (user.is_verified) {
      tags.push(`<span class="iu-tag iu-tag--blue">${escapeHTML(t('filterVerified'))}</span>`);
    }
    if (user.is_private) {
      tags.push(`<span class="iu-tag">${escapeHTML(t('filterPrivate'))}</span>`);
    }
    return `
      <div class="iu-row ${hidden ? 'iu-row--hidden' : ''}" data-row="${escapeAttr(user.id)}">
        <img class="iu-avatar" src="${escapeAttr(user.profile_pic_url || '')}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">
        <div class="iu-row-text">
          <div class="iu-row-name">
            <a href="https://www.threads.com/@${encodeURIComponent(user.username)}" target="_blank" rel="noopener noreferrer" data-stop>@${escapeHTML(user.username)}</a>
            ${tags.join(' ')}
          </div>
          <div class="iu-row-sub">${escapeHTML(user.full_name || '')}</div>
        </div>
        <div class="iu-row-actions">
          <a class="iu-icon-btn" href="https://www.threads.com/@${encodeURIComponent(user.username)}" target="_blank" rel="noopener noreferrer" data-stop title="${escapeAttr(t('openProfile'))}" aria-label="${escapeAttr(t('openProfile'))}">${SVG.open}</a>
          <button type="button" class="iu-icon-btn iu-text-btn" data-hide="${escapeAttr(user.id)}" data-stop title="${escapeAttr(hidden ? t('unhideTooltip') : t('hideTooltip'))}">${escapeHTML(hidden ? t('unhide') : t('hide'))}</button>
        </div>
      </div>
    `;
  }

  function bindResults(body) {
    const search = body.querySelector('[data-search]');
    if (search) {
      search.addEventListener('input', event => {
        state.search = event.target.value;
        const list = body.querySelector('[data-list]');
        if (list) list.innerHTML = renderUserList(getDisplayUsers());
      });
    }

    body.querySelectorAll('[data-filter]').forEach(el => {
      el.addEventListener('click', () => {
        const key = el.getAttribute('data-filter');
        state.filters[key] = !state.filters[key];
        persist();
        renderBody();
      });
    });

    body.addEventListener('click', event => {
      const hideBtn = event.target.closest('[data-hide]');
      if (hideBtn) {
        event.preventDefault();
        event.stopPropagation();
        const id = hideBtn.getAttribute('data-hide');
        if (state.hidden.has(id)) {
          state.hidden.delete(id);
        } else {
          state.hidden.add(id);
        }
        persist();
        renderBody();
        return;
      }
      if (event.target.closest('[data-stop]')) {
        event.stopPropagation();
        return;
      }
    });

    body.querySelector("[data-action='copy']")?.addEventListener('click', copyUsernames);

    body.querySelector("[data-action='pause-scan']")?.addEventListener('click', () => {
      state.scanPaused = !state.scanPaused;
      renderBody();
    });

    body.querySelector("[data-action='cancel-scan']")?.addEventListener('click', () => {
      state.scanCancelled = true;
      state.scanPaused = false;
      renderBody();
    });

    body.querySelector("[data-action='dismiss-status']")?.addEventListener('click', () => {
      state.mode = 'results';
      state.scanCancelled = false;
      renderBody();
    });
  }

  async function startScan() {
    state.error = '';
    state.mode = 'scanning';
    state.scanPaused = false;
    state.scanCancelled = false;
    state.users = [];
    state.progress = {
      current: 0,
      total: 0,
      label: 'loadingFollowing',
      note: '',
    };
    renderBody();

    try {
      const viewerId = getCookie('ds_user_id');
      if (!viewerId) throw new Error(t('cookieMissing'));
      const csrf = getCookie('csrftoken');
      if (!csrf) throw new Error(t('csrfMissing'));

      const username = getLoggedInUsername();
      log('Found logged in username:', username);
      const totalFollowing = await getFollowingCount(username, viewerId);
      log('Found total following count:', totalFollowing);

      state.progress.total = totalFollowing;
      updateProgressDOM();

      const onPage = (results, totalGuess) => {
        state.progress = {
          current: results.length,
          total: totalGuess || totalFollowing || 0,
          label: 'loadingFollowing',
          note: '',
        };
        updateProgressDOM();
      };

      const following = await fetchFollowingWithBackStatus(viewerId, onPage, totalFollowing);
      if (state.scanCancelled) {
        state.users = following;
        state.mode = 'results';
        state.scanCancelled = false;
        renderBody();
        return;
      }
      state.users = following;

      state.mode = 'scanDone';
      const nonFollowers = state.users.filter(u => !u.follows_viewer && !state.hidden.has(u.id)).length;
      toast(t('scanCompletedToast', { count: nonFollowers }));
      renderBody();

      setTimeout(() => {
        if (state.mode === 'scanDone') {
          state.mode = 'results';
          state.scanCancelled = false;
          renderBody();
        }
      }, 2000);
    } catch (error) {
      console.error('[tu] scan failed:', error);
      state.error = error?.message || String(error) || t('scanFailed');
      state.mode = 'idle';
      renderBody();
    }
  }

  async function fetchFollowingWithBackStatus(viewerId, onPage, initialTotal = 0) {
    const results = [];
    let cursor = '';
    let page = 0;
    let totalGuess = initialTotal;

    const csrf = getCookie('csrftoken');
    if (!csrf) {
      log('Error: csrftoken cookie is missing!');
      throw new Error(t('csrfMissing'));
    }
    const lsdToken = getLSDToken();
    const fbDtsg = getFbDtsg();
    const viewerFbid = getFbid(viewerId);

    log('Starting fetch following process with settings:', {
      viewerId,
      csrf: csrf ? 'exists (length: ' + csrf.length + ')' : 'missing',
      lsdToken: lsdToken ? 'exists (length: ' + lsdToken.length + ')' : 'missing',
      fbDtsg: fbDtsg ? 'exists (length: ' + fbDtsg.length + ')' : 'missing',
      viewerFbid,
    });

    while (true) {
      await waitWhile(() => state.scanPaused && !state.scanCancelled);
      if (state.scanCancelled) {
        log('Scan was cancelled by user.');
        return results;
      }

      const isFirst = page === 0;
      const docId = isFirst ? '27111011515218333' : '27033450226310257';
      const friendlyName = isFirst ? 'BarcelonaFriendshipsFollowingTabQuery' : 'BarcelonaFriendshipsFollowingTabRefetchableQuery';

      const variables = isFirst
        ? {
            first: 20,
            userID: viewerId,
            __relay_internal__pv__BarcelonaIsInternalUserrelayprovider: false,
            __relay_internal__pv__BarcelonaIsLoggedInrelayprovider: true,
            __relay_internal__pv__BarcelonaIsCrawlerrelayprovider: false,
            __relay_internal__pv__BarcelonaShouldShowFediverseListsrelayprovider: true,
          }
        : {
            after: cursor,
            first: 10,
            id: viewerId,
            __relay_internal__pv__BarcelonaIsInternalUserrelayprovider: false,
            __relay_internal__pv__BarcelonaIsLoggedInrelayprovider: true,
            __relay_internal__pv__BarcelonaIsCrawlerrelayprovider: false,
          };

      const headers = {
        accept: '*/*',
        'content-type': 'application/x-www-form-urlencoded',
        'x-asbd-id': '359341',
        'x-csrftoken': csrf,
        'x-fb-friendly-name': friendlyName,
        'x-fb-lsd': lsdToken || '',
        'x-ig-app-id': '238260118697367',
        'x-root-field-name': 'fetch__XDTUserDict',
        'x-requested-with': 'XMLHttpRequest',
      };

      const bodyParams = new URLSearchParams();
      bodyParams.append('lsd', lsdToken || '');
      if (fbDtsg) bodyParams.append('fb_dtsg', fbDtsg);
      bodyParams.append('av', viewerFbid);
      bodyParams.append('__user', '0');
      bodyParams.append('__a', '1');
      bodyParams.append('fb_api_caller_class', 'RelayModern');
      bodyParams.append('fb_api_req_friendly_name', friendlyName);
      bodyParams.append('variables', JSON.stringify(variables));
      bodyParams.append('doc_id', docId);

      log(`Preparing request for page ${page}:`, {
        friendlyName,
        docId,
        variables,
        headers,
        bodyString: bodyParams.toString(),
      });

      let response;
      let attempt = 0;
      while (true) {
        try {
          log(`Sending fetch request (page: ${page}, attempt: ${attempt})...`);
          response = await fetch(location.origin + '/graphql/query', {
            method: 'POST',
            credentials: 'include',
            headers: headers,
            body: bodyParams.toString(),
          });
          log(`Response received (page: ${page}): status = ${response.status}`);
          if (response.ok) break;

          log(`Response not ok: status = ${response.status}`);
          if (response.status === 429 || (response.status >= 500 && response.status < 600)) {
            if (attempt >= MAX_RETRIES) {
              if (response.status === 429) {
                log('Rate limit reached. Maximum retries exhausted.');
                throw new Error(t('tooManyRequests'));
              }
              throw new Error(t('requestFailed', { status: response.status }));
            }
            const retryAfter = parseRetryAfter(response.headers.get('retry-after'));
            const wait = retryAfter || Math.min(60000, 5000 * Math.pow(2, attempt));
            log(`Retrying after cooldown of ${wait}ms...`);
            await sleepWithCountdown(wait, 'cooldownIn');
            attempt += 1;
            continue;
          }
          throw new Error(t('requestFailed', { status: response.status }));
        } catch (e) {
          log(`Fetch exception on page ${page}, attempt ${attempt}:`, e);
          if (attempt >= MAX_RETRIES) throw e;
          attempt += 1;
          await sleep(2000);
        }
      }

      log(`Parsing response for page ${page}...`);
      const json = await parseResponse(response);
      const userObj = json.data?.fetch__XDTUserDict || json.data?.user || json.data?.node;
      const edge = userObj?.following;
      if (!edge?.edges) {
        log('Error: parsed response does not contain following edges structure!', {
          json,
          userObj,
        });
        throw new Error(t('scanFailed'));
      }

      const users = edge.edges.map(item => normalizeUser(item.node)).filter(u => u.id && u.username);

      log(`Successfully processed page ${page}. Users in this page: ${users.length}`);
      results.push(...users);
      state.users = dedupe(results);

      onPage(state.users, totalGuess);

      cursor = edge.page_info?.end_cursor || '';
      page += 1;

      log(`Page ${page - 1} summary:`, {
        cursor,
        hasNextPage: edge.page_info?.has_next_page,
        totalLoadedSoFar: state.users.length,
      });

      if (!edge.page_info?.has_next_page || !cursor) {
        log('No more pages left. Fetch loop complete.');
        break;
      }

      const nextDelay = randomBetween(state.timings.scanDelayMin, state.timings.scanDelayMax);
      log(`Waiting ${nextDelay}ms before next page query...`);
      await sleepWithCountdown(nextDelay, 'nextActionIn');

      if (state.timings.scanPauseEveryPages > 0 && page % state.timings.scanPauseEveryPages === 0) {
        log(`Triggering scheduled cooldown scan pause of ${state.timings.scanPauseMs}ms...`);
        await sleepWithCountdown(state.timings.scanPauseMs, 'scanPause');
      }
    }
    log(`Fetch complete. Total unfollowers / followers found: ${results.length}, deduped: ${state.users.length}`);
    return dedupe(results);
  }

  function parseRetryAfter(value) {
    if (!value) return 0;
    const seconds = Number(value);
    if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
    const date = Date.parse(value);
    if (!Number.isNaN(date)) return Math.max(0, date - Date.now());
    return 0;
  }

  async function copyUsernames() {
    const display = getDisplayUsers();
    if (!display.length) return;
    const text = display
      .map(u => u.username)
      .sort()
      .join('\n');
    try {
      await navigator.clipboard.writeText(text);
      toast(t('copiedToast', { count: display.length }));
    } catch (err) {
      console.error('[tu] copy to clipboard failed', err);
    }
  }

  function toggleLanguage() {
    state.language = state.language === 'tr' ? 'en' : 'tr';
    persist();
    renderShell();
  }

  function getDisplayUsers() {
    const query = state.search.trim().toLowerCase();
    return state.users
      .filter(u => !u.follows_viewer)
      .filter(u => (state.filters.showHidden ? state.hidden.has(u.id) : !state.hidden.has(u.id)))
      .filter(u => state.filters.verified || !u.is_verified)
      .filter(
        u =>
          !query ||
          (u.username + ' ' + (u.full_name || ''))
            .toLowerCase()
            .includes(query)
      )
      .sort((a, b) => a.username.localeCompare(b.username));
  }

  function normalizeUser(raw) {
    return {
      id: String(raw.id || raw.pk || raw.pk_id || ''),
      username: String(raw.username || ''),
      full_name: String(raw.full_name || ''),
      profile_pic_url: String(raw.profile_pic_url || raw.profile_pic_url_hd || ''),
      is_verified: Boolean(raw.is_verified),
      is_private: Boolean(raw.text_post_app_is_private ?? raw.is_private),
      follows_viewer: Boolean(raw.friendship_status?.followed_by),
    };
  }

  function dedupe(list) {
    const seen = new Set();
    return list.filter(u => {
      if (!u.id || seen.has(u.id)) return false;
      seen.add(u.id);
      return true;
    });
  }

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^|; )' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '=([^;]*)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  function getFbid(viewerId) {
    let fbid = '';
    for (const script of document.querySelectorAll('script')) {
      const match =
        script.textContent.match(/"ACCOUNT_ID":"([^"]+)"/) ||
        script.textContent.match(/"USER_ID":"([^"]+)"/) ||
        script.textContent.match(/"fbid":"([^"]+)"/);
      if (match) {
        fbid = match[1];
        break;
      }
    }
    return fbid || viewerId || '0';
  }

  function getLoggedInUsername() {
    const link = document.querySelector('a[href^="/@"]');
    if (link) return link.getAttribute('href').replace('/@', '').split('?')[0];
    for (const script of document.querySelectorAll('script')) {
      const text = script.textContent;
      if (!text) continue;
      const match = text.match(/"username":"([^"]+)"/);
      if (match) return match[1];
    }
    return null;
  }

  async function fetchFollowingCount(username) {
    if (!username) return 0;
    try {
      log(`Fetching following count from profile page: /@${username}...`);
      const response = await fetch(location.origin + '/@' + username);
      if (!response.ok) return 0;
      const html = await response.text();
      const match = html.match(/"following_count":\s*(\d+)/) || html.match(/"following":\s*\{\s*"count":\s*(\d+)/);
      if (match) {
        log(`Following count parsed from profile HTML: ${match[1]}`);
        return parseInt(match[1], 10);
      }
    } catch (e) {
      log('Failed to fetch following count from profile:', e);
    }
    return 0;
  }

  async function getFollowingCount(username, userId) {
    for (const script of document.querySelectorAll('script')) {
      const text = script.textContent;
      if (!text) continue;
      if (text.includes(userId)) {
        const match = text.match(/"following_count":\s*(\d+)/);
        if (match) {
          log(`Following count found in script tags: ${match[1]}`);
          return parseInt(match[1], 10);
        }
      }
    }
    if (username) {
      return fetchFollowingCount(username);
    }
    return 0;
  }

  function getLSDToken() {
    if (window.LSD?.token) return window.LSD.token;
    if (window.__LSD__?.token) return window.__LSD__.token;
    for (const script of document.querySelectorAll('script')) {
      const match = script.textContent.match(/"LSD",\[\],{"token":"([^"]+)"}/) || script.textContent.match(/"lsd":"([^"]+)"/);
      if (match) return match[1];
    }
    const matchHTML =
      document.body.innerHTML.match(/"LSD",\[\],{"token":"([^"]+)"}/) ||
      document.body.innerHTML.match(/"lsd":"([^"]+)"/) ||
      document.body.innerHTML.match(/name="lsd" value="([^"]+)"/);
    return matchHTML ? matchHTML[1] : null;
  }

  function getFbDtsg() {
    if (window.DTSGInitData?.token) return window.DTSGInitData.token;
    if (window.__DTSGInitData__?.token) return window.__DTSGInitData__.token;
    for (const script of document.querySelectorAll('script')) {
      const match = script.textContent.match(/"DTSGInitData",\[\],{"token":"([^"]+)"}/) || script.textContent.match(/"fb_dtsg":"([^"]+)"/);
      if (match) return match[1];
    }
    const matchHTML =
      document.body.innerHTML.match(/"DTSGInitData",\[\],{"token":"([^"]+)"}/) ||
      document.body.innerHTML.match(/"fb_dtsg":"([^"]+)"/) ||
      document.body.innerHTML.match(/name="fb_dtsg" value="([^"]+)"/);
    return matchHTML ? matchHTML[1] : null;
  }

  async function parseResponse(response) {
    const text = await response.text();
    log('Response text body:', text);
    let cleaned = text.trim();
    if (cleaned.startsWith('for (;;);')) {
      cleaned = cleaned.substring(9);
    } else if (cleaned.startsWith('while (1);')) {
      cleaned = cleaned.substring(10);
    } else if (cleaned.startsWith(")]}'")) {
      cleaned = cleaned.substring(4);
    }

    try {
      const parsed = JSON.parse(cleaned);
      log('Successfully parsed single JSON object:', parsed);
      return parsed;
    } catch (e) {
      log('Failed parsing text as single JSON object. Trying line-by-line parsing...');
      const lines = cleaned.split('\n');
      for (const line of lines) {
        let lineCleaned = line.trim();
        if (lineCleaned.startsWith('for (;;);')) {
          lineCleaned = lineCleaned.substring(9);
        }
        try {
          const parsed = JSON.parse(lineCleaned);
          if (parsed?.data) {
            log('Successfully parsed line-by-line JSON part:', parsed);
            return parsed;
          }
        } catch (err) {}
      }
      log('Line-by-line parsing failed too. Throwing original error:', e);
      throw e;
    }
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, Math.max(0, ms)));
  }

  function randomBetween(min, max) {
    const lo = Math.min(min, max);
    const hi = Math.max(min, max);
    return Math.floor(Math.random() * (hi - lo + 1)) + lo;
  }

  async function waitWhile(predicate, interval = 200) {
    while (predicate()) await sleep(interval);
  }

  async function sleepWithCountdown(ms, reasonKey) {
    state.waitUntil = Date.now() + ms;
    state.waitReason = reasonKey;
    updateCountdownDOM();
    const start = Date.now();
    while (Date.now() - start < ms) {
      if (state.scanCancelled) break;
      await sleep(Math.min(250, ms - (Date.now() - start)));
      if (state.scanPaused) {
        const pauseStart = Date.now();
        await waitWhile(() => state.scanPaused);
        state.waitUntil += Date.now() - pauseStart;
        updateCountdownDOM();
      }
    }
    state.waitUntil = 0;
    state.waitReason = '';
    updateCountdownDOM();
  }

  function startCountdown() {
    if (countdownTimer) return;
    countdownTimer = setInterval(updateCountdownDOM, 500);
  }

  function stopCountdown() {
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  }

  function updateCountdownDOM() {
    const node = document.querySelector(`#${APP_ID} [data-countdown]`);
    if (!node) return;
    if (!state.waitUntil) {
      node.textContent = '';
      return;
    }
    const remaining = Math.max(0, Math.ceil((state.waitUntil - Date.now()) / 1000));
    const reason = state.waitReason || 'nextActionIn';
    node.textContent = t(reason, { seconds: remaining });
  }

  function updateProgressDOM() {
    const root = document.querySelector(`#${APP_ID} [data-body]`);
    if (!root) return;
    const { current, total, label, note } = state.progress;
    const counter = root.querySelector('[data-progress-counter]');
    if (counter) {
      counter.textContent = total ? t('ofTotal', { current, total }) : t('ofUnknown', { current });
    }
    const labelEl = root.querySelector('[data-progress-label]');
    if (labelEl) {
      labelEl.textContent = state.scanPaused ? t('paused') : t(label);
    }
    const noteEl = root.querySelector('[data-progress-note]');
    if (noteEl) {
      noteEl.textContent = note || '';
    }

    const listEl = root.querySelector('[data-list]');
    if (listEl) {
      const display = getDisplayUsers();
      listEl.innerHTML = renderUserList(display);
      const summaryEl = root.querySelector('.iu-results-summary');
      if (summaryEl) {
        const totalNonFollowers = state.users.filter(u => !u.follows_viewer && !state.hidden.has(u.id)).length;
        summaryEl.textContent =
          state.mode === 'scanning'
            ? t('scanning')
            : totalNonFollowers === 0
            ? t('foundNone')
            : totalNonFollowers === 1
            ? t('foundOne')
            : t('foundCount', { count: totalNonFollowers });
      }
    }

    if (state.minimized) {
      const pillLabelEl = document.querySelector(`#${APP_ID} [data-pill-label]`);
      if (pillLabelEl) {
        pillLabelEl.textContent = pillLabel();
      }
    }
  }

  function toast(message) {
    const root = document.getElementById(APP_ID);
    if (!root) return;
    root.querySelector('.iu-toast')?.remove();
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }
    const node = document.createElement('div');
    node.className = 'iu-toast';
    node.textContent = message;
    root.appendChild(node);
    toastTimer = setTimeout(() => {
      node.remove();
      toastTimer = null;
    }, 3500);
  }

  function showSettings() {
    const fields = [
      ['scanDelayMin', 'minScanDelay', 100],
      ['scanDelayMax', 'maxScanDelay', 100],
      ['scanPauseEveryPages', 'scanPauseEvery', 1],
      ['scanPauseMs', 'scanPauseLength', 1000],
    ];
    const formHTML = fields
      .map(
        ([key, label, step]) => `
      <label class="iu-field">
        <span>${escapeHTML(t(label))}</span>
        <input type="number" min="0" step="${step}" data-setting="${escapeAttr(key)}" value="${Number(state.timings[key])}">
      </label>
    `
      )
      .join('');

    showDialog({
      title: t('settingsTitle'),
      body: t('settingsBody'),
      contentHTML: `<div class="iu-form">${formHTML}</div>`,
      confirmLabel: t('save'),
      extraButton: { label: t('restoreDefaults'), action: 'restore' },
      onConfirm: dialog => {
        dialog.querySelectorAll('[data-setting]').forEach(input => {
          const key = input.getAttribute('data-setting');
          const val = Number(input.value);
          if (Number.isFinite(val) && val >= 0) {
            state.timings[key] = val;
          }
        });
        persist();
        toast(t('saved'));
      },
      onExtra: dialog => {
        Object.assign(state.timings, DEFAULT_TIMINGS);
        dialog.querySelectorAll('[data-setting]').forEach(input => {
          const key = input.getAttribute('data-setting');
          input.value = state.timings[key];
        });
      },
    });
  }

  function showDialog({
    title,
    body,
    contentHTML,
    confirmLabel,
    destructive,
    extraButton,
    onConfirm,
    onExtra,
  }) {
    const overlay = document.createElement('div');
    overlay.className = 'iu-overlay';
    overlay.innerHTML = `
      <div class="iu-dialog" role="dialog" aria-modal="true">
        <h3>${escapeHTML(title)}</h3>
        ${body ? `<p>${escapeHTML(body)}</p>` : ''}
        ${contentHTML || ''}
        <div class="iu-dialog-actions">
          ${extraButton ? `<button type="button" class="iu-btn iu-btn--ghost iu-btn--small" data-extra>${escapeHTML(extraButton.label)}</button>` : ''}
          <button type="button" class="iu-btn iu-btn--small" data-cancel>${escapeHTML(t('cancel'))}</button>
          <button type="button" class="iu-btn iu-btn--small ${destructive ? 'iu-btn--danger' : 'iu-btn--primary'}" data-confirm>${escapeHTML(confirmLabel)}</button>
        </div>
      </div>
    `;
    document.getElementById(APP_ID).appendChild(overlay);
    const close = () => overlay.remove();
    overlay.addEventListener('click', event => {
      if (event.target === overlay) close();
    });
    overlay.querySelector('[data-cancel]').addEventListener('click', close);
    overlay.querySelector('[data-confirm]').addEventListener('click', () => {
      onConfirm(overlay);
      close();
    });
    if (extraButton && onExtra) {
      overlay.querySelector('[data-extra]').addEventListener('click', () => onExtra(overlay.querySelector('.iu-dialog')));
    }
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function escapeHTML(value) {
    return String(value ?? '').replace(
      /[&<>"']/g,
      ch =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        })[ch]
    );
  }

  function escapeAttr(value) {
    return escapeHTML(value);
  }

  const CSS = `
    #${APP_ID}, #${APP_ID} * { box-sizing: border-box; }
    #${APP_ID} {
      --iu-bg: #101010;
      --iu-bg-2: #181818;
      --iu-bg-3: #222222;
      --iu-line: rgba(255,255,255,0.08);
      --iu-line-strong: rgba(255,255,255,0.16);
      --iu-text: #ffffff;
      --iu-muted: #999999;
      --iu-accent: #ffffff;
      --iu-accent-2: #e5e5e5;
      --iu-danger: #ff3040;
      --iu-success: #00f576;
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 2147483647;
      color: var(--iu-text);
      font: 14px/1.45 -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif;
    }
    #${APP_ID} > * { pointer-events: auto; }
    #${APP_ID} button, #${APP_ID} input, #${APP_ID} a { font: inherit; color: inherit; }
    #${APP_ID} a { text-decoration: none; }
    #${APP_ID} button { cursor: pointer; }

    #${APP_ID} .iu-panel {
      position: absolute;
      width: ${PANEL_WIDTH}px;
      max-width: calc(100vw - 24px);
      max-height: calc(100vh - 24px);
      display: flex;
      flex-direction: column;
      background: var(--iu-bg);
      border: 1px solid var(--iu-line);
      border-radius: 14px;
      box-shadow: 0 24px 60px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.3);
      overflow: hidden;
      animation: iu-pop 0.18s ease-out;
    }
    @keyframes iu-pop {
      from { opacity: 0; transform: translateY(8px) scale(0.985); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    #${APP_ID} .iu-header {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 12px 12px 14px;
      border-bottom: 1px solid var(--iu-line);
      cursor: grab;
      user-select: none;
      background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent);
    }
    #${APP_ID} .iu-header.iu-dragging { cursor: grabbing; }
    #${APP_ID} .iu-brand { display: flex; align-items: center; gap: 10px; min-width: 0; }
    #${APP_ID} .iu-brand-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--iu-success), var(--iu-muted));
      flex-shrink: 0;
    }
    #${APP_ID} .iu-brand-text { min-width: 0; }
    #${APP_ID} .iu-brand-text strong { display: block; font-size: 14px; font-weight: 600; }
    #${APP_ID} .iu-brand-text span { display: block; font-size: 11px; color: var(--iu-muted); }
    #${APP_ID} .iu-header-actions { display: flex; gap: 4px; flex-shrink: 0; }
    #${APP_ID} .iu-header-actions button {
      width: 28px;
      height: 28px;
      display: grid;
      place-items: center;
      border: none;
      background: transparent;
      border-radius: 6px;
      color: var(--iu-muted);
      transition: background 0.15s, color 0.15s;
      font-size: 11px;
      font-weight: 600;
    }
    #${APP_ID} .iu-header-actions button:hover { background: var(--iu-bg-2); color: var(--iu-text); }
    #${APP_ID} .iu-header-actions svg { display: block; }

    #${APP_ID} .iu-body {
      flex: 1 1 auto;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    #${APP_ID} .iu-welcome {
      padding: 28px 22px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
    #${APP_ID} .iu-welcome-icon {
      width: 64px;
      height: 64px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: rgba(255,255,255,0.08);
      color: var(--iu-text);
      margin-bottom: 4px;
    }
    #${APP_ID} .iu-welcome-icon--error { background: rgba(239,68,68,0.15); color: var(--iu-danger); }
    #${APP_ID} .iu-welcome h2 { margin: 0; font-size: 17px; font-weight: 600; color: var(--ui-muted); }
    #${APP_ID} .iu-welcome p { margin: 0; color: var(--iu-muted); font-size: 13px; max-width: 300px; }

    #${APP_ID} .iu-btn {
      border: 1px solid var(--iu-line);
      background: var(--iu-bg-2);
      color: var(--iu-text);
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      transition: background 0.15s, border-color 0.15s, transform 0.05s;
    }
    #${APP_ID} .iu-btn:hover:not(:disabled) { background: var(--iu-bg-3); border-color: var(--iu-line-strong); }
    #${APP_ID} .iu-btn:active:not(:disabled) { transform: scale(0.98); }
    #${APP_ID} .iu-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    #${APP_ID} .iu-btn--primary { background: var(--iu-accent); border-color: var(--iu-accent); color: #000000; }
    #${APP_ID} .iu-btn--primary:hover:not(:disabled) { background: var(--iu-accent-2); border-color: var(--iu-accent-2); }
    #${APP_ID} .iu-btn--danger { background: var(--iu-danger); border-color: var(--iu-danger); color: #fff; }
    #${APP_ID} .iu-btn--danger:hover:not(:disabled) { background: #ff4d5a; border-color: #ff4d5a; }
    #${APP_ID} .iu-btn--ghost { background: transparent; }
    #${APP_ID} .iu-btn--lg { padding: 10px 20px; font-size: 14px; margin-top: 8px; }
    #${APP_ID} .iu-btn--small { padding: 6px 10px; font-size: 12px; }

    #${APP_ID} .iu-progress-bar-container { padding: 12px 16px; display: flex; flex-direction: column; gap: 10px; }
    #${APP_ID} .iu-progress-head { display: flex; flex-direction: column; gap: 2px; }
    #${APP_ID} .iu-progress-head h2 { margin: 0; font-size: 13px; font-weight: 600; color: var(--iu-muted); }
    #${APP_ID} .iu-progress-head p { margin: 0; color: var(--iu-muted); font-size: 11px; min-height: 1em; }
    #${APP_ID} .iu-text-success { color: var(--iu-success); }
    #${APP_ID} .iu-progress-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: var(--iu-muted);
    }
    #${APP_ID} .iu-progress-actions { display: flex; gap: 6px; justify-content: flex-end; }
    #${APP_ID} .iu-current {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      background: var(--iu-bg-2);
      border-radius: 6px;
      font-size: 11px;
    }
    #${APP_ID} .iu-current strong { font-weight: 600; }

    #${APP_ID} .iu-results {
      flex: 1 1 auto;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }
    #${APP_ID} .iu-results-summary {
      padding: 12px 16px 4px;
      font-size: 13px;
      color: var(--iu-muted);
    }
    #${APP_ID} .iu-search-row {
      padding: 8px 16px;
    }
    #${APP_ID} .iu-search {
      width: 100%;
      height: 36px;
      padding: 0 12px;
      border: 1px solid var(--iu-line);
      border-radius: 8px;
      background: var(--iu-bg-2);
      color: var(--iu-text);
      outline: none;
      transition: border-color 0.15s;
    }
    #${APP_ID} .iu-search:focus { border-color: var(--iu-accent); }
    #${APP_ID} .iu-search::-webkit-search-cancel-button { opacity: 0.5; }

    #${APP_ID} .iu-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 0 16px 10px;
    }
    #${APP_ID} .iu-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border: 1px solid var(--iu-line);
      border-radius: 999px;
      background: transparent;
      color: var(--iu-muted);
      font-size: 12px;
      transition: border-color 0.15s, color 0.15s, background 0.15s;
    }
    #${APP_ID} .iu-chip:hover { border-color: var(--iu-line-strong); color: var(--iu-text); }
    #${APP_ID} .iu-chip--on { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.5); color: var(--iu-text); }
    #${APP_ID} .iu-chip-tick { display: inline-grid; place-items: center; width: 12px; height: 12px; }
    #${APP_ID} .iu-chip-tick svg { width: 12px; height: 12px; }

    #${APP_ID} .iu-list {
      flex: 1 1 auto;
      min-height: 100px;
      max-height: 50vh;
      overflow-y: auto;
      overscroll-behavior: contain;
      border-top: 1px solid var(--iu-line);
      border-bottom: 1px solid var(--iu-line);
    }
    #${APP_ID} .iu-list-empty {
      padding: 30px 20px;
      text-align: center;
      color: var(--iu-muted);
      font-size: 13px;
    }
    #${APP_ID} .iu-row {
      display: grid;
      grid-template-columns: 36px 1fr auto;
      gap: 10px;
      padding: 8px 16px;
      align-items: center;
      cursor: default;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      transition: background 0.1s;
    }
    #${APP_ID} .iu-row:hover { background: rgba(255,255,255,0.02); }
    #${APP_ID} .iu-row:last-child { border-bottom: none; }
    #${APP_ID} .iu-row--hidden { opacity: 0.45; }
    #${APP_ID} .iu-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
      background: var(--iu-bg-3);
    }
    #${APP_ID} .iu-row-text { min-width: 0; }
    #${APP_ID} .iu-row-name {
      display: flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 13px;
      font-weight: 500;
    }
    #${APP_ID} .iu-row-name a { color: var(--iu-text); }
    #${APP_ID} .iu-row-name a:hover { color: var(--iu-accent-2); }
    #${APP_ID} .iu-row-sub {
      font-size: 12px;
      color: var(--iu-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #${APP_ID} .iu-row-actions {
      display: flex;
      gap: 4px;
      align-items: center;
    }
    #${APP_ID} .iu-icon-btn {
      display: inline-grid;
      place-items: center;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      border: none;
      background: transparent;
      color: var(--iu-muted);
      transition: background 0.15s, color 0.15s;
    }
    #${APP_ID} .iu-icon-btn:hover { background: var(--iu-bg-2); color: var(--iu-text); }
    #${APP_ID} .iu-text-btn {
      width: auto;
      padding: 0 8px;
      font-size: 11px;
      font-weight: 500;
    }
    #${APP_ID} .iu-tag {
      display: inline-flex;
      align-items: center;
      padding: 1px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
      background: rgba(255,255,255,0.06);
      color: var(--iu-muted);
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }
    #${APP_ID} .iu-tag--blue {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #0095f6;
      border-radius: 9999px;
      padding: 2px 8px;
      text-transform: none;
      font-weight: 500;
    }
    #${APP_ID} .iu-tag--green { background: rgba(0,245,118,0.15); color: var(--iu-success); }
    #${APP_ID} .iu-tag--red { background: rgba(255,48,64,0.15); color: var(--iu-danger); }

    #${APP_ID} .iu-bottom-bar-wrapper {
      flex-shrink: 0;
      border-top: 1px solid var(--iu-line);
      background: var(--iu-bg);
    }
    #${APP_ID} .iu-actionbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
    }
    #${APP_ID} .iu-actionbar-left,
    #${APP_ID} .iu-actionbar-right {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }
    #${APP_ID} .iu-muted { color: var(--iu-muted); font-size: 12px; }

    #${APP_ID} .iu-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.65);
      display: grid;
      place-items: center;
      padding: 20px;
      z-index: 1;
    }
    #${APP_ID} .iu-dialog {
      width: 100%;
      max-width: 380px;
      background: var(--iu-bg);
      border: 1px solid var(--iu-line);
      border-radius: 12px;
      padding: 18px;
      box-shadow: 0 30px 80px rgba(0,0,0,0.55);
    }
    #${APP_ID} .iu-dialog h3 { margin: 0 0 8px; font-size: 16px; }
    #${APP_ID} .iu-dialog p { margin: 0 0 14px; color: var(--iu-muted); font-size: 13px; }
    #${APP_ID} .iu-dialog-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; }
    #${APP_ID} .iu-dialog-actions [data-extra] { margin-right: auto; }
    #${APP_ID} .iu-form { display: grid; gap: 8px; max-height: 50vh; overflow-y: auto; padding-right: 4px; }
    #${APP_ID} .iu-field { display: grid; grid-template-columns: 1fr 110px; align-items: center; gap: 10px; font-size: 12px; color: var(--iu-muted); }
    #${APP_ID} .iu-field input {
      height: 32px;
      padding: 0 10px;
      border: 1px solid var(--iu-line);
      border-radius: 6px;
      background: var(--iu-bg-2);
      color: var(--iu-text);
      outline: none;
    }
    #${APP_ID} .iu-field input:focus { border-color: var(--iu-accent); }

    #${APP_ID} .iu-toast {
      position: absolute;
      left: 50%;
      bottom: 12px;
      transform: translateX(-50%);
      padding: 8px 14px;
      background: rgba(20,22,28,0.95);
      border: 1px solid var(--iu-line);
      border-radius: 999px;
      font-size: 12px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.35);
      pointer-events: none;
      animation: iu-pop 0.18s ease-out;
    }

    #${APP_ID} .iu-pill {
      position: absolute;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      background: var(--iu-bg);
      border: 1px solid var(--iu-line);
      color: var(--iu-text);
      border-radius: 999px;
      box-shadow: 0 12px 30px rgba(0,0,0,0.4);
      font-size: 12px;
      font-weight: 500;
      transition: background 0.15s;
      cursor: pointer;
    }
    #${APP_ID} .iu-pill:hover { background: var(--iu-bg-2); }
    #${APP_ID} .iu-pill-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--iu-muted);
    }
    #${APP_ID} .iu-pill-dot--active { background: var(--iu-success); animation: iu-pulse 1.4s infinite; }
    #${APP_ID} .iu-pill-dot--error { background: var(--iu-danger); }
    @keyframes iu-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    @media (max-width: 480px) {
      #${APP_ID} .iu-panel {
        width: calc(100vw - 16px) !important;
        max-height: calc(100vh - 16px) !important;
        left: 8px !important;
        right: 8px !important;
        top: 8px !important;
        bottom: 8px !important;
      }
      #${APP_ID} .iu-list { max-height: none; flex: 1 1 auto; }
    }
  `;

  cleanupExisting();
  injectStyles();
  mount();
})();