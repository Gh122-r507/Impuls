<?php

namespace App\Controllers;

use App\Models\Complaint;
use App\Models\User;
use App\View\View;

class AdminController
{
    private $Complaint;
    private $User;

    public function __construct()
    {
        $this->Complaint = new Complaint();
        $this->User = new User();
    }

    public function index()
    {
        $userInfo = $this->User->findUserById($_SESSION['user_id']);
        $data = [
            'pageTitle' => 'админ-панель',
            'userInfo' => $userInfo
        ];
        return View::render('admin-panel/index', $data);
    }

    public function getAllProcessingComplaints()
    {
        $complaints = $this->Complaint->getAllProcessingComplaints();
        echo json_encode([
            'complaints' => $complaints
        ]);
        exit();
    }

    public function getAdminComplaintsInWork()
    {
        $complaints = $this->Complaint->getAdminComplaintsInWork($_SESSION['user_id']);
        echo json_encode([
            'complaints' => $complaints
        ]);
        exit();
    }

    public function takeComplaint()
    {
        if($_SERVER['REQUEST_METHOD'] == 'POST')
        {
            $data = json_decode(file_get_contents("php://input"),true);
            $complaintId = $data['complaintId'];
            $adminId = $_SESSION['user_id'];

            if($complaintId && $adminId)
            {
                $result = $this->Complaint->takeComplaint($complaintId, $adminId);
                echo json_encode(['success' => $result]);
                exit();
            }
        }
        echo json_encode(['success' => false]);
        exit();
    }
}