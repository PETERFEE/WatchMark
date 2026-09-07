chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "CHANGE_DETECTED") {
        
        // Fetch the saved email first so we can include it in the popups
        chrome.storage.local.get(['alertEmail'], (result) => {
            if (result.alertEmail) {
                
                const popupMessage = `Changes occur, email sent to: ${result.alertEmail}`;

                // 1. Trigger the Chrome Extension desktop notification
                chrome.notifications.create({
                    type: "basic",
                    iconUrl: chrome.runtime.getURL("icons/icon128.png"),
                    title: "WatchMark update",
                    message: popupMessage,
                    priority: 2
                });

                // 2. Tell the webpage to throw a visual alert box on the screen
                if (sender.tab && sender.tab.id) {
                    chrome.tabs.sendMessage(sender.tab.id, { 
                        action: "SHOW_ALERT", 
                        message: popupMessage 
                    });
                }

                // 3. Send the actual email via EmailJS
                sendEmailAlert(result.alertEmail, request.newValue);

            } else {
                console.log("Change detected, but no email address was saved.");
            }
        });
    }
});

function sendEmailAlert(emailAddress, newValue) {
    const emailJsUrl = "https://api.emailjs.com/api/v1.0/email/send";

    const payload = {
        service_id: "service_sjd4k6i",     
        template_id: "template_31kpfg8",   
        user_id: "har84vKHUESauuHzv",        
        template_params: {
            to_email: emailAddress,        
            message: `Seat changed to: ${newValue}` 
        }
    };

    fetch(emailJsUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
            console.log("Email alert sent successfully to:", emailAddress);
        } else {
            console.error("Failed to send email alert. Check your API settings in EmailJS.");
        }
    })
    .catch(error => console.error("Error sending email:", error));
}