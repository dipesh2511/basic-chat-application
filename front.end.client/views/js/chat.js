import { config_variables } from "./config.js";
import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";

let current_chat_id = null; // To store the current chat's friend ID
let chatTitle = null; // Define chatTitle globally
const socket = io.connect(window.location.origin);

// Request notification permission
if (Notification.permission !== "granted") {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
    }
  });
}

if (!sessionStorage.getItem("user_payload")) {
  window.location.href = '/';
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
        `${window.location.origin}/api/chat/history?persons=${userData.data._id},${friend._id}`,
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
        `${window.location.origin}/api/chat/history?persons=${userData.data._id},${friendId}`,
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

  // function to get the users which are not friend of the logged in user
  const notFriendUsers = async () => {
    try {
      let user_payload = sessionStorage.getItem("user_payload");

      user_payload = JSON.parse(user_payload);
      const response = await fetch(config_variables.USER_LIST, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: user_payload.access,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch users: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log(data);
      return data.data || [];
    } catch (error) {
      console.error("Error fetching non-friend users:", error.message);
      return [];
    }
  };

  // function to send request to the user which is not friend of the user
  const sendFriendRequest = async (friendToBe_id) => {
    try {
      let user_payload = sessionStorage.getItem("user_payload");

      user_payload = JSON.parse(user_payload);

      const response = await fetch(
        `${config_variables.USER_LIST}/${userData.data._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: user_payload.access,
          },
          body: JSON.stringify({ friends: friendToBe_id }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to send friend request: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Friend request sent:", data);
      return data || {};
    } catch (error) {
      console.error("Error sending friend request:", error.message);
      return { error: error.message };
    }
  };

  // function to update user profile photo
  const uploadProfilePhoto = async (formData) => {
    try {
      const user_payload = JSON.parse(sessionStorage.getItem("user_payload"));
      const response = await fetch(
        `${config_variables.USER_READ}/${userData.data._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: user_payload.access,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload profile photo");
      }

      const data = await response.json();
      console.log("Profile photo updated:", data);
      alert("Profile photo updated successfully!");
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      alert("Failed to upload profile photo. Please try again.");
    }
  };

  // Get user data
  let userData = await fetchUserData(
    JSON.parse(sessionStorage.getItem("user_payload"))
  );
  //  console.log(userData)

  // setting the name header
  let logged_in_user_name = document.getElementById("logged-in-user-name");
  logged_in_user_name.innerText = userData.data.name;

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
      if(friend.profile_photo == null){
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
      }else{
        chatItem.innerHTML = `
        <div class="chat-icon">
            <img src="${friend.profile_photo}" alt="${friend.name}" class="chat-icon-img">
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
      }
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
  // Event listener for View Profile
  document
    .getElementById("view-profile")
    .addEventListener("click", function (event) {
      event.preventDefault();
      alert("View Profile clicked");
      // Add your logic to view the profile
    });

  // Event listener for Add Friends
  document
    .getElementById("add-friends")
    .addEventListener("click", function (event) {
      event.preventDefault();
      alert("Add Friends clicked");
      // Add your logic to add friends
    });

  // Event listener for Logout
  document.getElementById("logout").addEventListener("click", function (event) {
    event.preventDefault();
    if (confirm("Are you sure you want to logout?")) {
      sessionStorage.removeItem("user_payload");
      window.location.href = '/';
    }
  });

  // Toggle profile dropdown
  document
    .getElementById("profile-dropdown")
    .addEventListener("click", function (event) {
      event.preventDefault();
      const dropdownContent = document.getElementById(
        "profile-dropdown-content"
      );
      dropdownContent.style.display =
        dropdownContent.style.display === "block" ? "none" : "block";
    });

  // Close dropdown when clicking outside
  document.addEventListener("click", function (event) {
    const profileDropdown = document.getElementById("profile-dropdown");
    const profileDropdownContent = document.getElementById(
      "profile-dropdown-content"
    );
    if (
      !profileDropdown.contains(event.target) &&
      !profileDropdownContent.contains(event.target)
    ) {
      profileDropdownContent.style.display = "none";
    }
  });

  // Add this to your existing JavaScript code

  // Open Profile Modal
  document
    .getElementById("view-profile")
    .addEventListener("click", function (event) {
      event.preventDefault();
      const profileModal = document.getElementById("profile-modal");
      profileModal.style.display = "flex";

      // Populate profile details
      document.getElementById("profile-name").textContent = userData.data.name;
      document.getElementById("profile-email").textContent =
        userData.data.email;
      if (userData.data.profile_photo) {
        document.getElementById("profile-photo-img").src =
          userData.data.profile_photo;
      }
    });

  // Close Profile Modal
  document.querySelector(".close-modal").addEventListener("click", function () {
    const profileModal = document.getElementById("profile-modal");
    profileModal.style.display = "none";
  });

  // Close modal when clicking outside
  window.addEventListener("click", function (event) {
    const profileModal = document.getElementById("profile-modal");
    if (event.target === profileModal) {
      profileModal.style.display = "none";
    }
  });

  // Edit Profile Button
  document
    .getElementById("edit-profile")
    .addEventListener("click", function () {
      alert("Edit Profile clicked");
      // Add your logic to edit the profile
    });

  // Change Photo Button
  document
    .getElementById("change-photo")
    .addEventListener("click", function () {
      // Trigger the hidden file input when "Change Photo" is clicked
      document.getElementById("select-photo").click();
    });

  // Handle file selection
  document
    .getElementById("select-photo")
    .addEventListener("change", function (event) {
      const file = event.target.files[0]; // Get the selected file
      if (file) {
        const reader = new FileReader(); // Create a FileReader to read the file

        reader.onload = function (e) {
          // Update the profile photo with the selected image
          const profilePhotoImg = document.getElementById("profile-photo-img");
          profilePhotoImg.src = e.target.result;
          const formData = new FormData();
          formData.append("profile_photo", file);
          // Optionally, upload the photo to the server
          uploadProfilePhoto(formData);
        };

        reader.readAsDataURL(file); // Read the file as a data URL
      }
    });

  // Open Add Friends Modal
  document
    .getElementById("add-friends")
    .addEventListener("click", function (event) {
      event.preventDefault();
      const addFriendsModal = document.getElementById("add-friends-modal");
      addFriendsModal.style.display = "flex";

      // Fetch all users (replace with actual API call)
      fetchAllUsers();
    });

  // Close Add Friends Modal
  document
    .querySelector("#add-friends-modal .close-modal")
    .addEventListener("click", function () {
      const addFriendsModal = document.getElementById("add-friends-modal");
      addFriendsModal.style.display = "none";
    });

  // Close modal when clicking outside
  window.addEventListener("click", function (event) {
    const addFriendsModal = document.getElementById("add-friends-modal");
    if (event.target === addFriendsModal) {
      addFriendsModal.style.display = "none";
    }
  });

  // Fetch all users from the database
  async function fetchAllUsers() {
    const users = await notFriendUsers();

    const usersList = document.getElementById("users-list");
    usersList.innerHTML = "";

    users.forEach((user) => {
      const userItem = document.createElement("div");
      userItem.classList.add("user-item");

      if (user.profile_photo) {
        userItem.innerHTML = `
        <div class="user-info">
          <img src="${user.profile_photo}" alt="${user.name}" class="user-photo" />
          <span class="user-name">${user.name}</span>
        </div>
        <button class="send-request-btn" data-id="${user._id}">Send Request</button>
      `;
      } else {
        userItem.innerHTML = `
        <div class="user-info">
          <img src="/default.jpg" alt="${user.name}" class="user-photo" />
          <span class="user-name">${user.name}</span>
        </div>
        <button class="send-request-btn" data-id="${user._id}">Send Request</button>
      `;
      }
      usersList.appendChild(userItem);
    });

    // Add event listeners to "Send Request" buttons
    document.querySelectorAll(".send-request-btn").forEach(async (button) => {
      button.addEventListener("click", function () {
        const userId = this.getAttribute("data-id");
        console.log(`Friend request sent to user `);
        alert(`Friend request sent to user`);
        sendFriendRequest(userId);
        this.textContent = "Request Sent";
        this.classList.add("sent");
        this.disabled = true;
        window.location.href = '/chat';
        location.reload();
      });
    });
  }

  // Render friends on page load
  renderFriends(userData.data.friends);
};

renderChat();
