const webhooks = {
    "webhook-1": "YOUR_DISCORD_WEBHOOK_URL_1",
    "webhook-2": "YOUR_DISCORD_WEBHOOK_URL_2",
    "webhook-3": "YOUR_DISCORD_WEBHOOK_URL_3",
    "webhook-4": "YOUR_DISCORD_WEBHOOK_URL_4",
    "webhook-5": "YOUR_DISCORD_WEBHOOK_URL_5",
    "webhook-6": "https://discord.com/api/webhooks/1353295895613145229/4Bneq4JONcU-qnkDMvrxy0ReTJ2Rj2V1FeazoiwM5VEKmFf-aEwK_h9XcTwo6vD2Z9oI",
    "webhook-7": "YOUR_DISCORD_WEBHOOK_URL_7",
    "webhook-8": "YOUR_DISCORD_WEBHOOK_URL_8",
    "webhook-9": "YOUR_DISCORD_WEBHOOK_URL_9",
    "webhook-10": "YOUR_DISCORD_WEBHOOK_URL_10",
    "webhook-11": "YOUR_DISCORD_WEBHOOK_URL_11",
    "webhook-12": "YOUR_DISCORD_WEBHOOK_URL_12",
    "webhook-13": "YOUR_DISCORD_WEBHOOK_URL_13",
    "webhook-14": "YOUR_DISCORD_WEBHOOK_URL_14",
    "webhook-15": "YOUR_DISCORD_WEBHOOK_URL_15",
    "webhook-16": "YOUR_DISCORD_WEBHOOK_URL_16",
    "webhook-17": "YOUR_DISCORD_WEBHOOK_URL_17",
    "webhook-18": "YOUR_DISCORD_WEBHOOK_URL_18",
    "webhook-19": "YOUR_DISCORD_WEBHOOK_URL_19",
    "webhook-20": "YOUR_DISCORD_WEBHOOK_URL_20",
    "webhook-21": "YOUR_DISCORD_WEBHOOK_URL_21",
    "webhook-22": "YOUR_DISCORD_WEBHOOK_URL_22",
    "webhook-23": "YOUR_DISCORD_WEBHOOK_URL_23",
    "webhook-24": "YOUR_DISCORD_WEBHOOK_URL_24",
    "webhook-25": "YOUR_DISCORD_WEBHOOK_URL_25"
};

function getWebhookURL(webhookKey) {
    return webhooks[webhookKey] || null;
}

function sendMessage(webhookKey) {
    const webhookURL = getWebhookURL(webhookKey);
    if (!webhookURL) return alert("Invalid webhook!");

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
        if (data.id) {
            alert(`Message sent! Message ID: ${data.id}`);
            localStorage.setItem(`${webhookKey}_lastMessageID`, data.id);
        } else {
            alert("Message sent, but couldn't get ID.");
        }
    })
    .catch(() => alert("Error sending message!"));
}

function loadMessage(webhookKey) {
    const webhookURL = getWebhookURL(webhookKey);
    if (!webhookURL) return alert("Invalid webhook!");

    const messageID = document.getElementById("editMessageID").value || localStorage.getItem(`${webhookKey}_lastMessageID`);
    if (!messageID) return alert("Please enter a valid message ID.");

    fetch(`${webhookURL}/messages/${messageID}`, { method: "GET" })
    .then(response => {
        if (!response.ok) throw new Error("Message not found.");
        return response.json();
    })
    .then(data => {
        document.getElementById("editContent").value = data.content || "[No Content]";
        alert("Message loaded! You can now edit it.");
    })
    .catch(() => alert("Could not load message content! Ensure it's sent from this webhook."));
}

function editMessage(webhookKey) {
    const webhookURL = getWebhookURL(webhookKey);
    if (!webhookURL) return alert("Invalid webhook!");

    const messageID = document.getElementById("editMessageID").value || localStorage.getItem(`${webhookKey}_lastMessageID`);
    const newContent = document.getElementById("editContent").value;

    if (!messageID) return alert("Please enter a valid message ID.");

    fetch(`${webhookURL}/messages/${messageID}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent })
    })
    .then(response => {
        if (!response.ok) throw new Error("Edit failed.");
        alert("Message edited successfully!");
    })
    .catch(() => alert("Failed to edit message! Ensure it's sent from this webhook."));
}