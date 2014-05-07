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
class Action extends \Engine\Mvc\Model
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
    protected $_orderExpr = 'controller_id';

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
    public $controller_id;
     
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
        $this->belongsTo("controller_id", "\ExtjsCms\Model\Mvc\Controller", "id", ['alias' => 'Controller']);
    }

    /**
     * Return table name
     * @return string
     */
    public function getSource()
    {
        return "core_mvc_action";
    }
     
}
