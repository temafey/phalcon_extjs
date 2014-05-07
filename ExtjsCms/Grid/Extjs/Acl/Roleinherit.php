<?php
/**
 * @namespace
 */
namespace ExtjsCms\Grid\Extjs\Acl;

use ExtjsCms\Grid\Base,
    Engine\Crud\Grid\Column,
    Engine\Crud\Grid\Filter\Extjs as Filter,
    Engine\Crud\Grid\Filter\Field,
    Engine\Filter\SearchFilterInterface as Criteria;

/**
 * Class Roleinherit
 *
 * @category    Module
 * @package     Acl
 * @subpackage  Grid
 */
class Roleinherit extends Base
{
    /**
     * Extjs grid key
     * @var string
     */
    protected $_key = 'acl-roleinherit';

    /**
     * Grid title
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
     * Initialize grid columns
     *
     * @return void
     */
    protected function _initColumns()
    {
		$this->_columns = [
			'id'      => new Column\Primary('Id'),
			'name'    => new Column\Name('Name'),
			'role'    => new Column\JoinOne('Role', '\ExtjsCms\Model\Acl\Role'),
            'inherit' => new Column\JoinOne('Inherit role', '\ExtjsCms\Model\Acl\RoleToinherit'),
		];
    }

    /**
     * Initialize grid filters
     *
     * @return void
     */
    protected function _initFilters()
    {
        $this->_filter = new Filter([
			'search' => new Field\Search('Search', 'search', [
                [
                    'path' => null,
                    'filters' => [
                        Criteria::COLUMN_ID => Criteria::CRITERIA_EQ,
                        Criteria::COLUMN_NAME => Criteria::CRITERIA_BEGINS,
                    ],
                ],
                [
                    'path' => 'ExtjsCms\Model\Acl\Role',
                    'filters' => [
                        Criteria::COLUMN_NAME => Criteria::CRITERIA_BEGINS
                    ],
                ]
			]),
			'id'   => new Field\Primary('Id'),
            'name' => new Field\Name('Name'),
			'role' => new Field\Join('Roles', '\ExtjsCms\Model\Acl\Role')
        ]);
    }
}
