var Cart;
Cart = {
  attrs: {
    buttons: '.card__add',
    quantity: '.cart__quantity' 
  },
  
  currency: '$',

  init: function() {
    console.log('autoload init');
    $(document).on('click', Cart.attrs.buttons, Cart.addProduct);
  },

  addProduct: function(e) {
    e.preventDefault();
    var product = $(this).data();
    
    if(typeof product.id === 'undefined') {
      console.log('Отсутствует ID товара');
      return false;
    }
    
    var cart_data = Cart.getStorage() || {};
    
    if (cart_data.hasOwnProperty(product.id)) {
      cart_data[product.id].count++;
    } else {
      product.count = 1;
      cart_data[product.id] = product;
    }
    Cart.setStorage(cart_data);
    return false;
  },

  deleteProduct: function(e) {

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
    
    Cart.recalcSum();
    return false;
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



