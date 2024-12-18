// Select the canvas element
const canvas = document.querySelector('canvas.webgl');

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color('black'); // Set the background color of the scene to black

// Create an empty BufferGeometry object
const geometry = new THREE.BufferGeometry();

// Set the number of triangles to create
const count = 50;

// Create an array for the triangle positions
// Each triangle has 3 vertices, each vertex has 3 coordinates (x, y, z)
const positionsArray = new Float32Array(count * 3 * 3);

// Randomize the position values for the vertices
for (let i = 0; i < count * 3 * 3; i++) {
    positionsArray[i] = (Math.random() - 0.5) * 4; // Values are in the range of -2 to 2
}

// Create a BufferAttribute for the positions and set it to the geometry
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
geometry.setAttribute('position', positionsAttribute);

// Create a material for the mesh
const material = new THREE.MeshBasicMaterial({
    color: 0xFFFF00, // Set color to yellow
    wireframe: true, // Enable wireframe mode
});

// Create a mesh using the geometry and material
const mesh = new THREE.Mesh(geometry, material);

// Add the mesh to the scene
scene.add(mesh);

// Camera setup
const sizes = {
    width: window.innerWidth, // Set the initial width of the canvas
    height: window.innerHeight, // Set the initial height of the canvas
};
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 5; // Set the camera position along the z-axis
scene.add(camera);

// Renderer setup
const renderer = new THREE.WebGLRenderer({
    canvas: canvas, // Specify the canvas for rendering
});
renderer.setSize(sizes.width, sizes.height); // Set the size of the canvas

// Handle window resizing
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth; // Update canvas width
    sizes.height = window.innerHeight; // Update canvas height

    // Update camera aspect ratio and projection matrix
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer size
    renderer.setSize(sizes.width, sizes.height);
});

// Smooth Drag Controls for rotating the mesh
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let rotationSpeed = 0.002; // Smooth rotation speed factor
let targetRotationX = 0;
let targetRotationY = 0;

// Handle mouse down event to start dragging
canvas.addEventListener('mousedown', () => {
    isDragging = true;
});

// Handle mouse move event to rotate the mesh based on mouse movement
canvas.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;

        // Update the target rotation values for smooth transition
        targetRotationY += deltaX * rotationSpeed;
        targetRotationX += deltaY * rotationSpeed;
    }

    // Update the previous mouse position
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY,
    };
});

// Handle mouse up event to stop dragging
canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

// Handle mouse leave event to stop dragging
canvas.addEventListener('mouseleave', () => {
    isDragging = false;
});

// Smooth Scroll Zooming
let targetZoom = camera.position.z; // Target zoom position
let zoomSpeed = 0.05; // Smooth zoom speed factor

canvas.addEventListener('wheel', (event) => {
    // Update the target zoom value (with zoom direction)
    targetZoom += event.deltaY * 0.001;
    targetZoom = Math.max(1, Math.min(10, targetZoom)); // Clamp zoom level
});

// Fullscreen functionality on double click
canvas.addEventListener('dblclick', () => {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen(); // Enter fullscreen
    } else {
        document.exitFullscreen(); // Exit fullscreen
    }
});

// Animation loop for rendering the scene continuously
const animate = () => {
    // Smoothly interpolate camera zoom
    camera.position.z += (targetZoom - camera.position.z) * zoomSpeed;

    // Smoothly interpolate mesh rotation
    mesh.rotation.x += (targetRotationX - mesh.rotation.x) * 0.1; // Smooth rotation on X axis
    mesh.rotation.y += (targetRotationY - mesh.rotation.y) * 0.1; // Smooth rotation on Y axis

    renderer.render(scene, camera); // Render the scene with the camera
    requestAnimationFrame(animate); // Request the next frame for animation
};

animate(); // Start the animation loop
