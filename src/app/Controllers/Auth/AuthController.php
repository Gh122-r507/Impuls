<?php

namespace App\Controllers\Auth;
use App\Models\User;
use App\View\View;
use Dotenv\Dotenv;
use Firebase\JWT\JWT;

class AuthController
{
    private string $jwtKey;
    private Dotenv $dotenv;

    public function __construct()
    {
        $this->dotenv = Dotenv::createImmutable(dirname(__DIR__, 4));
        $this->dotenv->load();
        $this->jwtKey = $_ENV['jwtKey'];
    }

    public function login() : string
    {
        $error = 'Неверные учётные данные!';
        $data = [
          'pageTitle' => 'Авторизация',
            'header' => 'Импульс | Авторизация'
        ];

        if ($_SERVER['REQUEST_METHOD'] === 'POST')
        {
            $email = $_POST['email'] ?? '';
            $password = $_POST['password'] ?? '';
            $userModel = new User();
            $user = $userModel->findUser($email);
            if ($user and password_verify($password, $user['user_password']))
            {
                $role = $userModel->getRole($user['id']);
                $issuedAt = time();
                $expirationTime = $issuedAt + 3600*60*60*24*30;
                $payload = [
                    'iss' => 'http://localhost',
                    'iat' => $issuedAt,
                    'exp' => $expirationTime,
                    'user_id' => $user['id'],
                    'username' => $user['username'],
                    'role' => $role
                ];
                $jwt = JWT::encode($payload, $this->jwtKey, 'HS256');
                setcookie('token', $jwt, time() + 3600*60*60*24*30, '/');
                header('Location: /');
                exit;
            }else{
                return view::render('auth/login', ['error' => $error, 'pageTitle' => $data['pageTitle'], 'header' => $data['header']]);
            }
        }
        return view::render('auth/login', $data);
    }

    public function register() : string
    {
        $error = 'Ошибка регистрации ;(';
        $data = [
            'pageTitle' => 'Регистрация',
            'header' => 'Импульс | Регистрация'
        ];
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $username = $_POST['username'] ?? '';
            $email = $_POST['email'] ?? '';
            $password = $_POST['password'] ?? '';
            $firstName = $_POST['first_name'] ?? '';
            $surname = $_POST['surname'] ?? '';
            $userModel = new User();
            if ($userModel->createUser($username, $firstName, $surname, $email, $password))
            {
                $user = $userModel->findUser($email);
                $issuedAt = time();
                $expirationTime = $issuedAt + 3600*60*60*24*30;
                $payload = [
                    'iss' => 'http://localhost',
                    'iat' => $issuedAt,
                    'exp' => $expirationTime,
                    'user_id' => $user['id'],
                    'username' => $user['username'],
                    'role' => $user['role']
                ];
                $jwt = JWT::encode($payload, $this->jwtKey, 'HS256');
                setcookie('token', $jwt, time() + 3600*60*60*24*30, '/');
                header('Location: /');
                exit;
            }else{
                return view::render('auth/register', ['error' => $error, 'pageTitle' => $data['pageTitle'], 'header' => $data['header']]);
            }
        }
        return view::render('auth/register', $data);
    }

    public function logout():void
    {
        $_SESSION = [];
        session_destroy();
        setcookie('token', '', time() - 3600, '/');
        header('Location: /login');
        exit;
    }
}