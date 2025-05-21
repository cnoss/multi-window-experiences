document.addEventListener('DOMContentLoaded', function () {
  const markdownTargets = document.querySelectorAll('[data-js-markdownit]');

  if (markdownTargets.length === 0) return;
  
  const md = window.markdownit({
    html: true
  });

  markdownTargets.forEach(el => {
    const rawMarkdown = el.textContent;
    const renderedHTML = md.render(rawMarkdown);
    el.innerHTML = renderedHTML;
  });
});