async function sendMessage(webhookURL) {
    const title = document.getElementById("embedTitle").value;
    const description = document.getElementById("embedDescription").value;
    const color = document.getElementById("embedColor").value.replace("#", ""); // Remove # from color
    const sendAsEmbed = document.getElementById("embedToggle").checked;

    let payload;

    if (sendAsEmbed) {
        payload = {
            embeds: [{
                title: title || null,
                description: description,
                color: parseInt(color, 16)
            }]
        };
    } else {
        payload = { content: description };
    }

    try {
        const response = await fetch(webhookURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("Message sent!");
        } else {
            alert("Failed to send message.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function loadMessage(webhookURL) {
    const messageID = document.getElementById("editMessageID").value;
    if (!messageID) {
        alert("Enter a Message ID!");
        return;
    }

    try {
        const response = await fetch(`${webhookURL}/messages/${messageID}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            alert("Failed to load message.");
            return;
        }

        const messageData = await response.json();
        console.log("Loaded Message Data:", messageData);

        // Set text content (outside embed)
        document.getElementById("editContent").value = messageData.content || "";

        // If there's an embed, load its details
        if (messageData.embeds.length > 0) {
            const embed = messageData.embeds[0];
            document.getElementById("embedTitle").value = embed.title || "";
            document.getElementById("embedDescription").value = embed.description || "";
            document.getElementById("embedColor").value = embed.color ? `#${embed.color.toString(16)}` : "#ff0000";
            document.getElementById("embedToggle").checked = true;
        } else {
            document.getElementById("embedToggle").checked = false;
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function editMessage(webhookURL) {
    const messageID = document.getElementById("editMessageID").value;
    if (!messageID) {
        alert("Enter a Message ID!");
        return;
    }

    const newContent = document.getElementById("editContent").value;
    const newTitle = document.getElementById("embedTitle").value;
    const newDescription = document.getElementById("embedDescription").value;
    const newColor = document.getElementById("embedColor").value.replace("#", "");
    const editAsEmbed = document.getElementById("embedToggle").checked;

    let payload;

    if (editAsEmbed) {
        payload = {
            content: newContent || "", // Ensure content is still included
            embeds: [{
                title: newTitle || null,
                description: newDescription || null,
                color: parseInt(newColor, 16)
            }]
        };
    } else {
        payload = { content: newContent };
    }

    try {
        const response = await fetch(`${webhookURL}/messages/${messageID}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("Message edited successfully!");
        } else {
            alert("Failed to edit message.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}