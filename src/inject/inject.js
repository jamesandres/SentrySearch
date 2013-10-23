/*jslint browser: true, nomen: true, plusplus: true, todo: true, white: true, indent: 2 */
(function (window, document, $) {
  'use strict';

  /**
   * The SentrySearch function object.
   */
  function SentrySearch() {
    var that = this;

    this.settings = {
      search_template: [
        '<div class="SentrySearch-search">',
          '<h6>Search</h6>',
          '<form method="GET">',
            '<input type="text" name="SentrySearch" value="" placeholder="Finally, you can search in Sentry!">',
          '</form>',
        '</div>'
      ].join('')
    };

    chrome.extension.sendRequest({ method: 'getOptions' }, function(response) {
      // TODO: Have an options page
      that.init();
    });
  }

  SentrySearch.prototype.init = function () {
    this.injectSearch();
  };

  SentrySearch.prototype.injectSearch = function() {
    var that = this,
        $sidebar = $('#content .sidebar'),
        doInject;

    if ($sidebar.length === 0) {
      return
    }

    // Injects our sidebar
    doInject = function () {
      var $this = $(this);

      if ($this.find('.SentrySearch-search').length === 0) {
        that.search = $(that.settings.search_template);
        $this.prepend(that.search);
        that.bindHandlers();
      }
    };

    doInject.apply($sidebar[0]);
    $sidebar.bind('DOMSubtreeModified', doInject);
  };

  SentrySearch.prototype.bindHandlers = function () {
    var that = this;

    // Safety, never actually submit our form
    this.search.find('form').submit(function () { return false; });

    // Bindings
    this.search.find('input[name="SentrySearch"]').change(function () {
      that.search($(this).val());
    });
  };

  SentrySearch.prototype.search = function(string) {
    console.log(string, 'SentrySearch');
  };


  // Gorilla in the mist
  var _SentrySearch = new SentrySearch();

}(window, document, jQuery));
