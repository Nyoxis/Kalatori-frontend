<?php

/* Plugin name: Polkadot payments for WooCommerce
 * Plugin URI: https://woocommerce.zymologia.fi/Alzymologist/about.html
 * Description: Use Polkadot blokchain for direct payments
 * Author: Alzymologist OY
 * Author URI: https://zymologia.fi
 * Version: 1.0.1
*/

// Не открываем напрямую
if ( ! defined( 'ABSPATH' ) ) exit;


/*
 * Этот фильтр-хук позволяет зарегистрировать наш PHP-класс в качестве платёжного шлюза WooCommerce
 */
add_filter( 'woocommerce_payment_gateways', 'polkadot_register_gateway_class' );
function polkadot_register_gateway_class( $gateways ) {
    $gateways[] = 'WC_Polkadot_Gateway'; // название вашего класса, добавляем его в общий массив
    return $gateways;
}


/*
 * А дальше идёт сам класс, тоже обратите внимание, что он внутри хука plugins_loaded
 */

add_action( 'plugins_loaded', 'polkadot_gateway_class' );
function polkadot_gateway_class() {

    class WC_Polkadot_Gateway extends WC_Payment_Gateway {
	/**
	 * Это конструктор класса, о нём мы с вами ещё поговорим в 3-м шаге урока
	 */
	public function __construct() {

	    $this->id = 'polkadot'; // ID платёжного шлюза
	    $this->icon = 'https://lleo.me/fon1.jpg'; // URL иконки, которая будет отображаться на странице оформления заказа рядом с этим методом оплаты
	    $this->has_fields = true; // если нужна собственная форма ввода полей карты
	    $this->method_title = 'Polkadot payments';
	    $this->method_description = 'Polkadot direct payments'; // будет отображаться в админке

	    // платёжные плагины могут поддерживать подписки, сохранённые карты, возвраты
	    // но в пределах этого урока начнём с простых платежей, хотя в виде ниже будет чуть подробнее и о другом
	    $this->supports = array(
		'products'
	    );

	    // тут хранятся все поля настроек
	    $this->init_form_fields();

	    // инициализируем настройки
	    $this->init_settings();
	    // название шлюза
	    $this->title = $this->get_option( 'title' );
	    // описание
	    $this->description = $this->get_option( 'description' );
	    // включен или выключен
	    $this->enabled = $this->get_option( 'enabled' );
	    // работает в тестовом режиме (sandbox) или нет
	    $this->testmode = 'yes' === $this->get_option( 'testmode' );
	    // и естественно отдельные ключи для тестового и рабочего режима шлюза
	    $this->private_key = $this->testmode ? $this->get_option( 'test_private_key' ) : $this->get_option( 'private_key' );
	    $this->publishable_key = $this->testmode ? $this->get_option( 'test_publishable_key' ) : $this->get_option( 'publishable_key' );

	    // Хук для сохранения всех настроек, как видите, можно еще создать собственный метод process_admin_options() и закастомить всё
	    add_action( 'woocommerce_update_options_payment_gateways_' . $this->id, array( $this, 'process_admin_options' ) );

	    // Если будет генерировать токен из данных карты, то по-любому нужно будет подключать какой-то JS
	    add_action( 'wp_enqueue_scripts', array( $this, 'payment_scripts' ) );

	    // ну и хук тоже можете тут зарегистрировать
	    // add_action( 'woocommerce_api_{webhook name}', array( $this, 'polkadot_webhook' ) );
	}

	/**
	 * Админка wooCommerce: опции платёжного шлюза, тоже подробнее в 3-м шаге
	 */
	public function init_form_fields(){

		// + die('init_form_fields()');

	    $this->form_fields = array(

		'enabled' => array(
		    'title'       => 'On/Off',
		    'label'       => 'Turn on Polkadot payments',
		    'type'        => 'checkbox',
		    'description' => '',
		    'default'     => 'no'
		),

		'title' => array(
		    'title'       => 'Заголовок',
		    'type'        => 'text',
		    'description' => 'Это то, что пользователь увидит как название метода оплаты на странице оформления заказа.',
		    'default'     => 'Polkadot direct payments',
		    'desc_tip'    => true,
		),


/*
		'workfield' => array(
		    'title'       => 'workfield',
		    'label'       => 'workfield',
		    'type'        => 'textarea',
		    'description' => 'Рабочее поле.',
		    'default'     => 'wwwwwwwwwwwwwwwwwwwww',
		    'desc_tip'    => true,
		),
*/

		'description' => array(
		    'title'       => 'Описание',
		    'type'        => 'textarea',
		    'description' => 'Описание этого метода оплаты, которое будет отображаться пользователю на странице оформления заказа.',
		    'default'     => 'Оплатите при помощи карты легко и быстро.',
		),

		'testmode' => array(
		    'title'       => 'Тестовый режим',
		    'label'       => 'Включить тестовый режим',
		    'type'        => 'checkbox',
		    'description' => 'Хотите сначала протестировать с тестовыми ключами API?',
		    'default'     => 'yes',
		    'desc_tip'    => true,
		),
		'test_publishable_key' => array(
		    'title'       => 'Тестовый публичный ключ',
		    'type'        => 'text'
		),
		'test_private_key' => array(
		    'title'       => 'Тестовый приватный ключ',
		    'type'        => 'password',
		),
		'publishable_key' => array(
		    'title'       => 'Публичный ключ',
		    'type'        => 'text'
		),
		'private_key' => array(
		    'title'       => 'Приватный ключ',
		    'type'        => 'password'
		)
	    );
	}

	/**
	 * А этот метод пригодится, если захотите добавить форму ввода данных карты прямо на сайт
	 * Подробнее об этом мы поговорим в 4-м шаге
	 */
/*
	public function payment_fields() {

		die('payment_fields()');

	    // окей, давайте выведем описание, если оно заполнено
	    if ( $this->description ) {
		// отдельные инструкции для тестового режима
		if ( $this->testmode ) {
		    $this->description .= ' ТЕСТОВЫЙ РЕЖИМ АКТИВИРОВАН. В тестовом режиме вы можете использовать тестовые данные карт, указанные в <a href="#" target="_blank">документации</a>.';
		    $this->description  = trim( $this->description );
		}
		// описание закидываем в теги <p>
		echo wpautop( wp_kses_post( $this->description ) );
	    }

	    // я использую функцию echo(), но по сути можете закрыть тег PHP и выводить прямо как HTML
	    echo '<fieldset id="wc-' . $this->id . '-cc-form" class="wc-credit-card-form wc-payment-form" style="background:transparent;">';

die('oooh');

	    // чтобы разработчики плагинов могли сюда что-то добавить, но не обязательно
	    do_action( 'woocommerce_credit_card_form_start', $this->id );

	    // I recommend to use inique IDs, because other gateways could already use #ccNo, #expdate, #cvc
	    echo '<div class="form-row form-row-wide"><label>Номер карты <span class="required">*</span></label>
		<input id="truemisha_ccNo" type="text" autocomplete="off">
		</div>
		<div class="form-row form-row-first">
		    <label>Срок действия <span class="required">*</span></label>
		    <input id="truemisha_expdate" type="text" autocomplete="off" placeholder="MM / ГГ">
		</div>
		<div class="form-row form-row-last">
		    <label>Код (CVC) <span class="required">*</span></label>
		    <input id="truemisha_cvv" type="password" autocomplete="off" placeholder="CVC">
		</div>
		<div class="clear"></div>';

	    // чтобы разработчики плагинов могли сюда что-то добавить, но не обязательно
	    do_action( 'woocommerce_credit_card_form_end', $this->id );

	    echo '<div class="clear"></div></fieldset>';
	}
*/

	/*
	 * Для подключения дополнительных CSS и JS, нужны также для формы ввода карт и создания токена для них
	 */
        public function payment_scripts() {

	    // if our payment gateway is disabled, we do not have to enqueue JS too
	    if ( 'no' === $this->enabled ) return;

	    // выходим, если находимся не на странице оформления заказа
	    if ( ! is_cart() && ! is_checkout() && ! isset( $_GET['pay_for_order'] ) ) {
		return;
	    }


//	    die('fff');

/*
wc_print_notice(
    sprintf(
	'Минимальная сумма заказа %s, а у вы хотите заказать всего лишь на %s.' ,
	wc_price( $minimum_amount ),
	wc_price( WC()->cart->subtotal )
    ),
    'notice' // или error
);
*/





// echo "################################################################";

// die('eeeeeeeeeeee');

	//    wp_register_style( 'polkadot-payment', plugins_url( 'css/polkadot.css' , __FILE__ ) );
//@@@@@@@@@@@@@@@@	    wp_register_script( 'polkadot-payment', plugins_url( 'js/polkadot.js?'.rand(0,9999999) , __FILE__ ), array(), rand(0,100).'.'.rand(0,100).'.'.rand(0,100) );
//@@@@@@@@@@@@@@@@	    wp_enqueue_script( 'polkadot-payment' );

/*
add_action('wp_enqueue_scripts', 'override_woo_frontend_scripts');
function override_woo_frontend_scripts() {
    wp_deregister_script('wc-checkout');
    wp_enqueue_script('wc-checkout', get_template_directory_uri() . '/checkout.js', array('woocommerce', 'wc-country-select', 'wc-address-i18n'), null, true);
}
*/






	/*
		if ( is_checkout() && $this->upi_address !== 'hide' ) {
			wp_enqueue_style( 'upiwc-selectize', plugins_url( 'css/selectize.min.css' , __FILE__ ), array(), '0.15.2' );
			wp_enqueue_style( 'upiwc-checkout', plugins_url( 'css/checkout.min.css' , __FILE__ ), array( 'upiwc-selectize' ), UPIWC_VERSION );
			wp_enqueue_script( 'upiwc-selectize', plugins_url( 'js/selectize.min.js' , __FILE__ ), array( 'jquery' ), '0.15.2', false );
		}

		wp_register_style( 'upiwc-jquery-confirm', plugins_url( 'css/jquery-confirm.min.css' , __FILE__ ), array(), '3.3.4' );
		wp_register_style( 'upiwc-payment', plugins_url( 'css/payment.min.css' , __FILE__ ), array( 'upiwc-jquery-confirm' ), UPIWC_VERSION );
		wp_register_script( 'upiwc-qr-code', plugins_url( 'js/easy.qrcode.min.js' , __FILE__ ), array( 'jquery' ), '3.8.3', true );
		wp_register_script( 'upiwc-jquery-confirm', plugins_url( 'js/jquery-confirm.min.js' , __FILE__ ), array( 'jquery' ), '3.3.4', true );
		wp_register_script( 'upiwc-payment', plugins_url( 'js/payment.min.js', __FILE__ ), array( 'jquery', 'upiwc-qr-code', 'upiwc-jquery-confirm' ), UPIWC_VERSION,
	*/


	    // наш платёжный плагин отключен? ничего не делаем
	//    if ( 'no' === $this->enabled ) {
	//	return;
	//    }

	    // также нет смысла подключать JS, если плагин не настроен, не указаны API ключи
	//    if ( empty( $this->private_key ) || empty( $this->publishable_key ) ) {
	//	return;
	//    }

	//    // проверяем также ssl, если плагин работает не в тестовом режиме
	//    if ( ! $this->testmode && ! is_ssl() ) {
	//	return;
	//    }

	    // предположим, что это какой-то JS банка для обработки данных карт
	//    wp_enqueue_script( 'bank_js', 'https://урл-какого-то-банка/api/token.js' );

	    // а это наш произвольный JavaScript, дополняющий token.js
	//    wp_register_script( 'woocommerce_polkadot', plugins_url( 'polkadot.js', __FILE__ ), array( 'jquery', 'bank_js' ) );

	    // допустим, что нам в JavaScript коде понадобится публичный API ключ, передаём его вот так
	//    wp_localize_script( 'woocommerce_polkadot', 'polkadot_params', array(
	//	'publishableKey' => $this->publishable_key
	//    ) );

	//     wp_enqueue_script( 'woocommerce_polkadot' );

// return "############################################################";

        }

	/*
	 * Валидация полей, подробнее в шаге 5
	 */
/*
	public function validate_fields() {

	    if( empty( $_POST[ 'billing_first_name' ]) ) {
		wc_add_notice(  'Имя обязательно для заполнения!', 'error' );
		return false;
	    }
	    return true;

	}
*/

	/*
	 * Тут мы будем обрабатывать платёж, подробнее в шаге 5
	 */
	public function process_payment( $order_id ) {

	    die("{\"process_payment\":\"$order_id\"}");
	// ...

        }

	/*
	 * В том случае, если нам нужен хук, к которому будет обращаться банк для передачи ответа, типа PayPal IPN
	 */
	public function polkadot_webhook() {

	    die("polkadot_webhook()");
	// ...

        }
    }
}





/*
// Hook in Blocks integration. This action is called in a callback on plugins loaded
add_action( 'woocommerce_blocks_loaded', 'woocommerce_gateway_polkadot_block_support' );

function woocommerce_gateway_polkadot_block_support() {

    if ( class_exists( 'Automattic\WooCommerce\Blocks\Payments\Integrations\AbstractPaymentMethodType' ) ) {
	// require_once plugin_dir_path( __FILE__ ) . '/includes/class-wc-zipmoney-payment-gateway-blocks-support.php';
	require_once plugin_dir_path( __FILE__ ) . '/Polkadot.class.php';

	// add_action('plugins_loaded', function () {
	//    die('ee3');
           add_action( 'woocommerce_blocks_payment_method_type_registration',
                function ($registry) {
                    $registry->register( new Automattic\WooCommerce\Blocks\Payments\Integrations\Polkadot() );
        	});
	// });

    }
}
*/


add_action('plugins_loaded', function () {
  if ( class_exists( 'Automattic\WooCommerce\Blocks\Payments\Integrations\AbstractPaymentMethodType' ) ) {
    require_once plugin_dir_path( __FILE__ ) . '/Polkadot.class.php';
    add_action( 'woocommerce_blocks_payment_method_type_registration',
	function ($registry) {
	    $registry->register( new Automattic\WooCommerce\Blocks\Payments\Integrations\Polkadot() );
	}
    );
 }
});


/**
 * Function for `woocommerce_store_api_checkout_order_processed` action-hook.
 * 
 * @param \WC_Order $order Order object.
 *
 * @return void
 */
function polkadot_callback( $order ) {

// return true;
// die('oki');

    // $order->add_order_note( 'LLeo monster: complete' );
    $order->add_order_note( 'Polkadot daemon: error' );
    // $order->set_status( 'on-hold' );
    // $order->payment_complete();
    $order->save();
    // return true;


    //=> https://wp-kama.ru/plugin/woocommerce/hook
    die(""
	."\n get_id()         :".$order->get_id()
	."\n get_status                :".$order->get_status()
	."\n get_total                 :".$order->get_total()
	."\n get_currency              :".$order->get_currency()
	."\n get_checkout_payment_url  :".$order->get_checkout_payment_url()
	."\n has_status('on-hold') == ".intval( $order->has_status( 'on-hold' ))
	// ."\n get_order_key()  :".$order->get_order_key()
    );


    return false;
}
// add_action( 'woocommerce_blocks_checkout_order_processed', 'polkadot_callback', 10 );
add_action( 'woocommerce_store_api_checkout_order_processed', 'polkadot_callback' );
//=> https://wp-kama.ru/plugin/woocommerce/hook/woocommerce_store_api_checkout_order_processed?ysclid=lsb0do06rf737094715


// //////////////////////////////////////////////
// //////////////////////////////////////////////
// //////////////////////////////////////////////
// //////////////////////////////////////////////
// //////////////////////////////////////////////

// СУКА БЛЯТЬ КАЖЕТСЯ Я ПОЙМАЛ order_id!
add_action( 'woocommerce_blocks_enqueue_checkout_block_scripts_before', 'polkadot_cath_order_id' );
function polkadot_cath_order_id() {
    global $post;

// die("<pre>UUUUUUUUUUUw: ".print_r($x,1));

/*
die("<pre>".print_r($post,1));

	."\n get_id()         :".$order->get_id()
	."\n get_status                :".$order->get_status()
	."\n get_total                 :".$order->get_total()
	."\n get_currency              :".$order->get_currency()
	."\n get_checkout_payment_url  :".$order->get_checkout_payment_url()
	."\n has_status('on-hold') == ".intval( $order->has_status( 'on-hold' ))

<------><------>// die("id : ".$this->get_id());
<------><------>return [
<------><------><------>// 'order_id' => gettype( $this->id ),
<------><------><------>'root_url'                 => plugins_url('', __FILE__),
<------><------><------>'title'                    => $this->get_setting( 'title' ),
<------><------><------>'description'              => $this->get_setting( 'description' )
<------><------>];

*/



    echo '<input type="hidden" id="order-id" value="' . esc_attr($GLOBALS['post']->ID) . '">';
}


// //////////////////////////////////////////////
// //////////////////////////////////////////////
// //////////////////////////////////////////////
// //////////////////////////////////////////////
// //////////////////////////////////////////////









add_action('rest_api_init', function () {
    register_rest_route('polkadot/v1', '/checkout-data/', array(
        'methods' => 'GET',
        'callback' => 'polkadot_ajax',


        'args' => array(
            'order_id' => array(
                'validate_callback' => function($param, $request, $key) {
                    return is_numeric($param);
                }
            ),
            'additional_param' => array(
                'validate_callback' => function($param, $request, $key) {
                    // Perform validation for additional_param if necessary
                    return true; // Return true if the validation passes
                }
            ),
            // Add more parameters as needed
        ),


        'permission_callback' => function () {
	    return true;
            return current_user_can('edit_shop_orders');
        },
    ));
});

// https://woocommerce.zymologia.fi/wp-json/polkadot/v1/checkout-data?morder_id=12

function polkadot_ajax(WP_REST_Request $request) {


    // Assuming the order ID is passed as a query parameter named 'order_id'
//    $order_id = $request->get_param('order_id');

/*
    // If the order ID is not provided, you might want to handle this case
    if (!$order_id) {
        return new WP_Error('no_order_id', 'Order ID is missing', array('status' =>  400));
    }

    // Now you can use the $order_id to fetch the order data or perform other actions
    // ...

    // For example, to get the order object you can use:
    $order = wc_get_order($order_id);

    // Perform operations with the $order object
    // ...

    // Return a response
    return new WP_REST_Response($order->get_data(),  200);

*/


    // Your logic to fetch additional checkout data goes here.
    // For example, you can get the current order ID from the request and use it to retrieve order details.
//    $order_id = $request->get_param('order_id');

$o='';

    global $post;
    $order_id = $post->ID;

    $o.="\n\n id.1 = ".$order_id;

    $order_id = get_query_var('order-pay');

    $o.="\n\n id.2 = ".$order_id;

    $order = new WC_Order(); // $post->ID);
    $order_id = $order->get_id();

    $o.="\n\n id.3 = ".$order_id;

    $order_id = $request->get_param('order_id');

    $o.="\n\n id.4 = ".$order_id;

    $order = wc_get_order(1); // $order_id);

    $o.="\n\n id.4.1 = ".gettype($order).' '.($order===false?'false':'true');

die("oooooooooooooooo:
[      ".$o."     ]




"

.print_r(

	wc_price( WC()->cart->subtotal )

// $request

,1)
// .$order_id
);
    $order = wc_get_order($order_id);
    // Perform any necessary checks or calculations and return the data.
    return new WP_REST_Response($order->get_data(),  200);
}

// https://woocommerce.zymologia.fi/wp-json/polkadot/v1/checkout-data























/*
    die(""
	."\n get_status                :".$order->get_status()
	."\n get_total                 :".$order->get_total()
	."\n get_currency              :".$order->get_currency()
	."\n get_checkout_payment_url  :".$order->get_checkout_payment_url()
	."\n has_status() == ".intval( $order->has_status( 'on-hold' ))
    );
$order->update_status( 'cancelled',
$order->update_status( 'failed' );
$order->update_status( apply_filters( 'wc_ppcp_capture');
$order->update_status( 'on-hold', sprintf(
$order->update_status( 'wc-refunded' );^M
$order->update_status( 'wc-cancelled', sprintf( 'The zipMoney charge (id:%s) has been cancelled.', $charge->getId() 
$order->update_status( WC_Zipmoney_Payment_Gateway_Config::ZIP_ORDER_STATUS_AUTHORIZED_KEY );
$order->update_status( 'cancelled', 'order_note' );

$order->set_status(apply_filters( 'authorize_status', 'on-hold' ),
$order->set_status( 'on-hold' );

$this->set_processing( 'capture' );

$order->payment_complete( $result->get_capture_id() );
$order->payment_complete( $charge->getId() );^M
$order->payment_complete();


$order->set_transaction_id( $capture->getId() );
$order->add_order_note( sprintf( __( 'Error processing payment. Reason: %s', 'pymntpl-paypal-woocommerce' ),

$this->add_payment_complete_message( $order, $result );
$this->save_order_meta_data( $order, $result->paypal_order );
do_action( 'wc_ppcp_order_payment_complete', $order, $result, $this );
do_action( 'woocommerce_checkout_order_processed', $order_id, (array) $WC_Session, $order );

// Add the authorised status for payment complete^M
add_filter( 'woocommerce_valid_order_statuses_for_payment_complete',
 array( $this, 'filter_add_authorize_order_status_for_payment_complete' ) );

public function filter_add_authorize_order_status_for_payment_complete( $statuses ) {
><------>$statuses[] = str_replace( 'wc-', '', WC_Zipmoney_Payment_Gateway_Config::ZIP_ORDER_STATUS_AUTHORIZED_KEY
*/
