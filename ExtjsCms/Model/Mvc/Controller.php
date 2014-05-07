<?php
/**
 * @namespace
 */
namespace ExtjsCms\Model\Mvc;

/**
 * Class event.
 *
 * @category   Module
 * @package    Mvc
 * @subpackage Model
 */
class Controller extends \Engine\Mvc\Model
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
    protected $_orderExpr = 'module_id';

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
    public $module_id;
     
    /**
     *
     * @var string
     */
    public $name;
     
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
        $this->belongsTo("module_id", "\ExtjsCms\Model\Mvc\Module", "id", ['alias' => 'Module']);
        $this->hasMany("id", "\ExtjsCms\Model\Mvc\Action", "controller_id", ['alias' => 'Action']);
    }

    /**
     * Return table name
     * @return string
     */
    public function getSource()
    {
        return "core_mvc_controller";
    }
     
}
