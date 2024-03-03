function fetchPostOffices(pincode) {
    const url = `https://api.postalpincode.in/pincode/${pincode}`;
    return fetch(url)
        .then(response => response.json())
        .then(data => data[0].PostOffice)
        .catch(error => {
            console.error('Error fetching post offices:', error);
            return null;
        });
}

function initMap(latitude, longitude) {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
        zoom: 8
    });
}

function getCurrentTime(timezone) {
    const date = new Date();
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const currentTime = new Date(utc + (1000 * timezone));
    return currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}

window.addEventListener('load', async () => {
    const userIP = await getUserIP();
    if (userIP) {
        const ipInfo = await fetchIPInfo(userIP);
        if (ipInfo) {
            const latitude = ipInfo.loc.split(',')[0];
            const longitude = ipInfo.loc.split(',')[1];
            document.getElementById('latitude').textContent = latitude;
            document.getElementById('longitude').textContent = longitude;
            document.getElementById('city').textContent = ipInfo.city;
            document.getElementById('region').textContent = ipInfo.region;
            document.getElementById('timezone').textContent = ipInfo.timezone;

            // Initialize Google Maps
            initMap(latitude, longitude);

            // Display current time for the user's timezone
            const currentTime = getCurrentTime(ipInfo.timezone);
            document.getElementById('current-time').textContent = `Current Time: ${currentTime}`;

            // Fetch post offices based on Pin code
            const postOffices = await fetchPostOffices(ipInfo.postal);
            if (postOffices) {
                const postOfficeList = document.getElementById('post-office-list');
                postOffices.forEach(postOffice => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${postOffice.Name} - ${postOffice.BranchType}`;
                    postOfficeList.appendChild(listItem);
                });
            }
        }
    }
});

document.getElementById('getData').addEventListener('click', async () => {
    const userIP = await getUserIP();
    if (userIP) {
        const ipInfo = await fetchIPInfo(userIP);
        if (ipInfo) {
            const latitude = ipInfo.loc.split(',')[0];
            const longitude = ipInfo.loc.split(',')[1];
            document.getElementById('latitude').textContent = latitude;
            document.getElementById('longitude').textContent = longitude;
            document.getElementById('city').textContent = ipInfo.city;
            document.getElementById('region').textContent = ipInfo.region;
            document.getElementById('timezone').textContent = ipInfo.timezone;

            // Initialize Google Maps
            initMap(latitude, longitude);

            // Display current time for the user's timezone
            const currentTime = getCurrentTime(ipInfo.timezone);
            document.getElementById('current-time').textContent = `Current Time: ${currentTime}`;

            // Fetch post offices based on Pin code
            const postOffices = await fetchPostOffices(ipInfo.postal);
            if (postOffices) {
                const postOfficeList = document.getElementById('post-office-list');
                postOfficeList.innerHTML = ''; // Clear existing list
                postOffices.forEach(postOffice => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${postOffice.Name} - ${postOffice.BranchType}`;
                    postOfficeList.appendChild(listItem);
                });
            }
        }
    }
});

document.getElementById('searchBox').addEventListener('input', () => {
    const searchQuery = document.getElementById('searchBox').value.toLowerCase();
    const postOfficeList = document.getElementById('post-office-list');
    Array.from(postOfficeList.children).forEach(item => {
        const itemName = item.textContent.toLowerCase();
        if (itemName.includes(searchQuery)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});
