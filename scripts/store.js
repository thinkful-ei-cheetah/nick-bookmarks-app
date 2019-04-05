'use strict';

const store = (function() {
  return {
    bookmarks: [], // bookmarkItem = { id:cuid(), title, url, description, rating, expand:false, isEditing:false }
    adding: false,
    filter: false,
    minRating: 5,
  };
}());