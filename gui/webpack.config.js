const path = require('path');

module.exports = {
    entry: [
        path.join(__dirname, './src/main.ts')
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: path.join(__dirname, 'src'),
                exclude: /node_modules/,
                loader: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts'],
        modules: [
            path.join(__dirname, 'node_modules')
        ]
    },
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'public/dist'),
        filename: 'bundle.js'
    },
    resolveLoader: {
        modules: [
            path.join(__dirname, 'node_modules')
        ]
    },
    externals: {
        "socket.io-client": "io",
        "three": "THREE",
        "obj-loader": "THREE.OBJLoader",
        "mtl-loader": "THREE.MTLLoader",
        "gltf-loader": "THREE.GLTFLoader",
        "draco-loader": "THREE.DRACOLoader",
        "gpu-particle": "THREE.GPUParticleSystem"
        // "three-obj-mtl-loader": "three-obj-mtl-loader"
    }
};