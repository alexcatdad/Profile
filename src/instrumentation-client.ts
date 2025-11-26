import { initBotId } from 'botid/client/core';

initBotId({
    protect: [
        {
            path: '/*',
            method: 'GET',
        },
        {
            path: '/*',
            method: 'POST',
        },
        {
            path: '/*',
            method: 'PUT',
        },
        {
            path: '/*',
            method: 'DELETE',
        },
        {
            path: '/*',
            method: 'PATCH',
        },
    ],
});
