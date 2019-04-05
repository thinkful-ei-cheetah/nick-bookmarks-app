'use strict';

/* global store */
// bookmarkItem = { id:cuid(), title, url, description, rating, expanded:false, isEditing:false }

const bookmarksList = (function() {

  function generateControlString() {
    if(!store.adding){
      return `
        <form class="add-bookmark-controls add-filter-form js-controls-form" >
        <button type="submit" class="button add-filter-submit-button">Add</button>
        <select name="rating-filter-select" class="dropdown rating-filter-dropdown" aria-label="Filter by Minimum Rating">
          <option value="" disabled selected hidden>Filter by Minimum Rating</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
        </form>`;
    } else {
      return `
        <form class="add-bookmark-controls add-bookmark-form js-add-bookmark-form" >
        <h3 class="add-bookmark-heading">Add Bookmark</h3>
        <label for="add-bookmark-title-input">Title:</label>
        <input type="text" name="Title" id="add-bookmark-title-input" placeholder="Title" required>
        <label for="add-bookmark-url-input">URL:</label>
        <input type="url" name="URL" id="add-bookmark-url-input" placeholder="URL" required>
        <label for="add-bookmark-desc-textarea">Description:</label>
        <textarea name="add-bookmark-desc-textarea" id="add-bookmark-desc-textarea" placeholder="Description..."></textarea>
        <label for="add-bookmark-rating-spinner">Rating:</label>
        <select name="rating-select" class="dropdown rating-select-dropdown" aria-label="Select Rating">
            <option value="" disabled selected hidden>Select Rating</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
        </select>
        <button type="reset" class="button add-bookmark-cancel-button">Cancel</button>
        <button type="submit" class="button add-bookmark-submit-button">Submit</button>
        </form>`;
    }
  }

  function generateBookmarkElement(bookmark) {
    if(bookmark.expanded) {
      return `
        <li class="js-bookmark-item element" item-id="${bookmark.id}">
            <span class="bookmark-item expanded">
              <div class="expanded-header bookmark-item-header">
                <h4 class="bookmark-item-title">${bookmark.title}</h4>
                <span class="bookmark-item-rating">${bookmark.rating}</span>
              </div>
              <form class="expanded-info">
                <textarea name="expanded-description" id="expanded-description" cols="30" rows="3">${bookmark.description}</textarea>
                <div class="expanded-controls">
                  <button class="button expanded-control-edit">Edit</button>
                  <button class="button expanded-control-visit">Visit</button>
                  <button class="button expanded-control-remove">Remove</button>
                </div>
              </form>
            </span>
        </li>`;
    } else {
      return `
        <li class="js-bookmark-item element" item-id="${bookmark.id}">
          <div class="bookmark-item bookmark-item-header">
            <h4 class="bookmark-item-title">${bookmark.title}</h4>
            <span class="bookmark-item-rating">${bookmark.rating}</span>
          </div>
        </li>`;
    }
  }

  function generateBookmarksListString(bookmarksArray) {
    const bookmarksStringArray = bookmarksArray.map( bookmark => generateBookmarkElement(bookmark) );
    console.log(bookmarksStringArray);
    return bookmarksStringArray.join('');
  }

  function render() {
    let bookmarks = [...store.bookmarks];

    console.log('`render` ran');
    const controlsString = generateControlString();
    const bookmarksListString = generateBookmarksListString(bookmarks);

    console.log(controlsString);

    $('.js-controls-container').html(controlsString);
    $('.js-bookmarks-list').html(bookmarksListString);
  }

  return {
    render
  };
}());