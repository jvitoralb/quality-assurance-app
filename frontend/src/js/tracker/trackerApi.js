import { clearForm } from './trackerForms.js';
import { handleAPIAnswer, handleAPIError } from './tracker.js';


const handleAPICalls = (eventSource, inputData) => {
    const cudTrackerAPICalls = async (dataReq) => {
        const cudCallOptions = {
            'create-issue-form': {
                url: `/issue-tracker/api/v1/issues/${dataReq.project_name}`,
                method: 'POST'
            },
            'update-issue-form': {
                url: `/issue-tracker/api/v1/issues/${dataReq.project_name}`,
                method: 'PUT'
            },
            'delete-issue-form': {
                url: `/issue-tracker/api/v1/issues/${dataReq.project_name}`,
                method: 'DELETE'
            },
            'delete-project-form': {
                url: `/issue-tracker/api/v1/projects/${dataReq.project_name}`,
                method: 'DELETE'
            }
        }
        try {
            const req = await fetch(cudCallOptions[eventSource].url, {
                method: cudCallOptions[eventSource].method,
                mode: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataReq)
            });
            const answer = await req.json();

            if (answer.error || req.status === 400) {
                throw answer;
            }

            handleAPIAnswer(eventSource, answer);
            clearForm(eventSource);
        } catch(err) {
            handleAPIError(eventSource, err);
        }
    }

    const readTrackerAPICalls = async (dataReq = { project_name: '' }) => {
        // The default value for dataReq works when 'all-projects-btn' is called
        // and JS reads dataReq.project_name in readCallOptions['search-issue-form']
        const params = (() => {
            let params = {}
            for(let prop in dataReq) {
                if (prop !== 'project_name') {
                    params[prop] = dataReq[prop];
                }
            }
            return params;
        })();
        const readCallOptions = {
            'search-issue-form': {
                url: `/issue-tracker/api/v1/issues/${dataReq.project_name}?${new URLSearchParams(params)}`
            },
            'all-projects-btn': {
                url: `/issue-tracker/api/v1/projects/`
            }
        }
        try {
            const req = await fetch(readCallOptions[eventSource].url);
            const answer = await req.json();

            if (answer.error || req.status === 400) {
                throw answer;
            }

            if (eventSource === 'search-issue-form' && answer.issues.length === 1) {
                handleAPIAnswer(eventSource, answer.issues[0]);
            } else {
                handleAPIAnswer(eventSource, answer);
            }

            if (eventSource !== 'all-projects-btn') clearForm(eventSource);
        } catch(err) {
            handleAPIError(eventSource, err);
        }
    }

    if (eventSource === 'search-issue-form' || eventSource === 'all-projects-btn') {
        readTrackerAPICalls(inputData);
    } else {
        cudTrackerAPICalls(inputData);
    }
}

export default handleAPICalls;