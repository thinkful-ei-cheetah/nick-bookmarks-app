'use strict';

/* global store */
// bookmarkItem = { id:cuid(), title, url, description, rating, expanded:false, isEditing:false }

const bookmarksList = (function() {

  function generateBookmarkElement(bookmark) {
    if(bookmark.expanded) {
      return `
        <li class="js-bookmark-item" data-item-id="${bookmark.id}">
            <span class="bookmark-item-expanded">
              <div class="bookmark-item-header js-bookmark-item-header">
                <h4 class="bookmark-item-title">${bookmark.title}</h4>
                <span class="bookmark-item-rating">Rating: ${bookmark.rating}</span>
              </div>
              <form class="expanded-info">
                <textarea name="expanded-description" id="expanded-description" cols="30" rows="3">${bookmark.description}</textarea>
                <div class="expanded-controls">
                  <button class="button expanded-control-edit js-edit">Edit</button>
                  <button class="button expanded-control-remove js-remove">Remove</button>
                  <button class="button expanded-control-visit js-visit">Visit</button>                  
                </div>
              </form>
            </span>
        </li>`;
    } else {
      return `
        <li class="js-bookmark-item" data-item-id="${bookmark.id}">
          <div class="bookmark-item-header js-bookmark-item-header">
            <h4 class="bookmark-item-title">${bookmark.title}</h4>
            <span class="bookmark-item-rating">Rating: ${bookmark.rating}</span>
          </div>
        </li>`;
    }
  }

  function generateBookmarksListString(bookmarksArray) {
    const bookmarksStringArray = bookmarksArray.map( bookmark => generateBookmarkElement(bookmark) );
    return bookmarksStringArray.join('');
  }

  function render() {
    let bookmarks = [...store.bookmarks];

    // Filter on minRating
    bookmarks = bookmarks.filter(bookmark => bookmark.rating <= store.minRating);

    const bookmarksListString = generateBookmarksListString(bookmarks);

    // $('.js-controls-container').html(controlsString);
    if(store.adding) {
      $('.js-controls-form').addClass('hidden');
      $('.js-add-bookmark-form').removeClass('hidden');
    } else {
      $('.js-controls-form').removeClass('hidden');
      $('.js-add-bookmark-form').addClass('hidden');
    }

    $('.js-bookmarks-list').html(bookmarksListString);

    console.log('`render` ran');
  }

  function handleAddFilterFormShow() {
    $('.js-controls-container').on('click', '.js-add-form-show', event => {
      event.preventDefault();
      store.setAdding(true);
      render();
    });
  }

  function handleAddFilterFormHide() {
    $('.js-controls-container').on('click', '.js-add-form-cancel', event => {
      event.preventDefault();
      store.setAdding(false);
      render();
    });
  }

  function handleNewBookmarkSubmit() {
    $('.js-controls-container').on('submit', '.js-add-bookmark-form', event =>{
      event.preventDefault();
      const bmTitle = $('#add-bookmark-title-input').val();
      const bmUrl = $('#add-bookmark-url-input').val();
      const bmDesc = $('#add-bookmark-desc-textarea').val();
      let bmRating = $('#add-bookmark-rating-dropdown').val();

      // Check bmRating and set to 5(default) if null
      if(!bmRating) bmRating = 5;

      // temp bookmark creation...replace with api call here
      const bm = {
        id: cuid(),
        title: bmTitle,
        url: bmUrl,
        description: bmDesc,
        rating: bmRating,
      };

      store.setAdding(false);

      store.addBookmark(bm);
      render();
    });
  }

  function handleFilterByMinRating() {
    $('.js-controls-container').on('change', '.js-rating-filter', event => {
      const filterRating = Number($('.js-rating-filter').val());
      store.setMinRating(filterRating);
      render();
    });
  }

  function getItemIdfromElement(item) {
    return $(item)
      .closest('.js-bookmark-item')
      .data('item-id');
  }

  function handleBookmarkItemExpandToggle() {
    $('.js-bookmarks-list').on('click', '.bookmark-item-header', event =>{
      const id = getItemIdfromElement(event.currentTarget);
      const item = store.findById(id);

      if(item.expanded) {
        item.expanded = !item.expanded;
      } else {
        item.expanded = true;
      }

      render();
    });
  }

  function handleBookmarkVisit() {
    $('.js-bookmarks-list').on('click', '.js-visit', event => {
      event.preventDefault();
      const id = getItemIdfromElement(event.currentTarget);
      const item = store.findById(id);
      const url = item.url;
      
      window.open(url, '_blank');
    });
  }

  function handleBookmarkRemove() {
    $('.js-bookmarks-list').on('click', '.js-remove', event => {
      event.preventDefault();
      const id = getItemIdfromElement(event.currentTarget);

      store.findAndDelete(id);

      render();
    });
  }

  function bindEventListeners() {
    handleAddFilterFormShow();
    handleAddFilterFormHide();
    handleNewBookmarkSubmit();
    handleFilterByMinRating();
    handleBookmarkItemExpandToggle();
    handleBookmarkVisit();
    handleBookmarkRemove();
  }

  return {
    bindEventListeners,
    render
  };
}());