/**
 * Customed bookshelf.js v1.0.0
 * http://www.codrops.com
 *
 */
(function ($) {
 "use strict";
 
	// Loading...
	window.onload = function(){ 
	   $('#main-loading').fadeOut(600);
	}; 
  
	var win_h=$(window).height();
	var win_w=$(window).width();

	var easyMod = !Modernizr.csstransforms3d || win_w < 769;
	var phoneMod = $(window).width() < 769;

	  	
	// Build the Navigation html structure for each page
	function initNav(){		
	  if(easyMod){
		  $(".bb-bookblock").each(function(){
			  $(this).append('<a href="#" class="bb-flip bb-nav-prev">Previous<img src="img/necessity/nav-prev.png"/></a>')
		  });
		  $(".bb-bookblock").each(function(){
			  $(this).append('<a class="menu-button">"Show Menu"<div></div><div></div><div></div></a><a href="#" class="bb-flip bb-nav-next">Next<img src="img/necessity/nav-next.png"/></a>')
		  });	
		  $(".bb-flip.bb-nav-prev").hide();		
	  }else{
		  $(".bb-custom-side:even").each(function(){
			  $(this).append('<div class="page-foot-cover"></div><div class="page-head-cover"></div><a href="#" class="bb-flip bb-nav-prev">Previous<img src="img/necessity/nav-prev.png"/></a>')
		  });
		  $(".bb-custom-side:odd").each(function(){
			  $(this).append('<a class="menu-button">"Show Menu"<div></div><div></div><div></div></a><div class="page-head-cover"></div><div class="page-foot-cover"></div><a href="#" class="bb-flip bb-nav-next">Next<img src="img/necessity/nav-next.png"/></a>')
		  });
		  $(".bb-flip:first").hide();
		  $(".bb-flip:last").hide();	
	  }
	}

	var supportAnimations = 'WebkitAnimation' in document.body.style ||
			'MozAnimation' in document.body.style ||
			'msAnimation' in document.body.style ||
			'OAnimation' in document.body.style ||
			'animation' in document.body.style,
		animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		},
		// animation end event name
		animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
		//	scrollWrap = document.getElementById( 'scroll-wrap' ),
		docscroll = 0,
		books = document.querySelectorAll( '.main' );

	function scrollY() {
		return window.pageYOffset || window.document.documentElement.scrollTop;
	}

	// Main function of the book
	function Book( el ) {
		this.el = el;
		this.book = this.el.querySelector( '.book' );
	    //---------- this.ctrls =  this.el.querySelector( '.buttons' )
		// create the necessary structure for the books to rotate in 3d
		this._layout();

		this.bbWrapper = document.getElementById( this.book.getAttribute( 'data-book' ) );
		if( this.bbWrapper ) {
			this._initBookBlock();
		}
		this._initEvents();
	}

	Book.prototype._layout = function() {
		if( Modernizr.csstransforms3d ) {
			this.book.innerHTML = '<div class="cover"><a href="###"><img src="img/necessity/page-corner.png" id="page-corner" /></a><div class="front"></div><div class="inner inner-left"></div></div><div class="inner inner-right"></div>';
		}
	}
		
	Book.prototype._initBookBlock = function() {

		var current_page=0;
		
		var easyMod = !Modernizr.csstransforms3d || $(window).width() < 769;

		var $bookBlock = $( '.bb-bookblock');
		
		this.bb = 	$bookBlock.bookblock( {
							speed : 800,
							shadowSides : 0.8,
							shadowFlip : 0.7,
							onEndFlip : function(old, page, isLimit) {
									current_page = page;
									// updateNavigation
									$( '.outer-nav > a' ).removeClass('bb-current');
									$( '.outer-nav > a' ).eq(current_page).addClass('bb-current');
									resetMenu(page);
									// init Map
									initMap(page);
									
									//initBxslider(page);
									//if($('.bb-item:has').eq(page).hasClass('unslider'))
		$('.bb-item').eq(page).find('.unslider').trigger({type:'cust1', test:true,name:'gao1'});
		$('.bb-item').eq(page).find('#portfolio-container').trigger({type:'cust2', test:true,name:'gao2'});

							
									if(easyMod){
										updateNavigation( isLimit );										
									}else{
									}
							}
		} );

		$('#portfolio-container').one("cust2",function(){
			$(this).isotope({
			  // options
			  itemSelector : '.portfolio-item',
			  layoutMode : 'fitRows'
			});	
		});

		// filter items when filter link is clicked
		$('.portfolio-filters li').click(function(){
			var selector = $(this).attr('data-filter');
			$('#portfolio-container').isotope({ filter: selector });
			//reset fancyBox
			$('.isotope-item').find('.fancybox').removeAttr('rel')
			$('.isotope-item').not('.isotope-hidden').find('.fancybox').attr('rel', 'xxx');
			//reset current filter item
			$(".portfolio-filters>li.active").removeClass('active');
			$(this).addClass('active');
			return false;
		});

		$('.unslider').one("cust1",function(){
						$(this).bjqs({
							width       : 1300,
							height	    : 866,
							responsive  : true,
							animspeed   : 2600,
							centercontrols  : false,
							showmarkers     : false
						  });			
		});			
		
		function initMap(nextPage){
			
			var win_w=$(window).width();
			var theMap = $('.bb-item').eq(nextPage).find('#map-wrapper');
			if(win_w<769){
			  	theMap.parent().css({'height':'360px','width':'100%'});
			}else{
			  	theMap.parent().css({'height':'100%','width':'100%'});
			}
			var _address=theMap.attr('address-data');
			var _marker=theMap.attr('marker-url');
			theMap.gmap3({
			 map: {
				options: {
				  maxZoom: 14 
				}  
			 },
			 marker:{
				address: _address,
				options: {
				 icon: new google.maps.MarkerImage(
				   _marker,
				   new google.maps.Size(32, 37, "px", "px")
				 )
				}
			 }
			},
			"autofit" );
			theMap.css({'visibility':'visible','opacity':'1'});			
		}

		function resetMenu(nextPage){
			var $menuItem=$( ' #nav-scroll > a' );
			$menuItem.removeClass( 'bb-current' );
			$menuItem.eq(nextPage).addClass( 'bb-current' );
		}
	
		// Hide the first and last Navi in easymode
		function updateNavigation( isLastPage ) {
			
			if( current_page === 0 ) {
				$(".bb-flip.bb-nav-prev").hide();
				$(".bb-flip.bb-nav-next").show();
			}
			else if( isLastPage ) {
				$(".bb-flip.bb-nav-prev").show();
				$(".bb-flip.bb-nav-next").hide();
			}
			else {
				$(".bb-flip.bb-nav-prev").show();
				$(".bb-flip.bb-nav-next").show();
			}
	
		}

	}

	Book.prototype._initEvents = function() {
		var self = this;
		if( this.bb ) {	
			// add Click Flip events		
			$(".bb-nav-prev").each(function(){
				$(this).on('click touchstart',function(){
					self._prevPage();
				})
			});
			$(".bb-nav-next").each(function(){
				$(this).on('click touchstart',function(){
					self._nextPage();
				})
			});
			// add Swipe Flip events
			var $slides = $( '.bb-bookblock').children();
			$slides.on( {
				'swipeleft' : function( event ) {
					self._nextPage();
					return false;
				},
				'swiperight' : function( event ) {
					self._prevPage();
					return false;
				}
			} );
			// add keyboard events
			$( document ).keydown( function(e) {
				var keyCode = e.keyCode || e.which,
					arrow = {
						left : 37,
						up : 38,
						right : 39,
						down : 40
					};

				switch (keyCode) {
					case arrow.left:
						self._prevPage();
						break;
					case arrow.right:
						self._nextPage();
						break;
				}
			} );
			
			//open the book						
			$('#page-corner,#open-it').on('click touchstart',function(){
					if(easyMod){
						//If browser do not support the 3D animate
						$("#top-perspective").show(0,function(){
								bigBookPosition();
							});
						self._open();
						$("#scroll-wrap").fadeOut(500);
					}
					else{
						//Intro Wrapper fadeOut
						$(".intro-wrapper").fadeOut(800);
						$("#top-perspective").show(0,function(){
								bigBookPosition();
							});
						$(".book").animate({marginLeft:'50%'},500,'easeInBack',function(){
								self._open();
								function hideLittleBook(){
										$("#scroll-wrap").hide();
										$('#map-wrapper').css({'opacity':'1','visibility':'visible'});
									};
								setTimeout(hideLittleBook,500);
							});
					}
				}); 
			
			//close the book		
			$('#close-button').on('click touchstart',function(){
			//	$menuItems.removeClass( 'bb-current' );	
			//	$menuItems.first().addClass('bb-current');
				
				if(phoneMod){
				  $("#menu-wrapper").hide();
				};
				
			   if(easyMod){
					self._close();
					$("#scroll-wrap").fadeIn(500,function(){
						//reset the book cover position
							smallBookPosition();
						});
					$("#top-perspective").removeClass("animate");
					$("#top-perspective").hide();
			   }else{
					$("#top-perspective").removeClass("animate");
					if(!Modernizr.csstransitions){$('#top-wrapper').css({left:'+=300px'});}					
					$(document).ready(function(){
						function closeBook(){
						  self._close();
						  // hide the map
						  $('#map-wrapper').css({'opacity':'0','visibility':'hidden'});
						  $("#scroll-wrap").show(0,function(){
							  		//reset the book cover position
							  		smallBookPosition();
							  });
						  setTimeout(moveBack, 500);
						  function moveBack(){
							  $(".book").animate({marginLeft:'0%'},400,'easeOutCubic');
							  $(".intro-wrapper").fadeIn(1100);
							  $("#top-perspective").hide();
							  }; 
						};
						setTimeout(closeBook, 300);
					})
			   }
			});	
			
			//book menu funcion;
			var $menuItems = $( '#nav-scroll > a' );
			$menuItems.first().addClass('bb-current');
			$menuItems.on( 'click touchstart', function() {
				if(!Modernizr.csstransitions){$('#top-wrapper').css({left:'+=300px'});}								
			//	$menuItems.removeClass( 'bb-current' );	
			//	var $dot = $( this );
			//	$dot.addClass( 'bb-current' );
				if(phoneMod){
				  $("#menu-wrapper").hide();
				};
				var $el = $( this ),
					idx = $el.index();
					$("#top-perspective").removeClass("animate");
					function flipPage(){
						self._jumpPage(idx+1);
					};
					setTimeout(flipPage, 400);	
			});
		}
	}
				
	Book.prototype._open = function() {
		
		docscroll = scrollY();
		
		classie.add( this.el, 'book-open' );
		classie.add( this.bbWrapper, 'book-show' );
		animateBars();	
		var self = this,
			onOpenBookEndFn = function( ev ) {
				this.removeEventListener( animEndEventName, onOpenBookEndFn );
				document.body.scrollTop = document.documentElement.scrollTop = 0;
				//classie.add( scrollWrap, 'hide-overflow' );
			};

		if( supportAnimations ) {
			this.bbWrapper.addEventListener( animEndEventName, onOpenBookEndFn );
		}
		else {
			onOpenBookEndFn.call();
		}
	}

	Book.prototype._close = function() {
		//classie.remove( scrollWrap, 'hide-overflow' );
		setTimeout( function() { document.body.scrollTop = document.documentElement.scrollTop = docscroll; }, 25 );
		classie.remove( this.el, 'book-open' );
		classie.add( this.el, 'book-close' );
		classie.remove( this.bbWrapper, 'book-show' );
		classie.add( this.bbWrapper, 'book-hide' );
		resetBars();
		var self = this,
			onCloseBookEndFn = function( ev ) {
				this.removeEventListener( animEndEventName, onCloseBookEndFn );
				// reset bookblock starting page
				// self.bb.bookblock( 'jump', 1);
				classie.remove( self.el, 'book-close' );
				classie.remove( self.bbWrapper, 'book-hide' );
			};

		if( supportAnimations ) {
			this.bbWrapper.addEventListener( animEndEventName, onCloseBookEndFn );
		}
		else {
			onCloseBookEndFn.call();
		}
	}

	Book.prototype._nextPage = function() {
		$(".content-wrapper").scrollTop(0);
		$(".content-wrapper").perfectScrollbar('update');		
		this.bb.bookblock( 'next' );
	}

	Book.prototype._prevPage = function() {
		$(".content-wrapper").scrollTop(0);
		$(".content-wrapper").perfectScrollbar('update');
		this.bb.bookblock( 'prev' );
	}
	
	Book.prototype._jumpPage = function(xp) {

		this.bb.bookblock( 'jump', xp);
	} 		    

	function psScrollTop(){
		$(".content-wrapper").scrollTop(0);
		$(".content-wrapper").perfectScrollbar('update');
	}

	
				
	function initBook() {
		[].slice.call( books ).forEach( function( el ) {
			new Book( el );
		} );
	}

	
	//init the PerfectScrollBar
	function initPsScroll(){
	  $('.content-wrapper,.outer-nav').perfectScrollbar({
				wheelSpeed: 60,
				wheelPropagation: true,
				minScrollbarLength: 20,
				suppressScrollX: 1
		  });	
	}


	/*------Position Reset functions------*/	
						
	function smallBookPosition(){
			var win_h=$(window).height();
			$('#scroll-wrap').css({"height": win_h + 'px'});
			$('.main').each(function(){
				var book=$('.book');
				var intro=$('.intro-wrapper');
				var b_top=(win_h - book.height() - 0 ) / 2;
				var i_top=(win_h - intro.height() - 0 ) / 2;
				if (b_top > 0) {
					book.css({"top": b_top});
					intro.css({"top": i_top});		
				}
				else {
					 book.css({"top": 10});
					 intro.css({"top": i_top});
				}
			});
	 };

	function class_vertical_center(the_class){
		  var win_h=$(window).height();
		  $the_target = $('.' + the_class);			
		  $the_target.each(function(){
			  target=$(this);
			  p_top=(win_h - target.height() - 0 ) / 2;
			  if (p_top > 0) target.css({
				  "padding-top": p_top
			  });
			  else target.css({
				  "padding-top": 10
			  })
		  });
	};
	function class_horizon_center(the_class){
		  var win_w=$(window).width();
		  var $the_target = $('.' + the_class);			  		    
		  var target=$($the_target);
		  var m_left=(win_w - target.width() - 0 ) / 2;
		  if (m_left > 0) target.css({
			  "left": m_left
		  });
		  else target.css({
			  "left": m_left			
		  });
	};	
	function id_horizon_center(the_id){
		  var win_w=$(window).width();
		  var $the_target = $('#' + the_id);			  		    
		  var target=$($the_target);
		  var m_left=(win_w - target.width() - 0 ) / 2;
		  if (m_left > 0) target.css({
			  "left": m_left
		  });
		  else target.css({
			  "left": m_left			
		  });
	};	
	function id_vertical_center(the_id){
		  var win_h=$(window).height();
		  var $the_target = $('#' + the_id);			  		    
		  var target=$($the_target);
		  var m_top=(win_h - target.height() - 0 ) / 2;
		  if (m_top > 0) target.css({
			  "top": m_top
		  });
		  else target.css({
			  "top": m_top			
		  });
	};
	
	//reset the limit size book position in the big screen
	function bigBookPosition(){
		
		var win_w=$(window).width();
		var win_h=$(window).height();
		
		if(win_w > 1200){
			id_horizon_center("top-wrapper");
		}else{
			$("#top-wrapper").css("left","");
		}			

		if(win_h > 768){
			id_vertical_center("top-wrapper");
		}else{
			$("#top-wrapper").css("top","");
		}			
	
	}
	 

	//the Menu Button hover animate;
	function menuButtonHover(){
		$(".menu-button").each(function(){
			$(this).mouseover(function(){
				$(this).children('div:eq(0)').width(28);
				$(this).children('div:eq(1)').width(32);
				$(this).children('div:eq(2)').width(26);
			});
			$(this).mouseout(function(){
				$(this).children('div:eq(0)').width(30);
				$(this).children('div:eq(1)').width(20);
				$(this).children('div:eq(2)').width(10);
			});
		});
	}
	
	//init the Skill bar;
	function initBars(){
			$('.progress-bar').prepend('<div class="bar-percent"></div>');
	}

			
	//reset the Skill bar;
	function resetBars() {
			$('.progress-bar').each(function() {
				 var bar = $(this);
				 bar.find('.bar-percent').animate({width: '6%' } ,1500 ,"swing");
				});
		}	
		
	//animate the Skill bar;
	function animateBars() {
		$('.progress-bar').each(function() {
			 var bar = $(this);
			 var percent=bar.attr("data-percent")
			 bar.find('.bar-percent').animate({width: percent + '%' } ,1500 ,"swing");
			});
	}		

	//run the functions, when the document ready
	$(document).ready(function() {
		
		//inte the skill progress bars
		initBars();
		
		//inte the page navigations
		initNav();
	
		//the Menu Button hover animate;		
		menuButtonHover();
		
		//form functions
		$('input, textarea').placeholder();
		$("form").validate();
		
		//init fancybox
		$('.fancybox').fancybox();
		
		//init the portfolio filter
		$('li.portfolio-item').addClass('active');		
	
		//Close button-tip animate function
		if(!easyMod){
			$('#close-button').mouseover(function(){
				$('#close-tip').css({"right":"15%","opacity":".8"});
			});
			$('#close-button').bind('mouseout click',function(){
				$('#close-tip').css({"right":"-30%","opacity":"0"});
			});		
		}
	
		//init the book(main functions)
		initBook();
		
		//set element position
		smallBookPosition();
		bigBookPosition();
		
		//init the perfect-scroll when it's needed
		if(win_w > 768){
			initPsScroll();					
		}
	
	});
	
	//run the functions, when the window resize
	$(window).bind("resize", function (event) {
		
		var win_h_n=$(window).height();
		var win_w_n=$(window).width();
		
		//reset element position
		smallBookPosition();
		bigBookPosition();
		
		//reload the page when it's needed
		if(win_w > 768){
			if(win_w_n < 769){
				 location.reload();					
			}
		}else{
			if(win_w_n > 768){
				 location.reload();					
			}
		}
				
			
	});		

	//the Phone Menu Function
	$(window).scroll(function() {		
		if ($(this).scrollTop()>40 && ! $('#top-perspective').hasClass('animate'))
		 {
			$('#phone-menu').fadeIn(500);
		 }
		else
		 {
		 	$('#phone-menu').fadeOut(500);
		 }
	 });	

})(jQuery);