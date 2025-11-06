const generateBtn = document.getElementById('generate-btn');
const checkStatusBtn = document.getElementById('check-status-btn');
const resultsLog = document.getElementById('results-log');

const tabLinks = document.querySelectorAll('.tab-link');
const tabContents = document.querySelectorAll('.tab-content');

let hasClearedInitialLog = false;

export function getTaskId() {
    return document.getElementById('task-id').value;
}

export function getGenerateFormParams() {
    const tagsValue = document.getElementById('tags').value;
    const params = {
        prompt: document.getElementById('prompt').value,
        lyrics: document.getElementById('lyrics').value,
        instrumental: document.getElementById('instrumental').checked,
        num_songs: parseInt(document.getElementById('num-songs').value, 10),
        output_format: document.getElementById('output-format').value,
    };
    if (tagsValue) {
        params.tags = tagsValue.split(',').map(tag => tag.trim());
    }
    // Remove empty fields so the API can use defaults
    for (const key in params) {
        if (params[key] === '' || params[key] === null || (Array.isArray(params[key]) && params[key].length === 0)) {
            delete params[key];
        }
    }
    return params;
}

export function setLoading(isLoading) {
    generateBtn.disabled = isLoading;
    checkStatusBtn.disabled = isLoading;
    generateBtn.textContent = isLoading ? 'Generating...' : 'Generate';
}

function log(content, type = '') {
    if (!hasClearedInitialLog) {
        resultsLog.innerHTML = '';
        hasClearedInitialLog = true;
    }
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerHTML = content;
    resultsLog.prepend(entry);
}

export function logMessage(message) {
    log(`<p>${message}</p>`);
}

export function logError(message) {
    log(`<p>${message}</p>`, 'error');
}

export function logSuccess(message) {
    log(`<p>${message}</p>`, 'success');
}

export function clearLogs() {
    resultsLog.innerHTML = '<p>Results will appear here...</p>';
    hasClearedInitialLog = false;
}

export function displaySongs(taskId, songUrls) {
    const songContainer = document.createElement('div');
    songContainer.innerHTML = `<h4>Songs for Task <span class="task-id">${taskId}</span></h4>`;
    songUrls.forEach((url, index) => {
        const audioElement = document.createElement('div');
        audioElement.innerHTML = `
            <p>Song ${index + 1}:</p>
            <audio controls src="${url}"></audio>
            <a href="${url}" download="sonauto_song_${taskId}_${index}.ogg" target="_blank">Download</a>
        `;
        songContainer.appendChild(audioElement);
    });
    const logEntry = resultsLog.querySelector(`.log-entry-task-${taskId}`);
    if (logEntry) {
        logEntry.appendChild(songContainer);
    } else {
        log(songContainer.innerHTML);
    }
}

export function updateTaskStatus(taskId, status) {
    let logEntry = document.querySelector(`.log-entry-task-${taskId}`);
    if (!logEntry) {
        const newEntry = document.createElement('div');
        newEntry.className = `log-entry log-entry-task-${taskId}`;
        newEntry.innerHTML = `<p>Task <span class="task-id">${taskId}</span> Status: <span class="status">${status}</span></p>`;
        if (!hasClearedInitialLog) {
            resultsLog.innerHTML = '';
            hasClearedInitialLog = true;
        }
        resultsLog.prepend(newEntry);
    } else {
        const statusEl = logEntry.querySelector('.status');
        if (statusEl) {
            statusEl.textContent = status;
        }
    }
}

export function setActiveTab(tabId) {
    tabLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.tab === tabId);
    });
    tabContents.forEach(content => {
        content.classList.toggle('active', content.id === tabId);
    });
}

