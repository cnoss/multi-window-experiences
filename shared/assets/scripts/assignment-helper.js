/* Show position in the UI (e.g. in a console element)
############################################################################# */

// Show position in the UI (e.g. in a console element)
const updatePositionInUI = (selector, windowPosition) => {
  const target = document.querySelector(`[${selector}]`);
  target.innerHTML = `<p>${windowPosition.x}, ${windowPosition.y}</p>`
  
  // Trigger visual change (e.g. CSS transition animation)
  target.classList.remove('has-been-changed');
  void target.offsetWidth; // Force reflow
  target.classList.add('has-been-changed');
};