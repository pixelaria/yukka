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

  // Popup callbacks
  $('body').delegate('*[data-event="popup"]', 'click', function(e) {
    console.log('popup event');
    var popup = $(this).data('popup');
    if (popup) {
      $('body').addClass('body--noscroll');
      $('#'+popup).addClass('popup--active');
    }
    return false;
  });

  $('body').delegate('.popup__close', 'click', function(e) {
    var $popup = $(this).closest('.popup');
    
    $('body').removeClass('body--noscroll');
    $popup.removeClass('popup--active');
    
    if ($(this).hasClass('popup__close--remove')) {
      $popup.remove();
    }
    return false;
  });


  $(document).on('click','.spinner__button', function(e){
    console.log('.spinner__button');

    var $spinner = $(this).closest('.spinner');
    var $target = $spinner.find('.spinner__input');
    var $placeholder = $spinner.find('.spinner__placeholder');
    
    console.log($target);
    
    var change = 1,min = 1, max=200, uom = '';
    if ($target.data('change') != undefined) change = parseInt($target.data('change'));
    if ($target.data('min') != undefined) min = parseInt($target.data('min'));
    if ($target.data('max') != undefined) max = parseInt($target.data('max'));
    if ($target.data('uom') != undefined) uom = $target.data('uom');
    
    var val;
    
    if ($(this).hasClass('spinner__button--up')) {
      val=parseInt($target.val()) + change;
    } else {
      val=parseInt($target.val()) - change;
    }
    
    if (val<min) val=min;
    if (val>max) val=max;

    $target.val(val).change();
    $target.trigger('change');
    $placeholder.html(val+' '+uom);
    console.log(val+' '+uom);
    return false;
  });

  $(document).on('click','.product__btn', function(e){
    $(this).addClass('product__btn--hide');
    $(this).siblings('.product__spinner').addClass('product__spinner--active');
  });

});



