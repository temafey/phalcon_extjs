<?php
/**
 * @namespace
 */
namespace ExtjsCms\Form;

use Engine\Crud\Form\Extjs as Form;

/**
 * Class Base.
 *
 * @category   Module
 * @package    Event
 * @subpackage Form
 */
abstract class Base extends Form
{

    /**
     * Content managment system module router prefix
     * @var string
     */
    protected $_modulePrefix = 'admin';

    /**
     * Extjs module name
     * @var string
     */
    protected $_module = 'extjs-cms';
}