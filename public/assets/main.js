// Header solido allo scroll + menu mobile
(function () {
  var hdr = document.querySelector('.hdr');
  var hasHero = !!document.querySelector('.hero');
  function onScroll() { hdr.classList.toggle('solid', !hasHero || window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var burger = document.querySelector('.burger');
  var nav = document.getElementById('menu');
  function toggle(open) {
    burger.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { toggle(burger.getAttribute('aria-expanded') !== 'true'); });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { toggle(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggle(false); });
})();
