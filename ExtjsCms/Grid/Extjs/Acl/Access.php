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
 * Class Privilege
 *
 * @category    Module
 * @package     Acl
 * @subpackage  Grid
 */
class Access extends Base
{
    /**
     * Extjs grid key
     * @var string
     */
    protected $_key = 'acl-access';

    /**
     * Grid title
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
     * Initialize grid columns
     *
     * @return void
     */
    protected function _initColumns()
    {
		$this->_columns = [
			'id'         => new Column\Primary('Id'),
			'name'       => new Column\Name('Name'),
			'resource'   => new Column\JoinOne('Resource', '\ExtjsCms\Model\Acl\Resource'),
            //'accesslist' => new Column\JoinMany('Access list', '\ExtjsCms\Model\Acl\Accesslist', null, null, ', ', 5),
		];
        //$this->_columns['accesslist']->setAction('acl-access-list', 'access');
    }

    /**
     * Initialize grid filters
     *
     * @return void
     */
    protected function _initFilters()
    {
        $this->_filter = new Filter([
			'search'    => new Field\Search('Search', 'search', [
                [
                    'path' => null,
                    'filters' => [
                        Criteria::COLUMN_ID => Criteria::CRITERIA_EQ,
                        Criteria::COLUMN_NAME => Criteria::CRITERIA_BEGINS,
                    ],
                ],
                [
                    'path' => 'ExtjsCms\Model\Acl\Resource',
                    'filters' => [
                        Criteria::COLUMN_NAME => Criteria::CRITERIA_BEGINS
                    ],
                ]
			]),
			'id'       => new Field\Primary('Id'),
            'name'     => new Field\Name('Name'),
            'resource' => new Field\Join('Resource', '\ExtjsCms\Model\Acl\Resource')
        ]);
    }
}
