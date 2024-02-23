DOT={

debug: 0, // ТОЛЬКО ДЛЯ ОТЛАДКИ! ПОТОМ УБРАТЬ!



daemon: { // тут будет инфо, пришедшая от демона
    currency_name: 'DOT',
},

chain: { // тут будет инфо, запрошенное от блокчейна
    ss58Format: 0,
    amountAdd: 1.02*10000000000,
//    tokenDecimals: 10,
    mul: 10000000000,
//    tokenSymbol: "DOT",
//    existentialDeposit: 1*10000000000,
//    partialFee: 0.02*10000000000,
},

cx: {}, // а тут инфо от магазина

opencart3_run: function(path) {
    DOT.store = 'opencart3';

    DOT.button_on=function(){ $('#button-confirm').button('reset'); };
    DOT.button_off=function(){ $('#button-confirm').button('loading'); };

    DOT.path=DOT.mainjs=path;
    DOT.ajaxm = DOT.mainjs+'../../theme/default/image/polkadot/ajaxm.gif';

    DOT.init();
    DOT.Talert('clear');
    DOT.button_on();
//    DOT.progress.stop();
//    DOT.progress.run(0, function(){ DOT.Talert('Error: timeout'); setTimeout(DOT.progress.stop,800); });
    Array.from(DOT.dom('form-polkadot').elements).forEach((e) => { const { name,value } = e; DOT.cx[name]=value; });
    // DOT.daemon_info();
},

opencart3_submit: function() {
    Array.from(DOT.dom('form-polkadot').elements).forEach((e) => { const { name,value } = e; DOT.cx[name]=value; });
    DOT.dom("WalletID").querySelectorAll("INPUT").forEach(function(x){ if(x.checked) DOT.cx.acc=x.value; });
    if(DOT.cx.acc == 'false'|| !DOT.cx.acc || DOT.cx.acc=='') {
	DOT.alert('Please select account');
	return false;
    }
    return DOT.all_submit();
},


// ==========================================

presta_start: function(e) {
    e=e.closest("DIV.payment-options");
    if(!e) return alert('design error 01');
    e=e.querySelector("INPUT[name='payment-option']"); // .click(); // [id*='payment-option-']
    if(!e) return alert('design error 02');
    e.style.border='10px solid red';
    e.click();
},

presta_init: function(cx) {
    // запускается во время общей загрузки страницы, но выбор плагина DOT еще не сделан!
    DOT.store = 'presta';
    if(!cx.ajax_url) {
	cx.ajax_url=cx.ajax_host;
	// cx.ajax_url=cx.wpath.replace(/\/views$/g,'/')+'ajax.php';
    }
    DOT.cx=cx;
    DOT.path = cx.wpath;
    DOT.mainjs = cx.wpath+'/js/';
    DOT.ajaxm = cx.wpath+'/img/ajaxm.gif';

    // определяем процедуру включения основной платежной кнопки
    DOT.button_on=function(){
        document.querySelectorAll("BUTTON[type='submit'].disabled").forEach(function(e){
	    e.classList.remove("disabled");
	    e.disabled=null;
	    // e.style.border='1px dashed red';
	});
    };

    // перехатываем только нашу FORM.onsubmit
    var e=document.querySelector('FORM[action*="'+cx.module_name+'"]');
    if(!e) return DOT.alert("DOT plugin: Design error!");
    e.onsubmit=function(x) {
	DOT.button_on();
	DOT.alert('clear');
	var acc; DOT.dom("WalletID").querySelectorAll("INPUT").forEach(function(x){ if(x.checked) acc=x.value; });
	if(acc == 'false'|| acc=='') {
	    DOT.alert('Please select account');
	    return false;
	}
	DOT.cx.acc=cx.acc=acc;
	DOT.alert('Account: '+DOT.h(acc)+"<br>Total: "+DOT.h(cx.total)+"<br>id: "+DOT.h(cx.id));  // +"<br>shop_id: "+DOT.h(cx.shop_id)+"<br>products: "+DOT.h(cx.products)
	return DOT.all_submit();
    };

/*
    // debug option
    if(DOT.debug) { // да блять согласен - поставить checkbox (ТОЛЬКО ДЛЯ ОТЛАДКИ!!!)
      document.querySelectorAll("INPUT[type='checkbox'][name*='conditions_to_approve']").forEach(function(e){
        e.parentNode.style.border='1px dotted red';
        e.setAttribute('checked',true);
      });
    }
*/

    // 1. навешиваем на каждый выбор платежной опции запоминание этой опции
    //    с функцией старта наших процедур, если выбран наш плагин
    document.querySelectorAll('DIV[id^="payment-option-"]').forEach(function(q){
        if(q.id.indexOf('-container')<0) return;
        q.onclick=function(e) { var x=this;
            if(x.tagName!='DIV'||x.id.indexOf('-container')<0) x=x.closest('DIV[id^="payment-option-"]'); if(!x) return;
            DOT.f_save('pay_select',x.id);
	    // а не наш ли это был выбран плагин?
	    if(x.querySelectorAll("IMG[src*='polkadot.png']").length) { // да, наш!
		DOT.init();
	    }
        };
    });

    // 2. смотрим, какую платежную опцию выбирали в этом магазине прежде, делаем автовыбор
    var ps = DOT.f_read("pay_select");
    if(!ps) ps=''; else ps=''+ps;
    var p=document.getElementById(ps);
    if(p) { // если такая опция была, то сразу кликнуть нужный способ оплаты
	p=p.querySelector("INPUT#"+ps.replace(/\-container/g,''));
	if(p.focus) p.focus(); if(p.click) p.click();
    } else { // если опции не нашлось на странице
	// то какой-то вообще элемент выбран?
      document.querySelectorAll('DIV[id^="payment-option-"]').forEach(function(q){
        if(q.id.indexOf('-container')<0) return;
	if(q.querySelectorAll("IMG[src*='polkadot.png']").length) { // если это наш, кликнуть
	    var inp = q.querySelector("INPUT[name='payment-option'");
	    if(inp && inp.checked) setTimeout(function(e){ q.click(); },100); // и если он выбран
	}
      });
    }
},

//====================================================================================================

    path: false,
    mainjs: false,
    // wss: '', // 'wss://node-shave.zymologia.fi',
    // mul: 0, // 1000000000000,
    button_on: function(){},
    button_off: function(){},

    h: function(s){
        return (''+s).replace(/\&/g,'&'+'amp;').replace(/\</g,'&'+'lt;').replace(/\>/g,'&'+'gt;').replace(/\'/g,'&'+'#039;').replace(/\"/g,'&'+'#034;'); // '
    },

    dom: function(e) { return (typeof(e)=='object' ? e : document.getElementById(e) ); },

    'alert': function(s){
	var w=DOT.dom('dotpay_console');
	if(!w) alert('no w: '+s);
	if(s=='clear') w.innerHTML='';
	else w.innerHTML+=s+'<br>';
    },

    Ealert: function(s){
	DOT.Talert(s);
    },

    Talert: function(s){
	console.log(s);
	var w=DOT.dom('dotpay_console_test');
	if(!w) { DOT.alert("<div class='alert Xalert-danger' id='dotpay_console_test'></div>"); w=DOT.dom('dotpay_console_test'); }
	if(!w) return alert('Dot Payment error: '+s );

	if(s=='clear') w.innerHTML=''; else w.innerHTML+=s+'<br>';
	w.style.display=(w.innerHTML==''?'none':'block');
    },

    f_save: function(k,v){ try { return window.localStorage.setItem(k,v); } catch(e) { return ''; } },
    f_read: function(k){ try { return window.localStorage.getItem(k); } catch(e) { return ''; }},
    f_del: function(k){ try { return window.localStorage.removeItem(k); } catch(e) { return ''; }},

// ============== presta ==============
    cx: {},

// daemon_info: function() { return; },

daemon_get_info: async function() {
    if(!DOT.total()) return;
    if(!DOT.cx.ajax_url) return alert('DOT plugin error 10802: empty cx.ajax_url');
    const data = // JSON.stringify({ order_id: DOT.cx.id, price: DOT.cx.total });
	JSON.stringify({ order_id: 0, price: 0 });

    DOT.AJAX(
	DOT.cx.ajax_url,
	{
	    async: false,
	    callback: async function(s) {
		// var json=DOT.ajax_process_errors(s); if(!json) return;
		// for(var n in json) { if(n.substring(0,7)=='daemon_') { DOT.daemon[n.substring(7)]=json[n]; } }

		try { var json=JSON.parse(s); } catch(e) {
		    DOT.alert("Json error: ["+DOT.h(s0)+"]");
		    return false;
		}

		// alert(JSON.stringify(json));

		if(json.daemon_wss) DOT.daemon.wss=json.daemon_wss;
		else if(json.wss) DOT.daemon.wss=json.wss;
		else {
		    alert("Error connect to daemon");
		    DOT.alert("Error connect to daemon");
		    return false;
		}
		if(json.daemon_mul) DOT.daemon.mul=json.daemon_mul;
		else if(json.mul) DOT.daemon.mul=json.mul;

		    // пытаемся получить
		    await DOT.connect();
		    const cp = await DOT.api.rpc.system.properties();
		    // ss58Format
		    if(cp.ss58Format || cp.ss58Format===0) DOT.chain.ss58Format=cp.ss58Format;
		    // mul
		    if(cp.tokenDecimals) {
			DOT.chain.tokenDecimals=parseInt(cp.tokenDecimals.toHuman()[0]);
			if(DOT.chain.tokenDecimals) DOT.chain.mul=Math.pow(10, DOT.chain.tokenDecimals);
		    } if(!DOT.chain.mul) DOT.chain.mul=DOT.daemon.mul;
		    // имя блокчейна "DOT"
		    if(cp.tokenSymbol) DOT.chain.tokenSymbol = cp.tokenSymbol.toHuman()[0];
		    // цена транзакции
		    const existentialDeposit = await DOT.api.consts.balances.existentialDeposit;
		    DOT.chain.existentialDeposit = parseInt(existentialDeposit);
		    if(!DOT.chain.existentialDeposit) DOT.chain.existentialDeposit=1*DOT.chain.mul;
		    // цена транзакции
		    const addr = "0x80723effd95bfea4c175a1ceed58e4b4b6bd2609a709e22d8d7a415ce263863f";
		    const { partialFee } = await DOT.api.tx.balances.transferKeepAlive(addr, 30*DOT.chain.mul).paymentInfo(addr);
		    DOT.chain.partialFee = parseInt(partialFee);
		    if(!DOT.chain.partialFee) DOT.chain.partialFee=0.02*DOT.chain.mul;
		    // на сколько должна превышать сумма
		    DOT.chain.amountAdd = DOT.chain.partialFee + DOT.chain.existentialDeposit;

		    // alert('chain: '+JSON.stringify(DOT.chain)); return;

		DOT.amount=DOT.cx.total * DOT.chain.mul;
		DOT.amount_human=Math.floor(DOT.amount/DOT.chain.mul*10000)/10000+' '+DOT.chain.tokenSymbol; // DOT.daemon.currency_name;

		DOT.dom('dotpay_info').innerHTML=
		    "Amount: "+DOT.indot( DOT.cx.total*DOT.chain.mul + DOT.chain.partialFee)
		    +"<br>Covers price of kit(s), transaction fee and deposit in your Polkadot account"
		    +"<br>&nbsp;";

		// DOT.dom('dotpay_info').setAttribute('title','ssssssssssss');
		// DOT.dom('dotpay_info').setAttribute('alt','ssssssssssss');

/*
		    "Amount: "+DOT.indot( DOT.cx.total*DOT.chain.mul + DOT.chain.partialFee, 'planks')
		    +"<br>Minimum balance: "+DOT.indot( DOT.cx.total*DOT.chain.mul + DOT.chain.partialFee + DOT.chain.existentialDeposit, 'planks')
		    +"<br>"+DOT.indot(DOT.cx.total*DOT.chain.mul)+" * 10<sup>"+DOT.chain.tokenDecimals+"</sup> + "+DOT.chain.partialFee+" fee"
		    +" and "+DOT.indot(DOT.chain.existentialDeposit)+" on deposit";
*/
	    }
	},
	data
    );
},

indot: function(x,planks) { return (Math.floor( parseInt(x)/DOT.chain.mul*10000 ) /10000) + " "+DOT.chain.tokenSymbol+(planks?" ("+x+" planks)":''); },

ajax_process_errors: function(s0) {

	    var s=''+s0; s=s.replace(/^\s+/g,'').replace(/\s+$/g,'');

	    var w=s.split('{'); // }
	    if(w.length>1 && w[0]!='') {
		DOT.Talert("PHP WARNING: "+DOT.h(w[0]));
		s=s.substring(w[0].length);
	    }

	    try { var json=JSON.parse(s); } catch(e) {
		DOT.alert("Json error: ["+DOT.h(s0)+"]");
		return false;
	    }

	    if (json.error) { alert('error: '+JSON.stringify(json) );
                if(json.error.warning) DOT.alert('warning: '+json.error.warning);

                if(typeof(json['error'])=='object') {
                    for (i in json.error) DOT.Ealert('error: '+i+' = '+json.error[i]);
                } else {
		    // alert('error: '+json.error +(json.error_message ? ' '+json.error_message : '') );
                    DOT.Ealert('error: '+json.error +(json.error_message ? ' '+json.error_message : '') );
                }
		return false;
            }

            if( json.redirect ) { window.location = json.redirect; return false; }
	    return json;
},


total: function() {
    var total=1*((''+DOT.cx.total).replace(/^.*?([0-9\.]+).*?$/g,'$1'));
    if(!total) alert('DOT plugin error 10802 total: ['+DOT.h(DOT.cx.total)+']');
    else DOT.cx.total=''+total;
    return total;
},

all_submit: function() {
    if(!DOT.total()) return;
    // if(cx) DOT.cx=cx; else
    var cx=DOT.cx;
    DOT.alert('clear');
    DOT.button_off();

    if(!cx.id && cx.order_id) cx.id=DOT.cx.id=cx.order_id;
    if(!cx.id) return alert('DOT plugin error 0800: empty cx.id');
    if(!cx.total) return alert('DOT plugin error 0801: empty cx.total');
    if(!cx.ajax_url) return alert('DOT plugin error 0802: empty cx.ajax_url');

    var data = JSON.stringify({ order_id: cx.id, price: cx.total });
    DOT.AJAX(
	cx.ajax_url,
	async function(s) {
	    var json=DOT.ajax_process_errors(s); if(!json) return DOT.button_on();

            if( json.daemon_result == 'Waiting' && json.daemon_pay_account && 1*json.price
	    ) {
                json.my_account = cx.acc;
		json.pay_account = json.daemon_pay_account;
		if(!DOT.accounts || !DOT.accounts.length ) {
		    DOT.alert("You have no wallets extentions. Please sent transaction manually to address: "+json.pay_account);
		    DOT.button_on();
		} else {
		    if(DOT.paidflag) {
		        DOT.Talert('Ready! Waiting for daemon...');
		        // DOT.Talert('cx: '+JSON.stringify(cx));
		        // DOT.Talert('json: '+JSON.stringify(json));
			setTimeout(DOT.all_submit,800);
		        return;
		    }
		    DOT.pay(json);
		}
	    } else {
		var s='';
		for(var i in json) s+=i+' = ['+json[i]+"]\n";
		DOT.alert('ERROR OPT:\n\n '+s);
		DOT.button_on();
	    }
	    // =================
	},
	data
    );
    return false;
  },


progress: {
    total: 30000,
    now: 0,
    timeout: 100,
    id: 0,
    fn: function(){},
    run: function(x, fn) {
	    if(x===0) { DOT.progress.now=0; DOT.progress.fn=function(){}; }
	    if(fn) DOT.progress.fn=fn;

    if(DOT.dom('dotpay_progress_info')) DOT.dom('dotpay_progress_info').innerHTML=1*DOT.progress.now+' '+1*DOT.progress.timeout;

	    if(x!=undefined && !DOT.progress.id) {
		DOT.progress.id=setInterval(DOT.progress.run,DOT.progress.timeout);
	    }

	    DOT.progress.now += DOT.progress.timeout;

	    if(DOT.progress.now >= DOT.progress.total) {
		    clearInterval(DOT.progress.id);
		    return DOT.progress.fn();
	    }

	    var prc=(Math.floor(100*DOT.progress.now/DOT.progress.total));

	    // if(prc > 10) return DOT.progress.stop;

	    if(!DOT.dom('dotpay_progress')) {
		var d = document.createElement("div");
		d.id = 'dotpay_progress';
		d.style.position = 'fixed';
		d.style.left = '0px';
		d.style.bottom = '0px';
		d.style.padding = '0px 2px 1px 2px';
		d.style.width = '100%';
		d.style.height = '20px';
		document.body.appendChild(d);
	    }

	    DOT.dom('dotpay_progress').innerHTML=
		"<div style='text-align: -moz-right;width:100%;height:100%;border:1px solid #666;background:linear-gradient(to right, green 0%, red 100%);'>"
		    +"<div style='height:100%;position:relative;width:"+(100-prc)+"%;background-color:white;'>"
			+"<div style='height:100%;padding:0;margin:0;position:absolute;left:5px;top:-2px;font-size:11px;color:black;'>"+(prc)+"%</div>"
		    +"</div>"
		+"</div>";
    },
    stop: function() {
	clearInterval(DOT.progress.id);
	var q=DOT.dom('dotpay_progress'); if(q) document.body.removeChild(q);
    },
},

AJAX: function(url,opt,s) {
  if(!opt) opt={}; else if(typeof(opt)=='function') opt={callback:opt};
  var async=(opt.async!==undefined?opt.async:true);
  try{
    if(!async && !opt.callback) opt.callback=function(){};
    var xhr=new XMLHttpRequest();

    xhr.onreadystatechange=function(){
//    try{
      if(this.readyState==4) {
        if(this.status==200 && this.responseText!=null) {
            if(this.callback) this.callback(this.responseText,url,s);
            // else eval(this.responseText);
        } else if(this.status==500) {
            if(this.onerror) this.onerror(this.responseText,url,s);
            else if(opt.callback) opt.callback(false,url,s);
        }
      }
//     } catch(e){ DOT.alert('Error Ajax: '+DOT.h(this.responseText)); }
    };

    for(var i in opt) xhr[i]=opt[i];

    if(opt.error) xhr.onerror=opt.error;
    if(opt.timeout) xhr.timeout=opt.timeout;
    if(opt.ontimeout) xhr.ontimeout=opt.ontimeout;

    xhr.open((opt.method?opt.method:(s?'POST':'GET')),url,async);

    if(s) {
        if(typeof(s)=='object' && !(s instanceof FormData) ) {
          var formData = new FormData();
          for(var i in s) formData.append(i,s[i]);
          var k=0; Array.from(formData.entries(),([key,D])=>(k+=(typeof(D)==='string'?D.length:D.size)));
          xhr.send(formData);
        } else xhr.send(s);
    } else xhr.send();

    if(!async) return ( (xhr.status == 200 && xhr.readyState == 4)?xhr.responseText:false );

  } catch(e) { if(!async) return false; }
},


    payWithPolkadot: async function(json,SENDER, price, destination, wss) {
	await DOT.connect();

        var e = await DOT.api.query.system.account( destination );
	DOT.Talert('Start balance = '+ e.data.free );

	const injector = await polkadotExtensionDapp.web3FromAddress(SENDER);

	// var transfer = 'transfer';
	var transfer = 'transferKeepAlive';
	if(!DOT.api.tx.balances[transfer]) return alert("Chain error: not found api.tx.balances."+transfer);

	// if(!DOT.api.tx.balances[transfer]) transfer='transferKeepAlive';
	// if(!DOT.api.tx.balances[transfer]) for(var l in DOT.api.tx.balances) { if(l.indexOf('transferAllo')==0) transfer=l; }

	const transferExtrinsic = DOT.api.tx.balances[transfer](destination, price);
	transferExtrinsic.signAndSend(SENDER, { signer: injector.signer }, ({ status }) => {
            if(!DOT.progress.id) DOT.progress.run(0,
		    function(){
			DOT.alert('Error: timeout');
			setTimeout(DOT.progress.stop,800);
		    }); // start progressbar
	    DOT.Talert('status='+status.type);
	    if (status.isInBlock || status.type == 'InBlock') {
		DOT.Talert(`status:isInBlock Completed at block hash #${status.asInBlock.toString()}`);
	        DOT.api.query.system.account( destination ).then((e) => { DOT.Talert('balance isInBlock = '+ e.data.free ); });
	    } else if (status.isFinalized || status.type == 'Finalized') {
		DOT.Talert('status:Finalized');
		return DOT.payment_done( destination );
	    } else {
		DOT.Talert(`status: ${status.type}`);
	    }
	}).catch((error) => {
            DOT.progress.stop(); // stop progressbar
	    DOT.Talert('transaction failed'+error);
	    DOT.Ealert(error);
	    DOT.disconnect();
	    DOT.button_on();
        });
    },



    payment_done: async function( destination ) {

	DOT.Talert('payment_done!');
	var e = await DOT.api.query.system.account( destination );
	DOT.Talert('Ending balance = '+ e.data.free );

	if(1*e.data.free == 0) {
	    DOT.progress.stop();
	    DOT.button_on();
	    DOT.Talert('Transfer error');
	    alert('Transfer error');
	    return;
	}

	// DOT.api.query.system.account( destination ).then((e) => { DOT.Talert('balance Finalized = '+ e.data.free ); });

	// типа пришло
	var k=0;
	var sin = setInterval(async function(){
	    var e = await DOT.api.query.system.account( destination );
	    DOT.Talert('...balance now: '+ e.data.free );
	    if(++k > 10) { clearInterval(sin); DOT.Talert('...stop'); }
	},1000);
		// return;

	// DOT.progress.stop();
	// DOT.disconnect();
	DOT.Talert('Do submit...');
	DOT.paidflag = 1;
	DOT.all_submit();
    },

    pay: async function(json) {
	if(json.my_account == 'QR') {


	    DOT.alert("Transfer <b>"+DOT.indot( DOT.amount, 'planks' )+"</b> manualy to:"
		+"<div style='padding:10px 0 10px 0;font-weight:bold;font-size:1.1em'><a onclick='DOT.cpbuf(this.innerHTML); return false;'>"+DOT.id2west(json.pay_account)+"</a>"
		+"<div style='font-size:8px;'>"+json.pay_account+"</div>"
		+"<div>Balance: <span class='my_dot_balance'><img src='"+DOT.ajaxm+"'></span></div>"
		+"</div>"
		// +"<br>Order id: "+json.order_id
		+"and press button again"
	    );

	    await DOT.connect();
	    var x = await DOT.api.query.system.account( json.pay_account );
	    document.querySelectorAll('.my_dot_balance').forEach((e)=>{e.innerHTML=DOT.indot( x.data.free,'planks')});

	    DOT.button_on();

	    // eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
	    return;
	}
	DOT.alert("Transfer <b>"+DOT.indot( 1*DOT.amount, 'planks' )+"</b> to:"
		+"<div style='font-weight:bold;'><a onclick='DOT.cpbuf(this.innerHTML); return false;'>"+DOT.id2west(json.pay_account)+"</a></div>"
		+"<div style='font-size:8px;'>"+json.pay_account+"</div>"
		+"<br>Order id: "+json.order_id);
	DOT.payWithPolkadot(json, json.my_account, DOT.amount, json.pay_account);
    },

    et: 0,

    init: async function() { // x = path

	// load JS - первая необходимая часть для кошельков, остальное загрузим позже для ускорения
	await DOT.LOADS_promice([
	 DOT.mainjs+'bundle-polkadot-util.js',
	 DOT.mainjs+'bundle-polkadot-util-crypto.js',
	 DOT.mainjs+'bundle-polkadot-extension-dapp.js',

         DOT.mainjs+'bundle-polkadot-types.js',
         DOT.mainjs+'bundle-polkadot-api.js',
	 DOT.mainjs+'bundle-polkadot-keyring.js', // west
	 DOT.mainjs+'identicon.js'
	],1);

	DOT.daemon_get_info();

     try {
	// connect Wallets
        var wallets=await polkadotExtensionDapp.web3Enable('dotpay');
	DOT.wallets=wallets;

	var r={'manual':[
		"<label style='display:flex;text-align:left;' balanced='1'><input style='margin-right: 5px;' name='dot_addr' type='radio' value='QR'>Manual</label>",
	]};
        if( !wallets.length ) {
	    if(!DOT.et) DOT.alert("<b>Wallet not found</b>"
		    +"<br>You can use Wallet extention "
		    +(this.navigator()=='firefox'
			? "<a href='https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/'>polkadot{.js} for Firefox</a>"
			: (this.navigator()=='chrome'
			    ? "<a href='https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd'>polkadot{.js} for Chrome</a>"
			    : "<a href='https://github.com/polkadot-js/extension'>polkadot{.js}</a>"
			  )
		    )
		    +" or <a href='https://www.subwallet.app/'>Subwallet</a>"
		    +"<br>Also you can make DOT-payment manually using QR-code"
	    );
	} else {
	    var accounts = await polkadotExtensionDapp.web3Accounts({ss58Format:DOT.chain.ss58Format}); // 0
		// Kusama   == 2 CxDDSH8gS7jecsxaRL9Txf8H5kqesLXAEAEgp76Yz632J9M keyring.setSS58Format(2); console.log('Kusama', pair.address);
		// Polkadot == 0 1NthTCKurNHLW52mMa6iA8Gz7UFYW5UnM3yTSpVdGu4Th7h keyring.setSS58Format(0); console.log('Polkadot', pair.address);
	    DOT.accounts=accounts;
	    var deff = DOT.f_read('WalletID');
	    for(var l of accounts) {
		    var wal = l.meta.source.replace(/\-js$/,'');
		    if(!r[wal]) r[wal]=[];
		    r[wal].push("<label style='display:block;text-align:left;'>"
		  +"<div class='identicon' style='display:inline-block; width:42px;height:42px;margin-right:8px;'></div>"
		  +"&nbsp;<div style='display:inline-block'>"
		     +"<input name='dot_addr' type='radio' value='"+DOT.h(l.address)+"'"
		     +(deff == l.address ? ' checked' : '')
		     +">&nbsp;&nbsp;<span style='font-weight:bold' title='"+DOT.h(l.address)+"'>"+DOT.h(l.meta.name)+"</span>"
		     +"<div class='balance'>"+DOT.h(l.address)+"</div>"
		  +"</div>"
		  +"</label>");
	    }
	}

        var op=''; for(var wal in r) {
	    op += (wal==''? r[wal].join('') : "<div style='margin-left:10%;'>"+DOT.h(wal)+"</div>" + r[wal].join('') );
	}
	DOT.dom('WalletID').innerHTML=op; // +(k!=1?'': "<div>Loading wallets <img src='"+DOT.ajaxm+"'></div>");

	// Onchang -: save to LocalStorage
	DOT.dom('WalletID').querySelectorAll("INPUT").forEach(function(ee){ ee.onchange=DOT.save_addr; });
	DOT.dom('dotpay_wallet_finded').innerHTML="<br>Amount: "+DOT.amount_human
	    +"<br>found "+accounts.length+" accounts"+ (wallets.length > 1 ? " in "+wallets.length+" wallets":"");

	// вот теперь подгрузим остальные скрипты
//	await DOT.LOADS_promice([
//	 DOT.mainjs+'bundle-polkadot-keyring.js', // west
//       DOT.mainjs+'bundle-polkadot-types.js',
//	 DOT.mainjs+'identicon.js'
//	],1);

	DOT.identicon_init();

     } catch(ee) {
	    if(!DOT.et) { DOT.et=0; }
	    if(++DOT.et < 60) setTimeout(DOT.init,1000); // setTimeout(wallet_start,1000);
     }

    },

    navigator: function(){ // get Browser' name
        var ua=navigator.userAgent, tem;
        var M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if(/trident/i.test(M[1])){
	    tem= /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE '+(tem[1] || '');
	}
        if(M[1]==='Chrome'){
	    tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
    	    if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
	}
	M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
	if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
	return M[0].toLowerCase();
    },

    save_addr: function(x) { DOT.f_save('WalletID',this.value); },

    getBalance: async function(west,e) {
	e.innerHTML="<img src='"+DOT.ajaxm+"'>";
	return DOT.api.query.system.account( DOT.west2id(west) ).then((l) => {
	    var bal = 1* l.data.free;
	    e.innerHTML=Math.floor(bal/DOT.chain.mul*10000)/10000+' '+DOT.chain.tokenSymbol; // DOT.daemon.currency_name;
	    var w=e.closest('LABEL');
	    w.setAttribute('balanced',1);

	    if(bal < (DOT.cx.total*DOT.chain.mul + DOT.chain.amountAdd) ) {
		w.style.opacity='0.5';
		w.querySelector('INPUT').disabled=true;
	    }

	    // выяснить, один ли вообще кошелек, и тогда его сразу и выделить, шоб юзеру не кликать самому
	    var k=0, ready=false;
	    DOT.dom('WalletID').querySelectorAll('LABEL').forEach(function(p){
		if( !p.getAttribute('balanced') ) {
		    k=-99999999999; // есть непроверенный баланс
		} else {
		    var x = p.querySelector('INPUT');
		    if( !(x.disabled) ) { // если проверен баланс и он годится
			k++; ready=x;
		    }
		}
	    }); if(k==1 || k==2) { // manual or 1 wallet only
		    ready.click(); // если все балансы проверены и он единственный, то выделить его
		}
	});
    },

    west2id: function(west){
	return polkadotUtil.u8aToHex(polkadotKeyring.decodeAddress(west));
    },

    id2west: function(id){
	return polkadotKeyring.encodeAddress(id,DOT.chain.ss58Format);
    },

    disconnect: async function() {
	if(!DOT.api) return;
	await DOT.api.disconnect();
	DOT.api=false;
    },

    connect: async function() {
	if(DOT.api) return DOT.api;
	if(!DOT.daemon.wss) {
	    return alert('no wss');
	}
	// соединяемся с блокчейном
	var wss = (''+DOT.daemon.wss).replace(/\:\d+$/g,'');
	var Prov = new polkadotApi.WsProvider(wss);
	DOT.api = await polkadotApi.ApiPromise.create({ provider: Prov });
    },

    identicon_init: async function() {
	await DOT.connect();
	DOT.dom('WalletID').querySelectorAll('LABEL').forEach(function(p){
	    //получить адрес
	    var adr=p.querySelector('SPAN'); if(!adr) return; adr=adr.getAttribute('title'); // adr.innerHTML;
	    var oh=p.offsetHeight; if(!oh) oh=42;
	    oh+='px';
	    var div=p.querySelector('.identicon');
	    div.style.width=oh;
	    div.style.height=oh;
	    div.innerHTML=identicon_render(adr,42);
//	    p.innerHTML="<div style='display:inline-block; width:"+oh+";height:"+oh+";margin-right:8px;'>"
//		+identicon_render(adr,42)
//		+"</div>&nbsp;<div style='display:inline-block'>"+p.innerHTML+"</div>";
	    p.querySelector('INPUT').onchange=DOT.save_addr;
	    DOT.getBalance(adr,p.querySelector('.balance'));
	});
    },

 LOADES: {},
 LOADS: function(u,f,err,sync) { if(typeof(u)=='string') u=[u];

        var randome='?random='+Math.random(); // DEBUG ONLY!

        var s;
        for(var i of u) { if(DOT.LOADES[i]) continue;
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
         s.onerror=( typeof(err)=='function' ? err : function(e){ alert('File not found: '+e.src); } );
         s.onload=function(e){ e=e.target;
	    DOT.LOADES[e.getAttribute('orign')]=1;
            var k=1; for(var i of u) {
		if(!DOT.LOADES[i]){ k=0; break; }
	    }
            if(k){ if(f) f(e.src); }
         };
         document.getElementsByTagName('head').item(0).appendChild(s);
        }
        if(!s) { if(f) f(1); }
 },

 LOADS_sync: function(u,f,err) { DOT.LOADS(u,f,err,1) },

 LOADS_promice: function(file,sync) {
        return new Promise(function(resolve, reject) { DOT.LOADS(file,resolve,reject,sync); });
 },

 cpbuf: function(e,message){ if(typeof(e)=='object') e=e.innerHTML;
    var area = document.createElement('textarea');
    document.body.appendChild(area);
    area.value = e;
    area.select();
    document.execCommand('copy');
    document.body.removeChild(area);
    // if(message)
    alert('Copy:<p><b>'+(DOT.h(e).replace(/\n/g,'<br>'))+'</b>');
 },

};
