const webhooks = {
    Rules: "https://discord.com/api/webhooks/1346170728252440668/fqkyNEgF9LDX-M3orKPrGdYtbmFFhub6WIvok1mARbB_7nOTW17b6RFTeG4dUvfUCMbU",
    Information: "https://discord.com/api/webhooks/1348112654148960276/NYHuXKmEQF54EHmHLNuqJsZeJLzJy0S2tRIgraxjOHKTzwAYzQlSYgHKh2eBMtHV16U4",
    webhook3: "YOUR_DISCORD_WEBHOOK_URL_3",
    webhook4: "YOUR_DISCORD_WEBHOOK_URL_4",
    webhook5: "YOUR_DISCORD_WEBHOOK_URL_5"
    // Add more as needed
};

// Populate webhook dropdown
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
    const embedColor = document.getElementById("embedColor").value.replace("#", "0x");
    const sendAsEmbed = document.getElementById("embedToggle").checked;

    let payload = sendAsEmbed
        ? { embeds: [{ title: embedTitle || "Untitled", description: embedDescription, color: parseInt(embedColor) }] }
        : { content: embedDescription };

    fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        alert("Message sent!");
        console.log("Sent message:", data);
        if (data.id) localStorage.setItem("lastMessageID", data.id);
    })
    .catch(error => alert("Error sending message!"));
});

// Edit Webhook Message
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
