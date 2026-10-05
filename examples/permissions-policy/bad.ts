navigator.mediaDevices.getUserMedia({ video: true });

navigator.mediaDevices.getDisplayMedia();

navigator.geolocation.getCurrentPosition((position) => console.log(position.coords));
