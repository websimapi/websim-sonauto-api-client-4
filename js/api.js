const PROXY_URL = 'https://corsproxy.io/?https://sonauto-vercel-proxy-q8vonsdie-apis-projects-1c027b53.vercel.app/api/sonauto';

async function fetchApi(path, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const response = await fetch(`${PROXY_URL}${path}`, { ...options, headers });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorBody}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }
    return response.text();
}

export function generateSong(params) {
    return fetchApi('/generations', {
        method: 'POST',
        body: JSON.stringify(params),
    });
}

export function getGeneration(taskId) {
    return fetchApi(`/generations/${taskId}`);
}

