<?php
/**
 * @namespace
 */
namespace ExtjsCms\Model\Menu;

/**
 * Class Menus
 *
 * @category   Module
 * @package    Menu
 * @subpackage Model
 */
class Menus extends \Engine\Mvc\Model
{
    /**
     * Default name column
     * @var string
     */
    protected $_nameExpr = 'name';

    /**
     * Default order name
     * @var string
     */
    protected $_orderExpr = 'name';

    /**
     * Order is asc order direction
     * @var bool
     */
    protected $_orderAsc = true;

    /**
     *
     * @var integer
     */
    public $id;
     
    /**
     *
     * @var string
     */
    public $name;

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->hasMany("id", "\ExtjsCms\Model\Menu\Item", "menu_id", ['alias' => 'Item']);
    }

    /**
     * Return table name
     * @return string
     */
    public function getSource()
    {
        return "core_menu_menus";
    }
     
}
