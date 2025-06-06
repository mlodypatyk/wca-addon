chrome.storage.sync.get({averages: [5, 12, 25, 100]}, (result) => {
    document.getElementById("avgs").value = result.averages
})
document.getElementById("savebutton").addEventListener("click", () => {
    avgs = document.getElementById("avgs").value.split(',').map(Number)
    chrome.storage.sync.set({averages: avgs}, () => {
        alert("Saved.")
    }
    )
})