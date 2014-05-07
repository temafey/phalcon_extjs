<?php
/**
 * @namespace
 */
namespace ExtjsCms\Form\Extjs\Acl;

use ExtjsCms\Form\Base,
    Engine\Crud\Form\Field;

/**
 * Class Resource
 *
 * @category    Module
 * @package     Acl
 * @subpackage  Form
 */
class Resource extends Base
{
    /**
     * Extjs form key
     * @var string
     */
    protected $_key = 'acl-resource';

    /**
     * Form title
     * @var string
     */
    protected $_title = 'Resources';

    /**
     * Container model
     * @var string
     */
    protected $_containerModel = '\ExtjsCms\Model\Acl\Resource';

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
			'id'         =>  new Field\Primary('Id'),
			'name'       =>  new Field\Name('Name'),
            'description'=> new Field\Text('Desc', 'description')
		];
    }
}
