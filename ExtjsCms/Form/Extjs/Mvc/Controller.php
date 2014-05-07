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
class Controller extends Base
{
    /**
     * Extjs form key
     * @var string
     */
    protected $_key = 'mvc-controller';

    /**
     * Form title
     * @var string
     */
    protected $_title = 'Controller';

    /**
     * Container model
     * @var string
     */
    protected $_containerModel = '\ExtjsCms\Model\Mvc\Controller';

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
			'id'     => new Field\Primary('Id'),
			'module' => new Field\ManyToOne('Module', '\ExtjsCms\Model\Mvc\Module'),
			'name'   => new Field\Name("Controller"),
			//'action' => new Field\ManyToMany('Actions', '\ExtjsCms\Model\Mvc\Action', null, null, ', ', 5),
			'status' => new Field\ArrayToSelect("Status", null, ['active' => 'Active', 'not_active' => 'Not active'])
		];
    }
}
