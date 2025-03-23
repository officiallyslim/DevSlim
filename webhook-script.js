async function sendMessage(webhookURL) {
    const title = document.getElementById("embedTitle").value;
    const description = document.getElementById("embedDescription").value;
    const color = document.getElementById("embedColor").value.replace("#", ""); // Remove # from color
    const sendAsEmbed = document.getElementById("embedToggle").checked;

    let payload;

    if (sendAsEmbed) {
        payload = {
            content: "", // Avoid having non-embed content
            embeds: [{
                title: title || null,
                description: description || null,
                color: parseInt(color, 16) // Convert hex to integer
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

        if (!response.ok) {
            alert("Error sending message.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// **Load Message by ID and Populate Fields**
async function loadMessage(webhookURL) {
    const messageId = document.getElementById("editMessageID").value;

    if (!messageId) {
        alert("Please enter a message ID.");
        return;
    }

    try {
        const response = await fetch(`${webhookURL}/messages/${messageId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            alert("Message not found.");
            return;
        }

        const data = await response.json();

        // Load plain content (if exists)
        document.getElementById("editContent").value = data.content || "";

        // Check if there's an embed
        if (data.embeds && data.embeds.length > 0) {
            const embed = data.embeds[0];

            document.getElementById("embedTitle").value = embed.title || "";
            document.getElementById("embedDescription").value = embed.description || "";

            if (embed.color) {
                document.getElementById("embedColor").value = `#${embed.color.toString(16).padStart(6, "0")}`;
            }

            document.getElementById("embedToggle").checked = true;
        } else {
            document.getElementById("embedToggle").checked = false;
        }

    } catch (error) {
        console.error("Error fetching message:", error);
    }
}

// **Edit an Existing Message**
async function editMessage(webhookURL) {
    const messageId = document.getElementById("editMessageID").value;
    const newContent = document.getElementById("editContent").value;
    const newTitle = document.getElementById("embedTitle").value;
    const newDescription = document.getElementById("embedDescription").value;
    const newColor = document.getElementById("embedColor").value.replace("#", "");
    const sendAsEmbed = document.getElementById("embedToggle").checked;

    if (!messageId) {
        alert("Please enter a message ID.");
        return;
    }

    let payload;

    if (sendAsEmbed) {
        payload = {
            content: "", // Ensuring only embed is sent
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
        const response = await fetch(`${webhookURL}/messages/${messageId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            alert("Failed to edit message.");
        }
    } catch (error) {
        console.error("Error editing message:", error);
    }
}

// Add event listeners
document.getElementById("webhookForm").addEventListener("submit", function (e) {
    e.preventDefault();
    sendMessage(webhookURL);
});

document.getElementById("loadMessage").addEventListener("click", function () {
    loadMessage(webhookURL);
});

document.getElementById("editForm").addEventListener("submit", function (e) {
    e.preventDefault();
    editMessage(webhookURL);
});