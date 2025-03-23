async function sendMessage(webhookURL) {
    const embedToggle = document.getElementById("embedToggle").checked;
    const content = document.getElementById("embedDescription").value;
    const title = document.getElementById("embedTitle").value;
    const color = document.getElementById("embedColor").value.replace("#", "0x");

    if (!content) {
        alert("Message content cannot be empty!");
        return;
    }

    let payload;

    if (embedToggle) {
        payload = {
            embeds: [{
                title: title || undefined,
                description: content,
                color: parseInt(color) || 16711680 // Default: Red (#FF0000)
            }]
        };
    } else {
        payload = { content };
    }

    try {
        const response = await fetch(webhookURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to send message.");

        alert("Message sent successfully!");
    } catch (error) {
        console.error("Error:", error);
        alert("Error sending message.");
    }
}

async function loadMessage(webhookURL) {
    const messageID = document.getElementById("editMessageID").value;
    if (!messageID) {
        alert("Please enter a Message ID.");
        return;
    }

    try {
        const response = await fetch(`${webhookURL}/messages/${messageID}`);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();

        // Load plain text content
        document.getElementById("editContent").value = data.content || "";

        if (data.embeds && data.embeds.length > 0) {
            const embed = data.embeds[0];

            document.getElementById("embedTitle").value = embed.title || "";
            document.getElementById("embedDescription").value = embed.description || "";

            if (embed.color) {
                document.getElementById("embedColor").value = `#${embed.color.toString(16).padStart(6, "0")}`;
            }

            document.getElementById("embedToggle").checked = true;
        } else {
            // Clear embed fields if no embed is present
            document.getElementById("embedTitle").value = "";
            document.getElementById("embedDescription").value = "";
            document.getElementById("embedColor").value = "#ff0000";
            document.getElementById("embedToggle").checked = false;
        }

        alert("Message loaded successfully!");
    } catch (error) {
        console.error("Failed to load message:", error);
        alert("Failed to load message.");
    }
}

async function editMessage(webhookURL) {
    const messageID = document.getElementById("editMessageID").value;
    const content = document.getElementById("editContent").value;
    const embedToggle = document.getElementById("embedToggle").checked;
    const title = document.getElementById("embedTitle").value;
    const color = document.getElementById("embedColor").value.replace("#", "0x");

    if (!messageID) {
        alert("Please enter a Message ID.");
        return;
    }

    if (!content) {
        alert("Message content cannot be empty!");
        return;
    }

    let payload;

    if (embedToggle) {
        payload = {
            content: "",
            embeds: [{
                title: title || undefined,
                description: content,
                color: parseInt(color) || 16711680 // Default: Red (#FF0000)
            }]
        };
    } else {
        payload = { content, embeds: [] }; // Clear embeds if toggle is off
    }

    try {
        const response = await fetch(`${webhookURL}/messages/${messageID}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to edit message.");

        alert("Message edited successfully!");
    } catch (error) {
        console.error("Error:", error);
        alert("Error editing message.");
    }
}