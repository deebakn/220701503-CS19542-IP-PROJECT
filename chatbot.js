// JavaScript to handle chatbot functionality

document.getElementById("messageArea").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get the user's input message
    const userInput = document.getElementById("text").value;
    if (!userInput) return;

    // Display the user's message in the chat
    addMessageToChatbox("You", userInput);

    try {
        // Send the user's message to the chatbot API
        const response = await fetch("https://api.openai.com/v1/engines/davinci-codex/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": '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'
            },
            body: JSON.stringify({
                prompt: userInput,
                max_tokens: 50,
                temperature: 0.7 // You can adjust this parameter to control response creativity
            })
        });

        const data = await response.json();
        const botReply = data.choices[0].text.trim();

        // Display the chatbot's response in the chat
        addMessageToChatbox("Bot", botReply);
    } catch (error) {
        console.error("Error communicating with chatbot:", error);
        addMessageToChatbox("Bot", "Sorry, I couldn't connect to the chatbot service.");
    }

    // Clear the input field
    document.getElementById("text").value = "";
});

// Function to display messages in the chatbox
function addMessageToChatbox(sender, message) {
    const chatbox = document.getElementById("messageFormeight");
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");

    // Styling based on sender
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight; // Auto-scroll to the bottom
}
