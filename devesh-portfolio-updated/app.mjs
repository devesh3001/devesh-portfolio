import { projects, skills, solveSupply, noveltyScores, screenNovelty, filterProjects } from './model.mjs';
import { componentStrip, initExperience } from './experience.mjs';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const money = value => '$' + Math.round(value).toLocaleString('en-US');
let toastTimer;

function toast(message) {
  $('#toast').textContent = message;
  $('#toast').classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3000);
}

function projectLinks(project) {
  return `<div class="project-links">${project.website ? `<a href="${escape(project.website)}" target="_blank" rel="noopener noreferrer" aria-label="Visit ${escape(project.name)} website">Website ↗</a>` : ''}<a href="${escape(project.repository)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(project.name)} source on GitHub">GitHub ↗</a></div>`;
}

function renderProjects(category = 'all') {
  const selected = filterProjects(category);
  $('#project-grid').innerHTML = selected.map(project => `
    <article class="project-card" aria-labelledby="project-${project.id}">
      <div class="project-heading">
        <div class="project-category"><span class="project-index">${project.number}</span><span>${escape(project.category)}</span></div>
        <h3 id="project-${project.id}">${escape(project.name)}</h3>
        <p class="project-context">${escape(project.context)}</p>
        ${project.award ? `<a class="project-award" href="${escape(project.award.certificate)}" data-open-certificate target="_blank" rel="noopener noreferrer">${escape(project.award.title)} <span aria-hidden="true">↗</span></a>` : ''}
        <div class="project-tags">${project.tags.map(tag => `<span>${escape(tag)}</span>`).join('')}</div>
      </div>
      <div class="project-body">
        <p class="project-description">${escape(project.description)}</p>
        <ul class="project-features" aria-label="${escape(project.name)} key features">${project.features.map(feature => `<li>${escape(feature)}</li>`).join('')}</ul>
        <div class="project-metrics">${project.metrics.slice(0, 2).map(metric => `<div class="project-metric"><strong>${escape(metric.value)}</strong><span>${escape(metric.label)}</span></div>`).join('')}</div>
        <div class="project-bottom"><button class="case-button" data-case="${project.id}" aria-label="Read ${escape(project.name)} project details">Project details <span aria-hidden="true">↗</span></button>${projectLinks(project)}</div>
      </div>
    </article>`).join('');
  $('#all-project-count').textContent = projects.length;
  $('#work-count').textContent = selected.length + (selected.length === 1 ? ' project' : ' projects');
  $$('.filter').forEach(button => {
    const active = button.dataset.filter === category;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function selectSkills(key) {
  if (!skills[key]) return;
  $('#skill-chips').innerHTML = skills[key].tools.map(tool => `<span>${escape(tool)}</span>`).join('');
  $('#skill-note').textContent = skills[key].note;
  $$('[data-skill]').forEach(button => {
    const active = button.dataset.skill === key;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

const labNames = ['supply', 'anomaly', 'inventory'];
function selectLab(key, focus = false) {
  if (!labNames.includes(key)) return;
  for (const name of labNames) {
    const selected = name === key;
    const tab = $('#tab-' + name);
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    $('#panel-' + name).hidden = !selected;
  }
  if (focus) $('#tab-' + key).focus();
}

function drawSupplyChart(scenario) {
  const width = 580, height = 210, left = 43, right = 19, top = 18, bottom = 34;
  const maximum = 240;
  const chartHeight = height - top - bottom;
  const weights = [.7, .78, .75, .9, 1.02, 1];
  const values = weights.map(weight => Math.round(scenario.demand * weight));
  const plans = values.map(demand => solveSupply({ ...scenario, demand }));
  const x = i => left + 27 + i * (width - left - right - 54) / 5;
  const y = value => top + chartHeight * (1 - value / maximum);
  let svg = `<title>Illustrative demand and delivery</title><desc>Synthetic demand scenarios across six periods. Last-period demand is ${scenario.demand} units and delivery is ${Math.round(plans[5].delivered)} units.</desc>`;
  for (const tick of [0, 60, 120, 180, 240]) svg += `<path class="chart-grid" d="M${left} ${y(tick)}H${width - right}"/><text x="${left - 10}" y="${y(tick) + 3}" text-anchor="end">${tick}</text>`;
  const line = values.map((value, i) => `${i === 0 ? 'M' : 'L'}${x(i)} ${y(value)}`).join(' ');
  const upper = values.map((value, i) => `${i === 0 ? 'M' : 'L'}${x(i)} ${y(value * 1.1)}`).join(' ');
  const lower = [...values].reverse().map((value, reverseIndex) => `L${x(5 - reverseIndex)} ${y(value * .9)}`).join(' ');
  svg += `<path d="${upper} ${lower}Z" fill="var(--purple)" opacity=".075"/>`;
  plans.forEach((plan, i) => {
    const barY = y(plan.delivered);
    svg += `<rect x="${x(i) - 17}" y="${barY}" width="34" height="${Math.max(0, y(0) - barY)}" rx="3" fill="var(--green)" opacity="${i === 5 ? '.38' : '.18'}"/><rect x="${x(i) - 17}" y="${barY}" width="34" height="3" rx="1.5" fill="var(--green)"/><text x="${x(i)}" y="${height - 16}" text-anchor="middle">${String(i + 1).padStart(2, '0')}</text>`;
  });
  svg += `<path d="${line}" fill="none" stroke="var(--purple)" stroke-width="2" stroke-linejoin="round"/>`;
  values.forEach((value, i) => svg += `<circle cx="${x(i)}" cy="${y(value)}" r="${i === 5 ? 4 : 3}" fill="var(--paper)" stroke="var(--purple)" stroke-width="1.8"/>`);
  svg += '<text x="43" y="9" style="font-size:8px">UNITS</text><text x="560" y="207" text-anchor="end" style="font-size:7px">SYNTHETIC SCENARIO PERIODS</text>';
  $('#supply-chart').innerHTML = svg;
}

function updateSupply() {
  const scenario = { demand: Number($('#demand').value), outage: Number($('#outage').value), carbon: Number($('#carbon').value) };
  const plan = solveSupply(scenario);
  $('#demand-value').textContent = scenario.demand + ' units';
  $('#outage-value').textContent = scenario.outage + '%';
  $('#carbon-value').textContent = '$' + scenario.carbon + ' / unit CO₂';
  $('#coverage-value').innerHTML = Math.round(plan.coverage) + '<span>%</span>';
  $('#cost-value').textContent = money(plan.cost);
  $('#emissions-value').innerHTML = plan.emissions.toFixed(1) + '<span> u</span>';
  $('#marine-value').textContent = plan.marine;
  $('#truck-value').textContent = plan.backup;
  $('#shortage-value').textContent = plan.shortage;
  $('#marine-bar').style.width = 100 * plan.marine / scenario.demand + '%';
  $('#truck-bar').style.width = 100 * plan.backup / scenario.demand + '%';
  $('#shortage-bar').style.width = 100 * plan.shortage / scenario.demand + '%';
  let explanation = plan.shortage > 0
    ? `Capacity is the bottleneck: ${plan.cargoes} whole marine cargoes plus 60 units of backup can deliver ${plan.delivered} of ${scenario.demand} units. ${plan.shortage} units remain unmet.`
    : `${plan.cargoes} whole marine cargo${plan.cargoes === 1 ? '' : 'es'}${plan.backup ? ` plus ${plan.backup} units via ${plan.route}` : ''} cover the forecast. ${scenario.carbon > 0 ? 'The carbon price is included when choosing the route.' : 'With no carbon charge, the model minimizes operating cost.'}`;
  if (plan.surplus) explanation += ` ${plan.surplus} extra units from the final cargo go to stock.`;
  $('#supply-explanation').textContent = explanation;
  drawSupplyChart(scenario);
}

function updateAnomaly() {
  const threshold = Number($('#threshold').value) / 100;
  const count = screenNovelty(threshold).length;
  $('#threshold-value').textContent = threshold.toFixed(2);
  $('#candidate-count').textContent = count;
  $('#candidate-boundary').textContent = 'score > ' + threshold.toFixed(2);
  const left = 44, right = 559, top = 18, bottom = 223;
  const y = score => bottom - (score - .3) / .6 * (bottom - top);
  const x = i => left + 8 + i * (right - left - 16) / (noveltyScores.length - 1);
  let svg = `<title>Synthetic novelty scores</title><desc>${count} of 36 synthetic samples exceed a novelty threshold of ${threshold.toFixed(2)}. Selected samples are marked with rings.</desc>`;
  for (const tick of [.4, .6, .8]) svg += `<path class="chart-grid" d="M${left} ${y(tick)}H${right}"/><text x="${left - 10}" y="${y(tick) + 3}" text-anchor="end">${tick.toFixed(1)}</text>`;
  noveltyScores.forEach((point, i) => {
    const selected = point.score > threshold;
    const color = selected ? 'var(--flag)' : 'var(--green)';
    svg += `<path d="M${x(i)} ${bottom}V${y(point.score)}" stroke="${color}" stroke-opacity=".18" stroke-width="1.4"/><circle cx="${x(i)}" cy="${y(point.score)}" r="${selected ? 4.6 : 3}" fill="${color}"/>`;
    if (selected) svg += `<circle cx="${x(i)}" cy="${y(point.score)}" r="8" fill="none" stroke="${color}" stroke-opacity=".45"/>`;
  });
  svg += `<path class="threshold-line" d="M${left} ${y(threshold)}H${right}"/><rect x="${right - 72}" y="${y(threshold) - 20}" width="73" height="17" rx="3" fill="var(--paper)"/><text class="threshold-label" x="${right - 6}" y="${y(threshold) - 8}" text-anchor="end">T = ${threshold.toFixed(2)}</text>`;
  for (const index of [0, 8, 17, 26, 35]) svg += `<text x="${x(index)}" y="246" text-anchor="middle">${index + 1}</text>`;
  svg += '<text x="44" y="9" style="font-size:8px">NOVELTY</text><text x="559" y="259" text-anchor="end" style="font-size:7px">SYNTHETIC SAMPLE INDEX</text>';
  $('#anomaly-chart').innerHTML = svg;
}

function openDialog(dialog) {
  $$('dialog[open]').forEach(open => { if (open !== dialog) open.close(); });
  dialog.showModal();
  document.body.classList.add('dialog-open');
  dialog.scrollTop = 0;
}

function openCase(id) {
  const project = projects.find(project => project.id === id);
  if (!project) return;
  $('#case-category').textContent = project.category.toUpperCase();
  $('#case-content').innerHTML = `<div class="case-content"><p class="case-eyebrow">${escape(project.context)}</p><h2 id="case-title">${escape(project.name)}</h2>${project.award ? `<div class="case-award"><strong>${escape(project.award.title)}</strong><span>${escape(project.award.detail)}</span><a href="${escape(project.award.certificate)}" target="_blank" rel="noopener noreferrer">View certificate ↗</a></div>` : ''}<p class="case-lede">${escape(project.question)}</p><div class="case-result-grid">${project.metrics.map(metric => `<div><strong>${escape(metric.value)}</strong><span>${escape(metric.label)}</span></div>`).join('')}</div>${componentStrip(project.id)}<section class="case-section"><h3>Implementation</h3><ol>${project.pipeline.map(step => `<li>${escape(step)}</li>`).join('')}</ol></section><section class="case-section"><h3>Design choice</h3><p>${escape(project.decision)}</p></section><section class="case-section"><h3>${escape(project.evidenceTitle || 'Results')}</h3><p>${escape(project.evidence)}</p></section><section class="case-section case-caution"><h3>Limitations</h3><p>${escape(project.limitation)}</p></section><div class="case-actions">${project.website ? `<a class="button primary" href="${escape(project.website)}" target="_blank" rel="noopener noreferrer">Visit website ↗</a>` : ''}<a class="button ${project.website ? 'secondary' : 'primary'}" href="${escape(project.repository || 'https://github.com/devesh3001')}" target="_blank" rel="noopener noreferrer">View source on GitHub ↗</a>${project.lab ? `<button class="button secondary" data-go-lab="${project.lab}">Open method demo →</button>` : ''}</div><p class="case-provenance">${escape(project.provenance)}</p></div>`;
  openDialog($('#case-dialog'));
}

const commands = [
  { label: 'Selected projects', detail: 'View all selected projects', action: () => { renderProjects('all'); jump('work'); } },
  { label: 'Method demos', detail: 'Planning, novelty screening, and FEFO inventory', action: () => jump('lab') },
  { label: 'About Devesh', detail: 'Education and project tools', action: () => jump('about') },
  { label: 'Contact', detail: 'Email, LinkedIn, and GitHub', action: () => jump('contact') },
  { label: 'Resume PDF', detail: 'Open the full resume', keywords: 'resume cv pdf', action: () => window.open('./assets/Devesh_Srivastava_Resume.pdf', '_blank', 'noopener,noreferrer') },
  { label: '60-second overview', detail: 'Education, leadership, and three projects to start with', keywords: 'profile recruiter summary brief', action: () => openDialog($('#profile-dialog')) },
  { label: 'NSSC award certificate', detail: 'Second place · Data Analytics · IIT Kharagpur', keywords: 'mars award certificate nssc', action: () => openDialog($('#certificate-dialog')) },
  ...projects.map(project => ({ label: project.name, detail: project.category, action: () => openCase(project.id) }))
];
let matchingCommands = commands;
let commandIndex = 0;

function jump(id) { document.getElementById(id).scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); }

function renderCommands(query = '') {
  matchingCommands = commands.filter(command => (command.label + ' ' + command.detail + ' ' + (command.keywords || '')).toLowerCase().includes(query.toLowerCase().trim()));
  commandIndex = 0;
  $('#command-results').innerHTML = matchingCommands.length
    ? matchingCommands.map((command, index) => `<button class="command-result${index === 0 ? ' selected' : ''}" data-command-index="${index}"><span>${escape(command.label)}</span><small>${escape(command.detail)} ↗</small></button>`).join('')
    : '<p class="command-empty">No matches. Try “projects”, “resume”, or a project name.</p>';
}

function executeCommand(index) {
  const command = matchingCommands[index];
  if (!command) return;
  $('#command-dialog').close();
  command.action();
}

function openCommands() {
  renderCommands();
  $('#command-input').value = '';
  openDialog($('#command-dialog'));
  $('#command-input').focus();
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
  $('#theme-toggle').setAttribute('aria-label', label);
  $('#theme-toggle').title = label;
  $('#theme-toggle').innerHTML = theme === 'dark'
    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M19 5l-1.5 1.5m-11 11L5 19"/></svg>'
    : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M21 12.9A9 9 0 0 1 11.1 3a9 9 0 1 0 9.9 9.9Z"/></svg>';
  try { localStorage.setItem('devesh-portfolio-theme', theme); } catch { /* The theme still works if storage is unavailable. */ }
}

function closeMenu() {
  $('#mobile-nav').hidden = true;
  $('#menu-toggle').setAttribute('aria-expanded', 'false');
  $('#menu-toggle').setAttribute('aria-label', 'Open navigation');
}

// Bind the same controls for pointer and keyboard operation.
$$('.filter').forEach(button => button.addEventListener('click', () => renderProjects(button.dataset.filter)));
$$('[data-skill]').forEach(button => button.addEventListener('click', () => selectSkills(button.dataset.skill)));
document.addEventListener('click', event => {
  const button = event.target.closest('[data-case]');
  if (button) openCase(button.dataset.case);
});
document.addEventListener('click', event => {
  if (!event.target.closest('[data-open-certificate]')) return;
  event.preventDefault();
  openDialog($('#certificate-dialog'));
});
$$('[data-open-profile]').forEach(button => button.addEventListener('click', () => openDialog($('#profile-dialog'))));
$$('dialog').forEach(dialog => {
  dialog.addEventListener('click', event => {
    if (event.target.closest('[data-close-dialog]')) dialog.close();
    else if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    }
  });
  dialog.addEventListener('close', () => {
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('dialog-open');
  });
});
document.addEventListener('click', event => {
  const button = event.target.closest('[data-go-lab]');
  if (!button) return;
  $$('dialog[open]').forEach(dialog => dialog.close());
  selectLab(button.dataset.goLab);
  jump('lab');
});
document.addEventListener('click', event => {
  const button = event.target.closest('[data-jump]');
  if (!button || !document.getElementById(button.dataset.jump)) return;
  $$('dialog[open]').forEach(dialog => dialog.close());
  jump(button.dataset.jump);
});
for (const name of labNames) {
  const tab = $('#tab-' + name);
  tab.addEventListener('click', () => selectLab(name));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const current = labNames.indexOf(name);
    const next = event.key === 'Home' ? labNames[0] : event.key === 'End' ? labNames.at(-1) : labNames[(current + (event.key === 'ArrowRight' ? 1 : -1) + labNames.length) % labNames.length];
    selectLab(next, true);
  });
}
for (const id of ['demand', 'outage', 'carbon']) $('#' + id).addEventListener('input', updateSupply);
$('#reset-supply').addEventListener('click', () => {
  $('#demand').value = 120; $('#outage').value = 15; $('#carbon').value = 40;
  updateSupply();
});
$('#threshold').addEventListener('input', updateAnomaly);
$('#reset-anomaly').addEventListener('click', () => { $('#threshold').value = 62; updateAnomaly(); });
$('#theme-toggle').addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'));
$('#menu-toggle').addEventListener('click', () => {
  const open = $('#mobile-nav').hidden;
  $('#mobile-nav').hidden = !open;
  $('#menu-toggle').setAttribute('aria-expanded', String(open));
  $('#menu-toggle').setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
$$('#mobile-nav a').forEach(link => link.addEventListener('click', closeMenu));
$('#print-profile').addEventListener('click', () => window.print());
$('#copy-link').addEventListener('click', async () => {
  const url = document.querySelector('link[rel="canonical"]')?.href || location.origin + location.pathname;
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(url);
    toast('Portfolio link copied.');
  } catch {
    const field = document.createElement('textarea');
    field.value = url; field.setAttribute('aria-hidden', 'true');
    Object.assign(field.style, { position: 'fixed', opacity: '0', width: '1px', height: '1px', top: '0' });
    document.body.appendChild(field); field.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch { /* Report the fallback truthfully. */ }
    field.remove();
    $('#copy-link').focus();
    toast(copied ? 'Portfolio link copied.' : 'Copy the link from your browser’s address bar.');
  }
});
$('#command-open').addEventListener('click', openCommands);
$('#command-input').addEventListener('input', event => renderCommands(event.target.value));
$('#command-input').addEventListener('keydown', event => {
  if (event.key === 'Enter') { event.preventDefault(); executeCommand(commandIndex); }
  else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    if (!matchingCommands.length) return;
    commandIndex = (commandIndex + (event.key === 'ArrowDown' ? 1 : -1) + matchingCommands.length) % matchingCommands.length;
    $$('.command-result').forEach((button, index) => button.classList.toggle('selected', index === commandIndex));
    $$('.command-result')[commandIndex]?.scrollIntoView({ block: 'nearest' });
  }
});
$('#command-results').addEventListener('click', event => {
  const button = event.target.closest('[data-command-index]');
  if (button) executeCommand(Number(button.dataset.commandIndex));
});
document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    if ($('#command-dialog').open) $('#command-dialog').close(); else openCommands();
  }
  if (event.key === 'Escape') closeMenu();
});

function updateReadingProgress() {
  const scrollable = document.documentElement.scrollHeight - innerHeight;
  $('#reading-progress').style.width = (scrollable > 0 ? 100 * scrollY / scrollable : 0) + '%';
}
window.addEventListener('scroll', updateReadingProgress, { passive: true });
window.addEventListener('resize', () => { updateReadingProgress(); if (innerWidth > 740) closeMenu(); }, { passive: true });
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      $$('.desktop-nav a').forEach(link => {
        if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
  for (const id of ['home', 'work', 'lab', 'about', 'contact']) observer.observe(document.getElementById(id));
}

renderProjects();
selectSkills('ml');
updateSupply();
updateAnomaly();
initExperience({ updateSupply });
$('#current-year').textContent = new Date().getFullYear();
let savedTheme;
try { savedTheme = localStorage.getItem('devesh-portfolio-theme'); } catch { /* A private session may disable storage. */ }
setTheme(savedTheme === 'dark' ? 'dark' : 'light');
updateReadingProgress();
