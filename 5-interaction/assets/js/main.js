$( document ).ready(function() {
// start here 
$('.menu-link').click(function() {
  $('.menu').addClass('left');
});

$('.close-link').click(function() {
  $('.menu').removeClass('left');
});  

// popup link

$('.popup-link').click(function() {
  $('.popup').addClass('active');
}); 

$('.popup').click(function() {
  $('.popup').removeClass('active');
});  
	
















// end here
});