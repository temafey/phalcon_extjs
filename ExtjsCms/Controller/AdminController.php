<?php
/**
 * @namespace
 */
namespace ExtjsCms\Controller;

use Phalcon\Mvc\View;

/**
 * @RoutePrefix("/admin", name="admin")
 */
class AdminController extends Base
{
    public function initialize()
    {
        $this->auth->isAuth();
    }

    /**
     * @Route("/", methods={"GET"}, name="home")
     */
    public function indexAction()
    {
        parent::initialize();
        $modules = [];
        foreach ($this->modules as $module => $status) {
            if ($status) {
                $modules[] = ucfirst($module);
            }
        }
        $this->view->modules = $modules;
        $this->view->pick('admin/index');
    }

    /**
     * @Route("/auth", methods={"POST"}, name="login-auth")
     */
    public function authAction()
    {
        $params = $this->request->getPost();
        $result = ['success' => false];

        if ($this->auth->check($params)) {
            $result['success'] = true;
        } else {
            $result['msg'] = $this->auth->getMessage();
        }
        echo json_encode($result);

        $this->view->setRenderLevel(View::LEVEL_NO_RENDER);
    }

    /**
     * @Route("/check", methods={"POST"}, name="login-check")
     */
    public function checkAction()
    {
        $params = $this->request->getPost();
        $result = ['success' => false];

        if ($this->auth->checkRememberMe($params['token'])) {
            if (!$this->viewer->getId()) {
                $this->auth->loginWithRememberMe();
            }
            $result['success'] = true;
        } else {
            $result['msg'] = $this->auth->getMessage();
        }
        echo json_encode($result);

        $this->view->setRenderLevel(View::LEVEL_NO_RENDER);
    }

    /**
     * @Route("/logout", methods={"GET"}, name="logout")
     */
    public function logoutAction()
    {
        $result = ['success' => false];

        if ($this->auth->isAuth() && $this->auth->remove()) {
            $result['success'] = true;
        } else {
            $result['msg'] = $this->auth->getMessage();
        }
        echo json_encode($result);

        $this->view->setRenderLevel(View::LEVEL_NO_RENDER);
    }

    /**
     * @Route("/isauth", methods={"GET"}, name="isauth")
     */
    public function isauthAction()
    {
        $result = ['success' => false];

        if ($this->auth->isAuth()) {
            $result['success'] = true;
        } else {
            $result['msg'] = $this->auth->getMessage();
        }
        echo json_encode($result);

        $this->view->setRenderLevel(View::LEVEL_NO_RENDER);
    }

    /**
     * @Route("/menu/denied", methods={"GET"}, name="denied")
     */
    public function deniedAction()
    {
        $result = ['success' => false, 'msg' => 'Access denied'];
        echo json_encode($result);

        $this->view->setRenderLevel(View::LEVEL_NO_RENDER);
    }

    /**
     * @Route("/menu/options", methods={"GET"}, name="menu-options")
     */
    public function optionsAction()
    {
        $params = $this->request->getQuery();
        $result = $this->_getMenuOptions($params);
        echo json_encode($result);

        $this->view->setRenderLevel(View::LEVEL_NO_RENDER);
    }

    /**
     * Return admin panel menu options
     *
     * @param array $params
     * @return array
     */
    protected function _getMenuOptions(array $params)
    {
        $parent = (isset($params['node']) && $params['node'] !== 'root') ? $params['node'] : 0;
        $grid = new \ExtjsCms\Grid\Extjs\Menu\Item(['menu' => '1', 'status' => 'active', 'parent' => $parent], $this->getDi(), $this->getEventsManager());
        $options = $grid->getMenuOptions();

        return $options;
    }

}

