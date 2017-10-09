window.addEventListener('load', function() {
	var CSRF_TOKEN = document.querySelector('meta[name="csrf_token"]').content;
	var getMoreOffset = 0;
	var searchTerm = '';
	var getFilmsStatus = 'complete'; // possibilities: complete, pending
	var filmList = document.querySelector('ul#film-list');
	var loadMoreButton = document.getElementById('load-more-button');
	// var filterFilmsButton = document.getElementById('filter-films-button');
	var filterCategoriesRow = document.getElementById('categories-row');
	var filterCategoriesList = document.getElementById('categories-list');
	var selectedCategorySpan = document.getElementById('selected-category');

	var quickSearchField = document.getElementById('quick-search');

	loadMoreButton.addEventListener('click', function(event) {

		// when the page is first loaded, the initial offset will come from the backend
		// it is specified in the controller and passed to the view.
		// the next time this function is called it will use getMoreOffset 
		// getMoreOffset is incremented in the getFilms function
		if (getMoreOffset < this.dataset.offset) {
			getMoreOffset = this.dataset.offset;
		}
		loadMore(getMoreOffset);
	});

	filterCategoriesRow.addEventListener('click', function() {
		filterCategoriesList.classList.remove('hide-list');
	});

	filterCategoriesList.addEventListener('click', function(e) {
		if (e.target && e.target.matches('li.category-list-item')) {
			var listItem = e.target;
			var categoryId = listItem.dataset.categoryId;
			console.log('true', categoryId, e.target);
			
			selectedCategorySpan.removeChild(selectedCategorySpan.firstChild);
			selectedCategorySpan.appendChild(document.createTextNode(listItem.dataset.categoryName));
			document.getElementById('filter-by').dataset.filterByCategory = categoryId;
			filterCategoriesList.classList.add('hide-list');
			getMoreOffset = 0; // reset offset for load more 
			searchTerm = '';
			quickSearchField.value = '';
			clearFilmsList();
			filterFilms();
		} else {
			console.log('false', e.target);
		}
	});
	// filterFilmsButton.addEventListener('click', function() {
	// 	getMoreOffset = 0; // reset offset for load more 
	// 	searchTerm = '';
	// 	quickSearchField.value = '';
	// 	clearFilmsList();
	// 	filterFilms();
	// });

	quickSearchField.addEventListener('keyup', function() {
		getMoreOffset = 0; // reset offset for load more 
		searchTerm = this.value;
		clearFilmsList();
		clearFilters();
		
		if (searchTerm.length < 3) {
			return;
		}
		searchFilms();
	});

	/*
	|-------------------------------------------------------------------------------
	| GET FILMS
	|-------------------------------------------------------------------------------
	*/
	function getFilms(path, data) {

		getFilmsStatus = 'pending';

		axios.post(path, data)
		.then(function(res) {
			console.log(res.data);
			// var loadMoreButton = document.getElementById('load-more-button');
			if (res.data.filmCount <= res.data.newOffset) {
				// hide load more button 
				loadMoreButton.style = 'display: none;';
			} else {
				loadMoreButton.style = 'display: block;';
			}
	
			getMoreOffset = res.data.newOffset;
			films = res.data.films;
			if (films.length < 1) {
				// if there are no search results, useful, when previous search term
				// resluted in a item being appended to the DOM, but now the new 
				// search term returned no results, so there are no results
				clearFilmsList();
			} else {
				for (var i = 0; films.length > i; i++) {
					// append film items to the DOM
					createFilmItem(films[i]);
				}
			}
			
			getFilmsStatus = 'complete';
		})
		.catch(function(err) {
			console.log(err);
		});
	}
		
	/*
	|-------------------------------------------------------------------------------
	| LOAD MORE : appends more films to the current list
	|-------------------------------------------------------------------------------
	*/
	function loadMore(offset) {
	
		// if searchTerm exists and is valid
		if (searchTerm.length > 2) {
			var route = '/films/quick-search';
			var data = {
				offset: offset,
				_csrf: CSRF_TOKEN,
				search_term: searchTerm
			};
		} else {
			var route = '/films/get-more';
			var data = {
				offset: offset,
				_csrf: CSRF_TOKEN,
				category: document.getElementById('filter-by').dataset.filterByCategory,
			};
		} 

		getFilms(route, data);
	}
	
	/*
	|-------------------------------------------------------------------------------
	| FILTER FILMS : list films based on filters applied
	|-------------------------------------------------------------------------------
	*/
	function filterFilms() {
		var route = '/films/get-more';
		var data = {
			offset: 0,
			_csrf: CSRF_TOKEN,
			category: document.getElementById('filter-by').dataset.filterByCategory,
		};
	
		getFilms(route, data);
	}

	/*
	|-------------------------------------------------------------------------------
	| SEARCH FILMS
	|-------------------------------------------------------------------------------
	*/
	function searchFilms() {
		var route = '/films/quick-search';
		var data = {
			offset: 0,
			_csrf: CSRF_TOKEN,
			search_term: searchTerm
		};

		var i = 0;
		var intervalId = setInterval(function() {
			i++;
			if (getFilmsStatus === 'pending' && i < 100) { // wait max 10 seconds
				return;
			}
			clearFilmsList();
			getFilms(route, data);
			clearInterval(intervalId);
		}, 100);
	}

	/*
	|-------------------------------------------------------------------------------
	| CLEAR FILMS LIST : removes all current film items from the DOM
	|-------------------------------------------------------------------------------
	*/
	function clearFilmsList() {
		// remove all current film items
		while (filmList.firstChild) {
			filmList.removeChild(filmList.firstChild);
		}
	}

	/*
	|-------------------------------------------------------------------------------
	| CLEAR FILTERS
	|-------------------------------------------------------------------------------
	*/
	function clearFilters() {
		document.getElementById('filter-by').dataset.filterByCategory = 0;
		selectedCategorySpan.removeChild(selectedCategorySpan.firstChild);
		selectedCategorySpan.appendChild(document.createTextNode('None'));
	}
	
	/*
	|-------------------------------------------------------------------------------
	| CREATE FILM ITEM : create a new film list item and append it to the list
	|-------------------------------------------------------------------------------
	*/
	function createFilmItem(film) {
		
		var filmUl = document.getElementById('film-list');
	
		// li
		var listItem = document.createElement("li");
		listItem.className = 'film-item-wrapper';
	
		// div
		var filmDiv = document.createElement('div');
		filmDiv.className = 'film-item';
	
		// img
		var posterImg = document.createElement('img');
		posterImg.className = 'poster-thumbnail';
		posterImg.src = film.poster_image;
	
		// h2 
		var filmTitle = document.createElement('h2');
		filmTitle.className = 'film-title';
		filmTitle.appendChild(document.createTextNode(film.title));
	
		// h2 span (year)
		var filmYear = document.createElement('span');
		filmYear.className = 'film-year';
		filmYear.appendChild(document.createTextNode(' (' + film.year + ') '));
	
		filmTitle.appendChild(filmYear);
	
		// span categories
		var filmCategories = document.createElement('span');
		filmCategories.className = 'film-categories';
		filmCategories.appendChild(document.createTextNode(film.categories));
	
		// p description
		var filmDescription = document.createElement('p');
		filmDescription.className = 'film-description';
		var filmDesciptionText = film.description ? film.description.substring(0, 110) + '...' : 'No description';
		filmDescription.appendChild(document.createTextNode(filmDesciptionText));
	
		filmDiv.appendChild(posterImg);
		filmDiv.appendChild(filmTitle);
		filmDiv.appendChild(filmCategories);
		filmDiv.appendChild(filmDescription);
	
		listItem.appendChild(filmDiv);
		filmUl.appendChild(listItem);
	}
});
