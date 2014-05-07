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
class Action extends Base
{
    /**
     * Extjs grid key
     * @var string
     */
    protected $_key = 'mvc-action';

    /**
     * Grid title
     * @var string
     */
    protected $_title = 'Actions';

    /**
     * Container model
     * @var string
     */
    protected $_containerModel = '\ExtjsCms\Model\Mvc\Action';

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
			'module'   => new Column\JoinOne('Module', ['\ExtjsCms\Model\Mvc\Controller', '\ExtjsCms\Model\Mvc\Module']),
			'controller'=> new Column\JoinOne('Controller', '\ExtjsCms\Model\Mvc\Controller'),
			'name'      => new Column\Name("Action"),
			'status'    => new Column\Collection("Status", 'status', ['active' => 'Active', 'not_active' => 'Not active'])
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
			'search'    => new Field\Search('Search', 'search', [
				[
					'path' => null,
					'filters' => [
						Criteria::COLUMN_ID => Criteria::CRITERIA_EQ,
						Criteria::COLUMN_NAME => Criteria::CRITERIA_BEGINS
					],
				],
				[
					'path' => ['\ExtjsCms\Model\Mvc\Controller'],
					'filters' => [
						Criteria::COLUMN_NAME => Criteria::CRITERIA_BEGINS
					]
				],
				[
					'path' => ['\ExtjsCms\Model\Mvc\Controller', '\ExtjsCms\Model\Mvc\Module'],
					'filters' => [
						Criteria::COLUMN_NAME => Criteria::CRITERIA_BEGINS
					]
				]
			]),
    		'id'         => new Field\Primary('Id'),
    		'module'     => new Field\Join('Modules', '\ExtjsCms\Model\Mvc\Module', ['\ExtjsCms\Model\Mvc\Controller', '\ExtjsCms\Model\Mvc\Module']),
       		'controller' => new Field\Join('Controllers', '\ExtjsCms\Model\Mvc\Controller'),
            'status'     => new Field\ArrayToSelect('Status', 'status', ['active' => 'Active', 'not_active' => 'Not active'])
        ]);
    }
}
