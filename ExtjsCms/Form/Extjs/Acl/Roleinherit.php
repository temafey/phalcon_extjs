<?php
/**
 * @namespace
 */
namespace ExtjsCms\Form\Extjs\Acl;

use ExtjsCms\Form\Base,
    Engine\Crud\Form\Field;

/**
 * Class Roleinherit
 *
 * @category    Module
 * @package     Acl
 * @subpackage  Form
 */
class Roleinherit extends Base
{
    /**
     * Extjs form key
     * @var string
     */
    protected $_key = 'acl-roleinherit';

    /**
     * Form title
     * @var string
     */
    protected $_title = 'Role inherits';

    /**
     * Container model
     * @var string
     */
    protected $_containerModel = '\ExtjsCms\Model\Acl\Roleinherit';

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
			'role'      => new Field\ManyToOne('Role', '\ExtjsCms\Model\Acl\Role'),
            'inherit'   => new Field\ManyToOne('Inherit role', '\ExtjsCms\Model\Acl\RoleToInherit')
		];
    }
}
