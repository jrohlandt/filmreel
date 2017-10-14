window.addEventListener('load', function () {

	var leftNav = document.getElementById('left-nav');
	var headerHamburger = document.getElementById('header-hamburger');

	headerHamburger.addEventListener('click', function() {
		leftNav.classList.toggle('open');
	});
});