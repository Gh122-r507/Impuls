<?php

session_start();
require_once '../vendor/autoload.php';

use App\Middleware\AuthMiddleware;
use App\Middleware\RoleMiddleware;
use App\Router;
$router = new Router();

$router->register('/', [App\Controllers\ComplaintController::class, 'create'], [AuthMiddleware::class])
       ->register('/login', [App\Controllers\Auth\AuthController::class, 'login'])
       ->register('/register', [App\Controllers\Auth\AuthController::class, 'register'])
       ->register('/logout', [App\Controllers\Auth\AuthController::class, 'logout'],  [AuthMiddleware::class])
       ->register('/getUserComplaints', [App\Controllers\ComplaintController::class, 'getUserComplaints'],  [AuthMiddleware::class])
       ->register('/admin-panel', [App\Controllers\AdminController::class, 'index'],  [AuthMiddleware::class, [RoleMiddleware::class, 'admin']])
       ->register('/dashboard', [App\Controllers\DashboardController::class, 'index'],  [AuthMiddleware::class, [RoleMiddleware::class, 'admin']])
       ->register('/getAllComplaints', [App\Controllers\DashboardController::class, 'getComplaints'],  [AuthMiddleware::class, [RoleMiddleware::class, 'admin']])
       ->register('/getAllProcessingComplaints', [App\Controllers\AdminController::class, 'getAllProcessingComplaints'],  [AuthMiddleware::class, [RoleMiddleware::class, 'admin']])
       ->register('/getAdminComplaintsInWork', [App\Controllers\AdminController::class, 'getAdminComplaintsInWork'],  [AuthMiddleware::class, [RoleMiddleware::class, 'admin']])
       ->register('/takeComplaint', [App\Controllers\AdminController::class, 'takeComplaint'],  [AuthMiddleware::class, [RoleMiddleware::class, 'admin']]);

echo $router->resolve($_SERVER['REQUEST_URI']);


