/* global Mustache */

// Create listener for history push state
(function(window){
  "use strict"
    // Initializations
    var GIT_BRANCH_ID_LENGTH = 5;
    var SAMPLE_BRANCH_ENDING = '-sample-branch-name';
    var WRAPPER_NODE = 'fame-blossom-wrapper';
    var BRANCH_CONTENT_ID = '#fame-branch-content';
    var $ = document.querySelector.bind(window.document);

    function getTicketId(){
      var pathname = window.location.pathname;
      var matchArr = pathname.match(/ticket\/(.*)/);
      return matchArr !== null ? matchArr[1] : '';
    }

    function createNode(){
      var div = document.createElement('div');
      var template = "<span class='x-card-collaborators-header'>Suggested branch name</span><div id='fame-branch-content'></div>"
      var htmlStr = Mustache.to_html(template, {content: content});

      div.innerHTML = htmlStr;
      div.id = WRAPPER_NODE;
      return div;
    }

    function attachLoader(domNode){
      domNode.innerHTML = "<div class='loader'><div class='line-scale'><div></div><div></div><div></div><div></div><div></div></div></div>";
    }

    function titleFilter(titleWord){
      return (titleWord && titleWord.length > 2);
    }

    function formatBranchNameEnding(title){
      // Pattern: "-some-branch-name"
      // From: Some Branch Name - A/B Test
      var titleArr = title.split(' ').map(function(t){
        return t.replace(/[^a-z0-9]/gi,''); // Remove gnar chars
      }).filter(titleFilter);

      if (titleArr.length === 2){
        return '-' + titleArr.slice(0, 2).join('-');
      }
      if (titleArr.length >= 3){
        return '-' + titleArr.slice(0, 3).join('-');
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

    function delayedBranchName(){
      setTimeout(function(){
        var fameBranchContent = $(BRANCH_CONTENT_ID);
        if (!fameBranchContent){ return null; }

        // Grab card element and inject suggested branch name
        var cardTitle = $('.x-editable-text-content');
        var ticketId = getTicketId().substr(0, GIT_BRANCH_ID_LENGTH);
        var branchName = ticketId + extractBranchNameFromTitleNode(cardTitle);
        var template = "<pre>{{branchName}}</pre>"

        fameBranchContent.innerHTML = Mustache.to_html(
          template,
          {branchName: branchName}
        );
      }, 1000);
    }

    var intervalId = undefined;
    // Card click event handler
    // NOTE: This is probably the most fragile part of extension relying on (4) class/id structure
    on('#board', 'click', '.card', function(e) {
      clearInterval(intervalId);
      var counter = 0;
      intervalId = setInterval(function(){
        counter++;
        if (counter >= 10){ clearInterval(intervalId); }
        var applicationCard = $('.q-application-card');
        var cardSidebar = $('.x-card-sidebar-content-wrapper');

        // Card and Sidebar present
        if (applicationCard && cardSidebar){
          cardSidebar.insertBefore(createNode(), cardSidebar.firstChild);
          attachLoader($(BRANCH_CONTENT_ID));
          clearInterval(intervalId);
          delayedBranchName();
        }
      }, 1000)
   });
   console.log('Fame + Blossom.io add on activated!')

})(window);
