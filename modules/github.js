'use strict';

var github = (function() {
  var user = 'paesku';
  var repos,
      error,
      msg,
      eventMessage;

  var API = 'http://api.github.com/users/';

  // TODO: OAUTH for more than 60 requests per hour

  var $el = $('#github-module');
  var $btn = $el.find('button');
  var $input = $el.find('input');
  var $userData = $el.find('#github-user-data');
  var template = $el.find('#github-user-template').html();

  $btn.on('click', searchUser);

  /*
   * Render Mustache Template
   *
   * @param {{user: string, repos: array, c: string}} data – renderable data Object
   */
  function _render(data) {
    $userData.html(Mustache.render(template, data));
  };

  /*
   * Search GitHub User
   *
   * @param {value} string – GitHub username
   */
  function searchUser(value) {
    var name = (typeof value === 'string') ? value : $input.val();
    user = name;

    eventMessage = 'Searching GitHub for user: ' + user;

    // Emit event
    events.emit('statusSearchForUser', eventMessage);

    _checkUserName(user).then(function (res) {
      return res;
    }).then(function(res) {
      // only go on when user exists
      if (!res.message) {

        eventMessage = 'Searching GitHub Repositories from user: ' + user;
        // Update event
        events.emit('statusSearchForUser', eventMessage);
        _getRepositories(user);
      }
    }).fail(function (res) {
      console.warn('GitHub user does not exist' + res);
      _error('user');
    });
    $input.val('');
  };

  /*
   * Get Promis for a GitHub User
   *
   * @param {user} string – GitHub username
   * @return {promise} Object – Promise from request on GitHub
   */
  function _checkUserName(user) {
    var url = _buildURL(user, false);
    return Q(jQuery.ajax({
      type: 'GET',
      url: url,
    }));
  };

  /*
   * Get Repositories from User
   *
   * @param {user} string – GitHub username
   * @return {repositories} array – All repositories from a GitHub user
   */
  function _getRepositories(user) {
    var url = _buildURL(user, true);
    return Q(jQuery.ajax({
      type: 'GET',
      url: url,
    }).then(function (data) {
      repos = data;
      _render({
        user: user,
        repos: repos,
        error: false
      });
      fetchStatus.destroy();
    }).fail(function (xhr) {
      console.warn('Something went wrong: ' + xhr);
      _error('No Repo available');
    }));
  };

  /*
   * Create URL
   *
   * @param {user} string
   * @param {existingUser} boolean – set to true of the user exists
   * @return {url} url as a string
   */
  function _buildURL(user, existingUser) {
    var url;
    if (existingUser) {
      url = API + user + '/repos';
    } else {
      url = API + user;
    }
    return url;
  }

  /*
   * Render with error
   *
   * @param {err} string – error message
   */
  function _error(err) {
    if (err === 'user') {
      msg = 'User Does not exist';
    } else {
      msg = err;
    }
    error = 'There went something wrong with the request on GitHub. ' + msg;
    _render({
      user: false,
      repos: false,
      error: error
    });
  }

  /*
   * Public API
   */
  return {
    searchUser: searchUser
  };

})();
