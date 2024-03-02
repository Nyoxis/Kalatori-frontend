// alert('ok');

// функция, срабатывающая при успешном получении токена
var successCallback = function(data) {

    var checkout_form = $( 'form.woocommerce-checkout' );

    // добавляем токен в скрытое поле в форме <input tyoe="hidden" id="truemisha_token" ...
    // console.log(data) тоже помогает
    checkout_form.find( '#truemisha_token' ).val( data.token );

    // снимаем функцию tokenRequest с события отправки формы
    checkout_form.off( 'checkout_place_order', tokenRequest );

    // отправляем форму
    checkout_form.submit();

};

// функция, срабатывающая, если при получении токена что-то пошло не так
var errorCallback = function( data ) {
    console.log( data );
};

var tokenRequest = function() {
    // тут будет какая-то функция вашей платёжный системы или банка, которая соберёт все данные формы и отправит их
    // возможно тут вам понадобится публичный API ключ, который у нас уже лежит тут truemisha_params.publishableKey
    // ну и срабатывает successCallback() при успехе, или errorCallback() если что-то пошло не так
    return false;
};

jQuery(function($){
    var checkout_form = $( 'form.woocommerce-checkout' );
    checkout_form.on( 'checkout_place_order', tokenRequest );
});