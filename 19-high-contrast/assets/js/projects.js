function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function normalizeData(data) {
  if (!data || !data.portfolio || !Array.isArray(data.projects)) {
    throw new Error('project.json must contain portfolio and projects fields.');
  }
  return data;
}

function renderPortfolio(portfolio) {
  document.getElementById('portfolio-eyebrow').textContent = portfolio.eyebrow || '';
  document.getElementById('portfolio-title').textContent = portfolio.title || '';
  document.getElementById('portfolio-description').textContent = portfolio.description || '';
  if (portfolio.title) document.title = portfolio.title;
}

function renderProjects(projects) {
  const grid = document.getElementById('project-grid');
  grid.innerHTML = projects.map((project) => {
    const tags = Array.isArray(project.tags) ? project.tags : [];
    return `
      <a class="project-card" href="${escapeHtml(project.url)}" target="_blank" rel="noopener">
        <span class="project-category">${escapeHtml(project.category)}</span>
        <strong>${escapeHtml(project.title)}</strong>
        <span class="project-description">${escapeHtml(project.description)}</span>
        <span class="project-tags">${tags.map((tag) => `<em>${escapeHtml(tag)}</em>`).join('')}</span>
      </a>
    `;
  }).join('');
}

async function loadProjects() {
  const grid = document.getElementById('project-grid');
  try {
    const response = await fetch('project.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Unable to load project.json');
    const data = normalizeData(await response.json());
    renderPortfolio(data.portfolio);
    renderProjects(data.projects);
  } catch (error) {
    grid.innerHTML = `<p class="load-error">${escapeHtml(error.message)}</p>`;
  }
}

loadProjects();
