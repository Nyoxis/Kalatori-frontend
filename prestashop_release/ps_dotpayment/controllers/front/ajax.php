<?php
/**
 * @since 1.5.0
 *
 * @property Ps_Dotpayment $module
 */
class Ps_DotpaymentAjaxModuleFrontController extends ModuleFrontController
{
    public $ssl = true;


    /**
     * @see FrontController::postProcess()
     */
  public function postProcess() {

    $cart = $this->context->cart;
    $total = (float) ($cart->getOrderTotal(true, Cart::BOTH));
    $currency = $this->context->currency->iso_code;

    $json = array(
	// 'currency' => $currency,
	'order_id' => (int) $cart->id,
	'price' => $total
    );

    // Defaults
    $url = Configuration::get('DOT_URL'); if(empty($url)) $url='http://localhost:16726';
    $name = Configuration::get('DOT_NAME'); if(empty($name)) $name='PrestaShop';
    $url.="/order/".urlencode($name).'_'.$json['order_id']."/price/".$json['price'];

    if ($cart->id_customer == 0 || $cart->id_address_delivery == 0 || $cart->id_address_invoice == 0 || !$this->module->active) {
	$json['redirect'] = $this->context->link->getPageLink('order', true, null, 'step=1'); // '/index.php?controller=order&step=1';
	$this->jdie($json);
    }

    // Check that this payment option is still available in case the customer changed his address just before the end of the checkout process
    $authorized = false;
    foreach (Module::getPaymentModules() as $module) {
        if ($module['name'] == 'ps_dotpayment') { $authorized = true; break; }
    } if (!$authorized) {
        $this->ejdie($this->module->getTranslator()->trans('This payment method is not available.', [], 'Modules.Dotpayment.Shop'));
    }

    $customer = new Customer($cart->id_customer);
    if (!Validate::isLoadedObject($customer)) {
	$json['redirect'] = $this->context->link->getPageLink('order', true, null, 'step=1'); // '/index.php?controller=order&step=1';
	$this->jdie($json);
    }

    $currency = $this->context->currency;
    $total = (float) $cart->getOrderTotal(true, Cart::BOTH);
    $mailVars = [ '{dot_daemon}' => Configuration::get('DOT_DAEMON') ];

    // $this->ejdie( $this->context->link->getModuleLink($this->module->name, 'validation', [], true) );

    // A J A X
    $r = $this->ajax($json,$url);
    if(isset($r['error'])) $this->jdie($r);



    // Йобаные патчи для kalatori
    if(isset($r['order'])) $r['order_id']=$r['order'];
    if(isset($r['price'])) $r['price']=1*$r['price'];
    if(isset($r['result'])) {
        if($r['result']=='waiting') $r['result']='Waiting';
        if($r['result']=='paid') $r['result']='Paid';
    }
    $r['order_id']=preg_replace("/^.*\_/s",'',$r['order_id']);
    if( isset($r['mul']) && $r['mul'] < 20 ) $r['mul']=pow(10, $r['mul']);

    foreach($r as $n=>$l) $json['daemon_'.$n]=$l;
    if(0
        //    !isset($r['order_id']) || $r['order_id'] != $json['order_id']
        // || !isset($r['price'])   || 1*$r['price']   != 1*$json['price']
    ) {
            $json['error'] = 'response';
            $json['error_message'] = 'error price or order_id in daemon responce: '
                ."price: (".(1*$r['price']).")(".(1*$json['price']).")"
                ."order_id: (".($r['order_id']).")(".($json['order_id']).")"
                ."json: [".print_r($json,1)."]";
            $this->jdie($json);
    }

    // Log
    $this->logs(date("Y-m-d H:i:s")." [".$r['result']."] order:".$json['order_id']." price:".$json['price']." ".$r['pay_account']);

    // Success ?
    if(isset($r['result']) && $r['result']=='Paid') {
	// paid success

	// SUCCESS
	$this->module->validateOrder(
	    (int) $cart->id,
	    (int) Configuration::get('PS_OS_PAYMENT'),
	    $total,
	    $this->module->displayName,
	    null,
	    $mailVars,
	    (int) $currency->id,
	    false,
	    $customer->secure_key
	);
        $json['redirect'] = $this->context->link->getModuleLink($this->module->name, 'validation', [], true);
	$this->jdie($json);
    }

    $this->jdie($json);
  }


  function ejdie($s) {
    $this->jdie(array('error'=>1,'error_message'=>$s));
  }

  function jdie($j) {
    die(json_encode($j));
  }

  function ajax($json,$url) {
    if(gettype($json)=='string') $json=json_decode($json);
    if(empty($json)) return array( 'error' => 'json', 'error_message' => 'Wrong INPUT' );

    $ch = curl_init( );
    curl_setopt_array($ch, array(
	// CURLOPT_POSTFIELDS => json_encode($json,JSON_UNESCAPED_UNICODE),
        CURLOPT_HTTPHEADER => array('Content-Type:application/json'),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FAILONERROR => true,
        CURLOPT_CONNECTTIMEOUT => 2, // only spend 3 seconds trying to connect
        CURLOPT_TIMEOUT => 2, // 30 sec waiting for answer
        CURLOPT_URL => $url
    ));
    $result = curl_exec($ch);

    if (curl_errno($ch) || empty($result)) return array( 'error' => 'connect', 'error_message' => curl_error($ch), 'url' => $url );
    $array = json_decode($result);
    if(empty($array)) return array( 'error' => 'json', 'error_message' => 'Wrong json format', 'url' => $url );
    curl_close($ch);
    return (array) $array;
  }


  function logs($s='') {
    // $f = DIR_LOGS . "polkadot_log.log";
//    $f='/home/presta/log/payments.log';
//    $l=fopen($f,'a+');
//    fputs($l,$s."\n");
//    fclose($l);
//    chmod($f,0666);
  }

}
