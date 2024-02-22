// https://github.com/woocommerce/woocommerce-blocks/issues/3000


// КОГДА МЫ ПРОСТО ЗАГРУЗИЛИ СТРАНИЦУ
(function () {

  // Работа с памятью браузера шоб не грузить раньше времени DOT.js
  f_save = function(k,v){ try { return window.localStorage.setItem(k,v); } catch(e) { return ''; } };
  f_read = function(k){ try { return window.localStorage.getItem(k); } catch(e) { return ''; }};
  pageload = function() { // Считаем, что загрузили полностью и реакт просрался

	var pp = document.querySelectorAll("input.wc-block-components-radio-control__input");
	if(pp.length) {
	    var pay = ''+f_read('payment_select');
	    pp.forEach((e) => { // alert(pp.length+' id: '+e.id);
		e.addEventListener("click", (event) => { f_save('payment_select',event.target.id); return true; });
		// e.style.border='10px solid green';
		if(e.id == pay) e.click();
	    });
	}

//    alert( JSON.stringify(settings) );


    // пробуем убрать срабатываение формы
    var button = document.querySelector( '.wc-block-components-checkout-place-order-button' );

/*
    button.onclick = async function(event) {
	event.preventDefault();
	if(event.stopPropagation) event.stopPropagation();
	if(event.stopImmediatePropagation) event.stopImmediatePropagation();
	return false;
    };
*/
//	alert("button.onclick: "+button.onclick);
//     button.click();

/*
    var span = button.querySelector(".wc-block-components-button__text");
    span.onclick = async function(event) {
	event.preventDefault();
	if(event.stopPropagation) event.stopPropagation();
	if(event.stopImmediatePropagation) event.stopImmediatePropagation();
	return false;
    };
*/

    var form = button.form;
    form.onclick = async function(event) {
	event.preventDefault();
	// if(event.stopPropagation) event.stopPropagation();
	// if(event.stopImmediatePropagation) event.stopImmediatePropagation();
	return false;
    };

    var div = form.parentNode.parentNode.parentNode; // closest("DIV[data-block-name='woocommerce/checkout']"); // .wc-block-components-button__text");

    // <div data-block-name="woocommerce/checkout" class="wp-block-woocommerce-checkout alignwide wc-block-checkout"><div class="with-scroll-to-top__scroll-point" aria-hidden="true"></div><div class="wc-block-components-notices"><div class="wc-block-store-notice wc-block-components-notice-banner is-error is-dismissible"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="M12 3.2c-4.8 0-8.8 3.9-8.8 8.8 0 4.8 3.9 8.8 8.8 8.8 4.8 0 8.8-3.9 8.8-8.8 0-4.8-4-8.8-8.8-8.8zm0 16c-4 0-7.2-3.3-7.2-7.2C4.8 8 8 4.8 12 4.8s7.2 3.3 7.2 7.2c0 4-3.2 7.2-7.2 7.2zM11 17h2v-6h-2v6zm0-8h2V7h-2v2z"></path></svg><div class="wc-block-components-notice-banner__content"><div>Something went wrong when placing the order. Check your account's order history or your email for order updates before retrying.</div></div><button type="button" class="components-button wc-block-components-button wp-element-button wc-block-components-notice-banner__dismiss contained has-text has-icon" aria-label="Dismiss this notice"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M13 11.8l6.1-6.3-1-1-6.1 6.2-6.1-6.2-1 1 6.1 6.3-6.5 6.7 1 1 6.5-6.6 6.5 6.6 1-1z"></path></svg><span class="wc-block-components-button__text"></span></button></div></div><div class="wc-block-components-notices__snackbar wc-block-components-notice-snackbar-list" tabindex="-1"><div></div></div><div class="wc-block-components-sidebar-layout wc-block-checkout is-medium"><div style="position: absolute; inset: 0px; pointer-events: none; opacity: 0; overflow: hidden; z-index: -1;" aria-hidden="true"></div><div class="wc-block-components-main wc-block-checkout__main wp-block-woocommerce-checkout-fields-block"><form class="wc-block-components-form wc-block-checkout__form"><div class="wp-block-woocommerce-checkout-express-payment-block"><div class="wc-block-components-notices"></div><div class="wc-block-components-notices__snackbar wc-block-components-notice-snackbar-list" tabindex="-1"><div></div></div></div>
    if(!div) alert('no div');
    div.style.border='10px solid red';



	alert(div.tagName+' '+div.onclick);


    div.onclick = function(event) {

	event.preventDefault();
	if(event.stopPropagation) event.stopPropagation();
	if(event.stopImmediatePropagation) event.stopImmediatePropagation();
	return false;
    };

//    form.onclick = false;
//    form.onsubmit = false;
//    alert(	"form.onclick: "+form.onclick    +"\n\n\n\nform.action: "+form.action    +"\n\n\n\nform.submit: "+form.submit    +"\n\n\n\nform.onsubmit: "+form.onsubmit    );  };

    button.click();
    // form.submit(); - перегружает страницу постоянно

  };

    var cx={};

    const BUTTON_NAME = 'Pay using Polkadot';
    // Imports
    const { __ }  = wp.i18n;
    const { decodeEntities }  = wp.htmlEntities;
    // Data
    const settings = wc.wcSettings.getSetting('polkadot_data', {});
    const path = settings.root_url+'/';
    const defaultLabel = __('Polkadot', 'polkadot');
    const label = decodeEntities(settings.title) || defaultLabel;


//    alert(JSON.stringify( settings )); // args
    /*
     get_id()         :43
     get_status                :pending
     get_total                 :160.00
     get_currency              :EUR
     get_checkout_payment_url  :https://woocommerce.zymologia.fi/checkout/order-pay/43/?pay_for_order=true&key=wc_order_tFMQRwaQSfiXJ
     has_status('on-hold') == 0
    */


wallet_start=function(){
    // alert('wallet_start');
    console.log('find wallets');
    // return;

    console.log('path='+path);

//    console.log('path='+DOT.dom('order-id');


    wallet_go=function(){

	DOT.store = 'woocommerce';
	DOT.path=DOT.mainjs=path;
	DOT.ajaxm = path+'/image/ajaxm.gif';
	cx.ajax_url = path;
        if( DOT.dom('order-id') ) cx.order_id = 1*DOT.dom('order-id').value;
	DOT.cx = cx;
// { "root_url":"https://woocommerce.zymologia.fi/wp-content/plugins/polkadot-payments-woocommerce",
// "title":"",
// "description":"Оплатите при помощи карты легко и быстро."}
//	    : 
//	    order_id: DOT.cx.id,
//	    price: DOT.cx.total

// alert(DOT.path);

	var succ="wc-block-store-notice wc-block-components-notice-banner is-ok is-dismissible";
	var warn="wc-block-store-notice wc-block-components-notice-banner is-warning is-dismissible";
	var errr="wc-block-store-notice wc-block-components-notice-banner is-error is-dismissible";

	if(!DOT.dom('polkadot_work')) return setTimeout(function(){wallet_go()},200);
	if(!DOT.dom('WalletID')) DOT.dom('polkadot_work').innerHTML="<p>Select your DOT-account \
<span id='dotpay_wallet_finded'></span>\
<div id='WalletID_load' style='display:none'><img src='"+path+"/image/ajaxm.gif'> <font color='green'>loading...</font></div>\
<div style='padding-left:30px;' id='WalletID'>\
    <label style='display:block;text-align:left;'><input style='margin-right: 5px;' name='dot_addr' type='radio' value='QR'>QR-code</label>\
    <div><input type='button' value='Open my Wallets' onclick='dot_onselect()'></div>\
</div>\
</div>\
<div class='"+warn+"' style='display:none' id='dotpay_console'></div>\
";
	DOT.init();
	DOT.Talert('clear');

//	alert(JSON.stringify( DOT.cx ));

//        DOT.daemon_info();
    };

    if(typeof(DOT)!='undefined') wallet_go();
    else {
        var s=document.createElement('script');
	s.type='text/javascript';
	s.src=path+'DOT.js';
	    s.src+='?random='+Math.random(); // DEBUG ONLY!
	s.onerror=function(e){ alert('DOT plugin: script not found: '+e.src) };
	s.onload=wallet_go;
	document.getElementsByTagName('head').item(0).appendChild(s);
    }
};

// При выборе Polkadot.js
const Content_open = () => {
    wallet_start();
    return Content2();
};

const Content2 = () => {
    return React.createElement('div', { className: 'greeting', id: 'polkadot_work' },
	React.createElement(
	    'img',
	    { className: 'is_error', src: path+'image/ajaxm.gif' },
	    null
	)
    );
};

const Label = props => {
	const { PaymentMethodLabel } = props.components;
	return React.createElement(PaymentMethodLabel, { text: label });
};

const canMakePayment = (args) => {
    // alert('args: ' + JSON.stringify( args )); // args
    // сохраним наши рабочие аргументы
    if(!args.cartTotals) alert('Error #0704 no args');
    var p=args.cartTotals;
    cx.total = p.currency_prefix + ( p.total_price / (10 ** p.currency_minor_unit) );
    cx.code = p.currency_code;

    var checkout_button = document.querySelector( '.wc-block-components-checkout-place-order-button' );
    if(!checkout_button) return; // пока не готово, придем в другйо раз

    setTimeout(pageload,200);
    return true;

/*
//    var o='';
//    for(var i in form) o+="\n"+i+': '+typeof(form[i])+' '+(typeof(form[i])=='string'?form[i]:' ? ');
//    o="\n\n"+form.onsubmit+"\n\n"+o;
//    alert( o );
    var span = checkout_button.querySelector(".wc-block-components-button__text");
    span.onclick = async function(event) {
	event.preventDefault();
	return false;
    };
*/

    if(checkout_button) checkout_button.onclick = async function(event) {
	event.preventDefault();
    alert(111);

    // https://woocommerce.zymologia.fi/wp-json/wc/store/v1/checkout?_locale=user
    return false;




	let s = await fetch('/wp-json/wc/store/v1/checkout');
	alert( JSON.stringify( s ) );
	return true;

/*
// alert(1);
    var checkout_button = document.querySelector( '.wc-block-components-checkout-place-order-button' );
    var o=[];
    var f = document // checkout_button.closest('FORM')
        .querySelectorAll('input')
	.forEach((p,i)=>{
	    o.push(i+' ) type='+p.type+' name='+p.name+' value='+p.value);
	});
    alert(o.join("\n\n")
// JSON.stringify(o)
*/
	    var checkout_button = document.querySelector( '.wc-block-components-checkout-place-order-button' );
	    if(!checkout_button) return alert('Error #0701 no checkout_button');
	    var span = checkout_button.querySelector("SPAN");
	    if(!span) return alert('Error #0702 no span');
	    if(span.innerHTML != BUTTON_NAME) return true;

	    // а вот теперь приехало время платить

	    // return false;
	    return true;

/*
 get_status                :pending
 get_total                 :160.00
 get_currency              :EUR
 get_checkout_payment_url  :https://woocommerce.zymologia.fi/checkout/order-pay/43/?pay_for_order=true&key=wc_order_tFMQRwaQSfiXJ
 has_status() == 0

PHP message: woocommerce_blocks_checkout_order_processed is deprecated since version 7.2.0!
Use woocommerce_store_api_checkout_order_processed instead. This action was deprecated in WooCommerce Blocks version 7.2.0. Please use woocommerce_store_api_checkout_order_processed instead
*/

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
	    e.innerHTML = "<div>"+price+"</div>" + e.innerHTML;



	    // pay
	    var cx={};
	    cx.total = p.currency_prefix + ( p.total_price / (10 ** p.currency_minor_unit) );
	    // + p.currency_suffix
	    cx.code = p.currency_code;

//	    alert(JSON.stringify( settings )); // args

	    // {"root_url":"https://woocommerce.zymologia.fi/wp-content/plugins/polkadot-payments-woocommerce","title":"","description":"Оплатите при помощи карты легко и быстро."}





	    // Array.from(DOT.dom('form-polkadot').elements).forEach((e) => {
	    // const { name,value } = e; cx[name]=value;
	    // });
	    DOT.dom("WalletID").querySelectorAll("INPUT").forEach(function(x){ if(x.checked) cx.acc=x.value; });
	    if(cx.acc == 'false'|| !cx.acc || cx.acc=='') {
		DOT.alert('Please select account');
		return false;
	    }
	    alert(cx);
	    DOT.all_submit(cx);
	    return false;
    };
    return true; // always prepared to accept some polkadot
};

// Регистрируем Payment method
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


}());















/*






// wc.wcBlocksRegistry.registerPaymentMethodExtensionCallbacks( 'polkadot', function(x){ alert('ddd') } );
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