const tutorialSteps = [
    { target: '#email', title: '1. Add your alert email', text: 'Enter the address that should receive a message when the watched value changes.', visual: 'watch' },
    { target: '#save-btn', title: '2. Save your email', text: 'Click Save to store the alert address. The confirmation appears below the field.', visual: 'select' },
    { target: '.slider-row', title: '3. Choose the check interval', text: 'Drag the bar in 30-second steps, from 30 seconds to 5 minutes. A longer interval makes fewer page requests.', visual: 'timer' },
    { target: '#highlight-btn', title: '4. Highlight mode', text: 'Select the exact seat status or text on the webpage first, then click this button to monitor it.', visual: 'alert' },
    { target: '#picker-btn', title: '5. Point and click mode', text: 'Click this button, move over the webpage to preview elements, and click the element you want to watch.', visual: 'tech' },
    { target: '#active-panel', title: '6. Watch for updates', text: 'The selected element is checked for live changes and after each scheduled page refresh. You will receive a notification, on-page alert, and email.', visual: 'watch' },
    { target: '#help-btn', title: '7. Open this guide again', text: 'When you need a reminder, click the ? button. Class seats are one example; appointments, inventory, and other changing webpage statuses work too.', visual: 'select' }
];
let tutorialIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['alertEmail', 'isMonitoring', 'refreshInterval', 'tutorialComplete'], (result) => {
        if (result.alertEmail) {
            document.getElementById('email').value = result.alertEmail;
        }
        updateIntervalDisplay(result.refreshInterval || 30);
        if (result.isMonitoring) {
            document.getElementById('controls').style.display = 'none';
            document.getElementById('active-panel').hidden = false;
            document.getElementById('stop-btn').hidden = false;
        }
        if (!result.tutorialComplete) {
            openTutorial();
        }
    });
});

document.getElementById('help-btn').addEventListener('click', openTutorial);
document.getElementById('close-tutorial').addEventListener('click', closeTutorial);
document.getElementById('tutorial-back').addEventListener('click', () => showTutorialStep(tutorialIndex - 1));
document.getElementById('tutorial-next').addEventListener('click', () => {
    if (tutorialIndex === tutorialSteps.length - 1) closeTutorial();
    else showTutorialStep(tutorialIndex + 1);
});

function openTutorial() {
    tutorialIndex = 0;
    document.getElementById('tutorial').hidden = false;
    showTutorialStep(tutorialIndex);
}

function closeTutorial() {
    chrome.storage.local.set({ tutorialComplete: true });
    document.getElementById('tutorial').hidden = true;
    document.querySelectorAll('.tutorial-target').forEach((element) => element.classList.remove('tutorial-target'));
}

function showTutorialStep(index) {
    tutorialIndex = Math.max(0, Math.min(index, tutorialSteps.length - 1));
    const step = tutorialSteps[tutorialIndex];
    document.getElementById('tutorial').dataset.step = tutorialIndex + 1;
    document.getElementById('tutorial-progress').textContent = `${tutorialIndex + 1} / ${tutorialSteps.length}`;
    document.getElementById('tutorial-content').innerHTML = `<div class="tutorial-visual ${step.visual}">${tutorialIndex + 1}</div><h2 id="tutorial-title">${step.title}</h2><p>${step.text}</p>`;
    document.querySelectorAll('.tutorial-target').forEach((element) => element.classList.remove('tutorial-target'));
    const target = document.querySelector(step.target);
    if (target) target.classList.add('tutorial-target');
    requestAnimationFrame(positionTutorialCard);
    document.getElementById('tutorial-back').disabled = tutorialIndex === 0;
    document.getElementById('tutorial-next').textContent = tutorialIndex === tutorialSteps.length - 1 ? 'Start using it' : 'Next';
}

document.getElementById('save-btn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    chrome.storage.local.set({ alertEmail: email }, () => {
        const status = document.getElementById('status');
        status.style.visibility = 'visible';
        setTimeout(() => status.style.visibility = 'hidden', 2000);
    });
});

document.getElementById('refresh-interval').addEventListener('input', async (event) => {
    const refreshInterval = Number(event.target.value);
    updateIntervalDisplay(refreshInterval);
    chrome.storage.local.set({ refreshInterval });
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.id) {
        chrome.tabs.sendMessage(tab.id, { action: "UPDATE_REFRESH_INTERVAL" }).catch(() => {});
    }
});

function updateIntervalDisplay(refreshInterval) {
    const interval = Math.min(300, Math.max(30, Math.round(Number(refreshInterval) / 30) * 30));
    const label = formatInterval(interval);
    const slider = document.getElementById('refresh-interval');
    slider.value = interval;
    slider.setAttribute('aria-valuetext', label);
    document.getElementById('interval-value').textContent = label;
}

// Mode 1: Highlight
document.getElementById('highlight-btn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!isValidTab(tab)) return;

    try {
        const response = await chrome.tabs.sendMessage(tab.id, { action: "START_HIGHLIGHT" });
        if (response && response.success) {
            setMonitoringActive();
        } else {
            alert("Please highlight some text on the webpage first!");
        }
    } catch (error) {
        alert("Could not connect. Please REFRESH the webpage and try again.");
    }
});

// Mode 2: Picker
document.getElementById('picker-btn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!isValidTab(tab)) return;

    try {
        const response = await chrome.tabs.sendMessage(tab.id, { action: "START_PICKER" });
        if (response && response.success) {
            setMonitoringActive();
            window.close(); // Close popup so user can click the page
        }
    } catch (error) {
        alert("Could not connect. Please REFRESH the webpage and try again.");
    }
});

// Stop Monitoring
document.getElementById('stop-btn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    try {
        await chrome.tabs.sendMessage(tab.id, { action: "STOP_MONITORING" });
    } catch (error) {}
    
    chrome.storage.local.set({ isMonitoring: false });
    document.getElementById('controls').style.display = 'block';
    document.getElementById('active-panel').hidden = true;
    document.getElementById('stop-btn').hidden = true;
});

// Helper Functions
function isValidTab(tab) {
    if (!tab || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
        alert("Cannot run on Chrome settings pages or empty tabs. Please go to a normal website.");
        return false;
    }
    return true;
}

function setMonitoringActive() {
    chrome.storage.local.set({ isMonitoring: true });
    document.getElementById('controls').style.display = 'none';
    document.getElementById('active-panel').hidden = false;
    document.getElementById('stop-btn').hidden = false;
}

function formatInterval(interval) {
    if (interval < 60) return `${interval} seconds`;
    const minutes = Math.floor(interval / 60);
    const seconds = interval % 60;
    return seconds ? `${minutes} min ${seconds} s` : `${minutes} min`;
}

function positionTutorialCard() {
    const card = document.querySelector('.tutorial-card');
    const target = document.querySelector('.tutorial-target');
    if (!card) return;

    card.style.top = '12px';
    card.style.bottom = 'auto';
    if (!target) return;

    const targetBox = target.getBoundingClientRect();
    const cardBox = card.getBoundingClientRect();
    let top = targetBox.bottom + 18;
    if (top + cardBox.height > window.innerHeight - 12) {
        top = targetBox.top - cardBox.height - 18;
    }
    card.style.top = `${Math.max(12, top)}px`;
}