/* ==========================================================================
   NeonWait — Countdown Timer
   Author: NeonWait
   Version: 1.0.0
   Description: Configurable countdown timer with callback support.
   ========================================================================== */

(function () {
  'use strict';

  /**
   * NeonCountdown
   * 
   * Usage:
   *   new NeonCountdown({
   *     target: '2026-12-31T00:00:00',      // ISO date string or Date object
   *     el:     '#countdown',                 // container selector
   *     onTick: function(remaining) { ... },  // optional callback every second
   *     onEnd:  function() { ... }            // optional callback when done
   *   });
   *
   * HTML structure expected inside `el`:
   *   <span data-days>00</span>
   *   <span data-hours>00</span>
   *   <span data-minutes>00</span>
   *   <span data-seconds>00</span>
   */

  function NeonCountdown(options) {
    if (!(this instanceof NeonCountdown)) {
      return new NeonCountdown(options);
    }

    // Defaults
    this.options = Object.assign({
      target:  null,
      el:      '#countdown',
      onTick:  null,
      onEnd:   null
    }, options);

    this.container = document.querySelector(this.options.el);
    if (!this.container || !this.options.target) return;

    // Parse target date
    this.targetDate = (this.options.target instanceof Date)
      ? this.options.target
      : new Date(this.options.target);

    // Cache DOM elements
    this.$days    = this.container.querySelector('[data-days]');
    this.$hours   = this.container.querySelector('[data-hours]');
    this.$minutes = this.container.querySelector('[data-minutes]');
    this.$seconds = this.container.querySelector('[data-seconds]');

    // Start
    this._interval = null;
    this._tick();
    this._start();
  }

  /**
   * Start the interval
   */
  NeonCountdown.prototype._start = function () {
    var self = this;
    this._interval = setInterval(function () {
      self._tick();
    }, 1000);
  };

  /**
   * Single tick — recalculate remaining time
   */
  NeonCountdown.prototype._tick = function () {
    var now  = new Date().getTime();
    var diff = this.targetDate.getTime() - now;

    if (diff <= 0) {
      this._complete();
      return;
    }

    var remaining = {
      days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60)
    };

    this._render(remaining);

    if (typeof this.options.onTick === 'function') {
      this.options.onTick(remaining);
    }
  };

  /**
   * Update DOM elements
   */
  NeonCountdown.prototype._render = function (r) {
    if (this.$days)    this._updateValue(this.$days,    r.days);
    if (this.$hours)   this._updateValue(this.$hours,   r.hours);
    if (this.$minutes) this._updateValue(this.$minutes, r.minutes);
    if (this.$seconds) this._updateValue(this.$seconds, r.seconds);
  };

  /**
   * Update a single value with animation
   */
  NeonCountdown.prototype._updateValue = function (el, value) {
    var formatted = this._pad(value);
    if (el.textContent !== formatted) {
      el.textContent = formatted;
      // Trigger pop animation
      el.classList.remove('count-pop');
      // Force reflow
      void el.offsetWidth;
      el.classList.add('count-pop');
    }
  };

  /**
   * Pad single digits with leading zero
   */
  NeonCountdown.prototype._pad = function (n) {
    return n < 10 ? '0' + n : String(n);
  };

  /**
   * Countdown complete
   */
  NeonCountdown.prototype._complete = function () {
    clearInterval(this._interval);

    var zero = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    this._render(zero);

    if (typeof this.options.onEnd === 'function') {
      this.options.onEnd();
    }
  };

  /**
   * Destroy the countdown
   */
  NeonCountdown.prototype.destroy = function () {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  };

  /* -----------------------------------------------------------------------
     Expose
     ----------------------------------------------------------------------- */
  window.NeonCountdown = NeonCountdown;

})();
