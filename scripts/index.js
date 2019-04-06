'use strict';

/* global $, store, api, bookmarksList */

$(document).ready(function() {
  bookmarksList.bindEventListeners();
  // bookmarksList.render();

  api.readBookmarks()
    .then((bookmarks) => {
      bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
      bookmarksList.render();
    });
});