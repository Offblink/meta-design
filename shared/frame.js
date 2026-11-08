/* meta-design · 主题 / 明暗切换（frame.js）
   七个主题的 CSS 全部预载，每个 @scope 到自己的 [data-astryx-theme]，
   切主题 = 换 html 属性，零网络请求。偏好存 localStorage，file:// 下可用。 */
(function () {
  var THEMES = ['neutral', 'butter', 'chocolate', 'matcha', 'stone', 'gothic', 'y2k'];
  var MODES = ['light', 'dark', 'system'];
  var MODE_LABEL = {light: '☀ 亮色', dark: '☾ 暗色', system: '◐ 跟随系统'};
  var root = document.documentElement;
  var state = {
    theme: root.getAttribute('data-astryx-theme') || 'neutral',
    mode: root.hasAttribute('data-theme') ? root.getAttribute('data-theme') : 'system'
  };

  function save() {
    try { localStorage.setItem('meta-design', JSON.stringify(state)); } catch (e) {}
  }

  function apply() {
    root.setAttribute('data-astryx-theme', state.theme);
    if (state.mode === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', state.mode);
    save();
    render();
  }

  function render() {
    var bar = document.querySelector('[data-prefs]');
    if (!bar) return;
    bar.textContent = '';
    THEMES.forEach(function (t) {
      var b = document.createElement('button');
      b.className = 'pill' + (t === state.theme ? ' on' : '');
      b.textContent = t;
      b.title = '主题 ' + t;
      b.onclick = function () { state.theme = t; apply(); };
      bar.appendChild(b);
    });
    var sep = document.createElement('span');
    sep.className = 'sep';
    bar.appendChild(sep);
    var m = document.createElement('button');
    m.className = 'pill on';
    m.textContent = MODE_LABEL[state.mode];
    m.title = '切换明暗模式';
    m.onclick = function () {
      state.mode = MODES[(MODES.indexOf(state.mode) + 1) % MODES.length];
      apply();
    };
    bar.appendChild(m);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
