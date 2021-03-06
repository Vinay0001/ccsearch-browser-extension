import { elements } from './base';
// eslint-disable-next-line import/no-cycle
import {
  checkInputError,
  removeOldSearchResults,
  getRequestUrl,
  search,
  addSearchThumbnailsToDOM,
  removeLoaderAnimation,
  checkInternetConnection,
  getCollectionsUrl,
} from './searchModule';
import {
  licenseDropDownFields,
  aspectRatioDropDownFields,
  fileTypeDropDownFields,
  licenseAPIQueryStrings,
  useCaseAPIQueryStrings,
  useCaseDropDownFields,
  imageTypeDropDownFields,
  imageSizeDropDownFields,
  makeElementsDisplayNone,
  removeClassFromElements,
  removeLoadMoreButton,
  imageTypeAPIQueryStrings,
  fileTypeAPIQueryStrings,
  aspectRatioAPIQueryStrings,
  imageSizeAPIQueryStrings,
} from './helper';
import {
  loadSourcesToDom,
  resetFilterDropDown,
  loadUserDefaults,
  toggleOnFilterDropDownCheckboxes,
} from './filterModule';
import { handleImageAttributionDownload, handleImageDownload } from './infoPopupModule';
import { addSpinner } from './spinner';
import {
  showNotification,
  removeNode,
  getLatestSources,
  restoreInitialContent,
  showModal,
  fetchImageData,
} from '../utils';
import { loadBookmarkImages } from './bookmarkModule';
import loadStoredContentToUI from './popup.utils';

// global object to store the application variables
window.appObject = {};
window.appObject.inputText = '';
window.appObject.pageNo = 1;
window.appObject.bookmarksSectionIdx = 0;
window.appObject.enableMatureContent = false;
// List to hold  selected by the user from the drop down.
window.appObject.userSelectedSourcesList = [];

// List to hold user selected licenses
window.appObject.userSelectedLicensesList = [];

// List to hold user selected use case
window.appObject.userSelectedUseCaseList = [];

window.appObject.userSelectedImageTypeList = [];
window.appObject.userSelectedImageSizeList = [];
window.appObject.userSelectedFileTypeList = [];
window.appObject.userSelectedAspectRatioList = [];

// window.appObject.allUserSelectedFilterLists = [
//   'userSelectedSourcesList',
//   'userSelectedLicensesList',
//   'userSelectedUseCaseList',
//   'userSelectedFileTypeList',
//   'userSelectedImageTypeList',
//   'userSelectedImageSizeList',
//   'userSelectedAspectRatioList',
// ];

// object to map source display names to valid query names.
window.appObject.sourceAPIQueryStrings = {};

// Store Wheather Search Storage is enabled or not
let enableSearchStorageOption = true;

// Search Storage
window.appObject.storeSearch = {};

// eslint-disable-next-line no-undef
const clipboard = new ClipboardJS('.btn-copy');

clipboard.on('success', e => {
  e.clearSelection();
  showNotification('Copied', 'positive', 'snackbar-bookmarks');
});

elements.modal.classList.add('display-none');

elements.popupCloseButton.addEventListener('click', () => {
  elements.popup.style.opacity = 0;
  elements.popup.style.visibility = 'hidden';
  elements.popupMain.style.opacity = 0;
  elements.popupMain.style.visibility = 'hidden';

  // remove eventlisteners from download buttons to avoid multiple downloads.
  elements.downloadImageButton.removeEventListener('click', handleImageDownload);
  elements.downloadImageAttributionButton.removeEventListener('click', handleImageAttributionDownload);
});

elements.popup.addEventListener('click', e => {
  if (e.target.classList.contains('popup')) {
    // popup.style.opacity = 0;
    // popup.style.visibility = 'hidden';
    elements.popupCloseButton.click();
  }
});

Array.prototype.forEach.call(elements.popupTabLinks, element => {
  element.addEventListener('click', e => {
    const targetElement = e.target;
    const targetElementText = e.target.textContent;

    makeElementsDisplayNone(elements.popupTabContent);
    removeClassFromElements(elements.popupTabLinks, 'popup__tab-links-active');

    document.getElementById(targetElementText.toLowerCase()).style.display = 'block';
    targetElement.classList.add('popup__tab-links-active');
  });
});

// Activate the click event on pressing enter.
elements.inputField.addEventListener('keydown', event => {
  if (event.keyCode === 13) {
    elements.searchIcon.click();
  }
});

async function populateSourceList() {
  window.appObject.sourceAPIQueryStrings = await getLatestSources();

  let count = 0;
  const sourceDropDownFields = [];

  // iterating over source object
  Object.keys(window.appObject.sourceAPIQueryStrings).forEach(key => {
    sourceDropDownFields[count] = {
      id: window.appObject.sourceAPIQueryStrings[key],
      title: key,
    };
    count += 1;
  });

  loadSourcesToDom(sourceDropDownFields, enableSearchStorageOption && localStorage.length !== 0);
}

elements.filterIcon.addEventListener('click', () => {
  elements.filterSection.classList.toggle('section-filter--active');
});

setTimeout(populateSourceList(), 2500);

// function clearAllUserSelectedFilterLists() {
//   window.appObject.allUserSelectedFilterLists.forEach(element => {
//     console.log(`element name ${element}`);
//     console.log(`it's value ${window.appObject.element}`);
//     console.log(
//       `usersselesourcelist window.appObject.userSelectedSourcesList ${window.appObject.userSelectedSourcesList}`,
//     );
//     window.appObject.element = [];
//   });
//   // console.log(window.appObject.allUserSelectedFilterLists);
// }

// TODO: divide the steps into functions
elements.filterResetButton.addEventListener('click', () => {
  // reset values
  elements.useCaseChooser.value = '';
  elements.licenseChooser.value = '';
  elements.sourceChooser.value = '';
  elements.fileTypeChooser.value = '';
  elements.imageTypeChooser.value = '';
  elements.imageSizeChooser.value = '';
  elements.aspectRatioChooser.value = '';

  // array of dropdown container elements
  const dropdownElementsList = [
    elements.sourceChooserWrapper,
    elements.licenseChooserWrapper,
    elements.useCaseChooserWrapper,
    elements.fileTypeChooserWrapper,
    elements.imageTypeChooserWrapper,
    elements.imageSizeChooserWrapper,
    elements.aspectRatioChooserWrapper,
  ];

  dropdownElementsList.forEach(dropdown => {
    const dropdownContainer = dropdown.querySelector('.comboTreeDropDownContainer');
    const inputCheckboxes = dropdownContainer.getElementsByTagName('input');
    // unchecking all the options
    for (let i = 0; i < inputCheckboxes.length; i += 1) {
      // using click to uncheck the box as setting checked=false also works visually
      if (inputCheckboxes[i].checked) {
        inputCheckboxes[i].click();
      }
    }
  });

  // the filter is not activated anymore
  elements.filterIcon.classList.remove('activate-filter');

  // clear the datastructures and make a fresh search
  window.appObject.userSelectedLicensesList = [];
  window.appObject.userSelectedSourcesList = [];
  window.appObject.userSelectedUseCaseList = [];
  window.appObject.userSelectedFileTypeList = [];
  window.appObject.userSelectedImageTypeList = [];
  window.appObject.userSelectedImageSizeList = [];
  window.appObject.userSelectedAspectRatioList = [];
  // console.log(window.appObject.userSelectedUseCaseList);
  // clearAllUserSelectedFilterLists();
  // console.log(window.appObject.userSelectedUseCaseList);
  elements.searchIcon.click();
});

// block to disable license dropdown, when atleast one of use-case checkboxes are checked
elements.useCaseChooserWrapper.addEventListener(
  'click',
  event => {
    const useCaseDropDownContainer = elements.useCaseChooserWrapper.querySelector('.comboTreeDropDownContainer');
    const inputCheckboxes = useCaseDropDownContainer.getElementsByTagName('input');

    let flag = 0;
    if (event.target.classList.contains('comboTreeItemTitle')) {
      // only checking checkbox elements
      if (!event.target.querySelector('input').checked) {
        // if the clicked checkbox is unchecked
        resetFilterDropDown(elements.licenseChooserWrapper);
        // clear the datastructures and make a fresh search
        window.appObject.userSelectedLicensesList = [];
        // disable the license dropdown (as atleast one checkbox is checked)
        elements.licenseChooser.disabled = true;
        flag = 1;
      }
    }
    for (let i = 0; i < inputCheckboxes.length; i += 1) {
      // iterating all the checkboxes of use-case dropdown
      if (inputCheckboxes[i] !== event.target.querySelector('input')) {
        // excluding the current checkbox
        if (inputCheckboxes[i].checked) {
          // if atleast one checkbox is checked, disable the license dropdown
          resetFilterDropDown(elements.licenseChooserWrapper);
          elements.licenseChooser.disabled = true;
          flag = 1;
        }
      }
    }
    if (!flag) {
      // if none of the checkbox is checked
      if (elements.licenseChooser.disabled) {
        // enable the license dropdown if it is not already.
        elements.licenseChooser.disabled = false;
      }
    }
  },
  true, // needed to make the event trigger during capturing phase
  // (https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters)
);

function applyFilters() {
  //  reset filter data structures
  window.appObject.userSelectedSourcesList = [];
  window.appObject.userSelectedLicensesList = [];
  window.appObject.userSelectedUseCaseList = [];
  window.appObject.userSelectedImageTypeList = [];
  window.appObject.userSelectedImageSizeList = [];
  window.appObject.userSelectedFileTypeList = [];
  window.appObject.userSelectedAspectRatioList = [];

  if (elements.sourceChooser.value) {
    const userInputSourcesList = elements.sourceChooser.value.split(', ');
    userInputSourcesList.forEach(element => {
      window.appObject.userSelectedSourcesList.push(window.appObject.sourceAPIQueryStrings[element]);
    });
  }

  if (elements.licenseChooser.value) {
    const userInputLicensesList = elements.licenseChooser.value.split(', ');
    userInputLicensesList.forEach(element => {
      window.appObject.userSelectedLicensesList.push(licenseAPIQueryStrings[element]);
    });
  }

  if (elements.useCaseChooser.value) {
    const userInputUseCaseList = elements.useCaseChooser.value.split(', ');
    userInputUseCaseList.forEach(element => {
      window.appObject.userSelectedUseCaseList.push(useCaseAPIQueryStrings[element]);
    });
  }

  if (elements.imageTypeChooser.value) {
    const userInputImageTypeList = elements.imageTypeChooser.value.split(', ');
    userInputImageTypeList.forEach(element => {
      window.appObject.userSelectedImageTypeList.push(imageTypeAPIQueryStrings[element]);
    });
  }

  if (elements.imageSizeChooser.value) {
    const userInputImageSizeList = elements.imageSizeChooser.value.split(', ');
    userInputImageSizeList.forEach(element => {
      window.appObject.userSelectedImageSizeList.push(imageSizeAPIQueryStrings[element]);
    });
  }

  if (elements.fileTypeChooser.value) {
    const userInputFileTypeList = elements.fileTypeChooser.value.split(', ');
    userInputFileTypeList.forEach(element => {
      window.appObject.userSelectedFileTypeList.push(fileTypeAPIQueryStrings[element]);
    });
  }

  if (elements.aspectRatioChooser.value) {
    const userInputAspectRatioList = elements.aspectRatioChooser.value.split(', ');
    userInputAspectRatioList.forEach(element => {
      window.appObject.userSelectedAspectRatioList.push(aspectRatioAPIQueryStrings[element]);
    });
  }

  // "activate" filter icon if some filters are applied
  if (
    window.appObject.userSelectedSourcesList.length > 0 ||
    window.appObject.userSelectedLicensesList.length > 0 ||
    window.appObject.userSelectedUseCaseList.length > 0 ||
    window.appObject.userSelectedFileTypeList.length > 0 ||
    window.appObject.userSelectedImageTypeList.length > 0 ||
    window.appObject.userSelectedImageSizeList.length > 0 ||
    window.appObject.userSelectedAspectRatioList.length > 0
  ) {
    elements.filterIcon.classList.add('activate-filter');
  } else {
    elements.filterIcon.classList.remove('activate-filter');
  }
}

elements.filterApplyButton.addEventListener('click', () => {
  applyFilters();
  elements.searchIcon.click();
});

function checkIfSourceFilterIsRendered() {
  if (elements.sourceChooserWrapper.style.display !== 'inline-block') {
    showNotification('Loading Source Filters. Please try again!', 'negative', 'snackbar-bookmarks');
    throw new Error('Source Filter not loaded yet');
  }
}

elements.searchIcon.addEventListener('click', () => {
  window.appObject.inputText = elements.inputField.value.trim().replace('/[ ]+/g', ' ');
  window.appObject.pageNo = 1;
  window.appObject.searchByCollectionActivated = false;

  checkInputError(window.appObject.inputText);
  checkIfSourceFilterIsRendered();
  checkInternetConnection();
  removeNode('no-image-found-mes');
  removeOldSearchResults();
  removeLoaderAnimation();
  applyFilters();

  // check if this is necessary. localstorage.clear() is called in search() also
  localStorage.clear(); // clear the old results

  // enable spinner
  addSpinner(elements.spinnerPlaceholderGrid, 'original');
  // elements.spinner.classList.add('spinner');

  const url = getRequestUrl(
    window.appObject.inputText,
    window.appObject.userSelectedUseCaseList,
    window.appObject.userSelectedLicensesList,
    window.appObject.userSelectedSourcesList,
    window.appObject.userSelectedFileTypeList,
    window.appObject.userSelectedImageTypeList,
    window.appObject.userSelectedImageSizeList,
    window.appObject.userSelectedAspectRatioList,
    window.appObject.pageNo,
    window.appObject.enableMatureContent,
  );

  // console.log(window.appObject.userSelectedUseCaseList);
  console.log(window.appObject.userSelectedSourcesList);
  search(url);
  // console.log(url);
  // pageNo += 1;
  elements.clearSearchButton[0].classList.remove('display-none');
});

elements.modal.addEventListener('click', () => {
  elements.modalCancel.click();
});

elements.modalBody.addEventListener('click', e => {
  e.stopPropagation();
});

elements.clearSearchButton[0].addEventListener('click', () => {
  const modalText = 'Do you really want to clear the search?';
  function onModalConfirm() {
    // Restore Initial Content
    elements.clearSearchButton[0].classList.add('display-none');
    elements.inputField.value = '';
    removeOldSearchResults();
    removeLoadMoreButton(elements.loadMoreSearchButtonWrapper);
    elements.gridPrimary.setAttribute('style', 'position: relative; height: 0px;');
    localStorage.clear();
    restoreInitialContent('primary');
    applyFilters();
    elements.modal.classList.add('display-none');
  }
  function onModalClose() {
    elements.modal.classList.add('display-none');
  }
  chrome.storage.sync.get('enableSearchClearConfirm', items => {
    if (items.enableSearchClearConfirm) {
      showModal(modalText, onModalConfirm, onModalClose);
    } else {
      onModalConfirm();
    }
  });
});

// applying comboTree (see https://github.com/kirlisakal/combo-tree)
$('#choose-usecase').comboTree({
  source: useCaseDropDownFields,
  isMultiple: true,
});

$('#choose-license').comboTree({
  source: licenseDropDownFields,
  isMultiple: true,
});

$('#choose-aspectRatio').comboTree({
  source: aspectRatioDropDownFields,
  isMultiple: true,
});

$('#choose-fileType').comboTree({
  source: fileTypeDropDownFields,
  isMultiple: true,
});

$('#choose-imageType').comboTree({
  source: imageTypeDropDownFields,
  isMultiple: true,
});

$('#choose-imageSize').comboTree({
  source: imageSizeDropDownFields,
  isMultiple: true,
});

function setEnableSearchStorageOptionVariable(enableSearchStorage) {
  if (enableSearchStorage === undefined) {
    // enable the feature by default (on startup, enableSearchStorage key will by undefined)
    enableSearchStorageOption = true;
    chrome.storage.sync.set({ enableSearchStorage: enableSearchStorageOption });
  } else enableSearchStorageOption = enableSearchStorage;
}

function restoreAppObjectVariables() {
  window.appObject.inputText = localStorage.getItem('title');

  chrome.storage.sync.get(['enableMatureContent'], res => {
    window.appObject.enableMatureContent = res.enableMatureContent === true;
  });
}

restoreAppObjectVariables();

async function loadStoredSearchOnInit() {
  await chrome.storage.sync.get(['enableSearchStorage'], res => {
    setEnableSearchStorageOptionVariable(res.enableSearchStorage);

    if (localStorage.length !== 0 && enableSearchStorageOption) {
      loadStoredContentToUI();

      if (
        elements.sourceChooser.value ||
        elements.useCaseChooser.value ||
        elements.licenseChooser.value ||
        elements.fileTypeChooser.value ||
        elements.imageTypeChooser.value ||
        elements.imageSizeChooser.value ||
        elements.aspectRatioChooser.value
      ) {
        const activeLicenseOptions = {};
        const activeUseCaseOptions = {};
        const activeFileTypeOptions = {};
        const activeImageTypeOptions = {};
        const activeImageSizeOptions = {};
        const activeAspectRatioOptions = {};
        elements.licenseChooser.value.split(', ').forEach(x => {
          activeLicenseOptions[x] = true;
          window.appObject.userSelectedLicensesList.push(licenseAPIQueryStrings[x]);
        });
        elements.useCaseChooser.value.split(', ').forEach(x => {
          activeUseCaseOptions[useCaseAPIQueryStrings[x]] = true;
          window.appObject.userSelectedUseCaseList.push(useCaseAPIQueryStrings[x]);
        });
        elements.fileTypeChooser.value.split(', ').forEach(x => {
          activeFileTypeOptions[fileTypeAPIQueryStrings[x]] = true;
          window.appObject.userSelectedFileTypeList.push(fileTypeAPIQueryStrings[x]);
        });
        elements.imageTypeChooser.value.split(', ').forEach(x => {
          activeImageTypeOptions[imageTypeAPIQueryStrings[x]] = true;
          window.appObject.userSelectedImageTypeList.push(imageTypeAPIQueryStrings[x]);
        });
        elements.imageSizeChooser.value.split(', ').forEach(x => {
          activeImageSizeOptions[imageSizeAPIQueryStrings[x]] = true;
          window.appObject.userSelectedImageSizeList.push(imageSizeAPIQueryStrings[x]);
        });
        elements.aspectRatioChooser.value.split(', ').forEach(x => {
          activeAspectRatioOptions[aspectRatioAPIQueryStrings[x]] = true;
          window.appObject.userSelectedAspectRatioList.push(aspectRatioAPIQueryStrings[x]);
        });
        toggleOnFilterDropDownCheckboxes(elements.licenseChooserWrapper, activeLicenseOptions);
        toggleOnFilterDropDownCheckboxes(elements.useCaseChooserWrapper, activeUseCaseOptions);
        toggleOnFilterDropDownCheckboxes(elements.fileTypeChooserWrapper, activeFileTypeOptions);
        toggleOnFilterDropDownCheckboxes(elements.imageTypeChooserWrapper, activeImageTypeOptions);
        toggleOnFilterDropDownCheckboxes(elements.imageSizeChooserWrapper, activeImageSizeOptions);
        toggleOnFilterDropDownCheckboxes(elements.aspectRatioChooserWrapper, activeAspectRatioOptions);
        // console.log(elements.useCaseChooser.value);
        // console.log(useCaseAPIQueryStrings);
        // console.log(activeUseCaseOptions);
        elements.filterIcon.classList.add('activate-filter');
      }
    } else {
      elements.clearSearchButton[0].classList.add('display-none');
      loadUserDefaults();
    }
  });
}

loadStoredSearchOnInit();

async function nextRequest(page) {
  let result = [];
  let url;
  if (localStorage.getItem(window.appObject.pageNo)) {
    result = Object.values(JSON.parse(localStorage.getItem(window.appObject.pageNo)));
  } else {
    if (window.appObject.searchByCollectionActivated) {
      url = getCollectionsUrl(window.appObject.collectionName, page, window.appObject.enableMatureContent);
    } else {
      url = getRequestUrl(
        window.appObject.inputText,
        window.appObject.userSelectedUseCaseList,
        window.appObject.userSelectedLicensesList,
        window.appObject.userSelectedSourcesList,
        window.appObject.userSelectedFileTypeList,
        window.appObject.userSelectedImageTypeList,
        window.appObject.userSelectedImageSizeList,
        window.appObject.userSelectedAspectRatioList,
        window.appObject.pageNo,
        window.appObject.enableMatureContent,
      );
    }

    console.log(url);
    const response = await fetch(url);
    const json = await response.json();
    result = json.results;

    if (enableSearchStorageOption) {
      // Update Local Storage Data
      window.appObject.storeSearch.page = { ...result };
      localStorage.setItem(window.appObject.pageNo, JSON.stringify(window.appObject.storeSearch.page));
    }
  }
  // console.log(result);
  addSearchThumbnailsToDOM(result);
  window.appObject.pageNo += 1;
}

// store the name of the current active section
window.appObject.activeSection = 'search';
window.appObject.searchByCollectionActivated = localStorage.getItem('searchByCollectionActivated') === 'true';
window.appObject.collectionName = localStorage.getItem('collectionName');

elements.loadMoreSearchButton.addEventListener('click', () => {
  removeLoadMoreButton(elements.loadMoreSearchButtonWrapper);
  addSpinner(elements.spinnerPlaceholderGrid, 'for-bottom');
  nextRequest(window.appObject.pageNo);
});

elements.loadMoreBookmarkButton.addEventListener('click', () => {
  removeLoadMoreButton(elements.loadMoreBookmarkButtonkWrapper);
  addSpinner(elements.spinnerPlaceholderGrid, 'for-bottom');
  loadBookmarkImages(10);
});

document.getElementById('settings-icon').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

document.getElementById('invert_colors-icon').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  document.documentElement.classList.toggle('dark');
  chrome.storage.sync.get('darkmode', items => {
    const value = !items.darkmode;
    chrome.storage.sync.set({
      darkmode: value, // using ES6 to use variable as key of object
    });
  });
});

chrome.storage.sync.get('darkmode', items => {
  if (items.darkmode) {
    document.body.classList.add('dark');
    document.documentElement.classList.add('dark');
  }
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    elements.buttonBackToTop.classList.add('show');
  } else {
    elements.buttonBackToTop.classList.remove('show');
  }
});

elements.buttonBackToTop.addEventListener('click', () => window.scrollTo(0, 0));

async function migrateOldBookmarks() {
  chrome.storage.sync.get(null, items => {
    console.log('migrating old bookmarks');
    console.log(items);
  });

  chrome.storage.sync.get({ bookmarksMigrationDone: false }, items3 => {
    if (!items3.bookmarksMigrationDone) {
      let count = 0;
      chrome.storage.sync.get({ newBookmarks: {} }, store => {
        const { newBookmarks } = store;

        chrome.storage.sync.get('bookmarks', async items => {
          if (items.bookmarks !== undefined) {
            document.querySelector('.notification__popup--background').style.display = 'flex';
            if (items.bookmarks.length !== 0) {
              const currentBookmarksArray = items.bookmarks;

              for (let i = currentBookmarksArray.length - 1; i >= 0; i -= 1) {
                count += 1;
                console.log(count);
                const bookmarkId = currentBookmarksArray[i];
                // eslint-disable-next-line no-await-in-loop
                const res = await fetchImageData(bookmarkId);
                const imageDetailResponse = res[0];
                const responseCode = res[1];
                const imageObject = {};
                if (responseCode === 429) {
                  document.querySelector('.notification__popup--body p').innerText =
                    'The process has stoped due to surpassing the API limit. Please open the extension after 5 minutes to continue.';
                  throw new Error('API limit reached');
                }
                if (responseCode === 200) {
                  imageObject.thumbnail = imageDetailResponse.thumbnail
                    ? imageDetailResponse.thumbnail
                    : imageDetailResponse.url;
                  imageObject.license = imageDetailResponse.license;
                  newBookmarks[bookmarkId] = imageObject;

                  chrome.storage.sync.set({ newBookmarks }, () => {
                    const idx = currentBookmarksArray.indexOf(bookmarkId);
                    if (idx > -1) {
                      currentBookmarksArray.splice(idx, 1);
                    }

                    chrome.storage.sync.set({ bookmarks: currentBookmarksArray });
                  });
                }
              }
            }

            chrome.storage.sync.remove('bookmarks');
            chrome.storage.sync.get({ newBookmarks: {} }, items2 => {
              chrome.storage.sync.set({ bookmarks: items2.newBookmarks });
              chrome.storage.sync.remove('newBookmarks');
            });
            document.querySelector('.notification__popup--body p').innerText =
              'Done! Please close and open the extension again.';
            chrome.storage.sync.set({ bookmarksMigrationDone: true }, () => {
              console.log('migration done');
            });
            chrome.storage.sync.get(null, it => {
              console.log(it);
            });
          }
        });
      });
    }
  });
}

migrateOldBookmarks();
