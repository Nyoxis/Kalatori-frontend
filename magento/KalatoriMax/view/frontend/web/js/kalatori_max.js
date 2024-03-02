alert('Component_00'); 

define(
    [
        'Magento_Checkout/js/view/payment/default'
    ],
    function (Component) {
        'use strict';
alert('Component'); 
        return Component.extend({
            defaults: {
                template: 'Alzymologist_KalatoriMax/payment/kalatori_max'
            }
        });
    }
);
