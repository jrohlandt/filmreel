function deleteFilm(filmId) {
	console.log('delete film: ', filmId);

	var form = document.getElementById('film-form');

	if (window.confirm("Are you sure you want to delete this film?")) {
		form.action = '/admin/films/delete';
		form.submit();
	}
}

function showCategories() {
	console.log('hello');
	var dropdown = document.querySelector('#categories-dropdown');
	dropdown.style.display = 'block';

}