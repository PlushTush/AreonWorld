import react from '@vitejs/plugin-react-swc'
import {defineConfig} from 'vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

const headers = {
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Embedder-Policy": "require-corp",
    "Service-Worker-Allowed": "/",
};

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        plugins: [
            react({tsDecorators: true}),
            basicSsl(),
        ],
        server: {
            headers,
        },
        preview: {
            headers,
        },
        build: {
            headers,
        }
    }
})
