document.addEventListener("DOMContentLoaded", function () {
    let embeds = [];

    function updateEmbedPreview() {
        const container = document.getElementById("embedsContainer");
        container.innerHTML = ""; 

        embeds.forEach((embed, index) => {
            const embedDiv = document.createElement("div");
            embedDiv.className = "embed";
            embedDiv.innerHTML = `
                <div class="embed-header">
                    <input type="text" class="embed-title" value="${embed.title || ""}" placeholder="Title">
                    <input type="color" class="embed-color" value="${embed.color || "#ffffff"}">
                </div>
                <textarea class="embed-description" placeholder="Description">${embed.description || ""}</textarea>
                <input type="text" class="embed-image" value="${embed.image || ""}" placeholder="Image URL">
                <button onclick="removeEmbed(${index})">❌ Remove</button>
            `;
            container.appendChild(embedDiv);
        });
    }

    function addEmbed() {
        embeds.push({
            title: "",
            description: "",
            color: "#ffffff",
            image: ""
        });
        updateEmbedPreview();
    }

    function removeEmbed(index) {
        embeds.splice(index, 1);
        updateEmbedPreview();
    }

    async function sendMessage() {
        const webhookURL = document.getElementById("webhookURL").value;
        const content = document.getElementById("messageContent").value;

        let payload = {
            content: content || null,
            embeds: embeds.length > 0 ? embeds : null
        };

        try {
            const response = await fetch(webhookURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) alert("Failed to send message.");
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function loadMessage() {
        const webhookURL = document.getElementById("webhookURL").value;
        const messageId = document.getElementById("editMessageID").value;
        if (!messageId) return alert("Please enter a message ID.");

        try {
            const response = await fetch(`${webhookURL}/messages/${messageId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) return alert("Message not found.");

            const data = await response.json();
            document.getElementById("messageContent").value = data.content || "";

            if (data.embeds) {
                embeds = data.embeds.map(embed => ({
                    title: embed.title || "",
                    description: embed.description || "",
                    color: embed.color ? `#${embed.color.toString(16).padStart(6, "0")}` : "#ffffff",
                    image: embed.image ? embed.image.url : ""
                }));
                updateEmbedPreview();
            }
        } catch (error) {
            console.error("Error fetching message:", error);
        }
    }

    async function editMessage() {
        const webhookURL = document.getElementById("webhookURL").value;
        const messageId = document.getElementById("editMessageID").value;
        const content = document.getElementById("messageContent").value;

        if (!messageId) return alert("Please enter a message ID.");

        let payload = {
            content: content || null,
            embeds: embeds.length > 0 ? embeds : null
        };

        try {
            const response = await fetch(`${webhookURL}/messages/${messageId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) alert("Failed to edit message.");
        } catch (error) {
            console.error("Error editing message:", error);
        }
    }

    // Event Listeners
    document.getElementById("addEmbed").addEventListener("click", addEmbed);
    document.getElementById("sendMessage").addEventListener("click", sendMessage);
    document.getElementById("loadMessage").addEventListener("click", loadMessage);
    document.getElementById("editMessage").addEventListener("click", editMessage);
});