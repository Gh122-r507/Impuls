fetchAdminComplaintsInWork = () => {
    fetch('/getAdminComplaintsInWork', {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.complaints) {
                data.complaints.sort((a, b) => a.id - b.id)
                updateAdminComplaintsInWork(data.complaints)
            }
        }).catch(error => {
        console.log(error)
    })
}
updateAdminComplaintsInWork = (complaints) => {
    const inWorkContainer = document.querySelector(".complaint-list");
    if (!inWorkContainer) {
        return;
    }
    inWorkContainer.innerHTML = '';
    if (complaints.length === 0) {
        inWorkContainer.innerHTML = '<p style="color: #fff; text-align: center">Жалоб в работе нет</p>';
        return;
    }
    complaints.forEach(complaint => {
        const complaintDetails = document.createElement("div");
        complaintDetails.classList.add('complaint-details');
        complaintDetails.innerHTML = `
            <div class="tile">
                <div class="tile-content">
                    <div class="tile-title">Обращение #${complaint.id} от ${complaint.username}</div>
                    <div class="tile-subtitle">Отдел: ${complaint.department}</div>
                    <div class="tile-status">Категория: ${complaint.problem_category}</div>
                </div>
            </div>
        `;
        inWorkContainer.appendChild(complaintDetails);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    fetchAdminComplaintsInWork();
});



setInterval(fetchAdminComplaintsInWork, 2000)
fetchAdminComplaintsInWork