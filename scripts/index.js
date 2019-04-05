'use strict';

/* global $, store, cuid, bookmarksList */

console.log('js hooked up');
//store.bookmarks[id] = { id:cuid(), title, url, description, rating, expand:false, isEditing:false }

$(document).ready(function() {
  bookmarksList.bindEventListeners();
  bookmarksList.render();

  store.addBookmark({id: cuid(), title:'Google', url:'www.google.com', description:'World\'s best search engine', rating: 5, expanded:true, isEditing:false});
  store.addBookmark({id: cuid(), title:'Amazon', url:'www.google.com', description:'World\'s best search engine', rating: 5, expanded:true, isEditing:false});
  store.addBookmark({id: cuid(), title:'nix.codes', url:'www.google.com', description:'World\'s best search engine', rating: 5, expanded:true, isEditing:false});

  console.log(store);
  bookmarksList.render();
});