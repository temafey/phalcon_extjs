<?php
/**
 * @namespace
 */
namespace ExtjsCms\Form\Extjs\Menu;

use ExtjsCms\Form\Base,
    Engine\Crud\Form\Field;

/**
 * Class Item
 *
 * @category    Module
 * @package     Menu
 * @subpackage  Form
 */
class Item extends Base
{
    /**
     * Extjs form key
     * @var string
     */
    protected $_key = 'menu-item';

    /**
     * Form title
     * @var string
     */
    protected $_title = 'Menu item';

    /**
     * Container model
     * @var string
     */
    protected $_containerModel = '\ExtjsCms\Model\Menu\Item';

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
			'id'         => new Field\Primary('Id'),
			'menu'       => new Field\ManyToOne('Menu', '\ExtjsCms\Model\Menu\Menus'),
			'title'      => new Field\Name('title'),
			'image'      => new Field\Image("Icon", 'image', 'upload', 'menu_item_{id}'),
            'parent'     => new Field\ManyToOne('Parent', '\ExtjsCms\Model\Menu\Item'),
			//'childs'    => new Field\ManyToMany('Childs', '\ExtjsCms\Model\Menu\Item', null, null, ', ', 5),
            'module'     => new Field\ManyToOne('Module', '\ExtjsCms\Model\Mvc\Module', 'module'),
			'controller' => new Field\ManyToOne('Controller', '\ExtjsCms\Model\Mvc\Controller'),
            'alias'      => new Field\Text('Alias'),
            'position'   => new Field\Text("Position"),
            'status'     => new Field\ArrayToSelect("Status", 'status', ['active' => 'Active', 'not_active' => 'Not active']),
            'description'=> new Field\HtmlEditor('Desciption', 'description')
		];
    }
}
