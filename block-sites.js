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
      '<p>Here\'s a song for your time:</p>' +
      '<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/Nrnq4SZ0luc?rel=0&amp;controls=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>'
    );
    document.body.hidden = false;
  });
}
