<?php
/**
 * @namespace
 */
namespace ExtjsCms;

use Engine\Mvc\Module as BaseModule;

/**
 * Class Event Module
 *
 * @category   Module
 * @package    Event
 */
class Module extends BaseModule
{
    /**
     * Module name
     * @var string
     */
    protected $_moduleName = 'extjs';

    /**
     * Autoload module prefixes
     * @var array
     */
    protected $_loaders = [
        'controller',
        'model',
        'grid'
    ];

    /**
     * Register module services
     * @var array
     */
    protected $_services = [
        'dispatcher',
        'view',
        'volt',
        //'acl',
        //'viewer'
    ];

    /**
     * Registers an autoloader related to the module
     *
     * @param \Phalcon\DiInterface $dependencyInjector
     */
    public function registerAutoloaders($di)
    {
        parent::registerAutoloaders($di);
    }

    /**
     * Registers an autoloader related to the module
     *
     * @param \Phalcon\DiInterface $dependencyInjector
     */
    public function registerServices($di)
    {
        parent::registerServices($di);

        if ($this->_config->application->debug) {
            $this->_initExtjsApplications();
        }
    }

    private function _initExtjsApplications()
    {
        // load all controllers of all modules for routing system
        $modules = $this->_di->get('modules');

        //Use the annotations router
        $defaultModule = $this->_config->application->defaultModule;

        //Read the annotations from controllers
        foreach ($modules as $module => $enabled) {
            if (!$enabled || $module == $defaultModule || $module = $this->_moduleName) {
                continue;
            }
            $files = scandir($this->_config->application->modulesDir . ucfirst($module) . '/Controller'); // get all file names
            foreach ($files as $file) { // iterate files
                if ($file == "." || $file == "..") {
                    continue;
                }
                $key = strtolower(str_replace('Controller.php', '', $file));
                $controller = ucfirst($module).'\Controller\\'.ucfirst($key);
                if (strpos($file, 'Controller.php') !== false) {

                }
            }
        }
    }
} 