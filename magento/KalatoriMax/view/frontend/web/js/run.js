alert('run');

define(
    [
        'uiComponent',
        'Magento_Checkout/js/model/payment/renderer-list'
    ],
    function (
        Component,
        rendererList
    ) {
        'use strict';

alert('run 1');

        rendererList.push(
            {
                type: 'kalatori_max',
                component: 'Alzymologist_KalatoriMax/js/kalatori_max'
            }
        );

alert('run 2');

        return Component.extend({});
    }
);
