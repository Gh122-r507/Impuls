fetchAdminProcessingComplaints = () => {
    fetch('getAllProcessingComplaints', {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
        .then(response => response.json())
        .then(data =>{
            if (data.complaints){
                data.complaints.sort((a,b)=> a.id - b.id)
                updateComplaintsList(data.complaints)
            }
        }).catch(error => {
            console.log(error)
    })
}

const updateComplaintsList = (complaints) => {
    const adminMain = document.querySelector(".admin-main");
    adminMain.innerHTML = '';

    if (complaints.length === 0) {
        adminMain.innerHTML = '<p style="color: #fff; text-align: center">Список обращений пуст</p><div class="loading loading-lg"></div>';
        return;
    }
    complaints.forEach(complaint => {
        const complaintDetails = document.createElement("div");
        complaintDetails.classList.add('complaint-details');
        complaintDetails.id = `complaint-${complaint.id}`;
        complaintDetails.innerHTML = `
            <div class="tile">
                <div class="tile-content">
                    <div class="tile-title">Обращение #${complaint.id} от ${complaint.first_name} ${complaint.surname}
                    <p>${complaint.created_at}</p></div>
                    <div class="tile-subtitle">Отдел: <span style="text-transform: lowercase">${complaint.department}</span></div>
                    <div class="tile-status">Категория: <span style="text-transform: lowercase">${complaint.problem_category}</span></div>
                </div>
                <div class="tile-action">
                    <button type="submit" class="btn btn-primary">Взять в работу</button>
                </div>
            </div>
        `;
        adminMain.appendChild(complaintDetails);
    });
};

const takeComplaint = async (complaintId) => {
    try {
        const response = await fetch('/takeComplaint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({ complaintId })
        });
        const data = await response.json();
        if (data.success) {
            alert('Жалоба взята в работу!');
            const complaintElement = document.querySelector(`#complaint-${complaintId}`);
            if (complaintElement) {
                complaintElement.remove();
            }
        } else {
            alert('Ошибка: ' + data.message);
        }
    } catch (error) {
        console.error('Ошибка при взятии жалобы:', error);
    }
};

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-primary') && event.target.textContent === 'Взять в работу') {
        const complaintId = event.target.closest('.tile').querySelector('.tile-title').textContent.match(/\d+/)[0];
        takeComplaint(complaintId);
    }
});

setInterval(fetchAdminProcessingComplaints, 2000)
fetchAdminProcessingComplaints()
