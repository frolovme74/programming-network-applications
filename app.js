import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { saveModel, getAllModels, deleteModel } from './idb.js';

const defaultModels = [
    { name: 'Машина', path: 'models/car.glb', img: null },
    { name: 'Дерево 1', path: 'models/tree.glb', img: null },
    { name: 'Дерево 2', path: 'models/tree1.glb', img: null },
    { name: 'Дерево 3', path: 'models/tree2.glb', img: null }
];

const mainPage = document.getElementById('main-page');
const uploadInput = document.getElementById('upload-input');
const uploadBtn = document.getElementById('upload-btn');

uploadBtn.addEventListener('click', () => uploadInput.click());

function createCard(title, linkPath, author, imgData = null, modelId = null) {
    const card = document.createElement('div');
    card.className = 'card';
    card.onclick = () => window.location.href = linkPath;

    const randomLikes = Math.floor(Math.random() * 500) + 10;
    let deleteBtnHtml = modelId !== null ? `<button class="btn-steam-delete" data-id="${modelId}" title="Удалить">✖</button>` : '';

    const imageHtml = imgData
        ? `<img src="${imgData}" class="card-img-top" style="height: 160px; width: 100%; object-fit: cover;">`
        : `<div class="card-img-top" style="height: 160px; background: #2a475e; display: flex; align-items: center; justify-content: center; font-size: 14px; color: #67c1f5; font-family: monospace;">ГЕНЕРАЦИЯ ПРЕВЬЮ...</div>`;

    card.innerHTML = `
        <div style="position: relative;">
            ${deleteBtnHtml}
            ${imageHtml}
        </div>
        <div class="card-body">
            <h5 class="card-title">${title}</h5>
        </div>
    `;

    if (modelId !== null) {
        const deleteBtn = card.querySelector('.btn-steam-delete');
        deleteBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (confirm(`Удалить модель "${title}"?`)) {
                await deleteModel(modelId);
                renderGallery();
            }
        });
    }

    return card;
}

function generateThumbnail(source) {
    return new Promise((resolve) => {
        const objectUrl = source instanceof Blob ? URL.createObjectURL(source) : source;

        const width = 300;
        const height = 160;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#2a475e');

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(2, 2, 3);

        const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
        renderer.setSize(width, height);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
        dirLight.position.set(5, 5, 5);
        scene.add(dirLight);

        const loader = new GLTFLoader();
        loader.load(objectUrl, (gltf) => {
            const box = new THREE.Box3().setFromObject(gltf.scene);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            gltf.scene.position.x += (gltf.scene.position.x - center.x);
            gltf.scene.position.y += (gltf.scene.position.y - center.y);
            gltf.scene.position.z += (gltf.scene.position.z - center.z);

            const maxDim = Math.max(size.x, size.y, size.z);
            camera.position.z = maxDim * 2.2;
            camera.lookAt(0, 0, 0);

            scene.add(gltf.scene);
            renderer.render(scene, camera);

            const dataUrl = renderer.domElement.toDataURL('image/jpeg', 0.8);

            if (source instanceof Blob) {
                URL.revokeObjectURL(objectUrl);
            }
            renderer.dispose();

            resolve(dataUrl);
        }, undefined, () => {
            resolve(null);
        });
    });
}

async function renderGallery() {
    mainPage.innerHTML = '';

    const userModels = await getAllModels();
    userModels.forEach(model => {
        const link = `detail.html?id=${model.id}`;
        mainPage.appendChild(createCard(model.name, link, 'Вы', model.thumbnail, model.id));
    });

    defaultModels.forEach(model => {
        const link = `detail.html?path=${encodeURIComponent(model.path)}`;

        const cardElement = createCard(model.name, link, 'Valve / IU5', model.img);
        mainPage.appendChild(cardElement);

        if (!model.img) {
            generateThumbnail(model.path).then(base64Img => {
                if (base64Img) {
                    model.img = base64Img;

                    const imgContainer = cardElement.querySelector('.card-img-top');
                    if (imgContainer) {
                        const newImg = document.createElement('img');
                        newImg.src = base64Img;
                        newImg.className = 'card-img-top';
                        newImg.style.cssText = 'height: 160px; width: 100%; object-fit: cover;';
                        imgContainer.replaceWith(newImg);
                    }
                }
            });
        }
    });
}

uploadInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.glb')) {
        const originalText = uploadBtn.innerText;
        uploadBtn.innerText = 'Генерация превью...';
        try {
            const cleanName = file.name.replace(/\.glb$/i, '');

            const thumbnail = await generateThumbnail(file);

            await saveModel(cleanName, file, thumbnail);

            uploadBtn.innerText = originalText;
            renderGallery();
        } catch (err) {
            console.error(err);
            alert('Ошибка при обработке модели.');
            uploadBtn.innerText = originalText;
        }
    }
    uploadInput.value = '';
});

renderGallery();
