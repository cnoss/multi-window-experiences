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

  markdownTargets.forEach(element => {
    element.textContent = element.textContent.replace(/^[ \t]+/gm, '');
  });

  const md = window.markdownit({
    html: true
  });

  markdownTargets.forEach(el => {
    const rawMarkdown = el.textContent;
    const renderedHTML = md.render(rawMarkdown);
    el.innerHTML = renderedHTML;
  });
});


/* Adding Code Copy Button
############################################################################ */

const addCopyButton = (preBlock) => {
  const button = document.createElement('button');
  button.className = 'copy-btn';
  button.textContent = 'Copy';

  button.addEventListener('click', () => {
    const codeBlock = preBlock.querySelector('code');
    if (!codeBlock) return;

    const codeText = codeBlock.innerText.replace(/\n\n/g, '\n'); // Entfernt doppelte Zeilenumbrüche
    navigator.clipboard.writeText(codeText).then(() => {
      button.textContent = 'Copied!';
      setTimeout(() => button.textContent = 'Copy', 1500);
    });
  });

  preBlock.style.position = 'relative'; // falls nötig für Button-Positionierung
  preBlock.appendChild(button);
  return preBlock;
}

/* Show Code from within HTML file
############################################################################ */

const showInFileCode = (codeId, target) => {
  const scriptContent = document.getElementById(codeId).textContent;
  const preBlock = document.createElement('pre');
  const codeBlock = document.createElement('code');
  codeBlock.textContent = scriptContent;
  preBlock.appendChild(codeBlock);
  const preBlockWidthButton = addCopyButton(preBlock);

  const targetElement = document.querySelector(target);
  if (!targetElement) {
    console.error(`Target element not found: ${target}`);
    return;
  }
  targetElement.appendChild(preBlockWidthButton);

  hljs.highlightElement(codeBlock);
  hljs.initLineNumbersOnLoad();
};


/* Fetch and Show Code from external file
############################################################################ */

const fetchAndShowExternalCode = (url, target) => {
  fetch(url)
    .then(response => response.text())
    .then(jsCode => {

      const indentedJsCode = jsCode
        .split('\n')
        .map(line => '  ' + line) // oder '\t' für echten Tab
        .join('\n');
      const workerCodeTarget = document.querySelector(target);
      const preBlock = document.createElement('pre');
      const codeBlock = document.createElement('code');
      codeBlock.classList.add('hljs', 'language-javascript', 'line-numbers');
      codeBlock.textContent = indentedJsCode;
      preBlock.appendChild(codeBlock);
      const preBlockWidthButton = addCopyButton(preBlock);
      workerCodeTarget.appendChild(preBlockWidthButton);

      hljs.highlightElement(codeBlock);
      hljs.initLineNumbersOnLoad();
      
      setTimeout(() => {
        const lineNumbers = document.querySelectorAll('.hljs-ln-line .hljs-ln-n');
        const lines = document.querySelectorAll('.hljs-ln-line');

        lineNumbers.forEach((numberEl, index) => {
          numberEl.style.cursor = 'pointer';
          numberEl.addEventListener('click', () => {

            console.log('Clicked line number:', index + 1);
            const line = lines[index];
            line.classList.toggle('highlighted-line');
          });
        });
      }, 500); // delay nötig, weil Plugin DOM async manipuliert

    })
    .catch(error => {
      console.error('Fehler beim Laden der JS-Datei:', error);
    });
};


/* Copy Code to Clipboard
############################################################################ */

document.querySelectorAll('.copy-btn').forEach(button => {
  button.addEventListener('click', () => {
    const code = button.nextElementSibling.textContent;
    navigator.clipboard.writeText(code).then(() => {
      button.textContent = 'Copied!';
      setTimeout(() => button.textContent = 'Copy', 1500);
    });
  });
});


/* Collapsible Sections
############################################################################ */

document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('.collapsible').forEach(section => {
    const h2 = section.querySelector('h2');
    const originalText = h2.textContent.trim();
    const button = document.createElement('button');
    button.className = 'collapse-toggle';
    button.type = 'button';
    button.innerHTML = `<span class="arrow icon">chevron_right</span> ${originalText}`;
    h2.textContent = '';
    h2.appendChild(button);

    button.addEventListener('click', () => {
      section.classList.toggle('open');
    });
  });

});