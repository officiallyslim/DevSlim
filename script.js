async function sendMessage() {
    const webhookURL = document.getElementById("webhookURL").value;
    const messageContent = document.getElementById("messageContent").value;
    const embedTitle = document.getElementById("embedTitle").value;
    const embedDescription = document.getElementById("embedDescription").value;
    const embedColor = document.getElementById("embedColor").value.replace("#", "");

    if (!webhookURL) return alert("Please enter a webhook URL.");

    const payload = {
        content: messageContent,
        embeds: embedTitle || embedDescription ? [{
            title: embedTitle,
            description: embedDescription,
            color: parseInt(embedColor, 16)
        }] : []
    };

    fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    }).then(res => {
        if (res.ok) alert("Message sent!");
        else alert("Failed to send message.");
    });
}

async function loadMessage() {
    const webhookURL = document.getElementById("webhookURL").value;
    const messageID = document.getElementById("editMessageID").value;

    if (!webhookURL || !messageID) return alert("Enter webhook URL and message ID.");

    try {
        const response = await fetch(webhookURL.replace("/api/webhooks/", "/api/webhooks/messages/") + "/" + messageID);
        const data = await response.json();

        if (data.content) document.getElementById("messageContent").value = data.content;
        if (data.embeds.length > 0) {
            document.getElementById("embedTitle").value = data.embeds[0].title || "";
            document.getElementById("embedDescription").value = data.embeds[0].description || "";
        }
    } catch (error) {
        alert("Failed to load message.");
    }
}

async function editMessage() {
    const webhookURL = document.getElementById("webhookURL").value;
    const messageID = document.getElementById("editMessageID").value;
    const messageContent = document.getElementById("messageContent").value;
    const embedTitle = document.getElementById("embedTitle").value;
    const embedDescription = document.getElementById("embedDescription").value;
    const embedColor = document.getElementById("embedColor").value.replace("#", "");

    if (!webhookURL || !messageID) return alert("Enter webhook URL and message ID.");

    const payload = {
        content: messageContent,
        embeds: embedTitle || embedDescription ? [{
            title: embedTitle,
            description: embedDescription,
            color: parseInt(embedColor, 16)
        }] : []
    };

    fetch(webhookURL.replace("/api/webhooks/", "/api/webhooks/messages/") + "/" + messageID, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    }).then(res => {
        if (res.ok) alert("Message edited!");
        else alert("Failed to edit message.");
    });
}