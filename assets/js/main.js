/* ==========================================================================
   NeonWait — Main JavaScript
   Author: NeonWait
   Version: 1.0.0
   ========================================================================== */

(function () {
  'use strict';

  /* -----------------------------------------------------------------------
     DOM Ready
     ----------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    NeonWait.init();
  });

  /* -----------------------------------------------------------------------
     NeonWait Namespace
     ----------------------------------------------------------------------- */
  var NeonWait = window.NeonWait || {};

  /**
   * Initialize all modules
   */
  NeonWait.init = function () {
    this.preloader();
    this.particles();
    this.scrollAnimations();
    this.currentYear();
  };

  /* -----------------------------------------------------------------------
     Preloader
     ----------------------------------------------------------------------- */
  NeonWait.preloader = function () {
    var preloader = document.getElementById('preloader');
    if (!preloader) return;

    window.addEventListener('load', function () {
      preloader.classList.add('preloader--hidden');
      // Remove from DOM after transition
      preloader.addEventListener('transitionend', function () {
        preloader.remove();
      });
    });
  };

  /* -----------------------------------------------------------------------
     Particles Generator
     ----------------------------------------------------------------------- */
  NeonWait.particles = function () {
    var container = document.querySelector('.bg-particles');
    if (!container) return;

    var particleCount = 20;
    var colors = [
      'var(--neon-primary)',
      'var(--neon-secondary)',
      'var(--neon-accent)'
    ];

    for (var i = 0; i < particleCount; i++) {
      var particle = document.createElement('span');
      particle.classList.add('particle');

      // Random positioning
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top  = Math.random() * 100 + '%';

      // Random size
      var size = Math.random() * 3 + 1;
      particle.style.width  = size + 'px';
      particle.style.height = size + 'px';

      // Random color
      var color = colors[Math.floor(Math.random() * colors.length)];
      particle.style.background = color;
      particle.style.boxShadow  = '0 0 6px ' + color + ', 0 0 12px ' + color;

      // Random animation duration and delay
      particle.style.setProperty('--duration', (Math.random() * 10 + 5) + 's');
      particle.style.setProperty('--delay', (Math.random() * 5) + 's');

      container.appendChild(particle);
    }
  };

  /* -----------------------------------------------------------------------
     Scroll-based Reveal Animations
     ----------------------------------------------------------------------- */
  NeonWait.scrollAnimations = function () {
    var animElements = document.querySelectorAll('[data-anim]');
    if (!animElements.length) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: show all elements
      animElements.forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var animClass = el.getAttribute('data-anim');
          var delay = el.getAttribute('data-anim-delay');

          if (delay) {
            el.style.animationDelay = delay + 'ms';
          }

          el.classList.add(animClass);
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    animElements.forEach(function (el) {
      el.style.opacity = '0';
      observer.observe(el);
    });
  };

  /* -----------------------------------------------------------------------
     Auto-Update Copyright Year
     ----------------------------------------------------------------------- */
  NeonWait.currentYear = function () {
    var yearElements = document.querySelectorAll('[data-year]');
    var currentYear = new Date().getFullYear();

    yearElements.forEach(function (el) {
      el.textContent = currentYear;
    });
  };

  /* -----------------------------------------------------------------------
     Expose to Global
     ----------------------------------------------------------------------- */
  window.NeonWait = NeonWait;

})();
