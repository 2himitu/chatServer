
let username = prompt("아이디를 입력하세요");

let roomNum = prompt("채팅방 번호를 입력하세요");

document.querySelector("#username").innerHTML = username;




const eventSource = new EventSource(`http://localhost:8234/chat/roomNum/${roomNum}`);
// const eventSource = new EventSource("http://localhost:8234/sender/ssar/receiver/cos");

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if(data.sender === username){//로그인한 유저가 보낸 메시지
      //파란박스(오른쪽)
    initMyMessage(data);
  }else{
    initYourMessage(data);
      //회색(왼쪽)
  }
}
//파란박스(오른쪽)
function getSendMsgBox(data){

  let md = data.createdAt.substring(5,10);
  let tm = data.createdAt.substring(11,16);
  let convertTime = tm + " | " + md;

  return `<div class="sent_msg">
  <p>${data.msg}</p>
  <span class="time_date"> ${convertTime} / <b>${data.sender}</b></span>
  </div>`;
}
//회색(왼쪽)
function getReceiverMsgBox(data){

  let md = data.createdAt.substring(5,10);
  let tm = data.createdAt.substring(11,16);
  let convertTime = tm + " | " + md;

  return `<div class="received_withd_msg">
  <p>${data.msg}</p>
  <span class="time_date"> ${convertTime}/<b>${data.sender}</b></span>
  </div>`;
}
//내가 쓴 메시지 가져오기
function initMyMessage(data){
  let chatBox = document.querySelector("#chat-box");

  let sendBox = document.createElement("div");
  sendBox.className = "outgoing_msg";

  sendBox.innerHTML = getSendMsgBox(data);
  chatBox.append(sendBox);
  //스크롤 이동
  document.documentElement.scrollTop = document.body.scrollHeight;
}
//상대가 쓴 메시지 가져오기
function initYourMessage(data){
  let chatBox = document.querySelector("#chat-box");

  let receivedBox = document.createElement("div");
  receivedBox.className = "incoming_msg";

  receivedBox.innerHTML = getReceiverMsgBox(data);
  chatBox.append(receivedBox);

  //스크롤 이동
  document.documentElement.scrollTop = document.body.scrollHeight;

}

//대화입력 함수
function addMessage(){
  let msgInput = document.querySelector("#chat-outgoing-msg");
  //AJAX 채팅 메시지를 전송
  let chat = {
    sender: username,
    roomNum: roomNum,
    msg: msgInput.value
  };

  fetch("http://localhost:8234/chat",{
    method: "post", //http post 메서드 (새로운 데이터를 write)
		body: JSON.stringify(chat), // JS -> JSON
		headers: {
			"Content-Type": "application/json; charset=utf-8"
		}
  });
  msgInput.value="";
}


//버튼으로 대화 입력
document.querySelector("#chat-outgoing--button").addEventListener("click",()=>{
  addMessage();
});
//엔터로 대화 입력
document.querySelector("#chat-outgoing-msg").addEventListener("keydown",(e)=>{
  if(e.keyCode===13){
    addMessage();
  }
});