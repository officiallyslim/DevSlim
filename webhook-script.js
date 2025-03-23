const webhooks = {
    webhook1: "https://discord.com/api/webhooks/1348112654148960276/NYHuXKmEQF54EHmHLNuqJsZeJLzJy0S2tRIgraxjOHKTzwAYzQlSYgHKh2eBMtHV16U4",
    webhook2: "https://discord.com/api/webhooks/1353305071831613492/3w8qlY9LnUmUt4Ojgx0hmcKl5bX0oJztC72qx_QyXcTvI3PQJo5bxXDTDQN0lHlwmf-J",
    webhook3: "https://discord.com/api/webhooks/1353311602337910836/j9Rv9T08iXXapZzX29trT1TIKSqfqW9r8R3o1vQnqjL3KfomoAM89IegpwOZMnqv69Yf",
    webhook4: "https://discord.com/api/webhooks/1353311832974164038/NJVxtBB0MmtANqthg9_6firo6DmYltRIaxCYG6VRgcIpm4nAVEiCzmMA4JjQdNi4Zyg1",
    webhook5: "https://discord.com/api/webhooks/1353311832974164038/NJVxtBB0MmtANqthg9_6firo6DmYltRIaxCYG6VRgcIpm4nAVEiCzmMA4JjQdNi4Zyg1"
};

// Function to get webhook URL based on the active page
function getWebhookURL() {
    const pageTitle = document.title.toLowerCase();
    if (pageTitle.includes("webhook 1")) return webhooks.webhook1;
    if (pageTitle.includes("webhook 2")) return webhooks.webhook2;
    if (pageTitle.includes("webhook 3")) return webhooks.webhook3;
    if (pageTitle.includes("webhook 4")) return webhooks.webhook4;
    if (pageTitle.includes("webhook 5")) return webhooks.webhook5;
    return null;
}

// Function to send a new message
async function sendMessage() {
    const webhookURL = getWebhookURL();
    if (!webhookURL) {
        alert("Webhook URL not found.");
        return;
    }

    const embedTitle = document.getElementById("embedTitle").value;
    const embedDescription = document.getElementById("embedDescription").value;
    const embedColor = document.getElementById("embedColor").value.replace("#", "0x");
    const sendAsEmbed = document.getElementById("embedToggle").checked;

    let payload = { content: embedDescription };

    if (sendAsEmbed && (embedTitle || embedDescription)) {
        payload = {
            embeds: [{
                title: embedTitle || undefined,
                description: embedDescription || undefined,
                color: parseInt(embedColor) || 0xff0000
            }]
        };
    }

    try {
        const response = await fetch(webhookURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        alert("Message sent successfully!");
    } catch (error) {
        console.error("Failed to send message:", error);
        alert("Failed to send message. Check the console for more details.");
    }
}

// Function to edit an existing message
async function editMessage() {
    const webhookURL = getWebhookURL();
    if (!webhookURL) {
        alert("Webhook URL not found.");
        return;
    }

    const messageID = document.getElementById("editMessageID").value;
    const newContent = document.getElementById("editContent").value;
    const embedTitle = document.getElementById("embedTitle").value;
    const embedDescription = document.getElementById("embedDescription").value;
    const embedColor = document.getElementById("embedColor").value.replace("#", "0x");

    if (!messageID) {
        alert("Please enter a Message ID.");
        return;
    }

    let payload = { content: newContent };

    if (embedTitle || embedDescription) {
        payload.embeds = [{
            title: embedTitle || undefined,
            description: embedDescription || undefined,
            color: parseInt(embedColor) || 0xff0000
        }];
    }

    try {
        const response = await fetch(`${webhookURL}/messages/${messageID}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        alert("Message edited successfully!");
    } catch (error) {
        console.error("Failed to edit message:", error);
        alert("Failed to edit message. Check the console for more details.");
    }
}

// Function to load a message by ID
async function loadMessage() {
    const webhookURL = getWebhookURL();
    if (!webhookURL) {
        alert("Webhook URL not found.");
        return;
    }

    const messageID = document.getElementById("editMessageID").value;
    if (!messageID) {
        alert("Please enter a Message ID.");
        return;
    }

    try {
        const response = await fetch(`${webhookURL}/messages/${messageID}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        document.getElementById("editContent").value = data.content || "";
        if (data.embeds.length > 0) {
            document.getElementById("embedTitle").value = data.embeds[0].title || "";
            document.getElementById("embedDescription").value = data.embeds[0].description || "";
            document.getElementById("embedColor").value = `#${data.embeds[0].color.toString(16).padStart(6, "0")}`;
        }

        alert("Message loaded successfully!");
    } catch (error) {
        console.error("Failed to load message:", error);
        alert("Failed to load message. Check the console for more details.");
    }
}

// Attach event listeners
document.addEventListener("DOMContentLoaded", function () {
    const webhookForm = document.getElementById("webhookForm");
    if (webhookForm) {
        webhookForm.addEventListener("submit", function (e) {
            e.preventDefault();
            sendMessage();
        });
    }

    const editForm = document.getElementById("editForm");
    if (editForm) {
        editForm.addEventListener("submit", function (e) {
            e.preventDefault();
            editMessage();
        });
    }

    const loadMessageButton = document.getElementById("loadMessage");
    if (loadMessageButton) {
        loadMessageButton.addEventListener("click", function () {
            loadMessage();
        });
    }
});