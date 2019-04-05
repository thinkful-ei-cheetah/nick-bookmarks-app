'use strict';

const store = (function() {

  function addBookmark(bookmark) {
    this.bookmarks.push(bookmark);
  }

  function findById(id) {
    return this.bookmarks.find(bookmark => bookmark.id === id);
  }

  function findAndDelete(id) {
    this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
  }

  function findAndUpdate(id, newData) {
    const bookmarkToUpdate = this.findById(id);
    Object.assign(bookmarkToUpdate, newData);
  }

  function setBookmarkExpanded(id, isExpanded) {
    const bookmark = this.findById(id);
    bookmark.expanded = isExpanded;
  }

  function setBookmarkIsEditing(id, isEditing) {
    const bookmark = this.findById(id);
    bookmark.isEditing = isEditing;
  }

  function setUserName(name) {
    this.userName = name;
  }

  function setAdding(adding) {
    this.adding = adding;
  }

  function setMinRating(minRating) {
    this.minRating = minRating;
  }

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
    setBookmarkIsEditing,
    setUserName,
    setAdding,
    setMinRating,
  };
}());