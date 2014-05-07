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
class Module extends Base
{
    /**
     * Extjs grid key
     * @var string
     */
    protected $_key = 'mvc-module';

    /**
     * Grid title
     * @var string
     */
    protected $_title = 'Modules';

    /**
     * Container model
     * @var string
     */
    protected $_containerModel = '\ExtjsCms\Model\Mvc\Module';

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
			'id'        => new Column\Primary('Id'),
			'name'      => new Column\Name("Module"),
			//'controller'=> new Column\JoinMany('Controllers', '\ExtjsCms\Model\Mvc\Controller', null, null, ', ', 5),
			'status'    => new Column\Collection("Status", null, ['active' => 'Active', 'not_active' => 'Not active'])
		];
		//$this->_columns['controller']->setAction('mvc-controller', 'module');
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
                Criteria::COLUMN_ID => Criteria::CRITERIA_EQ,
                Criteria::COLUMN_NAME => Criteria::CRITERIA_BEGINS
		    ]),
			'id'     => new Field\Primary('Id'),
            'status' => new Field\ArrayToSelect('Status', 'status', ['active' => 'Active', 'not_active' => 'Not active'])
        ]);
    }
}
