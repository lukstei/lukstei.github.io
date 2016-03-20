	
	/**************************************************************************/
	
	(function($)
	{	
		/**********************************************************************/

		var Nostalgia=function(options,page,slide,audio,config,configDefault)
		{
			/******************************************************************/
		
			var defaults=
			{
				tab						: 'left',
				className				: 'checkmark',			
				slideImageIndexPage		: 1,
				slideImageIndexPageHome	: 1,
				showMenuSlider			: false
			};
		
			var $this=this;
			
			$this.config=config;
			$this.configDefault=configDefault;

			$this.page=page;
			$this.audio=audio;
			$this.slide=slide;
			$this.options=options;
			
			$this.options=$.extend(defaults,options);
			
			$this.enable=false;

			$this.requestCurrent='';
			$this.requestPrevious='';
			
			$this.requestType=$('#nostalgiaRequestType').val();
			
			$this.url=window.location.pathname;
			
			$this.tabContent=false;
			
			$this.startPreloader=$('#start-preloader');
			$this.backgroundOverlay=$('#background-overlay');
			
			$this.nostalgia=$('#nostalgia');
			
			/***/
			
			$this.nostalgiaNavigation=$('#nostalgia-navigation');
			$this.nostalgiaNavigationMenu=$('#nostalgia-navigation-menu');
			$this.nostalgiaNavigationMenuList=$('#nostalgia-navigation-menu ul');
			$this.nostalgiaNavigationNameBox=$('#nostalgia-navigation-name-box');
			$this.nostalgiaNavigationClickHereBox=$('#nostalgia-navigation-click-here-box');	
			
			$this.nostalgiaNavigationStartLeftPosition=10;
			
			/***/
		
			$this.nostalgiaTab=$('#nostalgia-tab');
			$this.nostalgiaTabIcon=$('#nostalgia-tab-icon');
		
			$this.nostalgiaTabWidth=50;
			$this.nostalgiaTabMargin=5;
			
			$this.nostalgiaTabIconWidth=parseInt($('#nostalgia-tab-icon').css('width'));
			
			$this.mediaControl=$('#media-control');

			$this.nostalgiaTabContentMenuSelect=$('#nostalgia-tab-content-menu-select');
			
			$this.breakpoint=[1100,960,690];
			
			$this.nostalgiaNavigationMenuHeight=305;

			/******************************************************************/
			
			this.load=function()
			{		
				$this.createSupersizedSlider();

				$this.createStartPrealoder({complete:function()
				{
					$this.startPreloader.children('div:first').fadeOut(300,function() 
					{
						$this.startPreloader.animate({width:0},1000,'easeOutQuint',function() 
						{
							$this.backgroundOverlay.css('display','block');
							$this.showNavigationMenu(true,{complete:function() {}});
						});
					});
				}});
			};


			this.createStartPrealoder=function(data)
			{
				var slides = [$this.slide[0]]; // only preload first

				var i=0;
				var count=slides.length;

				var list=$(document.createElement('ul')).attr('class','no-list box-center')
		
				$this.startPreloader.find('div:first').prepend(list);
				$this.blink($this.startPreloader.find('p'));
							
				$(slides).each(function(index) 
				{			
					var image=$(document.createElement('img'));	
					var element=$(document.createElement('li'));
					
					list.append(element);

					image.attr('src',$this.slide[index].image + ($.browser.msie ? '?i='+getRandom(1,10000) : ''));

					$(image).bind('load',function() 
					{
						element.animate({opacity:1},100,function() 
						{
							if((++i)==count) data.complete.apply();
						});
					});
				});
			};

			this.showNavigationMenu=function(show,event)
			{
				if(show)
				{
					$this.nostalgiaNavigationMenu.animate({height:$this.nostalgiaNavigationMenuHeight},{duration:500,complete:function() 
					{
						$this.nostalgiaNavigationMenuList.trigger('updateSizes');
						$this.doEvent(event);					
					}});
				}			
				else
				{
					if(parseInt($this.nostalgiaNavigationMenu.css('height'))==0)
					{
						$this.doEvent(event);
						$this.nostalgiaNavigationMenuList.trigger('updateSizes');
						return;
					}
					$this.nostalgiaNavigationMenu.animate({height:'0px'},{duration:500,complete:function()  
					{
						$this.nostalgiaNavigationMenuList.trigger('updateSizes');
						$this.doEvent(event);
					}});				
				}
			};

			this.createSupersizedSlider=function()
			{
				$.supersized(
				{
					slides					: $this.slide,
					autoplay				: false,
					thumb_links				: false,
					start_slide				: ($this.options.slideImageIndexPageHome==-1 ? 1 : $this.options.slideImageIndexPageHome),
					thumbnail_navigation	: false
				});
				
				$('#nextslide,#prevslide').bind('click',function(e)
				{
					e.preventDefault();
				});
			};

			//***** dump
			
			/******************************************************************/
			
			this.createNostalgiaTabContentMenu=function()
			{
				$this.nostalgiaTabContentMenuSelect.bind('change',function() 
				{
					if($(this).find('option:selected').hasClass('external'))
					{
						window.open($(this).val(),'_blank');
						return;
					}
					window.location=$(this).val();
				});
			};

			/******************************************************************/
			/******************************************************************/
			
			this.isHashRequest=function()
			{
				return($this.requestType==1 ? true : false);
			};
			
			/******************************************************************/
			
			this.isQueryRequest=function()
			{
				return($this.requestType==2 ? true : false);
			};
			
			/******************************************************************/
			
            this.handleRequest=function()
            {		
				$this.setRequestCurrent();
				
				if($this.isHashRequest())
				{
					$(window).bind('hashchange',function(event) 
					{
						event.preventDefault();

						if($this.isEnable()==false) return;

						$this.setRequestCurrent();

						$this.doRequest();
						$this.requestPrevious=$this.requestCurrent;
					}); 

					if($this.requestCurrent!=$this.requestPrevious) $this.doRequest();

					if($this.requestCurrent=='')
					{
						if($this.options.startPage!==false)
						{
							$this.redirect($this.options.startPage);
							return;
						}

						if($this.options.showMenuAtStart)
						{
							$this.redirect('menu');
							return;
						}
						
						$this.redirect('main');
					}
				}
				else if($this.requestType==2) $this.doRequest();
            };
			
			/******************************************************************/
			
			this.setRequestCurrent=function()
			{
				if(this.isHashRequest())
				{
					var hash=window.location.hash;
					if(hash.substring(0,2)=='#!')
						$this.requestCurrent=hash.substring(2);
				}
			};
			
			/******************************************************************/
			
            this.doRequest=function()
            {	
                if(!$this.enable) return(false);
				if($this.requestType==0) return(false);
			
				$this.nostalgiaNavigationMenuList.find('li a').removeClass('selected');
				$this.nostalgiaNavigationMenuList.find('li a[href="'+$this.getURLQuery($this.requestCurrent)+'"]').addClass('selected');
				
				$this.enable=false;
				
				$this.setTitle();
				$this.setKeywords();
				$this.setDescripion();
				
				if($this.requestCurrent=='main')
				{
					if($this.isOpen())
					{
						$this.close({complete:function() 
						{
							$this.showNavigationMenu(false,{complete:function() 
							{
								$this.showNavigationClickHereBox(true);
								$this.showMediaControl(true);
								$this.switchSlide();
								$this.enable=true;
							}});
						}});
					}
					else
					{
						$this.showNavigationMenu(false,{complete:function() 
						{
							$this.showNavigationClickHereBox(true);
							$this.showMediaControl(true);
							$this.switchSlide();
							$this.enable=true;
						}});
					}

					return(true);
				}
				else if($this.requestCurrent=='menu')
				{
					$this.showNavigationClickHereBox(false);

					$this.showNavigationMenu(true,{complete:function() 
					{
						$this.enable=true;
					}});

					return(true);
				}
					
				if($this.isHashRequest())
				{
					$this.getPage($this.requestCurrent,{complete:function() 
					{
						if($this.tabContent!==false)
						{
							$this.showNavigationMenu(true);
							$this.showMediaControl(false);

							$this.open(false,{complete:function() 
							{
								$this.switchSlide();
								$this.requestPrevious=$this.requestCurrent;
								$this.enable=true;
							}});
						}
						else $this.enable=true;  
					}});
				}
				else
				{
					if(($this.requestCurrent=='main') || ($this.requestCurrent=='menu')) return(true);
					
					$this.showNavigationMenu(true);
					$this.showMediaControl(false);

					$this.open(false,{complete:function() 
					{
						$this.switchSlide();
					}});
				}

				return(true);
            };

			/******************************************************************/
			/******************************************************************/
			
			this.open=function(forceOpen,event)
			{
				var tabOpen=$this.isOpen();
				var tabToOpen=this.getPageProperty($this.requestCurrent,'tab');

				if((tabOpen===false) && (!forceOpen))
				{
					$this.moveNavigation(tabToOpen,{complete:function() { $this.open(true,event); }});
				}
				else
				{
					if(tabToOpen=='left')
					{
						if(tabOpen=='left')
						{
							$this.closeTab(tabOpen,{complete:function() 
							{
								$this.openTab(tabToOpen,{complete:function() { $this.doEvent(event); }});
							}});
						}
						else if(tabOpen=='right')
						{
							$this.closeTab(tabOpen,{complete:function() 
							{
								$this.moveNavigation(tabToOpen,{complete:function() 
								{ 
									$this.openTab(tabToOpen,{complete:function()  { $this.doEvent(event); }});						
								}});
							}});
						}
						else $this.openTab(tabToOpen,{complete:function() { $this.doEvent(event); }});						
					}
					else if(tabToOpen=='right')
					{
						if(tabOpen=='right')
						{
							$this.closeTab(tabOpen,{complete:function() 
							{
								$this.openTab(tabToOpen,{complete:function() { $this.doEvent(event); }});
							}});
						}
						else if(tabOpen=='left')
						{
							$this.closeTab(tabOpen,{complete:function() 
							{
								$this.moveNavigation(tabToOpen,{complete:function() 
								{ 
									$this.openTab(tabToOpen,{complete:function() { $this.doEvent(event); }});						
								}});
							}});
						}
						else $this.openTab(tabToOpen,{complete:function() { $this.doEvent(event); }});						
					}
				}
			};	
			
			/******************************************************************/
			
			this.close=function(event)
			{
				var tab=this.isOpen();

				if(tab===false)
				{
					$this.moveNavigation(false,{complete:function() 
					{
						$this.showNavigationMenu(false,{complete:function() { $this.doEvent(event); }});
					}});
				}
				else
				{
					$this.closeTab(tab,{complete:function() 
					{
						$this.moveNavigation(false,{complete:function() 
						{
							$this.showNavigationMenu(false,{complete:function() { $this.doEvent(event); }});
						}});
					}});
				}
			};
			
			/******************************************************************/
			
			this.isOpen=function()
			{	
				if($this.nostalgiaTab.width()==0) return(false);

				if($this.nostalgiaTab.hasClass('nostalgia-tab-left')) return('left');
				if($this.nostalgiaTab.hasClass('nostalgia-tab-right')) return('right');
				
				return(false);
			};
			
			/******************************************************************/
			/******************************************************************/
			
			this.openTab=function(tabToOpen,event)
			{
				$this.fillTab();
				$this.setTabClass(tabToOpen);
				
				$this.showNavigation(tabToOpen);
							
				$this.nostalgiaTabContentMenuSelect.find('option[value="'+$this.getURLQuery($this.requestCurrent)+'"]').attr('selected','selected');

				if(tabToOpen=='left')
				{
					$this.nostalgiaTab.css({left:0,right:'auto'});
					$this.nostalgiaTab.animate({width:$this.nostalgiaTabWidth+'%'},{duration:1000,easing:'easeOutExpo',complete:function() 
					{
						$this.showTabIcon(true,tabToOpen,{complete:function() { $this.doEvent(event); }});
					}});					
				}
				else
				{
					$this.nostalgiaTab.css({left:'auto',right:0});
					$this.nostalgiaTab.animate({width:$this.nostalgiaTabWidth+'%'},{duration:1000,easing:'easeOutExpo',complete:function() 
					{
						$this.showTabIcon(true,tabToOpen,{complete:function() { $this.doEvent(event); }});
					}});					
				}
			};
			
			/******************************************************************/
			
			this.closeTab=function(tabToClose,event)
			{
				$this.showTabIcon(false,tabToClose,{complete:function()
				{
					$(':input,a').qtip('destroy');
					$this.nostalgiaTab.animate({width:'0%'},{duration:1000,easing:'easeOutExpo',complete:function() 
					{
						$this.showNavigation(false);
						$this.doEvent(event);
					}});					
				}});
			};
			
			/******************************************************************/
			
			this.fillTab=function()
			{
				if($this.requestType==1) $('#nostalgia-tab-content-page').html($this.tabContent);
				$this.createScrollbar();
				
				jQuery.getScript('page/script/page.js',function() {});
			};
			
			/******************************************************************/
			
			this.setTabClass=function(tabToOpen)
			{
				var className=$this.getPageProperty($this.requestCurrent,'className');
				
				$this.resetTabClass();
				
				$this.nostalgiaTab.addClass('nostalgia-tab-'+tabToOpen);
				$this.nostalgiaTabIcon.addClass('nostalgia-tab-icon-'+className);
			};
			
			/******************************************************************/
			
			this.resetTabClass=function()
			{
				$this.nostalgiaTab.attr('class','');
				$this.nostalgiaTabIcon.attr('class','');
				$this.nostalgiaTabIcon.css({left:'',right:''});
			};
			
			/******************************************************************/
			
			this.showTabIcon=function(show,tab,event)
			{
				var option;
				var position=-1*$this.nostalgiaTabIconWidth;
				
				if(show) option=tab=='left' ? {'left':0} : {'right':0};
				else option=tab=='left' ? {'left':position} : {'right':position};
	
				$this.nostalgiaTabIcon.animate(option,{duration:300,complete:function() { $this.doEvent(event); }});
			};

			/******************************************************************/
			/******************************************************************/
			
			this.showNavigation=function(tabToOpen)
			{
				var tab=tabToOpen ? tabToOpen : $this.isOpen();
				var width=$this.getWindowWidth();
				
				if(width<$this.breakpoint[1])
				{
					if(tab) 
					{	
						$this.nostalgiaNavigation.css('display','none');
						$this.nostalgiaNavigation.css({left:$this.nostalgiaNavigationStartLeftPosition+'%',right:'auto'});
						return;
					}
				}
				
				if(($this.nostalgiaNavigation.css('display')=='none') && (!tab))
				{
					$this.nostalgiaNavigationMenu.css('height',0);
					$this.nostalgiaNavigationMenuList.trigger('updateSizes');
				}

				$this.nostalgiaNavigation.css('display','block');
			};
			
			
			/******************************************************************/
			
			this.moveNavigation=function(tabToOpen,event)
			{
				$this.showNavigationClickHereBox(false);
				$this.showMediaControl(false);
				
				if($this.getWindowWidth()<$this.breakpoint[1]) 
				{	
					$this.showNavigation();
					$this.doEvent(event);
					return;
				}
				
				var position=$this.getNostalgiaNavigationPosition(tabToOpen);
				
				if(tabToOpen=='left')
				{
					$this.nostalgiaNavigation.css({right:'auto',left:position.left+'%'});
					$this.nostalgiaNavigation.animate({left:$this.nostalgiaTabWidth+$this.nostalgiaTabMargin+'%'},{duration:1000,complete:function() { $this.doEvent(event); }});
				}
				else if(tabToOpen=='right')
				{
					$this.nostalgiaNavigation.css({right:position.right+'%',left:'auto'});
					$this.nostalgiaNavigation.animate({right:$this.nostalgiaTabWidth+$this.nostalgiaTabMargin+'%'},{duration:1000,complete:function()  { $this.doEvent(event); }});
				}
				else
				{
					if(position.left==$this.nostalgiaNavigationStartLeftPosition) $this.doEvent(event);
					else
					{
						$this.nostalgiaNavigation.css({right:'auto',left:position.left+'%'});
						$this.nostalgiaNavigation.animate({left:$this.nostalgiaNavigationStartLeftPosition+'%'},{duration:1000,complete:function() { $this.doEvent(event); }});
					}
				}
			};

			/******************************************************************/
			/******************************************************************/

			this.getPageProperty=function(key,property)
			{
				try
				{
					var val=$this.page[key][property];
				}
				catch(e) {}

				if(typeof(val)!='undefined') return(val);

				return($this.options[property]);
			};
			
			/******************************************************************/
			
			this.getPage=function(path,event)
			{
                $.get('page/'+path,{},function(tabContent) 
                {	
					$this.tabContent=tabContent;
					$this.doEvent(event);
                },
                'html').error(function() 
				{ 
					$this.tabContent=false;
					$this.doEvent(event); 
				}) 
			};

			/******************************************************************/
			
			this.createScrollbar=function()
			{
				$this.scrollbar=$('#nostalgia-tab-content-scroll').jScrollPane({maintainPosition:true,autoReinitialise:true,mouseWheelSpeed:45}).data('jsp');
				$this.scrollbar.scrollTo(0,0);
			};
			
			/******************************************************************/
			
			
			
			/******************************************************************/
			
			this.switchSlide=function()
			{
				var slideImageIndexPage;
	
				if($this.currentKey=='main') slideImageIndexPage=$this.options.slideImageIndexPageHome;
				else slideImageIndexPage=$this.getPageProperty($this.requestCurrent,'slideImageIndexPage');
				
				if(slideImageIndexPage==-1) api.nextSlide();
				else api.goTo(slideImageIndexPage);	
			};
			
			/******************************************************************/
			
			this.showMediaControl=function(show)
			{
				$this.mediaControl.css('display',(show ? 'block' : 'none'));
			};
			
			/******************************************************************/
			
			this.showNavigationClickHereBox=function(show)
			{
				$this.nostalgiaNavigationClickHereBox.css('display',(show ? 'block' : 'none'));
			};
			
			/******************************************************************/
			
						
			/******************************************************************/
			
			this.createMenuSlider=function()
			{
				if(!$this.options.showMenuSlider)
				{
					$('#nostalgia-navigation-prev-button,#nostalgia-navigation-next-button').css('display','none');
					return;
				}

				$this.nostalgiaNavigationMenuList.carouFredSel(
				{
					width			:	'variable',
					height			:	'variable',
					direction		:	'up',
					circular		:	true,
					items: 
					{
						visible		:	(!(($.browser.msie) && (parseInt($.browser.version)<=8)) && ($this.getWindowHeight()<=510)) ? 2 : 5,
						minimum		:	2,
						width		:	'300px'
					},
					scroll: 
					{
						items		:	1,
						duration	:	500,
						fx			:	'directscroll'
					},
					auto			:	false,
					prev			:	'#nostalgia-navigation-prev-button',
					next			:	'#nostalgia-navigation-next-button'
				});	
			};
			
			/******************************************************************/
			
			this.createAudioPlayer=function()
			{
				if($this.audio.length==0) 
				{
					$('#slidecaption-wrapper').css('width','210px');
					$('.audio-player').addClass('hidden');
					return;
				}

				var i=0;
				$('#jPlayer').jPlayer( 
				{
					ready:function() 
					{
						$(this).jPlayer('setMedia',$this.audio[0]);
						
						var click=document.ontouchstart===undefined ? 'click' : 'touchstart';
						var kickoff=function()
						{
							$('#jPlayer').jPlayer('play');
							document.documentElement.removeEventListener(click,kickoff,true);
						};
						document.documentElement.addEventListener(click,kickoff,true);
						
						$('#jPlayer').jPlayer('play');
					},
					ended:function()
					{
						i++;
						if(i>=$this.audio.length) i=0;
						$(this).jPlayer('setMedia',$this.audio[i]).jPlayer('play');
					},
					swfPath		:'script/Jplayer.swf',
					solution	:'html,flash'
				});
				
				$('.audio-player').bind('click',function(e) 
				{
					e.preventDefault();
					
					if($('.audio-player').hasClass('music-on'))
						$('.audio-player').addClass('music-pause-user');
					else $('.audio-player').removeClass('music-pause-user');
					
					$('#jPlayer').jPlayer($('.audio-player').hasClass('music-on') ? 'pause' : 'play');
				});
				
				$('#jPlayer').bind($.jPlayer.event.play,function()	{ $('.audio-player').removeClass('music-off').addClass('music-on'); });
				$('#jPlayer').bind($.jPlayer.event.pause,function() { $('.audio-player').removeClass('music-on').addClass('music-off'); });
			};

			/******************************************************************/
			
			this.blink=function(element)
			{
				$(element).animate({opacity:($(element).css('opacity')==1 ? 0.2 : 1)},500,function() {$this.blink($(this));});
			};
			
			/******************************************************************/
			
            this.isEnable=function()
            {
                if(!$this.enable)
                {
					if($this.requestPrevious!='') $this.redirect($this.requestPrevious);
                    return(false);
                }  
                
                return(true);
            };
			
			/******************************************************************/
			
            this.doEvent=function(event)
            {
                if(typeof(event)!='undefined')
                {
                    if(typeof(event.complete)!='undefined') event.complete.apply();
                };                  
            };
			
			/******************************************************************/
			
			this.getWindowWidth=function()
			{
				return($(window).width());
			};
			
			/******************************************************************/
			
			this.getWindowHeight=function()
			{
				return($(window).height());
			};
			
			/******************************************************************/
			
			this.getNostalgiaNavigationPosition=function(tabToOpen)
			{
				var windowWidth=$this.getWindowWidth();
				var navigationWidth=$this.nostalgiaNavigation.width();
				
				var left=$this.nostalgiaNavigation.position().left;
				var right=$this.nostalgiaNavigation.position().right;

				if(tabToOpen=='right') 
				{
					if(typeof(left)!='undefined')
						right=((windowWidth-left-navigationWidth)/windowWidth)*100;
					else right=(right/windowWidth)*100;
				}
				else 
				{
					if(typeof(right)!='undefined')
						left=((windowWidth-right-navigationWidth)/windowWidth)*100;
					else left=(left/windowWidth)*100;
				}

				return({left:left,right:right});
			};
			
			/******************************************************************/
			
			this.setPosition=function()
			{
				var tab=$this.isOpen();
				var width=$this.getWindowWidth();
				var height=$this.getWindowHeight();
				
				var nostalgiaTabContentScroll=$('#nostalgia-tab-content-scroll');
				var margin=parseInt(nostalgiaTabContentScroll.position().top)+parseInt(nostalgiaTabContentScroll.css('margin-top'))+parseInt(nostalgiaTabContentScroll.css('margin-bottom'));
				
				$('#nostalgia-tab-content-scroll').height(parseInt($(window).height())-margin-parseInt($('#nostalgia-tab-footer').height()));

				if(($.browser.msie) && parseInt($.browser.version)<=8) return;

				if(height<=510) $this.nostalgiaNavigationMenuList.trigger('configuration',['items.visible',2]);
				else $this.nostalgiaNavigationMenuList.trigger('configuration',['items.visible',4]);
				
				/***/

				$this.showNavigation();	
				
				/***/
				
				$this.nostalgiaNavigationMenuHeight='300px';
				if(height<=510) $this.nostalgiaNavigationMenuHeight='140px';
				
				if(parseInt($this.nostalgiaNavigationMenu.css('height'))!=0)
					$this.nostalgiaNavigationMenu.css('height',$this.nostalgiaNavigationMenuHeight);
				
				if(width>$this.breakpoint[0])
				{
					$this.nostalgiaTabWidth=50;

					if(tab)
					{
						$this.nostalgiaTab.css('width',$this.nostalgiaTabWidth+'%');
						$this.nostalgiaNavigation.css(tab,$this.nostalgiaTabWidth+$this.nostalgiaTabMargin+'%');
						$this.nostalgiaNavigation.css(tab=='left' ? 'right' : 'left','auto');
					}
				}
				
				/***/
				
				if((width<=$this.breakpoint[0]) && (width>=$this.breakpoint[1]))
				{
					$this.nostalgiaTabWidth=60;

					if(tab)
					{
						$this.nostalgiaTab.css('width',$this.nostalgiaTabWidth+'%');
						$this.nostalgiaNavigation.css(tab,$this.nostalgiaTabWidth+$this.nostalgiaTabMargin+'%');
						$this.nostalgiaNavigation.css(tab=='left' ? 'right' : 'left','auto');					
					}
				}
				
				/***/
				
				if(width<$this.breakpoint[1])
				{
					$this.nostalgiaTabWidth=80;
					
					if(tab)
					{
						$this.nostalgiaNavigation.css('display','none');	
						$this.nostalgiaTab.css('width',$this.nostalgiaTabWidth+'%');
					}
				}
				
				/***/
				
				if(width<$this.breakpoint[2])
				{
					$this.nostalgiaTabWidth=100;
					if(tab)
					{
						$this.nostalgiaTab.css('width',$this.nostalgiaTabWidth+'%');
					}	
				}
			};
			
			/******************************************************************/
			
			this.getURL=function(request)
			{
				return($this.url + $this.getURLQuery(request));
			};
			
			/******************************************************************/
			
			this.getURLQuery=function(request)
			{
				return(($this.requestType==1 ? '#!' : '?_escaped_fragment_=') + request);
			};
			
			/******************************************************************/
			
			this.redirect=function(request)
			{
				window.location=$this.getURL(request);
			};
			
			/******************************************************************/
			
			this.setTitle=function()
			{
				document.title=$this.getMeta('title');
			};
			
			/******************************************************************/
			
			this.setKeywords=function()
			{
				$('meta[name="keywords"]').attr($this.getMeta('keywords'));	
			};
			
			/******************************************************************/
			
			this.setDescripion=function()
			{
				$('meta[name="description"]').attr($this.getMeta('description'));	
			};
			
			/******************************************************************/
			
			this.getMeta=function(name)
			{
				var value='';
				
				try
				{
					value=$this.config[$this.requestCurrent][name];
				}
				catch(e) { }	
				
				if(!value.length) value=$this.configDefault[name];
				
				return(value);
			};
			
			/******************************************************************/
		};

		/**************************************************************/
		 
		$.fn.nostalgia=function(options,page,slide,audio,config,configDefault)
		{
			/***********************************************************/

			var nostalgia=new Nostalgia(options,page,slide,audio,config,configDefault);
			nostalgia.load();

			/***********************************************************/
		};
		
		/**************************************************************/
		
	})(jQuery);