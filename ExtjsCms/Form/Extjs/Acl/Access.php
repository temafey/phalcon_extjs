<?php
/**
 * @namespace
 */
namespace ExtjsCms\Form\Extjs\Acl;

use ExtjsCms\Form\Base,
    Engine\Crud\Form\Field;

/**
 * Class Access
 *
 * @category    Module
 * @package     Acl
 * @subpackage  Form
 */
class Access extends Base
{
    /**
     * Extjs form key
     * @var string
     */
    protected $_key = 'acl-access';

    /**
     * Form title
     * @var string
     */
    protected $_title = 'Accesses';

    /**
     * Container model
     * @var string
     */
    protected $_containerModel = '\ExtjsCms\Model\Acl\Access';

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
			'id' => new Field\Primary('Id'),
			'name' => new Field\Name('Name'),
			'resource' => new Field\ManyToOne('Resource', '\ExtjsCms\Model\Acl\Resource')
		];
    }
}
