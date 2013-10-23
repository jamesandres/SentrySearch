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
          '<h6 title="SentrySearch Chrome Extension">ˁ˚ᴥ˚ˀ</h6>',
          '<form method="GET" class="clearfix">',
            '<input type="text" name="SentrySearch" value="" placeholder="Finally, you can search in Sentry!" required>',
            '<div class="pull-left"><a class="action-go btn btn-primary">Go fetch!</a></div>',
            '<div class="pull-right"><a class="action-index btn">Update Index</a></div>',
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
        that.searchForm = that.search.find('form');
        $this.prepend(that.search);
        that.bindHandlers();
      }
    };

    doInject.apply($sidebar[0]);
    $sidebar.bind('DOMSubtreeModified', doInject);
  };

  SentrySearch.prototype.bindHandlers = function () {
    var that = this,
        $input = this.search.find('input[name="SentrySearch"]'),
        $goButton = this.search.find('a.action-go'),
        $indexButton = this.search.find('a.action-index');

    // Safety, never actually submit our form
    this.searchForm.submit(function () { return false; });

    // Bindings
    $goButton.click(function () { that.doSearch($input.val()); return false; });
    $indexButton.click(function () { that.startIndexing(); return false; });
  };

  SentrySearch.prototype.doSearch = function(string) {
    this.searchForm.submit(); // Abuse to run the validation
    console.log(string, 'Actually search for..');
  };

  SentrySearch.prototype.startIndexing = function() {
    // See: http://stackoverflow.com/questions/14251008/chrome-extension-to-open-link-in-new-tab-no-error-but-does-nothing-on-click
    console.log('TODO: Actually start the indexer.');
  };


  // Gorilla in the mist
  var _SentrySearch = new SentrySearch();

}(window, document, jQuery));
