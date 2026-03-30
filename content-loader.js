// Antigravity Content Loader – lädt Inhalte aus Supabase und ersetzt statische Texte/Bilder
(function () {
  var SUPABASE_URL = 'https://pqnsqidysytbfmjdghfh.supabase.co';
  var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxbnNxaWR5c3l0YmZtamRnaGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4ODI3NzUsImV4cCI6MjA5MDQ1ODc3NX0.lHr_D6cn7pSdXHhN6ayQTQMfjPqZOmOqzMf5vfrWuVQ';

  // Aktuelle Seite erkennen
  var path = window.location.pathname;
  var page = 'landing';
  if (path.indexOf('leistungen') !== -1) page = 'leistungen';
  else if (path.indexOf('cases') !== -1) page = 'cases';
  else if (path.indexOf('ueber-uns') !== -1) page = 'ueber-uns';
  else if (path.indexOf('projekt-starten') !== -1) page = 'projekt-starten';

  function applyContent(data) {
    data.forEach(function (item) {
      if (!item.value) return;
      var els = document.querySelectorAll('[data-sb-key="' + item.content_key + '"]');
      els.forEach(function (el) {
        if (item.content_type === 'image') {
          if (el.tagName === 'IMG') el.src = item.value;
        } else if (item.content_type === 'textarea') {
          // Zeilenumbrüche im Text als <br/> rendern
          el.innerHTML = item.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>');
        } else {
          el.textContent = item.value;
        }
      });
    });
  }

  function loadContent() {
    fetch(
      SUPABASE_URL + '/rest/v1/site_content?page=eq.' + page + '&select=content_key,value,content_type',
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': 'Bearer ' + SUPABASE_KEY
        }
      }
    )
      .then(function (res) { return res.ok ? res.json() : []; })
      .then(function (data) { applyContent(data); })
      .catch(function () { /* Statische Fallback-Inhalte bleiben erhalten */ });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadContent);
  } else {
    loadContent();
  }
})();
