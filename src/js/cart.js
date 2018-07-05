var Cart;
Cart = {
  attrs: {
    buttons: '.product__btn',
    quantity: '.cart__quantity',
    currency: 'Р' 
  },
  
  widget: {},
  
  init: function() {
    console.log('autoload init');

    $(document).on('click',Cart.attrs.buttons, function(e) {
      console.log('product__btn click');

      var $order = $(this).closest('.product__order');
      
      var product_id = $order.data('product');

      if (product_id != undefined && product_id) {
        console.log('product_id: '+product_id);

        $(this).addClass('product__btn--hide');
        $(this).siblings('.product__spinner').addClass('product__spinner--active');  

        Cart.addProduct(product_id);
      }
    });
  },

  addProduct: function(product_id) {
    e.preventDefault();
    
    var cart_data = Cart.getStorage() || {};
    
    if (cart_data.hasOwnProperty(product_id)) {
      cart_data[product_id].count++;
    } else {
      product.count = 1;
      cart_data[product_id] = product;
    }
    Cart.setStorage(cart_data);
    return false;
  },

  deleteProduct: function(product_id) {
    var cart_data = Cart.getStorage();
    delete cart_data[product_id];
    Cart.setStorage(product_id);
    
    Cart.widget.refresh();
    return false;

  },

  updateProduct: function(e) {
    var product = $(this).data();
    var amount = 1;
    cart_data = Cart.getStorage();
    
    cart_data[product.id].count += amount;
    
    if (cart_data[product.id].count < 1) {
      cart_data[product.id].count = 1;
    }
    Cart.setStorage(cart_data);
    
    Cart.refresh();
    return false;
  },
  

  /* Recalc Functions */

  refresh: function() {

  },


  /* Widget functions */
  initWidget: function(e) {
    console.log('widget.init');

  },
  
  refreshWidget:function(e){
    console.log('widget.refresh');
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