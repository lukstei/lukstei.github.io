
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
			{image:'media/image/background/01.jpg',title:'<span class="supersized-caption-title">Halle Kearney<br/>By Robby Mueller</span><br/><br/>Well, today was Halle Kearney\'s first senior picture session in Akron, OH and I decided to go with something a little different here.<br/><br/>This is not going to be used as one of her senior pictures (As far as I know).<br/><br/>We took a different spin on things and I\'m a tad bit stoked on it.<br/><br/><a href="http://www.flickr.com/photos/ro2b3yface/5623260278/in/photostream/">Author Website</a>'},
			{image:'media/image/background/02.jpg',title:'<span class="supersized-caption-title">Lavender<br/>By Vincent van der Pas</span><br/><br/>Taken in the south of France, near Apt.<br/><br/><a href="http://www.flickr.com/photos/archetypefotografie/4958711873/in/photostream/">Author Website</a>'},
			{image:'media/image/background/03.jpg',title:'<span class="supersized-caption-title">Plainsong<br/>By Robb North</span><br/><br/>sometimes you make me feel<br/>like i\'m living at the edge of the world<br/>like i\'m living at the edge of the world<br/><br/><a href="http://www.flickr.com/photos/robbn1/3405147407/in/photostream/">Author Website</a>'},
			{image:'media/image/background/04.jpg',title:'<span class="supersized-caption-title">Falcon on Rue Drolet<br/>By Flat-Black 66</span><br/><a href="http://www.flickr.com/photos/flatblack66/4733463620/">Author Website</a>'},
			{image:'media/image/background/05.jpg',title:'<span class="supersized-caption-title">New kitchen radio<br/>By Johan Larsson</span><br/><br/>Tivoli Model One.<br/><br/><a href="http://www.flickr.com/photos/johanl/6125230384/in/photostream/">Author Website</a>'},
			{image:'media/image/background/06.jpg',title:'<span class="supersized-caption-title">Bekohlicious!<br/>By 55Laney69</span><br/><br/>Canon 550D + Canon 50mm F1.8 EF II @F1.8 :). Cross Processed with Alien Skin Exposure<br/><br/><a href="http://www.flickr.com/photos/hansel5569/6001781706/in/photostream/">Author Website</a>'}
		];
		
		var audio=
		[
		];
		
		var page=
		{
			'about.html'		: {tab:'left',className:'checkmark',slideImageIndexPage:1},
			'services.html'		: {tab:'right',className:'features',slideImageIndexPage:2},
			'portfolio.html'	: {tab:'left',className:'image',slideImageIndexPage:3},
			'blog.php'			: {tab:'right',className:'info',slideImageIndexPage:4},
			'contact.php'		: {tab:'left',className:'mail',slideImageIndexPage:5},
			'post.html'			: {tab:'right',className:'info',slideImageIndexPage:6}
		};
		
        $('#nostalgia').nostalgia(options,page,slide,audio,config,configDefault);
    });