
$(document).ready(function() 
{
	$('.tooltip').tooltipster({interactive: false, theme: 'tooltipster-borderless', maxWidth: 500});

	$('.mail-link').click(function(e) {
		var mail = "lukas";
		window.location.href = "mailto:" + mail + "@lukstei.com";
	});

	var options=
	{
		tab						: 'left',
		className				: 'checkmark',			
		slideImageIndexPage		: 1,
		slideImageIndexPageHome	: 1,
		showMenuSlider			: true,
		showMenuAtStart			: true,
		startPage				: 'menu'
	};
	
    var slide=
	[
		{image:'media/image/background/02.jpg',title:''},
		{image:'media/image/background/01.jpg',title:''},
		{image:'media/image/background/03.jpg',title:''},
		{image:'media/image/background/04.jpg',title:''}
	];
	
	
    $('#nostalgia').nostalgia(options,{},slide,[],{},{});
});