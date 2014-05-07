<?php
/**
 * @namespace
 */
namespace ExtjsCms\Model\Acl;

/**
 * Class Resource
 *
 * @category   Module
 * @package    Acl
 * @subpackage Model
 */
class Resource extends \Engine\Mvc\Model
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
     *
     * @var string
     */
    public $description;

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->hasMany("id", "\ExtjsCms\Model\Acl\Accesslist", "resource_id", ['alias' => 'Accesslist']);
        $this->hasMany("id", "\ExtjsCms\Model\Acl\Access", "resource_id", ['alias' => 'Access']);
    }

    /**
     * Return table name
     * @return string
     */
    public function getSource()
    {
        return "core_acl_resource";
    }
     
}
