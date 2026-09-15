/* ==========================================================================
   微爱未央 Caritai —— 站点脚本
   负责：导航栏、页脚、团队页渲染、成员详情弹窗、移动端菜单
   ========================================================================== */
(function () {
  'use strict';

  var page = document.documentElement.getAttribute('data-page') || 'home';
  var lang = document.documentElement.getAttribute('data-lang') || 'zh';

  var HREF = {
    home:    { zh: 'index.html',      en: 'en.html' },
    about:   { zh: 'about-us.html',   en: 'eng-about.html' },
    team:    { zh: 'team.html',       en: 'eng-team.html' },
    events:  { zh: 'events.html',     en: 'eng-event.html' },
    support: { zh: 'contact-us.html', en: 'eng-support.html' }
  };

  var LABELS = {
    zh: { home: '首页', about: '关于微爱', team: '团队', events: '活动', support: '支持我们' },
    en: { home: 'Home', about: 'About', team: 'Team', events: 'Events', support: 'Support' }
  };

  var ORDER = ['home', 'about', 'team', 'events', 'support'];

  /* ---------- 导航栏 ---------- */
  function buildNav() {
    var el = document.getElementById('nav');
    if (!el) return;

    var brand =
      '<a class="brand" href="' + HREF.home[lang] + '">' +
        '<img src="assets/pages/home_0.png" alt="微爱未央 Caritai" ' +
          'onerror="this.onerror=null;this.style.display=\'none\';">' +
        '<span><span class="brand-zh">微爱未央</span>' +
        '<span class="brand-en">CARITAI</span></span>' +
      '</a>';

    var links = ORDER.map(function (key) {
      var active = (key === page) ? ' class="active"' : '';
      return '<a href="' + HREF[key][lang] + '"' + active + '>' + LABELS[lang][key] + '</a>';
    }).join('');

    var otherLang = (lang === 'zh') ? 'en' : 'zh';
    var langLabel = (lang === 'zh') ? 'English' : '中文';
    var langHref = HREF[page][otherLang];

    var toggle =
      '<button class="nav-toggle" id="navToggle" aria-label="菜单"><span></span><span></span><span></span></button>';

    el.innerHTML = brand +
      '<div class="nav-links" id="navLinks">' +
        links +
        '<a class="nav-lang" href="' + langHref + '">' + langLabel + '</a>' +
      '</div>' +
      toggle;

    document.getElementById('navToggle').addEventListener('click', function () {
      document.getElementById('navLinks').classList.toggle('open');
    });
  }

  /* ---------- 页脚 ---------- */
  function buildFooter() {
    var el = document.getElementById('footer');
    if (!el) return;

    var t = lang === 'zh' ? {
      follow: '关注微爱',
      note: '关注微信公众号「微爱未央」，了解我们的最新动态',
      copy: '© 2026 by Caritai Group. All rights reserved.'
    } : {
      follow: 'Follow Caritai',
      note: 'Follow our WeChat official account 微爱未央 for updates',
      copy: '© 2026 by Caritai Group. All rights reserved.'
    };

    el.innerHTML =
      '<div class="container"><div class="footer-inner">' +
        '<h3 class="footer-title">微爱未央 · Caritai</h3>' +
        '<p class="footer-sub">' + t.follow + '</p>' +
        '<p class="footer-sub">' + t.note + '</p>' +
        '<p class="footer-copy">' + t.copy + '</p>' +
      '</div></div>';
  }

  /* ---------- 头部滚动状态 ---------- */
  function initHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    function onScroll() {
      header.classList.toggle('scrolled', window.scrollY > 12);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- 成员详情弹窗 ---------- */
  function buildModal() {
    var overlay = document.getElementById('memberModal');
    if (!overlay) return;

    overlay.innerHTML =
      '<div class="modal" role="dialog" aria-modal="true">' +
        '<button class="modal-close" aria-label="关闭">×</button>' +
        '<div class="modal-head">' +
          '<img class="modal-avatar" alt="">' +
          '<div><div class="modal-name"></div><div class="modal-group"></div></div>' +
        '</div>' +
        '<div class="modal-fields"></div>' +
      '</div>';

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  function openModal(member) {
    var overlay = document.getElementById('memberModal');
    if (!overlay) return;
    overlay.querySelector('.modal-avatar').src = member.avatar;
    overlay.querySelector('.modal-name').textContent = member.name;
    overlay.querySelector('.modal-group').textContent = member.group;

    var fieldsBox = overlay.querySelector('.modal-fields');
    fieldsBox.innerHTML = (member.fields || []).map(function (f) {
      return '<div class="modal-field">' +
        '<div class="field-label">' + escapeHtml(f.label) + '</div>' +
        '<div class="field-value">' + escapeHtml(f.value) + '</div>' +
      '</div>';
    }).join('');

    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    overlay.querySelector('.modal').scrollTop = 0;
  }

  function closeModal() {
    var overlay = document.getElementById('memberModal');
    if (!overlay) return;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- 团队页渲染 ---------- */
  var GROUPS = {
    zh: [
      { key: '微爱帮帮团', desc: '他们居住在世界各地，毕业于不同高校，从事多种职业。他们因为对推动教育公平的理想汇聚在微爱未央。他们是服务微爱未央学生的志愿导师，是微爱运营的专业教练，也是微爱未央奖学金的固定捐赠人。他们为学生们提供职业技能、领导能力、组织运营的辅导，创造温暖与鼓励的氛围与个人发展的机会，帮助他们积累经验，拓展阅历，提升自信，肩负起微爱人的使命与传统。' },
      { key: '微爱之光顾问团', desc: '他们是来自不同领域的专业人士，他们认同微爱未央致力于服务积极上进而资源不足的学生的教育公益使命，以热情激励我们勇往直前，以经验辅佐微爱茁壮发展。他们在为微爱的战略决策提供咨询的同时，也为微爱奖学金提供固定的捐赠。' },
      { key: '学生团队', desc: '他们是微爱未央培养计划的核心，微爱奖学金获赠人，是微爱未央运营的主人翁，也是微爱未央最宝贵的财富。微爱之家设有主席、副主席，财务主管、活动组、宣传组等岗位，实现组织运营。微爱未央在选拔学生时，注重积极上进的精神、正直善良的品德与心怀社会的格局，每位微爱学生都有担任领导职务的机会。我们对每位微爱学生加以指导，为他们创造管理实践的真实场景和机会，丰富阅历，提升技能，培养沟通力和领导力。我们的培养理念是大胆试错，善于复盘，成长胜于成果。微爱学生团队是推动微爱未央前进的风帆。' },
      { key: '微爱校友', desc: '他们见证了微爱从诞生到发展的风雨历程，曾经的青稚变成今日的稳重。聚是一团火，散是满天星，他们在各地担起责任，传递爱的光芒，成为社会栋梁。微爱永远以他们为自豪。' }
    ],
    en: [
      { key: 'Caritai Mentors', desc: "Caritai mentors live all over the world and work in various fields and gathered together through Caritai's ideal of promoting social justice through improving educational equality. They are pro bono coaches for our students, experts in different aspects of organizational operation, and regular donors to the Caritai Scholarships. They guide our students to develop their professional skills, leadership capabilities, and knowledge about organizational management. They create an encouraging atmosphere and diverse opportunities for students to enhance their self-efficacy and eventually to carry forward Caritai's mission and traditions to a larger society." },
      { key: 'Caritai Advisors', desc: "Caritai advisors are seasoned professionals in various fields. They recognize Caritai's unwavering dedication to serving qualified but under-resourced college students. They inspire Caritai members to move forward and help the organization grow steadily by contributing their passion and leveraging their experience. They provide consulting for Caritai's strategic planning and regular donations to the Caritai Scholarships." },
      { key: 'Caritai Students', desc: "Caritai students are the core of Caritai's enrichment program, recipients of the Caritai Scholarships, owner and primary operation task force of Caritai, and our greatest asset. Caritai students are responsible for four functional groups - general management, treasurer, programming, and marketing - to drive the organization's operation. In Caritai's student member selection, we put emphasis on the individual's self-motivation, integrity and altruism. Every student has opportunities of fulfilling various leadership roles. We create real-world management scenarios and guide them through their practices to develop their knowledge, skills, abilities, and character. Our philosophy of student development is putting ideas to test, learning from mistakes, and honoring growth more than achievements. Caritai students are the engine that drives the organization forward." },
      { key: 'Caritai Alumni', desc: "Caritai alumni witnessed Caritai's journey from her foundation to prosperity, and along with Caritai's development, they have also turned from novices to professionals and scholars. They are a group of light-bringers, together or apart. Today, they shoulder meaningful responsibilities all over the world, lead by example, and carry forward compassion to more people in the society. They are the evergreen pride of Caritai." }
    ]
  };

  var PLACEHOLDER = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" fill="#eef2ec"/></svg>'
  );

  function renderTeam() {
    var root = document.getElementById('teamRoot');
    if (!root || typeof window.TEAM_DATA === 'undefined') return;

    var members = window.TEAM_DATA[lang] || [];
    var groups = GROUPS[lang] || [];

    var html = groups.map(function (g) {
      var list = members.filter(function (m) { return m.group === g.key; });
      var grid = list.map(function (m) {
        return '<button class="team-member" data-name="' + escapeHtml(m.name) + '" data-group="' +
          escapeHtml(m.group) + '">' +
          '<img class="team-avatar" loading="lazy" src="' + m.avatar + '" alt="' + escapeHtml(m.name) +
          '" onerror="this.onerror=null;this.src=\'' + PLACEHOLDER + '\';">' +
          '<span class="team-name">' + escapeHtml(m.name) + '</span>' +
        '</button>';
      }).join('');

      return '<section class="team-group">' +
        '<div class="container">' +
          '<div class="team-group-head">' +
            '<h2>' + g.key + '</h2>' +
            '<p>' + g.desc + '</p>' +
          '</div>' +
          '<div class="team-grid">' + grid + '</div>' +
        '</div>' +
      '</section>';
    }).join('');

    root.innerHTML = html;

    root.querySelectorAll('.team-member').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var name = btn.getAttribute('data-name');
        var group = btn.getAttribute('data-group');
        var member = members.filter(function (m) { return m.name === name && m.group === group; })[0];
        if (member) {
          member.group = member.group || group;
          openModal(member);
        }
      });
    });
  }

  /* ---------- 里程碑 ---------- */
  function renderMilestones() {
    var root = document.getElementById('milestones');
    if (!root || typeof window.MILESTONES_DATA === 'undefined') return;
    var years = window.MILESTONES_DATA[lang] || [];
    root.innerHTML = years.map(function (m) {
      return '<button class="milestone-btn" data-year="' + escapeHtml(m.year) + '">' +
        escapeHtml(m.year) + '</button>';
    }).join('');
    root.querySelectorAll('.milestone-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openMilestoneModal(btn.getAttribute('data-year'));
      });
    });
  }

  function buildMilestoneModal() {
    var overlay = document.getElementById('milestoneModal');
    if (!overlay) return;
    overlay.innerHTML =
      '<div class="modal milestone-modal" role="dialog" aria-modal="true">' +
        '<button class="modal-close" aria-label="关闭">×</button>' +
        '<div class="milestone-year"></div>' +
        '<ul class="milestone-items"></ul>' +
      '</div>';
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeMilestoneModal();
    });
    overlay.querySelector('.modal-close').addEventListener('click', closeMilestoneModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMilestoneModal();
    });
  }

  function openMilestoneModal(year) {
    var overlay = document.getElementById('milestoneModal');
    if (!overlay || typeof window.MILESTONES_DATA === 'undefined') return;
    var years = window.MILESTONES_DATA[lang] || [];
    var m = years.filter(function (x) { return x.year === year; })[0];
    if (!m) return;
    overlay.querySelector('.milestone-year').textContent = year;
    overlay.querySelector('.milestone-items').innerHTML = (m.items || []).map(function (it) {
      return '<li>' + escapeHtml(it) + '</li>';
    }).join('');
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMilestoneModal() {
    var overlay = document.getElementById('milestoneModal');
    if (!overlay) return;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* ---------- 初始化 ---------- */
  buildNav();
  buildFooter();
  initHeader();
  buildModal();
  buildMilestoneModal();
  renderTeam();
  renderMilestones();
})();