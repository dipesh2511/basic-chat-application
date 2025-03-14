// Function to open chat
function openChat(name) {
    const chatList = document.getElementById("chat-list");
    const chatSection = document.getElementById("chat-section");
    const chatTitle = document.getElementById("chat-title");
    const chatMessages = document.getElementById("chat-messages");
  
    // Update chat title
    chatTitle.textContent = name;
  
    // Clear existing messages
    chatMessages.innerHTML = `
      <div class="message" data-id="1">
        <div class="sender">${name}</div>
        <div class="text">Hey! How's it going?</div>
        <div class="timestamp">10:00 AM</div>
        <div class="message-options">
          <i class="fas fa-edit" onclick="editMessage(1)"></i>
          <i class="fas fa-trash" onclick="deleteMessage(1)"></i>
        </div>
      </div>
      <div class="message sent" data-id="2">
        <div class="sender">You</div>
        <div class="text">Hi ${name}! All good here. 😊</div>
        <div class="timestamp">10:01 AM</div>
        <div class="message-options">
          <i class="fas fa-edit" onclick="editMessage(2)"></i>
          <i class="fas fa-trash" onclick="deleteMessage(2)"></i>
        </div>
      </div>
    `;
  
    // Show chat section and hide chat list on mobile
    if (window.innerWidth <= 768) {
      chatList.classList.add("hidden");
      chatSection.classList.add("active");
    }
  }
  
  // Function to go back to chat list on mobile
  document.getElementById("back-btn").addEventListener("click", function () {
    const chatList = document.getElementById("chat-list");
    const chatSection = document.getElementById("chat-section");
  
    chatList.classList.remove("hidden");
    chatSection.classList.remove("active");
  });
  
  // Function to create a group chat
  function createGroupChat() {
    const groupName = prompt("Enter a name for the group chat:");
    if (groupName) {
      openChat(groupName);
    }
  }
  
  // Function to send a message
  document.getElementById("send-btn").addEventListener("click", function () {
    const input = document.getElementById("chat-input");
    const message = input.value.trim();
    if (message) {
      const chatMessages = document.getElementById("chat-messages");
      const messageId = Date.now(); // Unique ID for the message
      chatMessages.innerHTML += `
        <div class="message sent" data-id="${messageId}">
          <div class="sender">You</div>
          <div class="text">${message}</div>
          <div class="timestamp">Just now</div>
          <div class="message-options">
            <i class="fas fa-edit" onclick="editMessage(${messageId})"></i>
            <i class="fas fa-trash" onclick="deleteMessage(${messageId})"></i>
          </div>
        </div>
      `;
      input.value = "";
      chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
    }
  });
  
  // Function to edit a message
  function editMessage(id) {
    const messageElement = document.querySelector(`.message[data-id="${id}"] .text`);
    const newText = prompt("Edit your message:", messageElement.textContent);
    if (newText) {
      messageElement.textContent = newText;
    }
  }
  
  // Function to delete a message
  function deleteMessage(id) {
    const messageElement = document.querySelector(`.message[data-id="${id}"]`);
    if (confirm("Are you sure you want to delete this message?")) {
      messageElement.remove();
    }
  }