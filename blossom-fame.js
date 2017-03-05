// Create listener for history push state
(function(window){
    // Initializations
    console.log('Fame + Blossom.io add on activated!')
    var GIT_BRANCH_ID_LENGTH = 5;
    var history = window.history;
    var pushState = history.pushState;
    var $ = document.querySelector.bind(window.document);

    function getTicketId(){
      var pathname = window.location.pathname;
      var matchArr = pathname.match(/ticket\/(.*)/);
      return matchArr !== null ? matchArr[1] : '';
    }

    function createNodeWithContent(content){
      var p = document.createElement('p');
      p.innerHTML = content;
      return p;
    }

    // Redefine history pushstate to get access
    history.pushState = function(state) {
        if (typeof history.onpushstate == 'function') {
            history.onpushstate({state: state});
        }
        return pushState.apply(history, arguments);
    }

    // Push state event listener
    window.onpopstate = history.onpushstate = function(e, b) {
      setTimeout(function(){
        // Grab card element and inject suggested branch name
        var applicationCard = $('.q-application-card');
        var cardSidebar = $('.x-card-sidebar-content-wrapper');
        var ticketId = getTicketId().substr(0, GIT_BRANCH_ID_LENGTH);
        cardSidebar.insertBefore(createNodeWithContent(ticketId), cardSidebar.firstChild);
      }, 2500);
    };
})(window);
