import * as api from './api.js';
import * as ui from './ui.js';

const POLLING_INTERVAL = 5000; // 5 seconds

async function handleGenerateSubmit(event) {
    event.preventDefault();
    
    const params = ui.getGenerateFormParams();
    
    ui.setLoading(true);
    ui.logMessage('Starting song generation...');
    
    try {
        const data = await api.generateSong(params);
        if (data.task_id) {
            ui.logMessage(`Generation task started successfully. Task ID: <span class="task-id">${data.task_id}</span>`);
            pollForStatus(data.task_id);
        } else {
            ui.logError(`Failed to start generation. Response: ${JSON.stringify(data)}`);
        }
    } catch (error) {
        ui.logError(`Error generating song: ${error.message}`);
    } finally {
        ui.setLoading(false);
    }
}

function pollForStatus(taskId) {
    ui.logMessage(`Polling for status of task <span class="task-id">${taskId}</span>...`);
    
    const intervalId = setInterval(async () => {
        try {
            const result = await api.getGeneration(taskId);
            if (result.status === 'SUCCESS') {
                clearInterval(intervalId);
                ui.logSuccess(`Task <span class="task-id">${taskId}</span> completed!`);
                ui.displaySongs(taskId, result.song_paths);
            } else if (result.status === 'FAILURE') {
                clearInterval(intervalId);
                ui.logError(`Task <span class="task-id">${taskId}</span> failed. Reason: ${result.error_message}`);
            } else {
                 ui.updateTaskStatus(taskId, result.status);
            }
        } catch (error) {
            clearInterval(intervalId);
            ui.logError(`Error polling for task <span class="task-id">${taskId}</span>: ${error.message}`);
        }
    }, POLLING_INTERVAL);
}

async function handleStatusSubmit(event) {
    event.preventDefault();

    const taskId = ui.getTaskId();
    if (!taskId) {
        ui.logError('Please enter a Task ID.');
        return;
    }
    
    ui.setLoading(true);
    try {
        const result = await api.getGeneration(taskId);
        if (result.status === 'SUCCESS') {
            ui.logSuccess(`Task <span class="task-id">${taskId}</span> completed!`);
            ui.displaySongs(taskId, result.song_paths);
        } else if (result.status === 'FAILURE') {
            ui.logError(`Task <span class="task-id">${taskId}</span> failed. Reason: ${result.error_message}`);
        } else {
            ui.logMessage(`Task <span class="task-id">${taskId}</span> status: <span class="status">${result.status}</span>`);
            pollForStatus(taskId);
        }
    } catch (error) {
        ui.logError(`Error checking status for task <span class="task-id">${taskId}</span>: ${error.message}`);
    } finally {
        ui.setLoading(false);
    }
}

function handleTabClick(event) {
    if (event.target.classList.contains('tab-link')) {
        ui.setActiveTab(event.target.dataset.tab);
    }
}

function init() {
    document.getElementById('generate-form').addEventListener('submit', handleGenerateSubmit);
    document.getElementById('status-form').addEventListener('submit', handleStatusSubmit);
    document.querySelector('.tab-nav').addEventListener('click', handleTabClick);
    ui.clearLogs();
}

init();

