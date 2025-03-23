<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Webhook Manager</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Webhook Manager</h1>
    
    <a href="index.html" class="button">Back to Home</a>

    <h2>Select Webhook</h2>
    <select id="webhookSelect"></select>

    <h2>Send a Webhook Message</h2>
    <form id="webhookForm">
        <input type="text" id="embedTitle" placeholder="Embed Title (optional)">
        <input type="text" id="embedDescription" placeholder="Message Content">
        <input type="color" id="embedColor" value="#ff0000">
        <label>
            <input type="checkbox" id="embedToggle"> Send as Embed
        </label>
        <button type="submit">Send Message</button>
    </form>

    <h2>Edit Sent Message</h2>
    <form id="editForm">
        <input type="text" id="editMessageID" placeholder="Message ID">
        <input type="text" id="editContent" placeholder="New Content">
        <button type="submit">Edit Message</button>
    </form>

    <script src="webhook-script.js"></script>
</body>
</html>