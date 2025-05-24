/* Create Window ID
############################################################################ */

const getWindowId = () => {
  const now = new Date();
  const windowId = String(now.getHours()).padStart(2, '0') + ':' +
    String(now.getMinutes()).padStart(2, '0') + ':' +
    String(now.getSeconds()).padStart(2, '0');
  
    return "window-" + windowId;
};



/* Adding Markdown Support
############################################################################ */

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