function loadMore(offset) {
	console.log('load more');

	if (window.getMoreOffset !== undefined) {
		offset = window.getMoreOffset > offset ? window.getMoreOffset : offset;
	}

	axios.get('/films/get-more/' + offset)
	  .then(function (response) {
		  console.log(response.data);
		  if (response.data.films.length < 1) {
				// todo remove load more button 
				document.getElementById('load-more-button').style = 'display: none;';
				console.log('no more films');
				return;
		  }
		  var filmUl = document.getElementById('film-list');
		  window.getMoreOffset = response.data.newOffset;
		  films = response.data.films;
		  films.forEach(function(film) {
			  console.log(film.title);

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
		  });
		console.log(response.data.newOffset);
	  })
	  .catch(function (error) {
		console.log(error);
	  });
}