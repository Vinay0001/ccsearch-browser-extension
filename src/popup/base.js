export const elements = {
  inputField: document.getElementById('section-search-input'),
  searchIcon: document.getElementById('search-icon'),
  filterIcon: document.getElementById('filter-icon'),
  spinnerPlaceholderGrid: document.getElementById('spinner-placeholder--grid'),
  spinnerPlaceholderPopup: document.getElementById('spinner-placeholder--popup'),
  spinnerPlaceholderBookmarks: document.getElementById('spinner-placeholder--bookmarks'),
  spinnerPlaceholderCollections: document.getElementById('spinner-placeholder--collections'),
  useCaseChooser: document.querySelector('#choose-usecase'),
  licenseChooser: document.querySelector('#choose-license'),
  sourceChooser: document.querySelector('#choose-source'),
  imageTypeChooser: document.querySelector('#choose-imageType'),
  imageSizeChooser: document.querySelector('#choose-imageSize'),
  fileTypeChooser: document.querySelector('#choose-fileType'),
  aspectRatioChooser: document.querySelector('#choose-aspectRatio'),
  licenseChooserWrapper: document.querySelector('.section-filter__filter-wrapper--choose-license'),
  useCaseChooserWrapper: document.querySelector('.section-filter__filter-wrapper--choose-usecase'),
  sourceChooserWrapper: document.querySelector('.section-filter__filter-wrapper--choose-source'),
  imageTypeChooserWrapper: document.querySelector('.section-filter__filter-wrapper--choose-imageType'),
  imageSizeChooserWrapper: document.querySelector('.section-filter__filter-wrapper--choose-imageSize'),
  fileTypeChooserWrapper: document.querySelector('.section-filter__filter-wrapper--choose-fileType'),
  aspectRatioChooserWrapper: document.querySelector('.section-filter__filter-wrapper--choose-aspectRatio'),
  sourceChooserLoadingMessage: document.querySelector('.section-filter__source-loading-mes'),
  filterResetButton: document.querySelector('.section-filter--reset-button'),
  filterApplyButton: document.querySelector('.section-filter--apply-button'),
  clearSearchButton: document.getElementsByClassName('clear-search-button'),
  loadMoreSearchButton: document.querySelector('.load-more-search-button'),
  loadMoreSearchButtonWrapper: document.querySelector('.load-more-search-button-wrapper'),
  loadMoreBookmarkButton: document.querySelector('.load-more-bookmark-button'),
  loadMoreBookmarkButtonkWrapper: document.querySelector('.load-more-bookmark-button-wrapper'),
  popup: document.getElementById('popup'),
  popupMain: document.querySelector('.popup__main'),
  downloadImageButton: document.getElementById('download-image'),
  downloadImageAttributionButton: document.getElementById('download-image-attribution'),
  popupCloseButton: document.querySelector('.popup__close-button'),
  gridPrimary: document.querySelector('.grid-primary'),
  gridBookmarks: document.querySelector('.grid-bookmarks'),
  filterSection: document.querySelector('.section-filter'),
  popupTabLinks: document.getElementsByClassName('popup__tab-links'),
  popupTabContent: document.getElementsByClassName('popup__tab-content'),
  facebookShareButton: document.querySelector('#facebook-share'),
  twitterShareButton: document.querySelector('#twitter-share'),
  pinterestShareButton: document.querySelector('#pinterest-share'),
  tumblrShareButton: document.querySelector('#tumblr-share'),
  bookmarksIcon: document.getElementById('bookmarks-icon'),
  collectionsIcon: document.getElementById('collections-icon'),
  homeIcon: document.getElementById('home-icon'),
  primarySection: document.querySelector('.section-primary'),
  bookmarksSection: document.querySelector('.section-bookmarks'),
  collectionsSection: document.querySelector('.section-collections'),
  collectionsSectionBody: document.querySelector('.section-collections--body'),
  deleteBookmarksButton: document.querySelector('.delete-bookmark-button'),
  buttonBackToTop: document.getElementsByClassName('button-backToTop')[0],
  exportBookmarksButton: document.getElementsByClassName('export-bookmarks-button')[0],
  selectCheckboxes: document.getElementsByClassName('select-checkbox'),
  buttonSelectAllCheckbox: document.getElementsByClassName('select-all-checkbox-button'),
  modal: document.getElementsByClassName('modal')[0],
  modalClose: document.getElementsByClassName('modal-close')[0],
  modalCancel: document.getElementsByClassName('modal-button--cancel')[0],
  modalConfirm: document.getElementsByClassName('modal-button--confirm')[0],
  modalContent: document.getElementsByClassName('modal-text')[0],
  modalBody: document.getElementsByClassName('modal-content')[0],
};
export const attributionTabLink = elements.popupTabLinks[0];
