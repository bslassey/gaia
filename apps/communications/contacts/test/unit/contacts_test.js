'use strict';

requireApp('communications/contacts/js/navigation.js');
requireApp('communications/contacts/js/utilities/status.js');
requireApp('communications/contacts/js/utilities/dom.js');
requireApp('communications/contacts/js/utilities/event_listeners.js');
requireApp('communications/contacts/js/contacts.js');

requireApp('communications/contacts/test/unit/mock_activities.js');
requireApp('communications/contacts/test/unit/mock_contacts_details.js');
requireApp('communications/contacts/test/unit/mock_contacts_form.js');
requireApp('communications/contacts/test/unit/mock_contacts_settings.js');
requireApp('communications/contacts/test/unit/mock_search.js');
requireApp('communications/contacts/test/unit/mock_contact_list_dom.js.html');
requireApp('communications/contacts/test/unit/mock_selection_dom.js.html');
requireApp('communications/contacts/test/unit/mock_contacts_list_obj.js');
requireApp('communications/contacts/test/unit/mock_fb_loader.js');
requireApp('communications/contacts/test/unit/mock_fb.js');

requireApp('communications/contacts/test/unit/helper.js');
requireApp(
        'communications/contacts/test/unit/mock_performance_testing_helper.js');

var contacts,
    ActivityHandler;

if (!this.PerformanceTestingHelper) {
  this.PerformanceTestingHelper = null;
}

if (!window.ActivityHandler) {
  window.ActivityHandler = null;
}

if (!this.fb) {
  this.fb = null;
}

if (!this.fbLoader) {
  this.fbLoader = null;
}

suite('Fill tag options', function() {
  var contacts,
      realContacts,
      realActivityHandler,
      subject,
      realL10n,
      realPerformanceTestingHelper,
      realFb,
      realFbLoader;

  suiteSetup(function() {
    realL10n = navigator.mozL10n;
    navigator.mozL10n = {
      get: function get(key) {
        return key;
      },
      DateTimeFormat: function() {
        this.localeFormat = function(date, format) {
          return date;
        };
      },
      language: {
        code: 'en',
        dir: 'ltr'
      }
    };
    realContacts = window.contacts;
    contacts = {};
    contacts.List = MockContactsListObj;
    contacts.Details = MockContactDetails;
    contacts.Form = MockContactsForm;
    contacts.Settings = MockContactsSettings;
    contacts.Search = MockSearch;
    window.contacts = contacts;
    realActivityHandler = window.ActivityHandler;
    window.ActivityHandler = MockActivities;
    realFbLoader = window.fbLoader;
    window.fbLoader = MockFbLoader;
    realFb = window.fb;
    window.fb = MockFb;
    realPerformanceTestingHelper = window.PerformanceTestingHelper;
    window.PerformanceTestingHelper = MockPerformanceTestingHelper;
    document.body.innerHTML = ContactListDom + MockSelectionDom;
    subject = window.Contacts;
    subject.init();

  });

  suiteTeardown(function() {
    subject.close();
    navigator.mozL10n = realL10n;
    window.contacts = realContacts;
    window.ActivityHandler = realActivityHandler;
    window.fbLoader = realFbLoader;
    window.fb = realFb;
    window.PerformanceTestingHelper = realPerformanceTestingHelper;
    document.body.innerHTML = '';
  });

  suite('go to selected tag', function() {
    var originTagOptions,
        container,
        mockLegend,
        customTag;
    var testTagOptions = {
      'test-type' : [
        {value: 'value1'},
        {value: 'value2'}
      ]
    };

    setup(function() {
      originTagOptions = TAG_OPTIONS;
      TAG_OPTIONS = testTagOptions;
      container = document.getElementById('tags-list');
      customTag = document.getElementById('custom-tag');

      mockLegend = document.createElement('legend');
      mockLegend.class = 'action';

      var mockLegendSpan = document.createElement('span');
      mockLegendSpan.textContent = 'value2';
      mockLegendSpan.dataset.taglist = 'test-type';
      mockLegend.appendChild(mockLegendSpan);
    });

    test('render tag selection form', function() {
      subject.goToSelectTag({currentTarget: mockLegend});
      assert.equal(container.querySelector('button[data-index="0"]')
        .textContent, 'value1');
      assert.equal(container.querySelector('button[data-index="1"]')
        .textContent, 'value2');
    });

    test('choose a tag', function() {
      var tag = container.querySelector('button[data-index="0"]');
      triggerEvent(tag, 'click');
      assert.isTrue(tag.className.contains('icon-selected'));
    });

    test('choose custom tag', function() {
      var tags = container.querySelectorAll('button');
      triggerEvent(customTag, 'touchend');
      for (var i = 0; i < tags.length; i++) {
        assert.lengthOf(tags[i].classList, 0);
      }
    });

    teardown(function() {
      TAG_OPTIONS = originTagOptions;
    });
  });
});
