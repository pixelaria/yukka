var Cart;
Cart = {

  attrs: {
    buttons: '.product__btn',
    quantity: '.cart__quantity',
    currency: 'Р' 
  },
  
  amount:0,
  weight:0,
  delivery:0,
  subtotal:0,

  init: function() {
    console.log('Cart initialize');

    Cart.order = $('#order');
    Cart.fields = {
      product:Cart.order.find('#products'),
      pickup:Cart.order.find('#pickup'),
      subtotal:Cart.order.find('#subtotal'),
      delivery:Cart.order.find('#delivery'),
    };

    // Refresh Widget
    Cart.initWidget();
    Cart.refresh();

    // Binds product buttons
    $(document).on('click',Cart.attrs.buttons, function(e) {
      console.log('product__btn click');

      var $product_order = $(this).closest('.product__order');
      
      var product_data = $product_order.data();
      console.log('product_data:');
      console.log(product_data);

      if (product_data != undefined && product_data) {
        
        $(this).addClass('product__btn--hide');
        $(this).siblings('.product__spinner').addClass('product__spinner--active');  

        Cart.addProduct(product_data);
      }
    });

    // Binds product quantity spinners
    $(document).delegate('.spinner__input','change',function(e){
      console.log('cart spinner__input');
      
      var $product_order = $(this).closest('.product__order');
      var val = $(this).val();
      
      if (val == 0) {
        Cart.deleteProduct($product_order.data('product'));
      } else {
        $product_order.data('quantity',val);
        Cart.updateProduct($product_order.data());
      }
    });

    // Cart remove icons
    $(document).delegate('.cart__remove','click',function(e){
      console.log('.cart__remove');
      var $product_order = $(this).closest('.product__order');
      Cart.deleteProduct($product_order.data('product'));
    });


    $(document).on('click','.checkout__btn',function(e){
      console.log('checkout__btn clicked');

      //prepare fields
      Cart.fields.product.val();
      Cart.fields.pickup.val(Cart.pickup);
      Cart.fields.subtotal.val(Cart.subtotal);
      Cart.fields.delivery.val(Cart.delivery);

    });
    
  },

  // Adds product to cart
  addProduct: function(product_data) {
    console.log('addProduct: '+product_data.product);
    var product_id = product_data.product;
    var cart_data = Cart.getStorage() || {};
    
    if (cart_data.hasOwnProperty(product_id)) {
      cart_data[product_id].quantity++;
    
    } else {
      product_data.quantity = 1;
      cart_data[product_id] = product_data;
    }
    Cart.setStorage(cart_data);
    Cart.refresh();
    return false;
  },

  // Delete product from cart
  deleteProduct: function(product_id) {
    console.log('delete product: '+product_id);

    var $product_order = $('.product__order[data-product="'+product_id+'"]');
    $product_order.find('.product__btn').removeClass('product__btn--hide');
    $product_order.find('.product__spinner').removeClass('product__spinner--active');  


    var cart_data = Cart.getStorage();
    delete cart_data[product_id];
    Cart.setStorage(cart_data);
    Cart.refresh();
    return false;

  },

  // Update product quantity in cart
  updateProduct: function(product_data) {
    var product_id = product_data.product;
    
    cart_data = Cart.getStorage();
    
    cart_data[product_id].quantity = product_data.quantity;
    
    if (cart_data[product_id].quantity < 1) {
      cart_data[product_id].quantity = 1;
    }
    Cart.setStorage(cart_data);
    Cart.refresh();
    
  },


  /* Recalc Functions */

  refresh: function() {
    Cart.loadProducts();
    Cart.refreshWidget();
    if ($('.cart').length) {
      Cart.redrawCart();
    }
  },


  /* Widget functions */
  initWidget: function() {
    console.log('widget.init');
    var $wrapper = $('.wrapper');
    
    Cart.$widget = $('<a/>',{
      appendTo:  $wrapper,
      class: 'cart-widget',
      href: '/catalog/',
      html: 'Корзина'
    });

  },
  
  /*
   * Refresh cart widget - loads quantity from local storatge
   */
  refreshWidget:function(){
    console.log('widget.refresh');
    if (Cart.amount>0) {
      Cart.$widget.addClass('cart-widget--active');
      var text = Cart.endings(Cart.amount, ['товар', 'товара', 'товаров']);
      Cart.$widget.html(Cart.amount+' '+text);

    } else {
      Cart.$widget.html('Корзина');
      Cart.$widget.removeClass('cart-widget--active');
    }
  },


  redrawCart:function() {
    if (!$('.cart').length) return;
    var $section = $('.section--cart');
    $('.cart').empty();
    $('#boxberry_map').empty();
    
    if (Cart.amount > 0) {
      $section.removeClass('section--hide');

      boxberry.openOnPage('boxberry_map'); 
      boxberry.open(Cart.boxberry_callback, //callback
        '6SVbWBI29LRPvMemNNuPoA==', // api-token
        'Санкт-Петербург', // город
        '',  // код пункта приема посылок
        Cart.subtotal, // объявленная стоимость
        Cart.weight, // вес посылки в граммах
        Cart.subtotal); // сумма к оплате покупателем

      var cart_data = Cart.getStorage();
      if (cart_data !== null && Object.keys(cart_data).length) {
        for (var key in cart_data) {
          if (cart_data.hasOwnProperty(key)) {
            Cart.drawProduct(cart_data[key]);
          }
        }
      }
    } else {
      $section.addClass('section--hide');
    }
  },
  
  //.product__order(data-product='50' data-name='Крепость' data-price='900' data-quantity='0')

  drawProduct:function(product_data) {
    var cart_row = $('<div/>',{
      appendTo:  $('.cart'),
      class: 'cart__row product__order',
      html: [
        $('<div/>',{
          class: 'cart__cell cart__cell--img',
          html: [
            $('<div/>',{
              class: 'cart__img',
              html: [
                $('<img/>',{
                  class: 'img img--responsive',
                  alt: product_data.name,
                  src: product_data.image
                })
              ]
            })
          ]
        }),
        $('<div/>',{
          class: 'cart__cell cart__cell--name',
          html: product_data.name+' <div class="price">'+product_data.price+' <span>Р</span></div>'
        }),
        $('<div/>',{
          class: 'cart__cell cart__cell--price',
          html: '<div class="price">'+product_data.price+' <span>Р</span></div>'
        }),
        $('<div/>',{
          class: 'cart__cell cart__cell--quantity',
          html: [
            $('<div/>',{
              class: 'spinner',
              html: [
                $('<input/>',{
                  class: 'spinner__input',
                  type: 'hidden',
                  value: product_data.quantity
                }),
                $('<span/>',{
                  class: 'spinner__button spinner__button--down',
                  html: '-'
                }),
                $('<div/>',{
                  class: 'spinner__placeholder',
                  html: product_data.quantity
                }),
                $('<span/>',{
                  class: 'spinner__button spinner__button--up',
                  html: '+'
                }),
              ]
            })
          ]
        }),
        $('<div/>',{
          class: 'cart__cell cart__cell--remove',
          html: '<span class="cart__remove"></span>'
        }),
      ]
    });
    console.log(cart_row);
    
    cart_row.data('product',product_data.product);
    
    console.log(cart_row.data());

    Cart.update_totals();
  },


  loadProducts:function(){
    console.log('loadProducts');
    var cart_data = Cart.getStorage();
    var amount = 0;
    var subtotal = 0;
    var weight = 0;

    if (cart_data !== null && Object.keys(cart_data).length) {
      for (var key in cart_data) {
        if (cart_data.hasOwnProperty(key)) {
          amount += parseInt(cart_data[key].quantity);
          subtotal += parseInt(cart_data[key].price) * parseInt(cart_data[key].quantity);
          weight += parseInt(cart_data[key].weight);
          Cart.bindProduct(cart_data[key]);
        }
      }
    }
    console.log('amount: '+amount)
    console.log('subtotal: '+subtotal)
    console.log('weight: '+weight);

    Cart.amount = amount;
    Cart.subtotal = subtotal;
    Cart.weight = weight;
  },

  bindProduct:function(product_data) {
    var $product_order= $('.product__order[data-product="'+product_data.product+'"]') 
    
    $product_order.data('quantity',product_data.quantity);

    $product_order.find('.product__btn').addClass('product__btn--hide');
    $product_order.find('.product__spinner').addClass('product__spinner--active');
    $product_order.find('.spinner__input').val(product_data.quantity);
    $product_order.find('.spinner__placeholder').html(product_data.quantity);
  },

  
  boxberry_callback: function(result) {
    console.log(result);
    
    if (result) {
      var $pickpoint = $('#pickpoint'), 
          _pickpoint = '';
      
      $pickpoint.html('').removeClass('totals__cell--full');
      
      if (result.address)
        _pickpoint+='<span>'+result.address+'</span><br />';
      
      if (result.phone)
        _pickpoint+='<span>'+result.phone+'</span><br />';
      
      if (result.workschedule)
        _pickpoint+='<span>'+result.workschedule+'</span>';
      
      $('<div/>',{
        appendTo:  $pickpoint,
        class: 'price',
        html: result.price+'<span>Р</span>'
      });

      Cart.delivery = result.price;
      Cart.pickup = _pickpoint;
      Cart.update_totals();
    }

    if (result.prepaid=='1') {
      alert('Отделение работает только по предоплате!');
    }
  },

  /* Update cart totals */
  update_totals: function() {
    console.log('update_totals');
    var _total = parseInt(Cart.subtotal) + parseInt(Cart.delivery);

    console.log(_total);

    $('#subtotal').html('<div class="price">'+_total+' <span>Р</span></div>');
  },

  /* Local Strorage functions */
  setStorage: function(o) {
    localStorage.setItem('pxcart', JSON.stringify(o));
    return false;
  },
  getStorage: function() {
    return JSON.parse(localStorage.getItem('pxcart'));
  },

  endings: function(number, text) {  
    cases = [2, 0, 1, 1, 1, 2];  
    return text[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];  
  }

};