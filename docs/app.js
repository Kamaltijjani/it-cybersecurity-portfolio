(() => {
  'use strict';
  const projects = [
{"id": "market-confluence", "name": "Market Confluence", "subtitle": "ChatGPT research assistant", "category": "agents", "categoryLabel": "AI & automation", "type": "Research assistant", "art": "mentor", "description": "A ChatGPT-based assistant for structured forex, crypto, and stock research, with evidence checks and a private journal.", "tags": ["ChatGPT", "SMC / ICT", "Price action", "Research workflows"], "overview": "Market Confluence is my ChatGPT research assistant for exploring forex, crypto, and stocks. It combines technical, fundamental, and sentiment research in an on-demand workflow, with a companion private research desk.", "approach": "The workflow separates higher-timeframe context, setup analysis, and entry conditions. Provisional SMC, ICT, and price-action rulebooks guide evidence checks, chart annotations, and structured reports. The GitHub Trading Agent is a related implementation of the same research concept.", "features": ["Standard day and swing research workflows", "Conditional setup reports and chart annotation tools", "Setup consistency validation and private journaling", "Explicit WATCH / NO_TRADE outcomes when evidence is incomplete"], "scope": "Research assistance with manual trade execution. Live TradingView access, messaging delivery, and continuous monitoring are not verified. No proven win rate or automated trading is claimed.", "lens": "Keep source timestamps, missing evidence, and invalidation visible. Private journal records and account information are not published in this portfolio.", "repository": null, "sourceLabel": null, "sourceNote": "Built as a ChatGPT assistant with a private companion desk. Explore the related GitHub Trading Agent entry for the public implementation."},
{"id": "github-trading-agent", "name": "GitHub Trading Agent", "subtitle": "Market Confluence · Node.js and n8n", "category": "agents", "categoryLabel": "AI & automation", "type": "Prototype · draft PR", "art": "agent", "description": "The Market Confluence implementation on GitHub: a research service, four n8n workflows, and a durable journal.", "tags": ["Node.js", "n8n", "Docker", "JavaScript"], "overview": "A standalone trading-research prototype developed for Market Confluence and published on the trading-mentor-agent branch of my portfolio repository. It translates the assistant concept into a service and workflow package.", "approach": "An authenticated Node.js service coordinates research requests, journal persistence, and request deduplication. Four n8n workflows separate analysis, private Telegram requests, follow-up observations, and measured results. Docker setup scripts and automated tests support local development.", "features": ["Authenticated research service and durable journal", "Four separate n8n workflow definitions", "Request deduplication and expiring observations", "Docker setup, automated checks, and documented integration gaps"], "scope": "Open draft pull request; not a fully operational signal agent. Live TradingView collection, deterministic confirmed-signal rules, WhatsApp integration, live n8n execution, and always-on deployment remain unfinished or unverified. Missing fresh evidence returns NO_TRADE.", "lens": "No broker execution. Keep credentials outside source control, restrict private messaging to the owner, and block actionable confirmations when required evidence is absent.", "repository": "https://github.com/Kamaltijjani/it-cybersecurity-portfolio/tree/trading-mentor-agent/projects/market-confluence-mentor", "sourceLabel": "View agent source", "sourceNote": "Public source on the trading-mentor-agent branch; draft pull request #2. This is the implementation of Market Confluence, rather than a separate trading product.", "attribution": null},
    {
      id: 'ohms', name: 'OHMS', subtitle: 'Online Hospital Management System', category: 'systems', categoryLabel: 'Systems design', type: 'Academic project', art: 'ohms',
      description: 'Designing connected patient records, appointments, and pharmacy workflows for the FUD Health Centre.',
      tags: ['Systems analysis', 'UML', 'Database design', 'Data protection'],
      overview: 'A five-member academic project for the Federal University Dutse Health Centre. OHMS explores how a manual hospital workflow can become a coordinated online system for administrators, doctors, patients, and pharmacists.',
      approach: 'The design brings together use cases, data-flow diagrams, an entity relationship model, and sequence and activity diagrams. It maps how patient information moves through registration, consultation, prescriptions, and pharmacy operations.',
      features: ['Patient registration and medical record workflows', 'Appointment booking and doctor availability flows', 'Prescription and medicine inventory workflows', 'Role-based user journeys and a relational database model'],
      scope: 'Academic systems analysis and design. The portfolio describes the proposed workflow; it does not claim a deployed hospital system, implemented security controls, or real patient data processing.',
      lens: 'Further implementation should define role permissions, protect patient records, audit sensitive actions, and validate appointment availability on the server.',
      repository: null, sourceLabel: null, sourceNote: 'Project documentation is not linked to a public repository yet.'
    },
    {
      id: 'farmbridge', name: 'FarmBridge+', subtitle: 'Farmer-to-buyer marketplace prototype', category: 'web', categoryLabel: 'Web development', type: 'Frontend prototype', art: 'farm',
      description: 'A farmer-to-buyer marketplace interface with searchable listings and category-based exploration.',
      tags: ['HTML', 'CSS', 'JavaScript', 'Search & filtering'],
      overview: 'A static marketplace prototype exploring how farmers and buyers could discover products through a simple, accessible web interface. The repository includes a lightweight landing page and an alternate interactive design.',
      approach: 'Built with HTML, CSS, and JavaScript, without a build step. The main page supports product and seller search; the alternate design combines category filters, search, a sample map, and testimonial navigation.',
      features: ['Searchable demonstration listings', 'Combined search and category filters in the alternate design', 'Responsive navigation and testimonial controls', 'Sample map with a fallback when the map library is unavailable'],
      scope: 'Frontend demonstration only. Products, prices, testimonials, statistics, and map locations are demo content. No authentication, checkout, messaging, order processing, or database backend is implemented.',
      lens: 'A production version would need seller verification, safe input handling, authorized access to orders, and privacy protections for contact details.',
      repository: 'https://github.com/Kamaltijjani/Farmbridge-plus', sourceLabel: 'View repository', sourceNote: 'Source and project scope are documented in the repository README.'
    },
    {
      id: 'gdp', name: 'GDP Dashboard', subtitle: 'Interactive economic data exploration', category: 'data', categoryLabel: 'Data', type: 'Template-based project', art: 'data',
      description: 'Exploring World Bank GDP data through country selection, year ranges, and comparative charts.',
      tags: ['Python', 'Streamlit', 'pandas', 'Data visualization'],
      overview: 'A Streamlit application for exploring World Bank GDP data. This project builds on the Streamlit GDP dashboard template and presents country comparisons through interactive charts and summary metrics.',
      approach: 'The Python application uses pandas to reshape a local CSV from yearly columns into year-and-GDP rows. Country and year selections filter the dataset before Streamlit renders a line chart and GDP metrics.',
      features: ['Country multiselect and year-range slider', 'GDP-over-time comparisons', 'Country metrics with growth comparisons', 'Handling for empty country selections and missing or invalid GDP values'],
      scope: 'A learning project adapted from the Streamlit GDP dashboard template. The repository data covers 1960–2022 and contains missing observations; it is not a live economic data feed.',
      lens: 'Data tools should make dataset age and missing observations clear so users can interpret comparisons responsibly.',
      repository: 'https://github.com/Kamaltijjani/gdp-dashboard', sourceLabel: 'View repository', sourceNote: 'Original template: Streamlit GDP Dashboard. Apache 2.0 license.', attribution: 'https://github.com/streamlit/gdp-dashboard-template'
    },
    {
      id: 'fudportal', name: 'FUD Portal', subtitle: 'Independent student portal UI study', category: 'web', categoryLabel: 'Web development', type: 'Educational prototype', art: 'portal',
      description: 'An educational portal interface exploring responsive navigation, a demo dashboard, and calendar controls.',
      tags: ['HTML', 'CSS', 'JavaScript', 'Responsive UI'],
      overview: 'An independent educational interface project inspired by Federal University Dutse. It explores a student-facing experience through a demonstration dashboard, calendar, and responsive navigation.',
      approach: 'The static interface uses HTML, CSS, and JavaScript. Interactive elements include a theme switch, month navigation, testimonial rotation, and a demonstration dashboard opened with an optional display name.',
      features: ['Responsive navigation and theme toggle', 'Previous and next month calendar controls', 'Demo dashboard and logout interaction', 'Feedback for unavailable actions and the unconnected newsletter form'],
      scope: 'Not the official FUD portal. Dashboard records are fictional and institutional claims are unverified. There is no real login, registration, results, payment, or newsletter backend. The demo does not collect passwords.',
      lens: 'A portal prototype should distinguish demo content from official services. Production would require institutional authorization, verified content, and appropriate identity and access controls.',
      repository: 'https://github.com/Kamaltijjani/Myportal.fud.edu.ng', sourceLabel: 'View repository', sourceNote: 'Source and educational limitations are documented in the repository README.'
    }
  ];
  const state = { filter: 'all', query: '', view: 'grid', currentProject: null, opener: null };
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const categoryName = key => ({all: 'all disciplines', systems: 'systems design', web: 'web development', data: 'data', agents: 'AI & automation'})[key];
  const matches = project => {
    const words = state.query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const haystack = [project.name, project.subtitle, project.description, project.categoryLabel, ...project.tags].join(' ').toLowerCase();
    return (state.filter === 'all' || project.category === state.filter) && words.every(word => haystack.includes(word));
  };
  function artwork(project, index) {
    const head = (name, right) => `<div class="preview-head"><strong>${name}</strong><span>${right}</span></div>`;
    let content;
    if (project.art === 'ohms') content = `<div class="preview-window">${head('OHMS +', 'HEALTH CENTRE')}<div class="preview-body"><div class="preview-sidebar"><span>Overview</span><span>Patients</span><span>Appointments</span><span>Pharmacy</span></div><div class="preview-main"><h4>A connected care workflow.</h4><div class="preview-metrics"><span>Patients<b>◎</b></span><span>Appointments<b>▦</b></span><span>Pharmacy<b>+</b></span></div><div class="preview-row"><i></i><em></em></div><div class="preview-row"><i></i><em></em></div><div class="preview-row"><i></i><em></em></div></div></div></div>`;
    if (project.art === 'farm') content = `<div class="preview-window farm-preview">${head('FarmBridge+', 'GROW · CONNECT · TRADE')}<div class="farm-banner">From the farm.<br>Closer to you.<span>❧</span></div><div class="farm-products"><span>◉</span><span>❧</span><span>◒</span></div></div>`;
    if (project.art === 'data') content = `<div class="preview-window data-preview">${head('GDP / EXPLORER', 'DATA VISUALIZATION')}<h4>A wider view of the economy.</h4><div class="data-legend"><span>Country A</span><span>Country B</span></div><svg class="graph" viewBox="0 0 300 78" preserveAspectRatio="none"><path class="graph-grid" d="M0 15H300M0 39H300M0 63H300"/><path stroke="#548bb0" d="M0 66L20 64L40 60L60 61L80 49L100 46L120 50L140 34L160 39L180 28L200 30L220 13L240 22L260 10L280 14L300 4"/><path stroke="#9a9dbb" d="M0 72L20 67L40 70L60 64L80 65L100 60L120 62L140 51L160 57L180 43L200 47L220 37L240 40L260 28L280 31L300 19"/></svg><div class="graph-label"><span>Year range</span><span>Illustrative chart</span></div></div>`;
    if (project.art === 'portal') content = `<div class="preview-window portal-preview">${head('FUD / PORTAL', 'INDEPENDENT UI STUDY')}<div class="portal-banner">A place for your<br>next chapter.</div><div class="portal-tiles"><span><b>▦</b>Calendar</span><span><b>◫</b>Dashboard</span><span><b>◎</b>Explore</span></div></div>`;
    if (project.art === 'mentor' || project.art === 'agent') content = `<div class="preview-window portal-preview">${head(project.art === 'mentor' ? 'MARKET CONFLUENCE' : 'GITHUB / AGENT', 'RESEARCH WORKFLOW')}<div class="portal-banner">${project.art === 'mentor' ? 'Evidence first.<br>Decisions with context.' : 'Research.<br>Validate. Journal.'}</div><div class="portal-tiles"><span><b>◎</b>Analyze</span><span><b>◇</b>Validate</span><span><b>▤</b>Journal</span></div></div>`;
    return `<div class="project-art ${project.art}-art" aria-hidden="true"><span class="project-number">PROJECT / 0${index + 1}</span><span class="art-caption">INTERFACE ILLUSTRATION</span>${content}</div>`;
  }
  function renderProjects() {
    const visible = projects.filter(matches);
    $('#projects').innerHTML = visible.map(project => {
      const index = projects.indexOf(project);
      return `<article class="project-card" aria-labelledby="project-${project.id}">${artwork(project,index)}<div class="project-info"><div class="project-meta"><span>${escapeHtml(project.categoryLabel.toUpperCase())}</span><span class="meta-dot"></span><span>${escapeHtml(project.type)}</span></div><div class="project-title-row"><h3 id="project-${project.id}">${escapeHtml(project.name)}</h3><button class="project-open-icon" data-project="${project.id}" type="button" aria-label="Explore ${escapeHtml(project.name)}">↗</button></div><p class="project-description">${escapeHtml(project.description)}</p><div class="project-tags">${project.tags.map(tag=>`<span>${escapeHtml(tag)}</span>`).join('')}</div><div class="project-actions"><button data-project="${project.id}" type="button">Explore project <span aria-hidden="true">→</span></button>${project.repository ? `<a href="${project.repository}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(project.name)} repository on GitHub (opens in a new tab)">Source code <span aria-hidden="true">↗</span></a>` : ''}</div></div></article>`;
    }).join('');
    $('#empty-state').hidden = visible.length !== 0;
    const query = state.query.trim() ? ` matching “${state.query.trim()}”` : '';
    $('#project-count').textContent = `${String(visible.length).padStart(2,'0')} of ${String(projects.length).padStart(2,'0')} projects · ${categoryName(state.filter)}${query}`;
    $$('.filter').forEach(button => {
      const active = button.dataset.filter === state.filter;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }
  function resetFilters() { state.filter = 'all'; state.query = ''; $('#project-search').value = ''; renderProjects(); }
  const dialog = $('#project-dialog');
  function renderDetails(project) {
    state.currentProject = project.id;
    $('#dialog-content').innerHTML = `<p class="dialog-meta">${escapeHtml(project.categoryLabel)} / ${escapeHtml(project.type)}</p><h2 id="dialog-title">${escapeHtml(project.name)}</h2><p class="dialog-lead">${escapeHtml(project.overview)}</p><div class="project-tags dialog-tags">${project.tags.map(tag=>`<span>${escapeHtml(tag)}</span>`).join('')}</div><div class="dialog-detail-grid"><section><h3>THE APPROACH</h3><p>${escapeHtml(project.approach)}</p></section><section><h3>${project.id==='ohms'?'PROPOSED WORKFLOWS':'WHAT TO EXPLORE'}</h3><ul>${project.features.map(feature=>`<li>${escapeHtml(feature)}</li>`).join('')}</ul></section><section><h3>SECURITY & RESPONSIBILITY</h3><p>${escapeHtml(project.lens)}</p></section><section><h3>PROJECT RESOURCES</h3><p>${escapeHtml(project.sourceNote)}</p>${project.attribution?`<a class="text-link" href="${project.attribution}" target="_blank" rel="noopener noreferrer">Original Streamlit template ↗</a>`:''}</section></div><div class="scope-note"><h3>PROJECT SCOPE</h3><p>${escapeHtml(project.scope)}</p></div><div class="dialog-source-row">${project.repository?`<a class="button button-dark" href="${project.repository}" target="_blank" rel="noopener noreferrer">${project.sourceLabel}<span aria-hidden="true">↗</span></a>`:`<a class="button button-dark" href="#credentials" data-close-link>View my background <span aria-hidden="true">↗</span></a>`}<a class="text-link" href="https://github.com/Kamaltijjani" target="_blank" rel="noopener noreferrer">GitHub profile ↗</a></div>`;
    $('#dialog-position').textContent = `${projects.indexOf(project)+1} / ${projects.length}`;
    dialog.scrollTop = 0;
  }
  function openProject(id, opener) {
    const project = projects.find(item => item.id === id);
    if (!project) return;
    state.opener = opener || document.activeElement;
    renderDetails(project);
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('modal-open');
    $('#close-dialog').focus();
  }
  function closeProject() {
    if (dialog.open) dialog.close();
    document.body.classList.remove('modal-open');
    if (state.opener && state.opener.isConnected) state.opener.focus();
  }
  function stepProject(direction) {
    const current = projects.findIndex(project => project.id === state.currentProject);
    renderDetails(projects[(current + direction + projects.length) % projects.length]);
  }
  $$('.filter').forEach(button => button.addEventListener('click', () => { state.filter=button.dataset.filter; renderProjects(); }));
  $('#project-search').addEventListener('input', event => { state.query = event.target.value; renderProjects(); });
  $('#reset-filters').addEventListener('click', () => { resetFilters(); $('#project-search').focus(); });
  $('#projects').addEventListener('click', event => { const button=event.target.closest('[data-project]'); if(button) openProject(button.dataset.project,button); });
  $('#close-dialog').addEventListener('click', closeProject);
  dialog.addEventListener('cancel', event => {event.preventDefault();closeProject();});
  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
  dialog.addEventListener('click', event => {
    if (event.target.closest('[data-close-link]')) closeProject();
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeProject();
    }
  });
  $('#previous-project').addEventListener('click', () => stepProject(-1));
  $('#next-project').addEventListener('click', () => stepProject(1));
  for (const view of ['grid','list']) $(`#${view}-view`).addEventListener('click', () => {
    state.view=view;
    $('#projects').classList.toggle('list-layout',view==='list');
    for (const name of ['grid','list']) { const active = view===name; $(`#${name}-view`).setAttribute('aria-pressed',String(active)); $(`#${name}-view`).classList.toggle('active',active); }
  });
  const menuButton = $('#menu-toggle');
  function setMenu(open) { menuButton.setAttribute('aria-expanded',String(open)); $('#navigation').classList.toggle('is-open',open); }
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded')!=='true'));
  $$('#navigation a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {if(event.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true'){setMenu(false);menuButton.focus();}});
  document.addEventListener('click', event => {if(!event.target.closest('.header'))setMenu(false);});
  $$('.skill-work-link').forEach(link=>link.addEventListener('click',()=>{
    state.filter=link.dataset.skillFilter||'all';state.query=link.dataset.skillSearch||'';$('#project-search').value=state.query;renderProjects();
  }));
  $('#copy-github').addEventListener('click',async()=>{
    const url='https://github.com/Kamaltijjani';
    try { if(!navigator.clipboard)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(url);$('#copy-status').textContent='GitHub profile link copied.'; }
    catch { $('#copy-status').textContent=`Copy this link: ${url}`; }
  });
  $('#year').textContent=String(new Date().getFullYear());
  renderProjects();
})();
