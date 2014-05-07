<?php
/**
 * @namespace
 */
namespace ExtjsCms\Model\Acl;

/**
 * Class RoleToInherit
 *
 * @category   Module
 * @package    Acl
 * @subpackage Model
 */
class RoleToInherit extends \Engine\Mvc\Model
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
        $this->hasMany("id", "\ExtjsCms\Model\Acl\Roleinherit", "inherit_role_id", ['alias' => 'Roleinherit']);
    }

    /**
     * Return table name
     * @return string
     */
    public function getSource()
    {
        return "core_acl_role";
    }
     
}
