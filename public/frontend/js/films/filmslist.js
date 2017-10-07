window.addEventListener('load', function() {
	var CSRF_TOKEN = document.querySelector('meta[name="csrf_token"]').content;
	getMoreOffset = 0;
	searchTerm = '';
	var filmList = document.querySelector('ul#film-list');
	var loadMoreButton = document.getElementById('load-more-button');
	var filterFilmsButton = document.getElementById('filter-films-button');
	var quickSearchField = document.getElementById('quick-search');

	loadMoreButton.addEventListener('click', function(event) {
		loadMore(this.dataset.offset);
	});

	filterFilmsButton.addEventListener('click', function() {
		filterFilms();
	});

	quickSearchField.addEventListener('keyup', function() {
		searchTerm = this.value;
		// function doit() {
			
			if (searchTerm.length < 3) {
				return;
			} 
			getMoreOffset = 0;
			// remove all current film items
			while (filmList.firstChild) {
				filmList.removeChild(filmList.firstChild);
			}
	
			var route = '/films/quick-search';
			var data = {
				offset: getMoreOffset,
				_csrf: CSRF_TOKEN,
				search_term: searchTerm
			};
	
			getFilms(route, data);
		// }
		// setTimeout(doit.bind(this), 1000);
		

	});

	/*
	|-------------------------------------------------------------------------------
	| GET FILMS
	|-------------------------------------------------------------------------------
	*/
	function getFilms(path, data) {

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
			for (var i = 0; films.length > i; i++) {
				// append film items to the DOM
				createFilmItem(films[i]);
			}
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
		// when the page is first loaded, the initial offset will come from the backend
		// it is specified in the controller and passed to the view.
		// the next time this function is called it will use getMoreOffset
		if (getMoreOffset < offset) {
			getMoreOffset = offset;
		}
	
		if (searchTerm.length > 2) {
			var route = '/films/quick-search';
			var data = {
				offset: getMoreOffset,
				_csrf: CSRF_TOKEN,
				search_term: searchTerm
			};
		} else {
			var route = '/films/get-more';
			var data = {
				offset: getMoreOffset,
				_csrf: CSRF_TOKEN,
				category: document.querySelector('#category-filter').value,
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
		getMoreOffset = 0;
		searchTerm = '';
		quickSearchField.value = '';

		var filmList = document.querySelector('ul#film-list');
		// remove all current film items
		while (filmList.firstChild) {
			filmList.removeChild(filmList.firstChild);
		}

		var route = '/films/get-more';
		var data = {
			offset: getMoreOffset,
			_csrf: CSRF_TOKEN,
			category: document.querySelector('#category-filter').value,
		};
	
		getFilms(route, data);
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
