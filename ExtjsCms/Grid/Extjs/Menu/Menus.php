<?php
/**
 * @namespace
 */
namespace ExtjsCms\Grid\Extjs\Menu;

use ExtjsCms\Grid\Base,
    Engine\Crud\Grid\Column,
    Engine\Crud\Grid\Filter\Extjs as Filter,
    Engine\Crud\Grid\Filter\Field,
    Engine\Filter\SearchFilterInterface as Criteria;

/**
 * Class
 *
 * @category    Module
 * @package     Menu
 * @subpackage  Grid
 */
class Menus extends Base
{
    /**
     * Extjs grid key
     * @var string
     */
    protected $_key = 'menu-menus';

    /**
     * Grid title
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
     * Initialize grid columns
     *
     * @return void
     */
    protected function _initColumns()
    {
		$this->_columns = [
			'id'    => new Column\Primary('Id'),
			'name'   => new Column\Name('Name'),
			//'items' => new Column\JoinMany('Items', '\ExtjsCms\Model\Menu\Item', null, null, ', ', 5)
		];
		//$this->_columns['item']->setAction('menu-item', 'menu');
    }

    /**
     * Initialize grid filters
     *
     * @return void
     */
    protected function _initFilters()
    {
        $this->_filter = new Filter([
    		'search' => new Field\Search('Search', 'search',
    			[
    				Criteria::COLUMN_ID => Criteria::CRITERIA_EQ,
    				Criteria::COLUMN_NAME => Criteria::CRITERIA_BEGINS
    				//'price_description' => Criteria::CRITERIA_BEGINS
    			]
		    ),
			'id' => new Field\Primary('Id')
        ]);
    }
}
