<?php
/**
 * @namespace
 */
namespace ExtjsCms\Model\Menu;

/**
 * Class Items
 *
 * @category   Module
 * @package    Menu
 * @subpackage Model
 */
class Item extends \Engine\Mvc\Model
{
    /**
     * Default name column
     * @var string
     */
    protected $_nameExpr = 'title';

    /**
     * Default order name
     * @var string
     */
    protected $_orderExpr = 'position';

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
     * @var integer
     */
    public $menu_id;

    /**
     *
     * @var string
     */
    public $controller_id;

    /**
     *
     * @var integer
     */
    public $parent_id;
     
    /**
     *
     * @var string
     */
    public $alias;
     
    /**
     *
     * @var string
     */
    public $title;
     
    /**
     *
     * @var string
     */
    public $description;
     
    /**
     *
     * @var string
     */
    public $image;
     
    /**
     *
     * @var integer
     */
    public $position;
     
    /**
     *
     * @var string
     */
    public $status;

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->belongsTo("menu_id", "\ExtjsCms\Model\Menu\Menus", "id", ['alias' => 'Menus']);
        $this->belongsTo("controller_id", "\ExtjsCms\Model\Mvc\Controller", "id", ['alias' => 'Controler']);
        $this->belongsTo("parent_id", "\ExtjsCms\Model\Menu\Item", "id", ['alias' => 'Parent']);
        $this->hasMany("id", "\ExtjsCms\Model\Menu\Item", "parent_id", ['alias' => 'Parents']);
    }

    /**
     * Return table name
     * @return string
     */
    public function getSource()
    {
        return "core_menu_item";
    }
     
}
