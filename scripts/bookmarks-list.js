'use strict';

/* global store */
// bookmarkItem = { id:cuid(), title, url, description, rating, expanded:false, isEditing:false }

const bookmarksList = (function() {

  // function generateControlString() {
  //   if(!store.adding){
  //     return `
  //     <form class="add-bookmark-controls add-filter-form js-controls-form" >
  //       <button class="button add-filter-submit-button js-add-form-show">Add</button>
  //       <select name="rating-filter-select" class="dropdown rating-filter-dropdown js-rating-filter" aria-label="Filter by Minimum Rating">
  //         <option value="" disabled selected hidden>Filter by Minimum Rating</option>
  //         <option value="5">5 Stars</option>
  //         <option value="4">4 Stars</option>
  //         <option value="3">3 Stars</option>
  //         <option value="2">2 Stars</option>
  //         <option value="1">1 Star</option>
  //       </select>
  //     </form>`;
  //   } else {
  //     return `
  //     <form class="add-bookmark-controls add-bookmark-form js-add-bookmark-form" >
  //       <h3 class="add-bookmark-heading">Add Bookmark</h3>
  //       <label for="add-bookmark-title-input">Title:</label>
  //       <input type="text" name="Title" id="add-bookmark-title-input" placeholder="Title" required>
  //       <label for="add-bookmark-url-input">URL:</label>
  //       <input type="url" name="URL" id="add-bookmark-url-input" placeholder="URL" required>
  //       <label for="add-bookmark-desc-textarea">Description:</label>
  //       <textarea name="add-bookmark-desc-textarea" id="add-bookmark-desc-textarea" placeholder="Description..."></textarea>
  //       <label for="add-bookmark-rating-dropdown">Rating:</label>
  //       <select name="rating-select" class="dropdown rating-select-dropdown" id="add-bookmark-rating-dropdown" aria-label="Select Rating">
  //           <option value="" disabled selected hidden>Select Rating</option>
  //           <option value="5">5 Stars</option>
  //           <option value="4">4 Stars</option>
  //           <option value="3">3 Stars</option>
  //           <option value="2">2 Stars</option>
  //           <option value="1">1 Star</option>
  //       </select>
  //       <button type="reset" class="button add-bookmark-cancel-button js-add-form-cancel">Cancel</button>
  //       <button type="submit" class="button add-bookmark-submit-button js-bookmark-submit">Submit</button>
  //     </form>`;
  //   }
  // }

  function generateBookmarkElement(bookmark) {
    if(bookmark.expanded) {
      return `
        <li class="js-bookmark-item element" item-id="${bookmark.id}">
            <span class="bookmark-item expanded">
              <div class="expanded-header bookmark-item-header">
                <h4 class="bookmark-item-title">${bookmark.title}</h4>
                <span class="bookmark-item-rating">Rating: ${bookmark.rating}</span>
              </div>
              <form class="expanded-info">
                <textarea name="expanded-description" id="expanded-description" cols="30" rows="3">${bookmark.description}</textarea>
                <div class="expanded-controls">
                  <button class="button expanded-control-edit">Edit</button>
                  <button class="button expanded-control-remove">Remove</button>
                  <button class="button expanded-control-visit">Visit</button>                  
                </div>
              </form>
            </span>
        </li>`;
    } else {
      return `
        <li class="js-bookmark-item element" item-id="${bookmark.id}">
          <div class="bookmark-item bookmark-item-header">
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

  function bindEventListeners() {
    handleAddFilterFormShow();
    handleAddFilterFormHide();
    handleNewBookmarkSubmit();
    handleFilterByMinRating();
  }

  return {
    bindEventListeners,
    render
  };
}());