fetchUserComplaints = () => {
    fetch('/getUserComplaints', {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.complaints) {
                data.complaints.sort((a,b)=> a.id - b.id)
                updateComplaintsList(data.complaints)
            }
        })
        .catch(error => {
            console.error(error)
        })
}

function updateComplaintsList(complaints) {
    let complaintsContainer = document.querySelector('.complaint-status')
    complaintsContainer.innerHTML = ''
    if (complaints.length === 0) {
        complaintsContainer.innerHTML = '<p style="color: #fff; text-align: center">У вас пока нет отправленных обращений &#128524;</p>'
        return
    }
    complaints.forEach(complaint => {
        let complaintElement = document.createElement('div')
        complaintElement.classList.add('tile')
        complaintElement.innerHTML = `
            <div class="tile-content">
            <div class="tile-header">
                 <span class="tile-title">#${complaint.id}</span>
                 <span class="tile-subtitle">${complaint.department} | ${complaint.problem_category}</span>
            </div>
                <ul class="step">
                    <li class="step-item ${complaint.status === 'В обработке' ? 'active' : ''}">
                        <a href="#" style="${complaint.status === 'В обработке' ? 'color: #fff' : 'color: rgba(255,255,255,0.6)'}" class="tooltip" data-tooltip="В обработке">В обработке</a>
                        <span class="${complaint.status === 'В обработке' ? 'loader' : ''}"></span>
                    </li>
                    <li class="step-item ${complaint.status === 'В работе' ? 'active' : ''}">
                         <a style="${complaint.status === 'В работе' ? 'color: #fff' : 'color: rgba(255,255,255,0.6)'}" href="#" class="tooltip" data-tooltip="В работе">В работе</a>
                         <progress  style="${complaint.status === 'В работе' ? 'width: 70px' : 'display:none'}"  class="progress" max="100"></progress>
                    </li>
                    <li class="step-item ${complaint.status === 'Выполнено' ? 'active' : ''}">
                        <a style="${complaint.status === 'Выполнено' ? 'color: #fff' : 'color: rgba(255,255,255,0.6)'}" href="#" class="tooltip" data-tooltip="Завершено">Завершено</a>
                    </li>
                </ul>
            </div>
        `;
        complaintsContainer.appendChild(complaintElement)
    })
}

setInterval(fetchUserComplaints, 2000)
fetchUserComplaints()

