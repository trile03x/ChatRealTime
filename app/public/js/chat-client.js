// yeu cau server connect voi client
const socket = io();
const checkWord = (er) => {
    if (er) {
        return alert("Word is bad")
    }
    else {
        return alert("Sent");
    }
};
let btnSendLocation = document.getElementById("btn-share-location");
if (btnSendLocation) {
    btnSendLocation.addEventListener("click", () => {
        if (!navigator) {
            return alert("Browser not support")
        }
        else {
            navigator.geolocation.getCurrentPosition((position) => {
                console.log(position);
                const { latitude, longitude } = position.coords;
                socket.emit("send location", { latitude, longitude })
            });
        }
    });
}
let formMess = document.getElementById('form-messages');
if (formMess) {
    formMess.addEventListener("submit", (e) => {
        e.preventDefault();
        const mess = document.getElementById("input-messages").value;
        if (mess.trim() != '') {
            socket.emit("Send mess-client", mess, checkWord);
        }
        document.getElementById("input-messages").value = '';
    })
}
socket.on("responsive", (messObject) => {
    const { user, createAt, mess } = messObject;
    let htmlContain = document.getElementById("app__messages").innerHTML;
    let elmentHtml = `
    <div class="message-item" id="message-item">
                    <div class="message__row1">
                        <p class="message__name">${user}</p>
                        <p class="message__date">${createAt}</p>
                    </div>
                    <div class="message__row2">
                        <p class="message__content">
                           ${mess}
                        </p>
                    </div>
                </div>`;
    let renderHtml = htmlContain + elmentHtml;
    document.getElementById("app__messages").innerHTML = renderHtml;

});
socket.on("send link location for client", (messObject) => {
    const { user, createAt, mess } = messObject;
    let htmlContain = document.getElementById("app__messages").innerHTML;
    let elmentHtml = `
    <div class="message-item" id="message-item">
                    <div class="message__row1">
                        <p class="message__name">${user}</p>
                        <p class="message__date">${createAt}</p>
                    </div>
                    <div class="message__row2">
                        <p class="message__content">
                           <a href ="${mess}" target="_blank">Location of ${user}</a>
                        </p>
                    </div>
                </div>`;
    let renderHtml = htmlContain + elmentHtml;
    document.getElementById("app__messages").innerHTML = renderHtml;

});
socket.on("send link location for client", (mess) => {
    console.log(mess);
});
socket.on("send list user", (list) => {
    console.log(list);
    let containHtml = '';
    list.map((user) => {
        containHtml += `<li class="app__item-user">${user.username}</li>`
    })
    document.getElementById("list-user-join").innerHTML = containHtml;
    document.getElementById("code-room").innerHTML = `<span class="app__title">TZ Chat Room : ${list[0].room}</span>`

})
const queryString = location.search;
const params = Qs.parse(queryString.substring(1)); // Remove the leading "?"
socket.emit("Join room from client to server", params);
