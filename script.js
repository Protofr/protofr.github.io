document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const messageArea = document.getElementById('message-area');
    const chatMessagesKey = 'frontendChatMessages'; // Key for localStorage

    // Load previous messages from localStorage on page load
    loadMessages();

    sendButton.addEventListener('click', () => {
        const messageText = messageInput.value.trim();
        if (messageText) {
            const senderName = 'You'; // Or you could add a local username input
            displayMessage(senderName, messageText, 'sent'); // Display sent message in UI

            // Store the new message in localStorage
            saveMessage(senderName, messageText, 'sent');

            messageInput.value = ''; // Clear input after sending
        }
    });

    function displayMessage(senderName, message, messageType = 'received') {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', messageType);
        messageDiv.innerHTML = `<span class="sender">${senderName}:</span> ${message}`;
        messageArea.appendChild(messageDiv);
        messageArea.scrollTop = messageArea.scrollHeight; // Scroll to bottom
    }

    function saveMessage(senderName, message, messageType) {
        let messages = getMessagesFromStorage(); // Get existing messages
        messages.push({ sender: senderName, text: message, type: messageType }); // Add new message
        localStorage.setItem(chatMessagesKey, JSON.stringify(messages)); // Save back to storage
    }

    function loadMessages() {
        const messages = getMessagesFromStorage();
        if (messages) {
            messages.forEach(msg => displayMessage(msg.sender, msg.text, msg.type));
        }
    }

    function getMessagesFromStorage() {
        const storedMessages = localStorage.getItem(chatMessagesKey);
        return storedMessages ? JSON.parse(storedMessages) : []; // Parse or return empty array
    }
});
