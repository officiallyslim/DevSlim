function sendMessage(webhookURL) {
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
    .then(() => alert("Message sent!"))
    .catch(() => alert("Error sending message!"));
}

function loadMessage(webhookURL) {
    const messageID = document.getElementById("editMessageID").value;
    if (!messageID) return alert("Please enter a valid message ID.");

    fetch(`${webhookURL}/messages/${messageID}`)
    .then(response => response.json())
    .then(data => {
        document.getElementById("editContent").value = data.content || "[No Content]";
    })
    .catch(() => alert("Could not load message content!"));
}

function editMessage(webhookURL) {
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
}