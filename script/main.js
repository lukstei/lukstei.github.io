
$(document).ready(function() 
{
	var eventSent = false;

	$('.tooltip').tooltipster({
		interactive: false, 
		theme: 'tooltipster-borderless', 
		maxWidth: 500,
		functionBefore: function() {
			if(!eventSent) {
				ga('send', 'event', 'tooltip', 'view');
				eventSent = true;
			}
			
			return true;
		}
	});

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
	{image:'media/image/background/04.jpg',title:''},
	{image:'media/image/background/02.jpg',title:''},
	{image:'media/image/background/01.jpg',title:''},
	{image:'media/image/background/03.jpg',title:''}
	];
	
	
	$('#nostalgia').nostalgia(options,{},slide,[],{},{});
});