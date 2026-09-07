let observer = null;
let monitoredElement = null;
let originalBackgroundColor = "";
let originalTextColor = "";
let originalOutline = "";
let isPicking = false;
let hoveredElement = null;
let reloadTimer = null; 

// ==========================================
// 1. PERSISTENCE: RUNS ON EVERY PAGE LOAD
// ==========================================
chrome.storage.local.get(['isMonitoring', 'monitorUrl', 'monitorSelector', 'lastValue'], (result) => {
    // Only try to restore if we are monitoring AND we are on the same base webpage
    const currentBaseUrl = window.location.href.split('?')[0];
    
    if (result.isMonitoring && result.monitorUrl && currentBaseUrl === result.monitorUrl) {
        // The page just refreshed! Wait for the university system to render the HTML, then reconnect.
        waitForElementAndRestore(result.monitorSelector, result.lastValue, 40);
    }
});

function waitForElementAndRestore(selector, lastValue, retries) {
    const el = document.querySelector(selector);
    
    if (el) {
        const currentValue = el.textContent.trim();
        
        // CHECK IF THE SEAT COUNT CHANGED DURING THE REFRESH!
        if (currentValue !== lastValue) {
            chrome.runtime.sendMessage({ action: "CHANGE_DETECTED", newValue: currentValue });
            // Update storage with the new value so it doesn't spam you with emails
            chrome.storage.local.set({ lastValue: currentValue });
        }
        
        // Lock back on and make it red again
        lockAndMonitorElement(el, true);

        scheduleReload();

    } else if (retries > 0) {
        // If the HTML hasn't loaded yet, wait 500ms and try again
        setTimeout(() => waitForElementAndRestore(selector, lastValue, retries - 1), 500);
    }
}


// ==========================================
// 2. MESSAGE LISTENER
// ==========================================
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    
    if (request.action === "SHOW_ALERT") {
        alert(request.message);
        return;
    }

    if (request.action === "UPDATE_REFRESH_INTERVAL") {
        if (monitoredElement) scheduleReload();
        return;
    }
    
    // --- MODE 1: HIGHLIGHT LOGIC ---
    if (request.action === "START_HIGHLIGHT") {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || selection.toString().trim() === "") {
            sendResponse({ success: false });
            return true;
        }

        let targetElement = selection.getRangeAt(0).commonAncestorContainer;
        if (targetElement.nodeType === Node.TEXT_NODE) {
            targetElement = targetElement.parentElement;
        }

        window.getSelection().removeAllRanges(); 
        lockAndMonitorElement(targetElement, false);
        
        sendResponse({ success: true });
        return true;
    }

    // --- MODE 2: PICKER LOGIC ---
    if (request.action === "START_PICKER") {
        isPicking = true;
        document.body.style.cursor = "crosshair";

        document.addEventListener('mouseover', onMouseOver, true);
        document.addEventListener('mouseout', onMouseOut, true);
        document.addEventListener('click', onPickClick, true);

        sendResponse({ success: true });
        return true;
    }

    // --- STOP MONITORING ---
    if (request.action === "STOP_MONITORING") {
        cleanUpMonitoring();
        // Erase the memory from the hard drive so it stops checking on reload
        chrome.storage.local.remove(['monitorUrl', 'monitorSelector', 'lastValue', 'isMonitoring']);
        sendResponse({ success: true });
        return true;
    }
});


// ==========================================
// 3. PICKER EVENT HANDLERS
// ==========================================
function onMouseOver(e) {
    if (!isPicking) return;
    hoveredElement = e.target;
    originalOutline = hoveredElement.style.outline;
    hoveredElement.style.outline = "2px dashed red";
    e.stopPropagation();
}

function onMouseOut(e) {
    if (!isPicking) return;
    if (hoveredElement) hoveredElement.style.outline = originalOutline;
}

function onPickClick(e) {
    if (!isPicking) return;
    e.preventDefault();
    e.stopPropagation();

    isPicking = false;
    document.body.style.cursor = "default";
    document.removeEventListener('mouseover', onMouseOver, true);
    document.removeEventListener('mouseout', onMouseOut, true);
    document.removeEventListener('click', onPickClick, true);

    e.target.style.outline = originalOutline; 
    lockAndMonitorElement(e.target, false);
}


// ==========================================
// 4. SHARED OBSERVER ENGINE & MEMORY
// ==========================================
function lockAndMonitorElement(element, isRestoring) {
    cleanUpMonitoring(); 

    monitoredElement = element;

    // If we are locking on for the very first time, build the map and save it to memory
    if (!isRestoring) {
        const selector = getCssPath(element);
        const currentValue = element.textContent.trim();
        const currentUrl = window.location.href.split('?')[0]; 
        
        chrome.storage.local.set({
            isMonitoring: true,
            monitorUrl: currentUrl,
            monitorSelector: selector,
            lastValue: currentValue
        });
    }

    // Save colors
    originalBackgroundColor = monitoredElement.style.backgroundColor;
    originalTextColor = monitoredElement.style.color;

    // Turn it red
    monitoredElement.style.backgroundColor = 'red';
    monitoredElement.style.color = 'white'; 

    // Keep the active observer running just in case the university system updates via background AJAX
    observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'characterData' || mutation.type === 'childList') {
                const newValue = monitoredElement.textContent.trim();
                
                chrome.storage.local.get(['lastValue'], (res) => {
                    if (newValue !== res.lastValue) {
                        chrome.runtime.sendMessage({ action: "CHANGE_DETECTED", newValue: newValue });
                        chrome.storage.local.set({ lastValue: newValue }); // Update memory
                    }
                });
            }
        });
    });

    observer.observe(monitoredElement, { characterData: true, childList: true, subtree: true });
    scheduleReload();
}

function scheduleReload() {
    clearTimeout(reloadTimer);
    chrome.storage.local.get(['refreshInterval'], (result) => {
        const refreshSeconds = Math.min(300, Math.max(30, Math.round(Number(result.refreshInterval || 30) / 30) * 30));
        reloadTimer = setTimeout(() => window.location.reload(), refreshSeconds * 1000);
    });
}

function cleanUpMonitoring() {
    clearTimeout(reloadTimer); // <--- ADD THIS LINE
    if (observer) {
        observer.disconnect();
        observer = null;
    }
    if (monitoredElement) {
        monitoredElement.style.backgroundColor = originalBackgroundColor;
        monitoredElement.style.color = originalTextColor; 
        monitoredElement = null;
    }
    isPicking = false;
    document.body.style.cursor = "default";
}

function getCssPath(el) {
    if (!(el instanceof Element)) return;
    var path = [];
    
    // Stop at the body tag so the path doesn't get ridiculously long
    while (el.nodeType === Node.ELEMENT_NODE && el.nodeName.toLowerCase() !== 'body') {
        var selector = el.nodeName.toLowerCase();
        
        // Notice we completely deleted the if (el.id) check here!
        
        var sib = el, nth = 1;
        while (sib = sib.previousElementSibling) {
            if (sib.nodeName.toLowerCase() == selector) nth++;
        }
        selector += ":nth-of-type(" + nth + ")";
        
        path.unshift(selector);
        el = el.parentNode;
    }
    return path.join(" > ");
}