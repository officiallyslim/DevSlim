const phrases = [
    "Ban Appeals",
    "Discord Support",
    "Game Support",
    "Development",
    "Support",
    "Game News",
    "Discord News",
    "News",
    "Discord Updates",
    "Game Updates",
    "Updates"
];

const typewriterText = document.getElementById('typewriter-text');
let currentPhraseIndex = 0;

function typePhrase() {
    const phrase = phrases[currentPhraseIndex];
    typewriterText.textContent = '';
    let charIndex = 0;

    const typingInterval = setInterval(() => {
        if (charIndex < phrase.length) {
            typewriterText.textContent += phrase.charAt(charIndex);
            charIndex++;
        } else {
            clearInterval(typingInterval);
            setTimeout(() => {
                currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
                typePhrase();
            }, 3000);
        }
    }, 150);
}

typePhrase();

// Webhook sender function
document.getElementById("webhookForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const webhookURL = "YOUR_DISCORD_WEBHOOK_URL";  // Replace with your webhook
    const message = document.getElementById("message").value;

    fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message })
    }).then(() => alert("Message sent!"))
    .catch(() => alert("Error sending message!"));
});