<?php

namespace Alzymologist\KalatoriMax\Controller\Payment;

class Index extends \Magento\Framework\App\Action\Action
{

    // https://magento.zymologia.fi/alzymologist/payment/index


public $scopeConfig;

 public function __construct(
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig
    ) {
        $this->scopeConfig = $scopeConfig;
    }
    public function getConfigValue($sku) {
        return $this->scopeConfig->getValue(
        'section/group/field',
        \Magento\Store\Model\ScopeInterface::SCOPE_STORE,
     );
    }

    public function execute(){
	die("sssssssssssssssssssssssssssssssssss");
	echo "Hello World";
	exit;
    }

}

?>