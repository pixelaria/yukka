var Cart;
Cart = {

  attrs: {
    buttons: '.product__btn',
    quantity: '.cart__quantity',
    currency: 'Р' 
  },
  quantity: 0,
  
  init: function() {
    console.log('Cart initialize');

    

    // Refresh Widget
    Cart.initWidget();
    Cart.loadProducts();
    Cart.refreshWidget();

    // Binds product buttons
    $(document).on('click',Cart.attrs.buttons, function(e) {
      console.log('product__btn click');

      var $product_order = $(this).closest('.product__order');
      
      var product_data = $product_order.data();
      console.log('product_data: ');
      console.log(product_data);

      if (product_data != undefined && product_data) {
        
        $(this).addClass('product__btn--hide');
        $(this).siblings('.product__spinner').addClass('product__spinner--active');  

        Cart.addProduct(product_data);
      }
    });

    // Binds product quantity spinners
    $(document).on('change','.spinner__input',function(e){
      var $product_order = $(this).closest('.product__order');
      var val = $(this).val();
      $product_order.data('quantity',val);

      Cart.updateProduct($product_order.data());
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
    return false;
  },

  // Delete product from cart
  deleteProduct: function(product_id) {
    var cart_data = Cart.getStorage();
    delete cart_data[product_id];
    Cart.setStorage(product_id);
    Cart.refreshWidget();
    return false;

  },

  // Update product quantity in cart
  updateProduct: function(product_data) {
    var product_id = product_data.product;
    var quantity = 1;
    cart_data = Cart.getStorage();
    
    cart_data[product_id].quantity = product_data.quantity;
    
    if (cart_data[product_id].quantity < 1) {
      cart_data[product_id].quantity = 1;
    }
    Cart.setStorage(cart_data);
    
    Cart.refresh();
    return false;
  },


  /* Recalc Functions */

  refresh: function() {

  },


  /* Widget functions */
  initWidget: function() {
    console.log('widget.init');
    var $wrapper = $('.wrapper');
    
    Cart.$widget = $('<div/>',{
      appendTo:  $wrapper,
      class: 'cart-widget',
      html: 'Корзина'
    });

  },
  
  /*
   * Refresh cart widget - loads quantity from local storatge
   */
  refreshWidget:function(){
    console.log('widget.refresh');
    if (Cart.totals>0) {
      Cart.$widget.addClass('cart-widget--active');
      Cart.$widget.html(Cart.totals+' товара');

    }
  },

  loadProducts:function(){
    var cart_data = Cart.getStorage();
    var totals = 0;

    if (cart_data !== null && Object.keys(cart_data).length) {
      for (var key in cart_data) {
        if (cart_data.hasOwnProperty(key)) {
          totals += parseInt(cart_data[key].quantity);
          Cart.bindProduct(cart_data[key]);
        }
      }
    }
    console.log('totals: '+totals)

    Cart.totals = totals;
  },

  bindProduct:function(product_data) {
    var $product_order= $('.product__order[data-product="'+product_data.product+'"]') 
    
    $product_order.data('quantity',product_data.quantity);

    $product_order.find('.product__btn').addClass('product__btn--hide');
    $product_order.find('.product__spinner').addClass('product__spinner--active');
    $product_order.find('.spinner__input').val(product_data.quantity);
    $product_order.find('.spinner__placeholder').html(product_data.quantity);
    
  },

  /* Local Strorage functions */
  setStorage: function(o) {
    localStorage.setItem('pxcart', JSON.stringify(o));
    return false;
  },
  getStorage: function() {
    return JSON.parse(localStorage.getItem('pxcart'));
  }
};