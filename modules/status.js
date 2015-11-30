var fetchStatus = (function() {
  var stat;

  var $status = $('#status-module');
  var $template = $('#status-template').html();



  _init();

  function _init() {
    _attach();
  }

  function _attach() {
    //  bind event
    events.on('statusSearchForUser', setStatus);
  }

  function _render() {
    $status.html(Mustache.render($template, {status: stat}));
  }

  function setStatus(newStatus) {
    stat = newStatus;
    _render();
  }

  function detach() {
    $status.detach();
  }

  function destroy() {
    $status.remove();
    events.off('statusSearchForUser', setStatus);
  }

  return {
    setStatus: setStatus,
    destroy: destroy,
    detach: detach,
  }
})();
