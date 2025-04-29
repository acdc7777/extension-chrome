
function content_to_background() {
    // content.js
    const msg = { title: "test" }
    chrome.runtime.sendMessage(msg, (response) => {
        console.log(response)
    })


    // background.js
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        console.log(msg)
        sendResponse({ msg: "response from background JS" })
    })
}

// ===========================================================


function backgroud_to_content() {
    // backgroud.js
    try {
        chrome.webNavigation.onCompleted.addListener(() => {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                console.log("title: ", tabs[0].url, "id: ", tabs[0].id)

                // Envoyer un message au script de contenu dans l'onglet actif
                const msg = {
                    title: "myMessage",
                    tab: tabs[0]
                }
                chrome.tabs.sendMessage(tabs[0].id, msg, (response) => {
                    if (response) {
                        console.log("ok")
                    }
                });
            });
        });
    } catch (err) { console.log(err) }
    // ===========================================================
    // content.js
    try {
        chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
            const title = await msg.title;
            if (title === "myMessage") {
                sendResponse(true);
                console.log("Title: ", msg.tab.title, "\nID: ", msg.tab.id)
            }
        })
    } catch (err) { console.log(err) }
}

