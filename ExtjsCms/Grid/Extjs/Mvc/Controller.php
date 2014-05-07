<?php
/**
 * @namespace
 */
namespace ExtjsCms\Grid\Extjs\Mvc;

use ExtjsCms\Grid\Base,
    Engine\Crud\Grid\Column,
    Engine\Crud\Grid\Filter\Extjs as Filter,
    Engine\Crud\Grid\Filter\Field,
    Engine\Filter\SearchFilterInterface as Criteria;

/**
 * Class
 *
 * @category    Module
 * @package     Mvc
 * @subpackage  Grid
 */
class Controller extends Base
{
    /**
     * Extjs grid key
     * @var string
     */
    protected $_key = 'mvc-controller';

    /**
     * Grid title
     * @var string
     */
    protected $_title = 'Controllers';

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
     * Initialize grid columns
     *
     * @return void
     */
    protected function _initColumns()
    {
		$this->_columns = [
			'id'     => new Column\Primary('Id'),
			'module' => new Column\JoinOne('Module', '\ExtjsCms\Model\Mvc\Module'),
			'name'   => new Column\Name("Controller"),
			//'action' => new Column\JoinMany('Actions', '\ExtjsCms\Model\Mvc\Action', null, null, ', ', 5),
			'status' => new Column\Collection("Status", null, ['active' => 'Active', 'not_active' => 'Not active'])
		];

		//$this->_columns['actions']->setAction ('mvc-action', 'controller');
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
                        Criteria::COLUMN_NAME => Criteria::CRITERIA_BEGINS
                    ],
                ],
                [
                    'path' => ['\ExtjsCms\Model\Mvc\Module'],
                    'filters' => [
                        Criteria::COLUMN_NAME => Criteria::CRITERIA_BEGINS
                    ]
                ]
    		]),
			'id'     => new Field\Primary('Id'),
       		'module' => new Field\Join('Modules', '\ExtjsCms\Model\Mvc\Module'),
            'status' => new Field\ArrayToSelect('Status', 'status', ['active' => 'Active', 'not_active' => 'Not active'])
        ]);
    }
}
