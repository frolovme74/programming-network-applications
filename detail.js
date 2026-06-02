import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { getModelById } from './idb.js';

const urlParams = new URLSearchParams(window.location.search);
const modelPath = urlParams.get('path');
const modelId = urlParams.get('id');

const container = document.getElementById('canvas-container');
const loaderUI = document.getElementById('loader');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(3, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

function centerModel(gltf) {
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    gltf.scene.position.x += (gltf.scene.position.x - center.x);
    gltf.scene.position.y += (gltf.scene.position.y - center.y);
    gltf.scene.position.z += (gltf.scene.position.z - center.z);

    const maxDim = Math.max(size.x, size.y, size.z);
    camera.position.z = maxDim * 2;
    camera.lookAt(0, 0, 0);
}

const gltfLoader = new GLTFLoader();

function loadGLTF(url) {
    gltfLoader.load(
        url,
        (gltf) => {
            centerModel(gltf);
            scene.add(gltf.scene);
            loaderUI.style.display = 'none';
        },
        (xhr) => {
            if (xhr.total > 0) {
                loaderUI.innerText = `ЗАГРУЗКА... ${Math.round(xhr.loaded / xhr.total * 100)}%`;
            }
        },
        (error) => {
            console.error('Ошибка загрузки модели:', error);
            loaderUI.innerText = 'ОШИБКА ЗАГРУЗКИ!';
        }
    );
}

async function init() {
    if (modelPath) {
        loadGLTF(modelPath);
    } else if (modelId) {
        try {
            const data = await getModelById(modelId);
            if (data && data.blob) {
                const objectUrl = URL.createObjectURL(data.blob);
                loadGLTF(objectUrl);
            } else {
                throw new Error("Модель не найдена в базе");
            }
        } catch (e) {
            console.error(e);
            loaderUI.innerText = 'МОДЕЛЬ НЕ НАЙДЕНА';
        }
    } else {
        loaderUI.innerText = 'МОДЕЛЬ НЕ УКАЗАНА';
    }
}

init();

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
