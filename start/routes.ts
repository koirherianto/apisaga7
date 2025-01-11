/* eslint-disable prettier/prettier */
import { middleware } from './kernel.js'

const LandingController = () => import('#controllers/landing_controller')
const AuthController = () => import('#controllers/auth_controller')
const DashboardController = () => import('#controllers/dashboard_controller')
const ProfileController = () => import('#controllers/profile_controllers')
const RedirectController = () => import('#controllers/redirect_controller')
const PageController = () => import('#controllers/page_controller')
const EditorController = () => import('#controllers/editor_controller')

import router from '@adonisjs/core/services/router'

router.get('/', [LandingController, 'index'])

router.group(() => {
    router.get('/register', [AuthController, 'registerView']).as('register')
    router.post('/register', [AuthController, 'register']).as('register.store')

    router.get('/login', [AuthController, 'loginView']).as('login')
    router.post('/login', [AuthController, 'login']).as('login.store')
}).middleware(middleware.guest())

router.group(() => {
    router.delete('/logout', [AuthController, 'logout']).as('logout')

    router.group(() => {
        // untuk user bisa mengedit data diri
        router.get('/profile', [ProfileController, 'index']).as('profile.index')
        router.put('/profile', [ProfileController, 'update']).as('profile.update')

        // untuk user bisa mengorganisir project nya sendiri
        router.resource('dashboard', DashboardController).as('dashboard')

        // Editor Page
        router.get(':sProject/:sVersion/:sTopbar/:sPage', [EditorController, 'index']).as('editor.index')

        // CRUD version, topbar, page
        // router.resource('version', VersionController).as('version')
        // router.resource('topbar', TopbarController).as('topbar')
        // router.resource('page', PageController).as('page')
    }).prefix('u')

}).middleware(middleware.auth())

 // jika url tidak lengkap arahkan page default
router.get(':sProject', [RedirectController, 'project']).as('redirect.project')
router.get(':sProject/:sVersion', [RedirectController, 'version']).as('redirect.version')
router.get(':sProject/:sVersion/:sTopbar', [RedirectController, 'topbar']).as('redirect.topbar')

// default page
router.get(':sProject/:sVersion/:sTopbar/:sPage', [PageController, 'index']).as('page.index')