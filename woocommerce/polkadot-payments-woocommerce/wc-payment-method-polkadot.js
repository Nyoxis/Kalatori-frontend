// https://github.com/woocommerce/woocommerce-blocks/issues/3000

// КОГДА МЫ ПРОСТО ЗАГРУЗИЛИ СТРАНИЦУ
(function () {
  var my_args = false;
  var DOTloaded = false;
  // Работа с памятью браузера шоб не грузить раньше времени DOT.js
  f_save = function(k,v){ try { return window.localStorage.setItem(k,v); } catch(e) { return ''; } };
  f_read = function(k){ try { return window.localStorage.getItem(k); } catch(e) { return ''; }};

  pageload = function() { // Считаем, что загрузили полностью и реакт просрался

	// console.log(' *** pageload');

	var pp = document.querySelectorAll("input.wc-block-components-radio-control__input");
	if(pp.length) {
	    var pay = ''+f_read('payment_select');
	    pp.forEach((e) => {
		e.addEventListener("click", (event) => {
		    var id=event.target.id;
		    f_save('payment_select',id);
		    return true;
		});
		if(e.id == pay) e.click();
	    });
	}

    // пробуем убрать срабатываение формы
    var button = document.querySelector( '.wc-block-components-checkout-place-order-button' );

    button.onclick = async function(event) {
	event.preventDefault();
	if(event.stopPropagation) event.stopPropagation();
	if(event.stopImmediatePropagation) event.stopImmediatePropagation();
	ajax_checkout();
	return false;
    };

//    form.onclick = false;
//    form.onsubmit = false;
//    alert(	"form.onclick: "+form.onclick    +"\n\n\n\nform.action: "+form.action    +"\n\n\n\nform.submit: "+form.submit    +"\n\n\n\nform.onsubmit: "+form.onsubmit    );  };

//    button.click();
    // form.submit(); - перегружает страницу постоянно

  };

    var cx={};
    const BUTTON_NAME = 'Pay using Polkadot';
    // Imports
    const { __ }  = wp.i18n;
    const { decodeEntities }  = wp.htmlEntities;
    // Data
    const settings = wc.wcSettings.getSetting('polkadot_data', {});
    // debugger;
    const path = settings.root_url+'/';
    const defaultLabel = __('Polkadot', 'polkadot');
    const label = decodeEntities(settings.title) || defaultLabel;











































    ajax_checkout = async function(e) {
	console.log('ajax_checkout');

	DOT.onpaid = function(json){ alert('PAID!'); };

	// переопределяем альтернативный AJAX для DOT-процедур
        DOT.AJAX_ALTERNATIVE = async function(url,func,s) {
	    console.log('AJAX_ALTERNATIVE');
	    var args = JSON.parse(my_args);
	    var customer_note=document.querySelector("DIV.wc-block-checkout__add-note TEXTAREA");
	    if(!customer_note) {
		// console.log('[!] Design error: note not found (DIV.wc-block-checkout__add-note TEXTAREA)');
		customer_note='';
	    } customer_note=''+customer_note.value;

	    var data={
		"shipping_address": args.cart.shippingAddress,
		"billing_address": args.cart.billingAddress,
		"customer_note": customer_note,
		"payment_method": "polkadot",
		"payment_data": [{"key":"wc-polkadot-new-payment-method","value":false}],
	    };

	    const r = await fetch(
		DOT.payment_url // +"&mul="+DOT.chain.mul
		// "https://woocommerce.zymologia.fi/wp-json/wc/store/v1/checkout?_locale=user&ajax=1&mul="+DOT.chain.mul
		,{ method:'POST', mode:'cors', credentials:'include', headers: [
		    ["Content-Type", "application/json"],
		    ["X-WP-Nonce", wp.apiFetch.nonceMiddleware.nonce ],
		    ["Nonce", JSON.parse(DOT.f_read('storeApiNonce')).nonce ],
		], body: JSON.stringify(data)
		}
	    );

	    if(r.ok) {
		var text = await r.text();
		console.log(text);
		func(text);
	    } else {
		console.log("Error: " + r.status);
		alert("Error: " + r.status);
	    }
	};

	DOT.button_on();
	DOT.alert('clear');
	var acc; DOT.dom("WalletID").querySelectorAll("INPUT").forEach(function(x){ if(x.checked) acc=x.value; });
	if(acc == 'false'|| acc=='') {
	    DOT.alert('Please select account');
	    return false;
	}
	DOT.cx.acc=cx.acc=acc;

	DOT.cx.id=1;
	DOT.cx.ajax_url=1;
	console.log('Account: '+DOT.h(acc)+"<br>Total: "+DOT.h(cx.total));
	DOT.alert('Account: '+DOT.h(acc)+"<br>Total: "+DOT.h(cx.total));
	
	DOT.all_submit();
    };

wallet_start=function(){
    console.log('find wallets');

    wallet_go=function(){
        console.log('wallet go');

	if(typeof(DOT)!='object') { console.log('No DOT'); return; }
	if(!DOT.dom('polkadot_work')) { console.log('No polkadot_work yet'); return setTimeout(function(){wallet_go()},200); }
	if(DOT.inited) return; DOT.inited=1;

        console.log('wallet go inited');

	DOT.store = 'woocommerce';
	DOT.path=DOT.mainjs=path;
	DOT.ajaxm = path+'/image/ajaxm.gif';
	DOT.health_url = path.replace(/\/wp\-content\/.+$/g,'')+'/wp-json/kalatori/v1/health';
	DOT.payment_url = path.replace(/\/wp\-content\/.+$/g,'')+'/wp-json/wc/store/v1/checkout?_locale=user&ajax=1';
	console.log('Health rest: '+DOT.health_url);

	// https://woocommerce.zymologia.fi/wp-content/plugins/polkadot-payments-woocommerce
	// https://woocommerce.zymologia.fi/wp-json/polkadot/v1/wss
	// cx.ajax_url = path;
        // if( DOT.dom('order-id') ) cx.order_id = 1*DOT.dom('order-id').value;
	DOT.cx = cx;

	var succ="wc-block-store-notice wc-block-components-notice-banner is-ok is-dismissible";
	var warn="wc-block-store-notice wc-block-components-notice-banner is-warning is-dismissible";
	var errr="wc-block-store-notice wc-block-components-notice-banner is-error is-dismissible";

	if(!DOT.dom('WalletID')) DOT.dom('polkadot_work').innerHTML=
// "<input type='button' onclick='ajax_checkout(this)' style='padding:40px;' value='T E S T'>"+
"<p>Select your DOT-account \
<span id='dotpay_wallet_finded'></span>\
<div id='WalletID_load' style='display:none'><img src='"+DOT.ajaxm+"'> <font color='green'>loading...</font></div>\
<div style='padding-left:30px;' id='WalletID'>\
    <label style='display:block;text-align:left;'><input style='margin-right: 5px;' name='dot_addr' type='radio' value='QR'>QR-code</label>\
    <div><input type='button' value='Open my Wallets' onclick='dot_onselect()'></div>\
</div>\
</div>"
+"<div id='dotpay_info'></div>"
+"<div class='"+warn+"' style='display:none' id='dotpay_console'></div>"
;
	DOT.init();
	DOT.Talert('clear');
    };

    if(typeof(DOT)=='object') wallet_go();
    else {
      if( !DOTloaded ) {
	DOTloaded = 1;
        var s=document.createElement('script');
	s.type='text/javascript';
	s.src=path+'DOT.js';
	    if(path.indexOf('https://woocommerce.zymologia.fi')===0) s.src+='?random='+Math.random(); // MY OWN DEBUG
	s.onerror=function(e){ alert('DOT plugin: script not found: '+e.src) };
	s.onload=wallet_go;
	document.getElementsByTagName('head').item(0).appendChild(s);
      }
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
	    { className: 'is_error', src: path+'/image/ajaxm.gif' }, // DOT.ajaxm пока не существует
	    null
	)
    );
};

const Label = props => {
	const { PaymentMethodLabel } = props.components;
	return React.createElement(PaymentMethodLabel, { text: label });
};

const canMakePayment = (args) => {
// debugger;
    // alert('args: ' + JSON.stringify( args )); // args
    // сохраним наши рабочие аргументы
    my_args = JSON.stringify(args);

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
      icons: null, // ??? ['https://assets.polkadot.network/brand/Polkadot_Logo/Horizontal/SVG/Transparent/Polkadot_Logo_Horizontal_Pink-White.svg'],
      canMakePayment: canMakePayment,
      ariaLabel: label
};
wc.wcBlocksRegistry.registerPaymentMethod( PolkadotPaymentMethod );


}());

