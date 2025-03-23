document.getElementById("embedToggle").addEventListener("change", function() {
    document.getElementById("embedOptions").style.display = this.checked ? "block" : "none";
});

document.getElementById("editEmbedToggle").addEventListener("change", function() {
    document.getElementById("editEmbedOptions").style.display = this.checked ? "block" : "none";
});

document.getElementById("sendMessage").addEventListener("click", function() {
    const webhookUrl = document.getElementById("webhookUrl").value;
    const messageContent = document.getElementById("messageContent").value;
    const embedToggle = document.getElementById("embedToggle").checked;
    
    let payload = { content: messageContent };
    
    if (embedToggle) {
        payload.embeds = [{
            title: document.getElementById("embedTitle").value,
            description: document.getElementById("embedDescription").value,
            color: parseInt(document.getElementById("embedColor").value.replace("#", ""), 16)
        }];
    }
    
    fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    }).then(response => alert("Message Sent!"));
});

document.getElementById("loadMessage").addEventListener("click", async function() {
    const webhookUrl = document.getElementById("webhookUrl").value;
    const messageId = document.getElementById("messageId").value;
    
    const webhookParts = webhookUrl.split("/");
    const channelId = webhookParts[webhookParts.length - 2];

    const response = await fetch(`https://discord.com/api/v9/channels/${channelId}/messages/${messageId}`);
    const messageData = await response.json();

    if (messageData.content) {
        document.getElementById("editContent").value = messageData.content;
    }

    if (messageData.embeds.length > 0) {
        const embed = messageData.embeds[0];
        document.getElementById("editEmbedToggle").checked = true;
        document.getElementById("editEmbedOptions").style.display = "block";
        document.getElementById("editEmbedTitle").value = embed.title || "";
        document.getElementById("editEmbedDescription").value = embed.description || "";
    }
});

document.getElementById("editMessage").addEventListener("click", function() {
    const webhookUrl = document.getElementById("webhookUrl").value;
    const messageId = document.getElementById("messageId").value;
    const editContent = document.getElementById("editContent").value;
    const editEmbedToggle = document.getElementById("editEmbedToggle").checked;

    let payload = { content: editContent };

    if (editEmbedToggle) {
        payload.embeds = [{
            title: document.getElementById("editEmbedTitle").value,
            description: document.getElementById("editEmbedDescription").value,
            color: parseInt(document.getElementById("editEmbedColor").value.replace("#", ""), 16)
        }];
    }

    fetch(`${webhookUrl}/messages/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    }).then(response => alert("Message Edited!"));
});