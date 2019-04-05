'use strict';

const store = (function() {
  const addBookmark = function(bookmark) {
    this.bookmarks.push(bookmark);
  };

  const findById = function(id) {
    return this.bookmarks.find(bookmark => bookmark.id === id);
  };

  const findAndDelete = function(id) {
    this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
  };

  const findAndUpdate = function(id, newData) {
    const bookmarkToUpdate = this.findById(id);
    Object.assign(bookmarkToUpdate, newData);
  };

  const setBookmarkExpanded = function(id, isExpanded) {
    const bookmark = this.findById(id);
    bookmark.expanded = isExpanded;
  };

  const setUserName = function(name) {
    this.userName = name;
  };

  const setAdding = function(adding) {
    this.adding = adding;
  };

  const setMinRating = function(minRating) {
    this.minRating = minRating;
  };

  return {
    // PROPERTIES
    bookmarks: [], // bookmarkItem = { id:cuid(), title, url, description, rating, expanded:false, isEditing:false }
    userName: 'Nick',
    adding: false,
    minRating: 5, // Default value is 5 (display all)
    // METHODS
    addBookmark,
    findById,
    findAndDelete,
    findAndUpdate,
    setBookmarkExpanded,
    setMinRating,
    setAdding,
    setUserName
  };
}());