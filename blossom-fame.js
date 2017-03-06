/* global Mustache */

// Create listener for history push state
(function(window){
  "use strict"
    // Initializations
    console.log('Fame + Blossom.io add on activated!')
    var GIT_BRANCH_ID_LENGTH = 5;
    var SAMPLE_BRANCH_ENDING = '-sample-branch-name';
    var WRAPPER_NODE = 'fame-blossom-wrapper';
    var $ = document.querySelector.bind(window.document);

    function getTicketId(){
      var pathname = window.location.pathname;
      var matchArr = pathname.match(/ticket\/(.*)/);
      return matchArr !== null ? matchArr[1] : '';
    }

    function createNodeWithContent(content){
      var div = document.createElement('div');
      var template = "<span class='x-card-collaborators-header'>Suggested branch name</span><pre>{{content}}</pre>"
      var htmlStr = Mustache.to_html(template, {content: content});

      div.innerHTML = htmlStr;
      div.id = WRAPPER_NODE;
      return div;
    }

    function titleFilter(titleWord){
      return (titleWord && titleWord.length > 2);
    }

    function formatBranchNameEnding(title){
      // Pattern "-some-branch-name"
      // From: Some Branch Name - A/B Test
      var splitTitleArr = title.split(' ').map(function(t){
        return t.replace(/[^a-z0-9]/gi,''); // Remove gnar chars
      });
      var filteredTitleArr = splitTitleArr.filter(titleFilter);
      if (filteredTitleArr.length >= 3){
        return '-' + filteredTitleArr.slice(0, 3).join('-');
      }

      return SAMPLE_BRANCH_ENDING;
    }

    function extractBranchNameFromTitleNode(titleNode){
      if (!titleNode) return SAMPLE_BRANCH_ENDING;
      var title = titleNode.innerHTML.toLowerCase();
      return formatBranchNameEnding(title);
    }


    // Event delegation helper
    function on(elSelector, eventName, selector, fn) {
        var element = $(elSelector);

        element.addEventListener(eventName, function(event) {
            var possibleTargets = element.querySelectorAll(selector);
            var target = event.target;

            for (var i = 0, l = possibleTargets.length; i < l; i++) {
                var el = target;
                var p = possibleTargets[i];

                while(el && el !== element) {
                    if (el === p) {
                        return fn.call(p, event);
                    }
                    el = el.parentNode;
                }
            }
        });
    }

    // Card click event handler
    // NOTE: This is probably the most fragile part of extension relying on (4) class/id structure
    on('#board', 'click', '.card', function(e) {
       // this function is only called, when a list item with 'yes' class is called
       setTimeout(function(){
         // Grab card element and inject suggested branch name
         var applicationCard = $('.q-application-card');
         if (applicationCard){
           var cardSidebar = $('.x-card-sidebar-content-wrapper');
           var cardTitle = $('.x-editable-text-content');
           var ticketId = getTicketId().substr(0, GIT_BRANCH_ID_LENGTH);
           var branchName = ticketId + extractBranchNameFromTitleNode(cardTitle);
           cardSidebar.insertBefore(createNodeWithContent(branchName), cardSidebar.firstChild);
         }
       }, 2500);
   });

})(window);
