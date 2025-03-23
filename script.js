const phrases = [
    "Ban Appeals",
    "Discord Support",
    "Game Support",
    "Development",
    "Support",
    "Game News",
    "Discord News",
    "News",
    "Discord Updates",
    "Game Updates",
    "Updates"
];

const typewriterText = document.getElementById('typewriter-text');
let currentPhraseIndex = 0;

function typePhrase() {
    const phrase = phrases[currentPhraseIndex];
    typewriterText.textContent = '';
    let charIndex = 0;

    const typingInterval = setInterval(() => {
        if (charIndex < phrase.length) {
            typewriterText.textContent += phrase.charAt(charIndex);
            charIndex++;
        } else {
            clearInterval(typingInterval);
            setTimeout(() => {
                currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
                typePhrase();
            }, 3000);
        }
    }, 150);
}

typePhrase();

// Define 25 webhooks
const webhooks = {
    webhook1: "YOUR_DISCORD_WEBHOOK_URL_1",
    webhook2: "YOUR_DISCORD_WEBHOOK_URL_2",
    webhook3: "YOUR_DISCORD_WEBHOOK_URL_3",
    webhook4: "YOUR_DISCORD_WEBHOOK_URL_4",
    webhook5: "YOUR_DISCORD_WEBHOOK_URL_5",
    webhook6: "YOUR_DISCORD_WEBHOOK_URL_6",
    webhook7: "YOUR_DISCORD_WEBHOOK_URL_7",
    webhook8: "YOUR_DISCORD_WEBHOOK_URL_8",
    webhook9: "YOUR_DISCORD_WEBHOOK_URL_9",
    webhook10: "YOUR_DISCORD_WEBHOOK_URL_10",
    webhook11: "YOUR_DISCORD_WEBHOOK_URL_11",
    webhook12: "YOUR_DISCORD_WEBHOOK_URL_12",
    webhook13: "YOUR_DISCORD_WEBHOOK_URL_13",
    webhook14: "YOUR_DISCORD_WEBHOOK_URL_14",
    webhook15: "YOUR_DISCORD_WEBHOOK_URL_15",
    webhook16: "YOUR_DISCORD_WEBHOOK_URL_16",
    webhook17: "YOUR_DISCORD_WEBHOOK_URL_17",
    webhook18: "YOUR_DISCORD_WEBHOOK_URL_18",
    webhook19: "YOUR_DISCORD_WEBHOOK_URL_19",
    webhook20: "YOUR_DISCORD_WEBHOOK_URL_20",
    webhook21: "YOUR_DISCORD_WEBHOOK_URL_21",
    webhook22: "YOUR_DISCORD_WEBHOOK_URL_22",
    webhook23: "YOUR_DISCORD_WEBHOOK_URL_23",
    webhook24: "YOUR_DISCORD_WEBHOOK_URL_24",
    webhook25: "YOUR_DISCORD_WEBHOOK_URL_25"
};

// Populate the dropdown with webhook options
const webhookSelect = document.getElementById("webhookSelect");
Object.keys(webhooks).forEach(key => {
    let option = document.createElement("option");
    option.value = key;
    option.textContent = key.replace("webhook", "Webhook ");
    webhookSelect.appendChild(option);
});

// Send Webhook Message
document.getElementById("webhookForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const selectedWebhook = document.getElementById("webhookSelect").value;
    const webhookURL = webhooks[selectedWebhook];

    const embedTitle = document.getElementById("embedTitle").value;
    const embedDescription = document.getElementById("embedDescription").value;
    const embedColor = document.getElementById("embedColor").value.replace("#", "0x"); // Convert to Discord format
    const sendAsEmbed = document.getElementById("embedToggle").checked;

    let payload = {};

    if (sendAsEmbed) {
        payload.embeds = [{
            title: embedTitle || "Untitled",
            description: embedDescription,
            color: parseInt(embedColor)
        }];
    } else {
        payload.content = embedDescription;
    }

    fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        alert("Message sent!");
        console.log("Sent message:", data);
        if (data.id) {
            localStorage.setItem("lastMessageID", data.id); // Save last message ID for editing
        }
    })
    .catch(error => alert("Error sending message!"));
});

// Edit Last Sent Webhook Message
document.getElementById("editForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const selectedWebhook = document.getElementById("webhookSelect").value;
    const webhookURL = webhooks[selectedWebhook];

    const messageID = document.getElementById("editMessageID").value;
    const newContent = document.getElementById("editContent").value;

    if (!messageID) {
        alert("Please enter a valid message ID.");
        return;
    }

    fetch(`${webhookURL}/messages/${messageID}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent })
    })
    .then(() => alert("Message edited successfully!"))
    .catch(() => alert("Failed to edit message!"));
});