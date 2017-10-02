'use strict';

var BLOCKED_DOMAINS = [
  'reddit.com',
  'news.ycombinator.com'
];

var matched = null;

for (let i = 0; i < BLOCKED_DOMAINS.length; i++) {
  if (document.referrer.indexOf(BLOCKED_DOMAINS[i]) > -1) {
    matched = BLOCKED_DOMAINS[i];
    break;
  }
}

if (matched) {
  document.body.hidden = true;
  document.addEventListener('DOMContentLoaded', () => {
    document.body.innerHTML = (
      '<p>This page is unavailable when linked to from ' + matched + '.</p>' +
      '<p>Please find a less toxic place to spend your time.</p>' +
      '<p><a href="https://www.youtube.com/watch?v=_clM6zNYQLQ">Here is a great song for your time</a></p>'
    );
    document.body.hidden = false;
  });
}
