/*
	P0w0r-. v0.3
	Stef B. © 2013
*/

// Bewaar welke slide open staat, en welk element het laatste werd zichtbaar gemaakt.
var huidigeSlide = 0;
var huidigElement = 0;

// Bewaar het aantal slides in een variabele.
var aantalSlides = 0;

// Elementen die standaard onzichtbaar moeten zijn.
var elementen = 'li,pre,img,.verberg,code';

// Snelheid waarmee elementjes infaden.
var fadeSnelheid = 150;
var beweegSnelheid = 250

var interval;

// Wanneer het volledige document is geladen
$(document).ready(function()
{ 

	// Wat moet er bij de start verborgen zijn.
	$(elementen).css('opacity',0);
	$('.toon').css('opacity',1);

	// Vul de titel automatisch in op basis van de bestandsnaam zodat die niet telkens per presentatie manueel moet worden ingevuld
	/*
	var url = window.location.pathname;

	var titel = url.substring(url.lastIndexOf('/')+1);

	var vak = titel.substring(0,titel.indexOf('_'));	
	
	var nummer = titel.substring(vak.length+1,vak.length+3);	
	
	titel = titel.substring(vak.length + nummer.length + 2);
	titel = titel.substring(0,titel.lastIndexOf('.'))
	titel = titel.replace(/_/gi, " ");

	document.title = vak + ' - ' + nummer + ' - ' + titel;
	
	$('body > div > div > h2').empty().append(titel);

	//verander de nummer op de achtergrond van de eerste slide op deze manier omdat er met een :before wordt gewerkt in de .css
	$('body > div > div:first-child').attr('data-content',nummer)


	*/


	
	//bewaar het aantal slides
	aantalSlides = $('body > div > div').length;


	//als er een hash wordt meegegeven wordt de slidenummer hier uitgehaald	
	var startslide = window.location.hash;

	if(startslide.length > 0)
	{
		huidigeSlide = startslide.substring(6);
	}	
	
	//overloop alle slide-divs.
	//van elke slide die voor de huidige slide komt worden alle elementen al zichtbaar gezet
	var i = 0;

	$('body > div > div').each(function()
	{
		if(i < huidigeSlide)
		{
			$(this).find(elementen).css('opacity','1');	
		}
		else
		{
			return false;
		}
		i++;
	});
	
	
	// zorg voor een korte delay vooralleer de slides worden geresized
	interval = setInterval(initResize,50);
	
	//resize();
	$(window).resize(resize);
	

	// ga bij het scrollen naar de vorige slide of maak het volgende element zichtbaar
	$(document).bind('mousewheel', function(e,delta)
	{		
		if(delta > 0)
		{
			gaEenTerug();
		}
		else
		{
			gaEenVerder();
		}	
	});


	//als er toetsen worden ingedrukt kan er ook genavigeer worden
	$(document).keydown(function(e)
	{
		//console.log(e.keyCode)
		
		//bij het pijltje naar links
		if (e.keyCode == 37)
		{
			gaEenTerug();
			return false;
		}
		//bij spatie of het pijltje naar rechts
		else if (e.keyCode == 39 || e.keyCode == 32)
		{
			gaEenVerder();
			return false;	
		}
		//bij druk op "h", ga naar slide 1
		else if (e.keyCode == 72)
		{
			huidigeSlide = 0;
			beweeg();
			return false;
		}
		//bij druk op "e", ga naar de laatste slide
		else if (e.keyCode == 69)
		{
			huidigeSlide = aantalSlides - 1;
			beweeg();
			return false;
		}
		// toon alles, zodat je sneller doorheen de presentatie kan scrollen
		else if (e.keyCode == 83)
		{
			$(elementen).css('opacity',1);
			return false;
		}
		//vang het pijltje naar boven en onder op, maar doe er niets mee (anders beweegt het scherm)
		else if (e.keyCode == 38 || e.keyCode == 40)
		{
			return false;
		}
		//toon alles
	});

	

});

//omdat er soms wat foutloopt bij het inladen van alle slides wordt er even gewacht vooralleer de resize wordt uitgevoerd.
function initResize()
{
	resize();
	clearInterval(interval);
}

//teruggaan is steeds gelijk aan de vorige slide
function gaEenTerug()
{
	if(huidigeSlide > 0)
	{
		huidigeSlide--;
		beweeg();
	}
}


function gaEenVerder()
{
	huidigElement = 0;
	
	//zoek het eerst volgende onzichtbare element
	while(huidigElement < aantalElementen && $('body > div').children('div').eq(huidigeSlide).find(elementen).eq(huidigElement).css("opacity") == 1)
	{
		huidigElement++;
	}

	//als alle elementen op de huidige slide zichtbaar zijn, ga dan naar de volgende slide	
	if(huidigElement == aantalElementen && huidigeSlide < aantalSlides - 1)
	{
		huidigeSlide++;
		beweeg();				
	}
	//anders zet je het eerst volgende onzichtbare item zichtbaar
	else
	{
		$('body > div').children('div').eq(huidigeSlide).find(elementen).eq(huidigElement).animate({'opacity':'1'},fadeSnelheid);
		huidigElement++;
	}

}


function beweegNaar(slide)
{
	// zorg dat slide zeker een getal is (komt soms uit een cookie, vandaar)
	slide = parseInt(slide);

	//als het een geldige slidnr is, dan mag er geschoven worden
	if(slide > -1 && slide < aantalSlides)
	{
		
		huidigeSlide = slide;
		beweeg();
	}

}


function beweeg()
{
	//sla het aantal te tonen elementen op van de nieuwe slide
	aantalElementen = $('body > div').children('div').eq(huidigeSlide).find(elementen).length;
	
	//verschuif de volledige slideshow op, 
	$('body > div').stop(false, false).animate(
		{
			left: -(huidigeSlide * $(window).width())
		},
		beweegSnelheid);

	// verander de url het browservenster.
	window.location.href = '#slide' + huidigeSlide;
	
}


function resize()
{

	//zorg dat wanneer het venster vergroot/verkleint, de slides meedoen.
	$('body > div').width((aantalSlides * $(window).width())+100);
	//console.log('aantal slides ' + aantalSlides);
	//console.log('aantal slides ' + $(window).width());
	$('body > div').css('left',-(huidigeSlide * $(window).width()));
	$('body > div > div').width($(window).width());
	$('body > div > div').height($(window).height());

	//doordat alle andere fontgroottes in "em" zijn gedrukt volstaat het om enkel de font-grootte van de body aan te passen.
	$('body').css('font-size',$(window).height()/15 + 'px');
	
	//beweeg naar de huidige slide
	beweeg();
}