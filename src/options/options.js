jQuery(function ($) {

  var $focusedInput,
      defaultOptions = { columnHotkey: 'alt', tableHotkey: 'alt+shift' },
      options = localStorage.options ? JSON.parse(localStorage.options) : defaultOptions;


  // Initially load previous options
  if (options) {
    init(options);
  }


  // Fake input focusing
  $(document).on('click', function () {
    $focusedInput = null;
    $('.input').removeClass('focus');
  });

  $('.input').on('click', function (e) {
    $focusedInput = $(this);

    $('.input').removeClass('focus');
    $focusedInput.addClass('focus');

    e.stopPropagation();
  });


  // Hotkey -> focusedInput handling
  $(document).on('keyup', null, '', function (e) {
    
  });


  $(document).on('keydown', null, '', function (e) {
    var possible = hotkeysHandler(e),
        hotkey;

    if (!$focusedInput) {
      return;
    }

    for (hotkey in possible) {
      if (possible.hasOwnProperty(hotkey) && possible[hotkey]) {
        saveHotkey($focusedInput.attr('id'), hotkey);
        $focusedInput.html(valueToKeyboardKeys(hotkey));
        break;
      }
    };
  });


  $('#resetDefault').click(function (e) {
    if (confirm('Are you sure you want to reset to defaults?')) {
      init(defaultOptions);

      $('body').trigger('click'); // Unfocus all inputs
    }

    return false;
  });


  /**
   * Initialization
   */
  function init(defaults) {
    var key;

    for (key in defaults) {
      if (defaults.hasOwnProperty(key)) {
        $('#' + key).html(valueToKeyboardKeys(defaults[key]));
      }
    }
  }

  /**
   * Creates keyboard keys markup for a hotkey value.
   */
  function valueToKeyboardKeys(value) {
    var parts = value.split('+'),
        i;

    for (i = parts.length - 1; i >= 0; i--) {
      parts[i] = '<span class="key">' + toTitleCase(parts[i]) + '</span>';
    }

    return parts.join('<span class="sep">+</span>');
  }

  /**
   * Saves a hotkey to localStorage.
   */
  function saveHotkey(key, value) {
    options[key] = value;
    localStorage.options = JSON.stringify(options);
  }

  /**
   * Modified version of handleObj.handler from jquery.hotkeys.js.
   *
   * This version captures all keypresses and returns the combos.
   */
  function hotkeysHandler(event) {
    var textAcceptingInputTypes = ["text", "password", "number", "email", "url", "range", "date", "month", "week", "time", "datetime", "datetime-local", "search", "color"];

    // Don't fire in text-accepting inputs that we didn't directly bind to
    if (this !== event.target && (/textarea|select/i.test(event.target.nodeName) ||
      jQuery.inArray(event.target.type, textAcceptingInputTypes) > -1)) {
      return;
    }

    // Keypress represents characters, not special keys
    var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[event.which],
      character = String.fromCharCode(event.which).toLowerCase(),
      key, modif = "", possible = {};

    // check combinations (alt|ctrl|shift+anything)
    if (event.altKey && special !== "alt") {
      modif += "alt+";
    }

    if (event.ctrlKey && special !== "ctrl") {
      modif += "ctrl+";
    }

    // TODO: Need to make sure this works consistently across platforms
    if (event.metaKey && !event.ctrlKey && special !== "meta") {
      modif += "meta+";
    }

    if (event.shiftKey && special !== "shift") {
      modif += "shift+";
    }

    if (special) {
      possible[modif + special] = true;

    } else {
      possible[modif + character] = true;
      possible[modif + jQuery.hotkeys.shiftNums[character]] = true;

      // "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
      if (modif === "shift+") {
        possible[jQuery.hotkeys.shiftNums[character]] = true;
      }
    }

    return possible;
  };

  /**
   * See: http://stackoverflow.com/a/196991/806988
   */
   function toTitleCase(str) {
     return str.replace(/\w\S*/g, function(txt) {
       return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
     });
   }
});
