$(function (){
  console.log('init');
  
  // Slideout
  var slideoutBtn = document.querySelector('.navbar-toggler');
  var slideout = new Slideout({
    'panel': document.getElementById('panel'),
    'menu': document.getElementById('navbar'),
    'padding': 250,
    'tolerance': 70,
    'side': 'right',
    'tolerance': 70,
    'touch': false

  });

  // Slideout toggler
  slideoutBtn.addEventListener('click', function() {
    slideout.toggle();
  });

  $('.scroll-to-target').click(function(e) {
    console.log('scroll-to-target');
    var target = $(this).attr('href');
    var offset = 100;
    if ($(this).data('offset') != undefined) offset = $(this).data('offset');
    $('.nav').removeClass('nav--active');
    $.scrollTo(target, 600, { offset: -offset });
    return false;
  });

  $('.gallery').slick({
    dots: true,
    slidesPerRow: 3,
    slidesToScroll: 1,
    rows: 2,
    responsive: [
      {
        breakpoint: 478,
        settings: {
          slidesPerRow: 1,
          rows: 1,
          dots: false
        }
      }
    ]
  });  
});



