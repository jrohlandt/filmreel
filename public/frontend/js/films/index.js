window.addEventListener('load', function() {
	window.getMoreOffset = 0;
	var loadMoreButton = document.getElementById('load-more-button');
	var filterFilmsButton = document.getElementById('filter-films-button');

	loadMoreButton.addEventListener('click', function(event) {
		loadMore(this.dataset.offset);
	});

	filterFilmsButton.addEventListener('click', function() {
		filterFilms();
	});

	function getFilms() {
		
			var data = {
				offset: window.getMoreOffset,
				category: document.querySelector('#category-filter').value,
				_csrf: document.querySelector('meta[name="csrf_token"]').content,
			};
		
			axios.post('/films/get-more', data)
			.then(function(res) {
				console.log(res.data);
				// var loadMoreButton = document.getElementById('load-more-button');
				if (res.data.filmCount <= res.data.newOffset) {
					// hide load more button 
					loadMoreButton.style = 'display: none;';
				} else {
					loadMoreButton.style = 'display: block;';
				}
		
				window.getMoreOffset = res.data.newOffset;
				films = res.data.films;
				for (var i = 0; films.length > i; i++) {
					// append film items to the DOM
					createFilmItems(films[i]);
				}
			})
			.catch(function(err) {
				console.log(err);
			});
		}
		
		// loadMore appends more films to the current list
		function loadMore(offset) {
			// when the page is first loaded, the initial offset will come from the backend
			// it is specified in the controller and passed to the view.
			// the next time this function is called it will use window.getMoreOffset
			if (window.getMoreOffset < offset) {
				window.getMoreOffset = offset;
			}
			// if (window.getMoreOffset !== undefined) {
			// 	offset = window.getMoreOffset > offset ? window.getMoreOffset : offset;
			// }
		
			getFilms();
		}
		
		// filterFilms clears current film list and replaces it with a new one, based 
		// on the selected filters
		function filterFilms() {
			window.getMoreOffset = 0;
			var filmList = document.querySelector('ul#film-list');
			// remove all current film items
			while (filmList.firstChild) {
				filmList.removeChild(filmList.firstChild);
			}
		
			getFilms();
		}
		
		// append film items to the DOM
		function createFilmItems(film) {
			
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
