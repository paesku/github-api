var fetchStatus = (function() {
  var stat;

  var $status = $('#status-module');
  var $template = $('#status-template').html();

  //  bind event
  events.on('statusSearchForUser', setStatus);

  _render();

  function _render() {
    $status.html(Mustache.render($template, {status: stat}));
  }

  function setStatus(newStatus) {
    stat = newStatus;
    _render();
  }

  function destroy() {
    $status.remove();
    events.off('statusSearchForUser', setStatus);
  }

  return {
    setStatus: setStatus,
    destroy: destroy,
  }
})();
