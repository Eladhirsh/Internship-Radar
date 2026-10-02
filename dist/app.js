'use strict';
const sourceDomains = {
  greenhouse: ['job-boards.greenhouse.io', 'boards.greenhouse.io'],
  ashby: ['jobs.ashbyhq.com'],
  workday: ['myworkdayjobs.com'],
  yc: ['ycombinator.com/companies', 'workatastartup.com']
};
const field = document.querySelector('#keywords');
const source = document.querySelector('#source');
const promptField = document.querySelector('#discovery-prompt');
const safe = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function selectedDomains() { return source.value === 'all' ? Object.values(sourceDomains).flat() : sourceDomains[source.value]; }
function searchQuery() { return `${field.value.trim()} "2027" "summer" (United States OR USA OR "San Francisco" OR "New York" OR remote) (${selectedDomains().map(d => `site:${d}`).join(' OR ')})`; }
function refreshPrompt() {
  promptField.value = `Use TinyFish to find current U.S. summer 2027 ${field.value.trim()} roles across ${selectedDomains().join(', ')}. Search these sources separately so each gets coverage. Inspect official role pages with TinyFish browser agents when JavaScript or redirects prevent extraction. Confirm the exact season, U.S. location, and whether applications are open. Exclude closed jobs and put unspecified seasons in a separate unconfirmed list. Deduplicate by company and canonical role URL. Compare five companies in one table: company, exact role, location, listing link, technical focus, eligibility, compensation if stated, and checked date. Preserve agent run links and application-state evidence. Report sign-in or access limits honestly. Do not submit applications or enter personal information.`;
}
document.querySelector('#search-form').addEventListener('submit', event => {
  event.preventDefault();
  const url = new URL('https://www.google.com/search');
  url.searchParams.set('q', searchQuery());
  window.open(url.href, '_blank', 'noopener,noreferrer');
});
field.addEventListener('input', refreshPrompt); source.addEventListener('change', refreshPrompt); refreshPrompt();
document.querySelector('#copy-prompt').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try { await navigator.clipboard.writeText(promptField.value); status.textContent = 'Copied. Paste into ChatGPT with TinyFish connected.'; }
  catch { promptField.focus(); promptField.select(); status.textContent = 'Select and copy the prompt above.'; }
});
function validLink(value) { const url = new URL(value); if(url.protocol !== 'https:') throw new Error('Invalid evidence link'); return safe(url.href); }
function renderRole(role) {
  return `<tr><td><span class="company">${safe(role.company)}</span><span class="role">${safe(role.title)}</span><span class="source-label">${safe(role.source)}</span><details><summary>Eligibility & evidence</summary><p>${safe(role.eligibility)}</p><p><strong>Pay:</strong> ${safe(role.compensation || 'Not stated')}</p><p><strong>Work arrangement:</strong> ${safe(role.arrangement || 'Not stated')}</p><p><strong>Observed:</strong> ${safe(role.evidence)}</p><p class="evidence-links"><a href="${validLink(role.runUrl)}" target="_blank" rel="noopener noreferrer">TinyFish run (may require sign-in)</a><a href="${validLink(role.applicationUrl)}" target="_blank" rel="noopener noreferrer">Application destination</a></p></details></td><td data-label="Location">${safe(role.locations.join('; '))}</td><td data-label="Technical focus">${safe(role.focus)}</td><td data-label="Listing"><span class="open">Open when checked</span><a class="listing-link" href="${validLink(role.url)}" target="_blank" rel="noopener noreferrer" aria-label="View ${safe(role.company)} internship listing">View role</a></td></tr>`;
}
fetch('results.json', {cache:'no-cache'}).then(response => {if(!response.ok) throw new Error('Results unavailable'); return response.json();}).then(data => {
  if(!Array.isArray(data.roles) || !data.roles.length) throw new Error('No verified results');
  document.querySelector('#roles').innerHTML = data.roles.map(renderRole).join('');
}).catch(() => {
  document.querySelector('#roles').innerHTML = '<tr><td colspan="4">The comparison could not load. <a href="results.json">Open the saved results</a> or reload this page.</td></tr>';
  document.querySelector('#load-status').textContent = 'Unable to load the saved comparison.';
});
