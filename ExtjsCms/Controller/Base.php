<?php
/**
 * @namespace
 */
namespace ExtjsCms\Controller;

use Phalcon\Mvc\Controller as PhController,
    Phalcon\Mvc\View as PhView;

/**
 * Class Base
 * @package ExtjsCms\Controller
 */
class Base extends PhController
{
    /**
     * Initializes the controller
     */
    public function initialize()
    {
        if ($this->config->application->debug && $this->di->has('profiler')) {
            $this->profiler->start();
        }

        $this->view->setRenderLevel(PhView::LEVEL_ACTION_VIEW);
        // run init function
        if (method_exists($this, 'init')) {
            $this->init();
        }
        //$scriptModulePath = 'extjs/apps/Cms';
        $scriptModulePath = 'extjs/lib/cms';
        //Add some local CSS resources
        $this->assets
            //->addCss('extjs/lib/resources/css/ext-all.css')
            //->addJs('extjs/lib/ext-all.js')
            ->addJs($scriptModulePath.'/static/include-ext.js')
            ->addJs($scriptModulePath.'/static/options-toolbar.js')
            ->addJs('extjs/lib/ux/router/Route.js')
            ->addJs('extjs/lib/ux/router/Router.js')
            ->addJs($scriptModulePath.'/static/router.js')
            ->addCss($scriptModulePath."/css/style.css");
            //->addJs('extjs/lib/ext-all-rtl-debug-w-comments.js');

        $this->view->modulePath = $scriptModulePath;
    }

    public function afterExecuteRoute()
    {
        if ($this->config->application->debug && $this->di->has('profiler')) {
            $this->profiler->stop(get_called_class(), 'controller');
        }
    }

    public function disableHeader()
    {
        $this->view->disableHeader = true;
    }

    public function disableFooter()
    {
        $this->view->disableFooter = true;
    }

    /**
     * Return grid fullname
     *
     * @param string $module
     * @param string $grid
     * @return string
     */
    protected function _getGrid($module, $grid)
    {
        $module = str_replace("-", "_", \Phalcon\Text::uncamelize($module));
        $module = explode("_", $module);
        foreach ($module as $i => &$word) {
            if ($i == 0) {
                continue;
            }
            $word = ucfirst($word);
        }
        $module = implode("", $module);

        $grid = str_replace("-", "_", \Phalcon\Text::uncamelize($grid));
        $grid = explode("_", $grid);
        foreach ($grid as $i => &$word) {
            if ($i == 0) {
                continue;
            }
            $word = ucfirst($word);
        }
        $grid = implode("\\", $grid);

        return "\\".ucfirst($module)."\Grid\Extjs\\".ucfirst($grid);
    }

    /**
     * Return form fullname
     *
     * @param string $module
     * @param string $grid
     * @return string
     */
    protected function _getForm($module, $form)
    {
        $module = str_replace("-", "_", \Phalcon\Text::uncamelize($module));
        $module = explode("_", $module);
        foreach ($module as $i => &$word) {
            if ($i == 0) {
                continue;
            }
            $word = ucfirst($word);
        }
        $module = implode("", $module);

        $form = str_replace("-", "_", \Phalcon\Text::uncamelize($form));
        $form = explode("_", $form);
        foreach ($form as $i => &$word) {
            if ($i == 0) {
                continue;
            }
            $word = ucfirst($word);
        }
        $form = implode("\\", $form);

        return "\\".ucfirst($module)."\Form\Extjs\\".ucfirst($form);
    }

    /**
     * Return model fullname
     *
     * @param string $module
     * @param string $model
     * @return string
     */
    protected function _getModel($module, $model)
    {
        return "\\".ucfirst($module)."\Model\\".ucfirst($model);
    }

}