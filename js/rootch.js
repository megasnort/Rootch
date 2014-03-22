/*
	Rootch v0.1
	Stef B. © 2014
*/

var currentSlide = 0;
var currentElement = 0;

var slidesCount = 0;


var ctrlFlag = false;
var commandFlag = false;
var altFlag = false;
var shiftFlag = false;
var ctrlFlag = false;


var hiddenElements = 'li,pre,img,.verberg,code';


// Wanneer het volledige document is geladen
$(document).ready(function()
{ 

	// Wat moet er bij de start verborgen zijn.
	$(hiddenElements).css('opacity',0);
	$('.toon').css('opacity',1);

	//bewaar het aantal slides
	slidesCount = $('body > div > div').length;


	//als er een hash wordt meegegeven wordt de slidenummer hier uitgehaald	
	var startSlide = parseInt(window.location.hash.substring(6));

	if(startSlide > 0)
	{
		currentSlide = startSlide;

		//walk all slides before the currentSlide and make alle elemets visible
		var i = 0;

		$('body > div > div').each(function()
		{
			if(i < currentSlide)
			{
				$(this).find(hiddenElements).css('opacity','1');	
			}
			else
			{
				return false;
			}
			i++;
		});
	}	
	
	
	
	
	// Delay the initial resizing of the slides,
	// because the calculation of the total width of the slideshow is off a little bit when resizing immediately.
	var interval = setInterval(function()
	{
		resize();
		clearInterval(interval);
	},50);
	

	$(window).resize(resize);
	

	// ga bij het scrollen naar de vorige slide of maak het volgende element zichtbaar
	$(document).bind('mousewheel', function(e,delta)
	{		
		if(delta > 0)
		{
			moveBack();
		}
		else
		{
			moveForward();
		}	
	});

	$(document).keyup(function(e)
	{
		switch(e.keyCode)
		{
			//command
			case 244:
				ctrlFlag = false;
				break;
			// alt
			case 18:
				altFlag = false;
				break;
			// alt
			case 17:
				ctrlFlag = false;
				break;
			//shift
			case 16:
				shiftFlag = false;
				break;

		}
	});


	$(document).keydown(function(e)
	{
		console.log(e.keyCode);
		

		switch(e.keyCode)
		{
			//command
			case 244:
				ctrlFlag = true;
				break;
			// alt
			case 18:
				altFlag = true;
				break;
			// alt
			case 17:
				ctrlFlag = true;
				break;
			//shift
			case 16:
				shiftFlag = true;
				break;

		}

		//LEFT
		if (e.keyCode == 37 && noCombo())
		{
			moveBack();
			return false;
		}
		//RIGHT or SPACE
		else if ((e.keyCode == 39 || e.keyCode == 32)  && noCombo())
		{
			moveForward();
			return false;	
		}
		// (H)ome of the presentation
		else if ((e.keyCode == 72 || e.keyCode == 36)  && noCombo())
		{
			currentSlide = 0;
			move();
			return false;
		}
		// (E)nd of the presentation
		else if ((e.keyCode == 69  || e.keyCode == 35) && noCombo())
		{
			currentSlide = slidesCount - 1;
			move();
			return false;
		}
		// (S)how all
		else if ((e.keyCode == 83)  && noCombo())
		{
			$(hiddenElements).css('opacity',1);
			return false;
		}
		//Catch UP and DOWN, otherwise everything sometimes moves
		else if ((e.keyCode == 38 || e.keyCode == 40) && noCombo())
		{
			return false;
		}
	});

	$("body").touchwipe(
	{
		wipeLeft: moveBack,
		wipeRight: moveForward,
		wipeUp: function() { },
		wipeDown: function() { },
		min_move_x: 20,
		min_move_y: 20,
		preventDefaultEvents: true
	});
	

});



//teruggaan is steeds gelijk aan de vorige slide
function moveBack()
{
	if(currentSlide > 0)
	{
		currentSlide--;
		move();
	}
}


function moveForward()
{
	currentElement = 0;
	
	//find next invisible element
	while(currentElement < elementsCount && $('body > div').children('div').eq(currentSlide).find(hiddenElements).eq(currentElement).css("opacity") > 0)
	{
		currentElement++;
	}

	//when no invisible elements left, move to next Slide
	if(currentElement == elementsCount && currentSlide < slidesCount - 1)
	{
		currentSlide++;
		move();				
	}
	//make next element visible
	else
	{
		$('body > div').children('div').eq(currentSlide).find(hiddenElements).eq(currentElement).css('opacity','1');
		currentElement++;
	}

}


function noCombo()
{
	return (!ctrlFlag && !altFlag && !shiftFlag && !commandFlag);
}

function move()
{
	elementsCount = $('body > div').children('div').eq(currentSlide).find(hiddenElements).length;
	
	$('body > div').css('left', -(currentSlide * $(window).width()));

	window.location.href = '#slide' + currentSlide;	
}


function resize()
{

	$('body > div').width((slidesCount * $(window).width())+100);
	$('body > div').css('left',-(currentSlide * $(window).width()));
	$('body > div > div').width($(window).width());
	$('body > div > div').height($(window).height());

	$('body').css('font-size', $(window).height() / 16 + 'px');
	
	move();
}