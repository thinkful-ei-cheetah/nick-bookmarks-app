'use strict';

/* global store, api */
// bookmarkItem = { id:cuid(), title, url, description, rating, expanded:false, isEditing:false }

const bookmarksList = (function() {
  
  function generateControlElementString() {
    const options = generateOptionsByRating(store.minRating);

    if(store.isAdding){
      return `
        <form class="add-bookmark-form js-add-bookmark-form" >
          <h3 class="add-bookmark-heading">Add Bookmark</h3>
          <label for="add-bookmark-title-input">Title:</label>
          <input type="text" name="Title" id="add-bookmark-title-input" placeholder="ex. Google" required>
          <label for="add-bookmark-url-input">URL:</label>
          <input type="url" name="URL" id="add-bookmark-url-input" placeholder="https://" required>
          <label for="add-bookmark-desc-textarea">Description:</label>
          <textarea name="Description" id="add-bookmark-desc-textarea"></textarea>
          <label for="add-bookmark-rating-dropdown">Rating:</label>
          <select name="Rating" class="dropdown rating-select-dropdown" id="add-bookmark-rating-dropdown" aria-label="Select Rating">
            <option value="" disabled selected hidden>Select Rating</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <button type="reset" class="button btn-add-cancel js-add-form-cancel">Cancel</button>
          <button type="submit" class="button btn-add-submit js-bookmark-submit">Submit</button>
        </form>`;
    } else {
      return `
        <form class="controls-form js-controls-form" >
        <button class="button btn-add-form-show js-add-form-show" aria-label="Add Bookmark">Add</button>
        <select name="rating-filter-select" class="dropdown rating-filter-dropdown js-rating-filter" aria-label="Filter by Minimum Rating">
          ${options}
        </select>
        </form>`;
    }
  }

  function generateOptionsByRating(rating) {
    let selectedDefault = '', selected5='', selected4='', selected3='', selected2='', selected1='';

    switch(rating) {
      case 5:
        selected5 = 'selected';
        break;
      case 4:
        selected4 = 'selected';
        break;
      case 3:
        selected3 = 'selected';
        break;
      case 2:
        selected2 = 'selected';
        break;
      case 1:
        selected1 = 'selected';
        break;
      default:
        selectedDefault = 'selected';
    }


    return `
      <option value="" disabled ${selectedDefault} hidden>Select Rating</option>
      <option value="5" ${selected5}>5 Stars</option>
      <option value="4" ${selected4}>4 Stars</option>
      <option value="3" ${selected3}>3 Stars</option>
      <option value="2" ${selected2}>2 Stars</option>
      <option value="1" ${selected1}>1 Star</option>`;
  }

  function generateBookmarkElement(bookmark) {
    let headerTitle = '<div class="bookmark-item-header js-bookmark-item-header" tabindex="0">';
    let bodyTitle = '<form class="expanded-info">';

    let enableDescEdit = 'readonly';

    let buttons = `
      <button type="button" class="button btn-edit js-edit">Edit</button>
      <button type="button" class="button btn-remove js-remove">Remove</button>
      <button type="button" class="button btn-visit js-visit">Visit</button> `;

    let bookmarkHeaderInner = `
      <h4 class="bookmark-item-title">${bookmark.title}</h4>
      <span class="bookmark-item-rating">Rating: ${bookmark.rating}</span>`;
    
    if(bookmark.isEditing) {
      headerTitle = `<form class="js-edit-form">
                       <div class="bookmark-item-header">`;
      bodyTitle = '';
      enableDescEdit = '';
      const options = generateOptionsByRating(Number(bookmark.rating));

      bookmarkHeaderInner = `
        <h4 class="bookmark-item-title">${bookmark.title}</h4>
        <select name="Rating" class="dropdown edit-rating-dropdown js-edit-rating" aria-label="Select Rating">
          ${options}
        </select>`;

      buttons = `
        <button type="reset" class="button btn-remove js-edit-cancel">Cancel</button>
        <button type="submit" class="button btn-edit js-edit-submit">Submit</button>`;
    }

    const bookmarkHeader = `
      <li class="js-bookmark-item" data-item-id="${bookmark.id}">
        ${headerTitle}
            ${bookmarkHeaderInner}
          </div>`;

    let bookmarkBody = '';

    if(bookmark.expanded) {
      bookmarkBody = `
        ${bodyTitle}
          <textarea name="Description" class="js-expanded-desc" cols="30" rows="3" ${enableDescEdit}>${bookmark.desc}</textarea>
          <div class="expanded-controls">
            ${buttons}                  
          </div>
        </form>`;
    }

    return bookmarkHeader + bookmarkBody + '</li>';
  }

  function generateBookmarksListString(bookmarksArray) {
    const bookmarksStringArray = bookmarksArray.map( bookmark => generateBookmarkElement(bookmark) );
    return bookmarksStringArray.join('');
  }

  function render() {
    let bookmarks = [...store.bookmarks];

    // Filter on minRating
    if(store.minRating) {
      bookmarks = bookmarks.filter(bookmark => bookmark.rating <= store.minRating);
    }

    const controlsString = generateControlElementString();
    const bookmarksListString = generateBookmarksListString(bookmarks);

    $('.js-controls-container').html(controlsString);
    $('.js-bookmarks-list').html(bookmarksListString);

    console.log('`render` ran');
  }

  function handleAddFormShow() {
    $('.js-controls-container').on('click', '.js-add-form-show', event => {
      event.preventDefault();
      store.setAdding(true);
      render();
    });
  }

  function handleAddFormHide() {
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

      // reset the form
      $('.js-add-bookmark-form')[0].reset();
      
      api.createBookmark(bmTitle, bmUrl, bmDesc, bmRating)
        .then((newBookmark) => {
          console.log(newBookmark);
          store.addBookmark(newBookmark);
          store.setAdding(false);
          render();
        })
        .catch((err) => {
          alert('error ' + err.message);
        });
    });
  }

  function handleFilterByMinRating() {
    $('.js-controls-container').on('change', '.js-rating-filter', event => {
      const filterRating = Number($('.js-rating-filter').val());
      store.setMinRating(filterRating);
      render();
    });
  }

  function getItemIdfromElement(bookmark) {
    return $(bookmark)
      .closest('.js-bookmark-item')
      .data('item-id');
  }

  function handleBookmarkItemExpandToggle() {
    $('.js-bookmarks-list').on('click', '.js-bookmark-item-header', event =>{
      const id = getItemIdfromElement(event.currentTarget);
      const bookmark = store.findById(id);

      if(bookmark.expanded && !bookmark.isEditing) {
        bookmark.expanded = !bookmark.expanded;
      } else {
        bookmark.expanded = true;
      }

      render();
    });
  }

  function handleBookrmarkItemExpandToggleKeypress() {
    $('.js-bookmarks-list').on('keypress', '.js-bookmark-item-header', event => {
      const key = event.which;
      if(key === 13) {
        $('.js-bookmark-item-header').click();
        return false;
      }
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

      api.deleteBookmark(id)
        .then(() => {
          store.findAndDelete(id);
          render();
        });
    });
  }

  function handleBookmarkEditClicked() {
    $('.js-bookmarks-list').on('click', '.js-edit', event => {
      event.stopPropagation();
      const id = getItemIdfromElement(event.currentTarget);
      console.log('edit button clicked');
      store.setBookmarkIsEditing(id, true);
      render();
    });
  }

  function handleBookmarkEditSubmit() {
    $('.js-bookmarks-list').on('click', '.js-edit-submit', event => {
      event.preventDefault();

      const id = getItemIdfromElement(event.currentTarget);
      const newTitle = $('.js-edit-title').val();
      const newDesc = $('.js-expanded-desc').val();
      let newRating = $('.js-edit-rating').val();

      const newData = {
        desc: newDesc,
        rating: newRating
      };
      console.log('submit edit button clicked');
      api.updateBookmark(id, newData)
        .then(() => {
          store.findAndUpdate(id, newData);
          store.setBookmarkIsEditing(id, false);
          render();
        })
        .catch((err) =>{
          alert('error' + err.message);
        });
    });
  }

  function handleBookmarkEditCancel() {
    $('.js-bookmarks-list').on('click', '.js-edit-cancel', event => {
      event.stopPropagation();
      const id = getItemIdfromElement(event.currentTarget);
      console.log('edit cancel clicked');
      store.setBookmarkIsEditing(id, false);
      render();
    });
  }

  function bindEventListeners() {
    handleAddFormShow();
    handleAddFormHide();
    handleNewBookmarkSubmit();
    handleFilterByMinRating();
    handleBookmarkItemExpandToggle();
    handleBookrmarkItemExpandToggleKeypress();
    handleBookmarkVisit();
    handleBookmarkRemove();
    handleBookmarkEditClicked();
    handleBookmarkEditSubmit();
    handleBookmarkEditCancel();
  }

  return {
    bindEventListeners,
    render
  };
}());