const socket = io();

const $messageForm = document.querySelector('#message-form');
const $messageFormInput = document.querySelector('#message');
const $messageFormButton = document.querySelector('#submit');
const $shareLocation = document.querySelector('#share-location');
const $messages = document.querySelector('#messages');


// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        message: message
    });
    $messages.insertAdjacentHTML('beforeend', html);
});

$messageForm.addEventListener('submit', (e) => {
    const message = $messageFormInput.value;
    e.preventDefault();

    //Disable send message button
    $messageFormButton.setAttribute('disabled', 'disabled');

    socket.emit('sendMessage', message, (error) => {

        //Re-enable send message button
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        if (error) {
            return console.log(error);
        }
        console.log('Message sent!');
    });
});

$shareLocation.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser');
    }

    navigator.geolocation.getCurrentPosition((position) => {
        const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }

        $shareLocation.setAttribute('disabled', 'disabled');

        socket.emit('sendLocation', location, () => {

            $shareLocation.removeAttribute('disabled');

            console.log('Location Shared');
        });
    });

});