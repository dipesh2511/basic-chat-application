import { config_variables } from "./config.js";
import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";

let current_chat_id = null; // To store the current chat's friend ID
let chatTitle = null; // Define chatTitle globally
const socket = io.connect(config_variables.BASE_URL);

// Request notification permission
if (Notification.permission !== "granted") {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
    }
  });
}

if (!sessionStorage.getItem("user_payload")) {
  window.location.href = config_variables.LOGIN_URL;
}

let renderChat = async () => {
  // Fetch user data
  let fetchUserData = async (user_payload) => {
    let user_call = await fetch(
      `${config_variables.USER_READ}/${user_payload.data._id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await user_call.json();
  };

  // Fetch previous chat data for friends
  let fetchUserFriendsPreviousChatData = async (friends) => {
    let friendChat = [];
    for (let friend of friends) {
      let user_call = await fetch(
        `${config_variables.API_URL}/chat/history?persons=${userData.data._id},${friend._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      friendChat.push(await user_call.json());
    }
    return friendChat;
  };

  // Function to fetch chat history from the database
  let fetchChatHistory = async (friendId) => {
    try {
      const response = await fetch(
        `${config_variables.API_URL}/chat/history?persons=${userData.data._id},${friendId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      return data.data; // Return the chat history
    } catch (error) {
      console.error("Error fetching chat history:", error);
      return [];
    }
  };

  // Get user data
  let userData = await fetchUserData(
    JSON.parse(sessionStorage.getItem("user_payload"))
  );

  // Get previous chat data
  let previousChatData = await fetchUserFriendsPreviousChatData(
    userData.data.friends
  );

  // Function to open chat with provided chat history
  function openChat(name, friendId, chatHistory) {
    current_chat_id = friendId; // Set the current chat ID
    const chatList = document.getElementById("chat-list");
    const chatSection = document.getElementById("chat-section");
    chatTitle = document.getElementById("chat-title"); // Update the global chatTitle
    const chatMessages = document.getElementById("chat-messages");

    // Update chat title
    chatTitle.textContent = name;

    // Clear existing messages
    chatMessages.innerHTML = "";

    // Populate the chat with the provided chat history
    if (chatHistory) {
      chatHistory.forEach((message) => {
        const isSender = message.sender === userData.data._id;
        const senderName = isSender ? "You" : name;
        const messageClass = isSender ? "sent" : "";

        chatMessages.innerHTML += `
        <div class="message ${messageClass}" data-id="${message._id}">
          <div class="sender">${senderName}</div>
          <div class="text">${message.message}</div>
          <div class="timestamp">${new Date(
            message.posted_on
          ).toLocaleTimeString()}</div>
          <div class="message-options">
            <i class="fas fa-edit" data-action="edit" data-id="${
              message._id
            }"></i>
            <i class="fas fa-trash" data-action="delete" data-id="${
              message._id
            }"></i>
          </div>
        </div>
      `;
      });
    }

    // Scroll to the bottom of the chat messages container
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Clear the notification badge for this chat
    const chatItem = document.querySelector(
      `.chat-item[data-id="${friendId}"]`
    );
    if (chatItem) {
      const notificationBadge = chatItem.querySelector(".notification-badge");
      notificationBadge.style.display = "none";
    }

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
  document.getElementById("send-btn").addEventListener("click", async () => {
    const input = document.getElementById("chat-input");
    const message = input.value.trim();
    if (message && current_chat_id) {
      const chatMessages = document.getElementById("chat-messages");

      // Emit the new message to the server
      socket.emit("new_message", {
        sender: userData.data._id,
        receiver: current_chat_id,
        message: message,
      });

      // Clear the input
      input.value = "";
    }
  });

  // Listen for new messages from the server
  socket.on("add_message", (message_response) => {
    console.log("New message received:", message_response); // Debugging

    if (message_response.data) {
      const isSender = message_response.data.sender === userData.data._id;
      const senderName = isSender
        ? "You"
        : chatTitle
        ? chatTitle.textContent
        : "Unknown"; // Use chatTitle if available

      // Check if the message belongs to the current chat
      if (
        current_chat_id === message_response.data.sender ||
        current_chat_id === message_response.data.receiver
      ) {
        const chatMessages = document.getElementById("chat-messages");
        const messageClass = isSender ? "sent" : "";
        if (
          (message_response.data.receiver == current_chat_id &&
            message_response.data.sender == userData.data._id) ||
          (message_response.data.sender == current_chat_id &&
            message_response.data.receiver == userData.data._id)
        ) {
          // Append the new message to the chat
          chatMessages.innerHTML += `
        <div class="message ${messageClass}" data-id="${
            message_response.data._id
          }">
          <div class="sender">${senderName}</div>
          <div class="text">${message_response.data.message}</div>
          <div class="timestamp">${new Date(
            message_response.data.posted_on
          ).toLocaleTimeString()}</div>
          <div class="message-options">
            <i class="fas fa-edit" data-action="edit" data-id="${
              message_response.data._id
            }"></i>
            <i class="fas fa-trash" data-action="delete" data-id="${
              message_response.data._id
            }"></i>
          </div>
        </div>
      `;
        }
        chatMessages.scrollTop = chatMessages.scrollHeight;
        // Scroll to the bottom of the chat
      }

      // Update the chat list item with the latest message
      const friendId =
        message_response.data.sender === userData.data._id
          ? message_response.data.receiver
          : message_response.data.sender;

      const chatItem = document.querySelector(
        `.chat-item[data-id="${friendId}"]`
      );
      if (chatItem) {
        const chatPreview = chatItem.querySelector(".chat-preview");
        const notificationBadge = chatItem.querySelector(".notification-badge");

        // Update the chat preview with the latest message
        
        // Show the notification badge only if the current user is the recipient
        if (message_response.data.receiver === userData.data._id) {
          chatPreview.textContent = message_response.data.message;
          notificationBadge.style.display = "inline-block";
          console.log("Notification badge updated for friend:", friendId); // Debugging
        }
      }

      // Show notification only if the current user is the recipient
      if (
        Notification.permission === "granted" &&
        message_response.data.receiver === userData.data._id
      ) {
        const notification = new Notification("New Message", {
          body: `${senderName}: ${message_response.data.message}`,
          icon: "path/to/icon.png", // Optional: Add an icon for the notification
        });

        // Optional: Handle notification click
        notification.onclick = () => {
          window.focus(); // Bring the browser window to the front
        };
      }
    }
  });

  // Function to edit a message
  function editMessage(id) {
    const messageElement = document.querySelector(
      `.message[data-id="${id}"] .text`
    );
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

  // Function to render friends in the dropdown and chat list
  function renderFriends(friends) {
    const friendsDropdown = document.getElementById("friends-dropdown-content");
    const chatList = document.getElementById("chat-list");

    friends.forEach((friend) => {
      // Add friend to dropdown
      const dropdownItem = document.createElement("a");
      dropdownItem.href = "#";
      dropdownItem.textContent = friend.name;
      dropdownItem.setAttribute("data-chat", friend.name);
      dropdownItem.setAttribute("data-id", friend._id);
      friendsDropdown.appendChild(dropdownItem);

      // Add friend to chat list
      const chatItem = document.createElement("div");
      chatItem.classList.add("chat-item");
      chatItem.setAttribute("data-chat", friend.name);
      chatItem.setAttribute("data-id", friend._id);

      // Find the chat history for the selected friend
      const chatHistory = previousChatData.find((chat) =>
        chat.data.some(
          (message) =>
            (message.sender === userData.data._id &&
              message.receiver === friend._id) ||
            (message.sender === friend._id &&
              message.receiver === userData.data._id)
        )
      );

      // Get the latest message for the chat preview
      const latestMessage = chatHistory
        ? chatHistory.data[chatHistory.data.length - 1]
        : null;

      chatItem.innerHTML = `
      <div class="chat-icon">
        <i class="fas fa-user"></i>
      </div>
      <div class="chat-info">
        <div class="chat-name">${friend.name}</div>
        <div class="chat-preview">${
          latestMessage ? latestMessage.message : "No messages yet"
        }</div>
        <div class="notification-badge" id="notification-${
          friend._id
        }" style="display: none;">1</div>
      </div>
    `;
      chatList.appendChild(chatItem);
    });
  }

  // Event delegation for chat items
  document
    .getElementById("chat-list")
    .addEventListener("click", async function (event) {
      const chatItem = event.target.closest(".chat-item");
      if (chatItem) {
        const chatName = chatItem.getAttribute("data-chat");
        const friendId = chatItem.getAttribute("data-id");

        // Fetch the latest chat history from the database
        const chatHistory = await fetchChatHistory(friendId);

        // Open the chat with the fetched history
        openChat(chatName, friendId, chatHistory);
      }
    });

  // Event delegation for dropdown items
  document
    .getElementById("friends-dropdown-content")
    .addEventListener("click", function (event) {
      const dropdownItem = event.target.closest("a");
      if (dropdownItem) {
        if (dropdownItem.id === "create-group-chat") {
          createGroupChat();
        } else {
          const chatName = dropdownItem.getAttribute("data-chat");
          const friendId = dropdownItem.getAttribute("data-id");
          openChat(chatName, friendId);
        }
      }
    });

  // Event delegation for message options
  document
    .getElementById("chat-messages")
    .addEventListener("click", function (event) {
      const action = event.target.getAttribute("data-action");
      const id = event.target.getAttribute("data-id");

      if (action === "edit") {
        editMessage(id);
      } else if (action === "delete") {
        deleteMessage(id);
      }
    });

  // Render friends on page load
  renderFriends(userData.data.friends);
};

renderChat();
