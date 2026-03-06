/* ==========================================================================
   NeonWait — Form Handler (Front-end Only)
   Author: NeonWait
   Version: 1.0.0
   Description: Client-side form validation and UI feedback.
                Connect to your own backend/API for actual submissions.
   ========================================================================== */

(function () {
  'use strict';

  /**
   * NeonForm
   *
   * Usage:
   *   new NeonForm({
   *     formSelector: '#subscribe-form',
   *     messageSelector: '.form-message',
   *     successMessage: 'Thank you for subscribing!',
   *     errorMessage: 'Please enter a valid email address.',
   *     onSubmit: function(data) {
   *       // Send data to your API
   *       // Return a Promise for async handling
   *     }
   *   });
   */

  function NeonForm(options) {
    if (!(this instanceof NeonForm)) {
      return new NeonForm(options);
    }

    this.options = Object.assign({
      formSelector:    '#subscribe-form',
      messageSelector: '.form-message',
      successMessage:  'Thank you! We\'ll notify you when we launch.',
      errorMessage:    'Please enter a valid email address.',
      onSubmit:        null
    }, options);

    this.form    = document.querySelector(this.options.formSelector);
    this.message = document.querySelector(this.options.messageSelector);

    if (!this.form) return;

    this._bindEvents();
  }

  /**
   * Bind form submit event
   */
  NeonForm.prototype._bindEvents = function () {
    var self = this;

    this.form.addEventListener('submit', function (e) {
      e.preventDefault();
      self._handleSubmit();
    });
  };

  /**
   * Handle form submission
   */
  NeonForm.prototype._handleSubmit = function () {
    var self = this;
    var emailInput = this.form.querySelector('input[type="email"]');

    if (!emailInput) return;

    var email = emailInput.value.trim();

    // Validate email
    if (!this._isValidEmail(email)) {
      this._showMessage(this.options.errorMessage, 'error');
      this._shakeInput(emailInput);
      return;
    }

    // Disable form during submission
    var submitBtn = this.form.querySelector('button[type="submit"], input[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.setAttribute('data-original-text', submitBtn.textContent);
      submitBtn.textContent = 'Sending...';
    }

    // Custom submit handler
    if (typeof this.options.onSubmit === 'function') {
      var result = this.options.onSubmit({ email: email });

      // Handle Promise-based responses
      if (result && typeof result.then === 'function') {
        result
          .then(function () {
            self._onSuccess(emailInput, submitBtn);
          })
          .catch(function (err) {
            self._onError(submitBtn, err);
          });
        return;
      }
    }

    // Default behavior (demo mode — simulate success)
    setTimeout(function () {
      self._onSuccess(emailInput, submitBtn);
    }, 1200);
  };

  /**
   * Success handler
   */
  NeonForm.prototype._onSuccess = function (input, btn) {
    this._showMessage(this.options.successMessage, 'success');
    input.value = '';
    this._resetButton(btn);
  };

  /**
   * Error handler
   */
  NeonForm.prototype._onError = function (btn, error) {
    var msg = (error && error.message) ? error.message : 'Something went wrong. Please try again.';
    this._showMessage(msg, 'error');
    this._resetButton(btn);
  };

  /**
   * Reset submit button
   */
  NeonForm.prototype._resetButton = function (btn) {
    if (!btn) return;
    btn.disabled = false;
    var original = btn.getAttribute('data-original-text');
    if (original) btn.textContent = original;
  };

  /**
   * Show form message
   */
  NeonForm.prototype._showMessage = function (text, type) {
    if (!this.message) return;

    this.message.textContent = text;
    this.message.className   = 'form-message ' + type;
    this.message.style.display = 'block';

    // Auto-hide after 5 seconds
    var self = this;
    clearTimeout(this._messageTimeout);
    this._messageTimeout = setTimeout(function () {
      self.message.style.display = 'none';
      self.message.textContent = '';
    }, 5000);
  };

  /**
   * Shake animation on invalid input
   */
  NeonForm.prototype._shakeInput = function (input) {
    input.style.animation = 'none';
    void input.offsetWidth; // force reflow
    input.style.animation = 'shake 0.4s ease';
    input.addEventListener('animationend', function () {
      input.style.animation = '';
    }, { once: true });
  };

  /**
   * Email validation
   */
  NeonForm.prototype._isValidEmail = function (email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  /* -----------------------------------------------------------------------
     Contact Form Handler
     ----------------------------------------------------------------------- */

  function NeonContactForm(options) {
    if (!(this instanceof NeonContactForm)) {
      return new NeonContactForm(options);
    }

    this.options = Object.assign({
      formSelector:    '#contact-form',
      messageSelector: '.contact-form-message',
      successMessage:  'Message sent successfully! We\'ll get back to you soon.',
      onSubmit:        null
    }, options);

    this.form    = document.querySelector(this.options.formSelector);
    this.message = document.querySelector(this.options.messageSelector);

    if (!this.form) return;

    this._bindEvents();
  }

  NeonContactForm.prototype._bindEvents = function () {
    var self = this;
    this.form.addEventListener('submit', function (e) {
      e.preventDefault();
      self._handleSubmit();
    });
  };

  NeonContactForm.prototype._handleSubmit = function () {
    var self = this;
    var formData = new FormData(this.form);
    var data = {};

    formData.forEach(function (value, key) {
      data[key] = value;
    });

    // Basic validation
    var valid = true;
    var inputs = this.form.querySelectorAll('[required]');
    inputs.forEach(function (input) {
      if (!input.value.trim()) {
        valid = false;
        input.style.borderColor = 'var(--neon-accent)';
      } else {
        input.style.borderColor = '';
      }
    });

    if (!valid) {
      this._showMessage('Please fill in all required fields.', 'error');
      return;
    }

    // Custom submit handler
    if (typeof this.options.onSubmit === 'function') {
      this.options.onSubmit(data);
      return;
    }

    // Default demo behavior
    var submitBtn = this.form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    setTimeout(function () {
      self._showMessage(self.options.successMessage, 'success');
      self.form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    }, 1500);
  };

  NeonContactForm.prototype._showMessage = function (text, type) {
    if (!this.message) return;
    this.message.textContent = text;
    this.message.className = 'form-message ' + type;
    this.message.style.display = 'block';

    var self = this;
    setTimeout(function () {
      self.message.style.display = 'none';
    }, 5000);
  };

  /* -----------------------------------------------------------------------
     Shake Keyframe (injected dynamically)
     ----------------------------------------------------------------------- */
  var style = document.createElement('style');
  style.textContent = '@keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }';
  document.head.appendChild(style);

  /* -----------------------------------------------------------------------
     Expose
     ----------------------------------------------------------------------- */
  window.NeonForm        = NeonForm;
  window.NeonContactForm = NeonContactForm;

})();
