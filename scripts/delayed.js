// Floating chat button
function buildChatButton() {
  const btn = document.createElement('a');
  btn.href = 'https://support.logi.com/hc/en-us';
  btn.className = 'chat-fab';
  btn.setAttribute('aria-label', 'Chat with support');
  btn.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="#fff"/></svg>';
  document.body.append(btn);
}
buildChatButton();
