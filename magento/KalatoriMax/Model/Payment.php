<?php
/**
 * @category    Alzymologist
 * @package     Alzymologist_Kalatori
 * @author      Alzymologist
 * @copyright   Alzymologist (https://alzymologist.com)
 * @license     https://github.com/alzymologist/kalatori/blob/master/LICENSE The MIT License (MIT)
 */

declare(strict_types = 1);

namespace Alzymologist\KalatoriMax\Model;

/**
 * Class Payment
 */
class Payment extends \Magento\Payment\Model\Method\AbstractMethod
{
    protected $_code = 'kalatori_max';
}
