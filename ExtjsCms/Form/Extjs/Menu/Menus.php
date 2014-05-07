<?php
/**
 * @namespace
 */
namespace ExtjsCms\Form\Extjs\Menu;

use ExtjsCms\Form\Base,
    Engine\Crud\Form\Field;

/**
 * Class
 *
 * @category    Module
 * @package     Menu
 * @subpackage  Form
 */
class Menus extends Base
{
    /**
     * Extjs form key
     * @var string
     */
    protected $_key = 'menu-menus';

    /**
     * Form title
     * @var string
     */
    protected $_title = 'Menus';

    /**
     * Container model
     * @var string
     */
    protected $_containerModel = '\ExtjsCms\Model\Menu\Menus';

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
			'id'    => new Field\Primary('Id'),
			'name'   => new Field\Name('Name'),
			//'item'  => new Field\ManyToMany('Items', '\ExtjsCms\Model\Menu\Item', null, null, ', ', 5, '150')
		];
    }
}
