'use strict';

/* global $, store, cuid, bookmarksList */

console.log('js hooked up');
//store.bookmarks[id] = { id:cuid(), title, url, description, rating, expand:false, isEditing:false }

$(document).ready(function() {
  bookmarksList.bindEventListeners();
  bookmarksList.render();

  store.addBookmark({id: cuid(), title:'Google', url:'https://www.google.com', description:'World\'s best search engine', rating: 5, expanded:true, isEditing:false});
  store.addBookmark({id: cuid(), title:'Amazon', url:'https://www.amazon.com', description:'World\'s biggest online store', rating: 5, expanded:false, isEditing:false});
  store.addBookmark({id: cuid(), title:'Reddit', url:'https://www.reddit.com', description:'Front page of the internet', rating: 5, expanded:false, isEditing:false});

  console.log(store);
  bookmarksList.render();
});