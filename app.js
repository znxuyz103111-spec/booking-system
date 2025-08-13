const GAS_URL = "https://script.google.com/macros/s/AKfycbwJB7m0bJOaCk0jl1nN7ZPxm4tRb-cZjAqt_SOuKRyUUqRhxGqVyy_qqIj7fupUAhRaWA/exec";
const API_TOKEN = "abcd1234";

document.addEventListener("DOMContentLoaded", function () {
    const calendarEl = document.getElementById("calendar");
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "timeGridWeek",
        selectable: true,
        select: function(info) {
            document.getElementById("bookingForm").style.display = "block";
            document.getElementById("resourceName").value = "教室A";
            document.getElementById("submitBooking").onclick = function() {
                createBooking(info.startStr, info.endStr);
            };
            document.getElementById("cancelBooking").onclick = function() {
                document.getElementById("bookingForm").style.display = "none";
            };
        }
    });

    fetch(`${GAS_URL}?action=list&from=2025-01-01&to=2025-12-31&resourceId=教室A&token=${API_TOKEN}`)
        .then(res => res.json())
        .then(data => {
            if (data.ok) {
                data.bookings.forEach(b => {
                    calendar.addEvent({
                        title: b.title,
                        start: b.start,
                        end: b.end
                    });
                });
            }
        });

    calendar.render();
});

function createBooking(start, end) {
    const payload = {
        action: "create",
        token: API_TOKEN,
        data: {
            resource_id: "教室A",
            resource_name: document.getElementById("resourceName").value,
            start: start,
            end: end,
            title: document.getElementById("title").value,
            requester: document.getElementById("requester").value,
            email: document.getElementById("email").value,
            purpose: document.getElementById("purpose").value
        }
    };

    fetch(GAS_URL, {
        method: "POST",
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
        if (data.ok) {
            alert("預約成功！");
            location.reload();
        } else {
            alert("預約失敗：" + data.error);
        }
    });
}
