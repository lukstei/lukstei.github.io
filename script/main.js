
    $(document).ready(function() 
    {

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
			{image:'media/image/background/01.jpg',title:''},
			{image:'media/image/background/02.jpg',title:''},
		];
		
		
        $('#nostalgia').nostalgia(options,{},slide,[],{},{});
    });