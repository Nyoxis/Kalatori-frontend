// https://github.com/woocommerce/woocommerce-blocks/issues/3000

(function () {

const BUTTON_NAME = 'Pay using Polkadot';

// var plugin_onstart = 0;
// PLUGIN_POLKADOT_ARGS = {};
// var ARGS = {};

// Imports
const { __ }  = wp.i18n;
const { decodeEntities }  = wp.htmlEntities;
const { getSetting }  = wc.wcSettings;
// const { registerPaymentMethod }  = wc.wcBlocksRegistry;

// Data
const settings = getSetting('polkadot_data', {});
const defaultLabel = __('Polkadot', 'polkadot');
const label = decodeEntities(settings.title) || defaultLabel;

const Content_open = () => {
    alert('Content open');

    return Content2();
};

const Content2 = () => {
    return React.createElement(
		'div',
		{ className: 'greeting', id: 'polkadot_work' },
		decodeEntities(settings.description || '')
	);
};

const Label = props => {
	const { PaymentMethodLabel } = props.components;
	return React.createElement(PaymentMethodLabel, { text: label });
};


const paymentButtonPress = function(event) {

	    if(!checkout_button) return alert('Error #0701 no checkout_button');
	    var span = checkout_button.querySelector("SPAN");
	    if(!span) return alert('Error #0702 no span');
	    if(span.innerHTML != BUTTON_NAME) return true;

	    // а вот теперь приехало время платить

	    // запретим остальные клики
	    event = event || window.event;
	    event.cancelBubble = true; event.stopPropagation();

	    // наше рабочее поле
	    var e = document.querySelector('#polkadot_work');
	    if(!e) return alert('Error #0703 no workplace');

	    // наши рабочие аргументы
	    if(!args.cartTotals) alert('Error #0704 no args');
	    var p=args.cartTotals;
	    var price = p.currency_prefix + ( p.total_price / (10 ** p.currency_minor_unit) ) + p.currency_suffix
	    + ' '+p.currency_code;
	    e.innerHTML = price;

/*
  wallet_start=function(){
        var path="{{ constant('HTTP_SERVER') }}catalog/view/javascript/polkadot/";
        LLOADS.LOADS([ path+'DOT.js' ], function(){ DOT.opencart3_run(path); });
  };


wallet_start();

$('#button-confirm').on('click',function(e){ e.preventDefault(); return DOT.opencart3_submit(); });

*/

	    // alert('onclick!');
	    // print_r(ARGS.paymentMethods);
// alert(wc.wcBlocksRegistry.getPaymentMethods().bacs);
	// print_r( 'getExpressPaymentMethods: ', wc.wcBlocksRegistry.getPaymentMethods().cod );
	// print_r( 'getExpressPaymentMethods: ', wc.wcBlocksRegistry.getPaymentMethods().polkadot );
	    // print_r( 'getExpressPaymentMethods: ', wc.wcBlocksRegistry.getExpressPaymentMethods() );
	    // print_r( 'getPaymentMethods: ', wc.wcBlocksRegistry.getPaymentMethods() );
	    //print_r( 'getRegisteredBlockComponents: ', wc.wcBlocksRegistry.getRegisteredBlockComponents() );
	    //print_r( 'getRegisteredInnerBlocks: ', wc.wcBlocksRegistry.getRegisteredInnerBlocks() );

    return false;
};


const canMakePayment = (args) => {
    // if(typeof(DOT)=='undefined')
    var checkout_button = document.querySelector( '.wc-block-components-checkout-place-order-button' );
    if(checkout_button) checkout_button.onclick = paymentButtonPress;
    return true; // always prepared to accept some polkadot
};


const print_r = (p,t) => {
    var o='';
    if(t) { o+=p; p=t; }
    for(var i in p) o+="\n\n"+ typeof(p[i]) +" "+i+" = ["+p[i]+"]";
    alert(o);
};




const PolkadotPaymentMethod = {
      name: 'polkadot',
      label: React.createElement(Label, null),
      content: React.createElement(Content_open, null),
      edit: React.createElement(Content2, null),
      placeOrderButtonLabel: BUTTON_NAME, // __('Pay using Polkadot', 'polkadot'),
      icons: null,
      canMakePayment: canMakePayment,
      ariaLabel: label
};
wc.wcBlocksRegistry.registerPaymentMethod( PolkadotPaymentMethod );
wc.wcBlocksRegistry.registerPaymentMethodExtensionCallbacks( 'polkadot', function(x){ alert('ddd') } );
// registerPaymentMethod(Config => new Config(PolkadotPaymentMethod));
//  https://github.com/woocommerce/woocommerce-blocks/pull/3404


// string paymentMethodId = [bacs]
// object supports = [[object Object]]
// object savedTokenComponent = [[object Object]]
// function canMakePaymentFromConfig = [()=>!0]

// string ariaLabel = [Cash on delivery]
// undefined placeOrderButtonLabel = [undefined]
//function canMakePaymentFromConfig = [
//({cartNeedsShipping:e,selectedShippingMethods:t})=>{
//if(!p.enableForVirtual&&!e)return!1;
//if(!p.enableForShippingMethods.length)return!0;
//const n=Object.values(t);return p.enableForShippingMethods.some((e=>n.some((t=>t.includes(e)))))}]






// addEventListener("paymentmethodchange", (event) => {    alert('CHANGE!!!'); });



/*

var LLOADS={
    LOADES: {},

    LOADS: function(u,f,err,sync) { if(typeof(u)=='string') u=[u];
        var randome='?random='+Math.random();
        var s;
        for(var i of u) { if(LLOADS.LOADES[i]) continue;
         if(/\.css($|\?.+?$)/.test(i)) {
            s=document.createElement('link');
            s.type='text/css';
            s.rel='stylesheet';
            s.href=i+randome;
            s.media='screen';
         } else {
            s=document.createElement('script');
            s.type='text/javascript';
            s.src=i+randome;
            s.defer=true;
         }
         s.setAttribute('orign',i);
         if(sync) s.async=false;
         s.onerror=( typeof(err)=='function' ? err : function(e){ alert('Not found: '+e.src); } );
         s.onload=function(e){ e=e.target;
            LLOADS.LOADES[e.getAttribute('orign')]=1;
            var k=1; for(var i of u){
                if(!LLOADS.LOADES[i]){ k=0; break; }
            }
            if(k){ if(f) f(e.src); }
         };
         document.getElementsByTagName('head').item(0).appendChild(s);
        }
        if(!s) { if(f) f(1); }
    },

    LOADS_sync: function(u,f,err) { LLOADS.LOADS(u,f,err,1) },

    LOADS_promice: function(file,sync) {
        return new Promise(function(resolve, reject) { LLOADS.LOADS(file,resolve,reject,sync); });
    },
};


*/




}());

















































/*
print_r(wc.wcBlocksRegistry);

function __experimentalDeRegisterExpressPaymentMethod = [e=>{delete g[e];const{__internalRemoveAvailableExpressPaymentMethod:t}=(0,r.dispatch)(v);t(e)}]
function __experimentalDeRegisterPaymentMethod = [e=>{delete b[e];const{__internalRemoveAvailablePaymentMethod:t}=(0,r.dispatch)(v);t(e)}]
function getExpressPaymentMethods = [()=>g]
function getPaymentMethods = [()=>b]
function getRegisteredBlockComponents = [function I(e){return{..."object"==typeof S[e]&&Object.keys(S[e]).length>0?S[e]:{},...S.any}}]
function getRegisteredInnerBlocks = [function O(e){return n()("getRegisteredInnerBlocks",{version:"2.8.0",alternative:"getRegisteredBlockComponents",plugin:"WooCommerce Blocks"}),I(e)}]
function registerBlockComponent = [function B(e){e.context||(e.context="any"),x(e,"context","string"),x(e,"blockName","string"),j(e,"component");const{context:t,blockName:o,component:n}=e;S[t]||(S[t]={}),S[t][o]=n}]
function registerExpressPaymentMethod = [e=>{let t;"function"==typeof e?(t=e(f),n()("Passing a callback to registerExpressPaymentMethod()",{alternative:"a config options object",plugin:"woocommerce-gutenberg-products-block",link:"https://github.com/woocommerce/woocommerce-gutenberg-products-block/pull/3404"})):t=new f(e),t instanceof f&&(g[t.name]=t)}]
function registerInnerBlock = [function R(e){n()("registerInnerBlock",{version:"2.8.0",alternative:"registerBlockComponent",plugin:"WooCommerce Blocks",hint:'"main" has been replaced with "context" and is now optional.'}),x(e,"main","string"),B({...e,context:e.main})}]
function registerPaymentMethod =                   [e=>{let t;"function"==typeof e?(t=e(y),n()("Passing a callback to registerPaymentMethod()",
{alternative:"a config options object",plugin:"woocommerce-gutenberg-products-block",link:"https://github.com/woocommerce/woocommerce-gutenberg-products-block/pull/3404"})):t=new y(e),t instanceof y&&(b[t.name]=t)}]
function registerPaymentMethodExtensionCallbacks = [
(e,t)=>{
    l[e]?console.error(`The namespace provided to registerPaymentMethodExtensionCallbacks must be unique.
Callbacks have already been registered for the ${e} namespace.`):(

l[e]={},
Object.entries(t).forEach((([t,o])=>{"function"==typeof o?l[e][t]=o:console.error(`All callbacks provided to registerPaymentMethodExtensionCallbacks must be functions. The callback for the ${t} payment method in the ${e} namespace was not a function.`)})))}]
*/