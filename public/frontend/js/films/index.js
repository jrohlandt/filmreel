function loadMore(offset) {
	console.log('load more');

	if (window.getMoreOffset !== undefined) {
		offset = window.getMoreOffset > offset ? window.getMoreOffset : offset;
	}

	axios.get('/films/get-more/' + offset)
	  	.then(function (response) {
			if (response.data.filmCount < response.data.newOffset) {
					// hide load more button 
					document.getElementById('load-more-button').style = 'display: none;';
			}
			
			window.getMoreOffset = response.data.newOffset;
			films = response.data.films;
			for (var i = 0; films.length > i; i++) {
				// append film items to the DOM
				createFilmItems(films[i]);
			}
	  	})
		.catch(function (error) {
			console.log(error);
		});

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
}