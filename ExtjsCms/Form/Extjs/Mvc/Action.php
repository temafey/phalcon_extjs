<?php
/**
 * @namespace
 */
namespace ExtjsCms\Form\Extjs\Mvc;

use ExtjsCms\Form\Base,
    Engine\Crud\Form\Field;

/**
 * Class
 *
 * @category    Module
 * @package     Mvc
 * @subpackage  Form
 */
class Action extends Base
{
    /**
     * Extjs form key
     * @var string
     */
    protected $_key = 'mvc-action';

    /**
     * Form title
     * @var string
     */
    protected $_title = 'Action';

    /**
     * Container model
     * @var string
     */
    protected $_containerModel = '\ExtjsCms\Model\Mvc\Action';

    /**
     * Container condition
     * @var array|string
     */
    protected $_containerConditions = null;

    /**
     * Initialize form fields
     *
     * @return void
     */
    protected function _initFields()
    {
		$this->_fields = [
			'id'        => new Field\Primary('Id'),
			'module'    => new Field\ManyToOne('Module', '\ExtjsCms\Model\Mvc\Module', null),
			'controller'=> new Field\ManyToOne('Controller', '\ExtjsCms\Model\Mvc\Controller'),
			'name'      => new Field\Name("Action"),
			'status'    => new Field\ArrayToSelect("Status", null, ['active' => 'Active', 'not_active' => 'Not active'])
		];
    }
}
