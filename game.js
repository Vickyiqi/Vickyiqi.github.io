const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

let x = 400;
let y = 400;
const speed = 5;

function draw() {
    context.fillStyle = 'teal';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制玩家方块
    context.fillStyle = 'red';
    context.fillRect(x, y, 20, 20);

    requestAnimationFrame(draw);
}

function move(event) {
    switch (event.key) {
        case 'ArrowUp':
            y -= speed;
            break;
        case 'ArrowDown':
            y += speed;
            break;
        case 'ArrowLeft':
            x -= speed;
            break;
        case 'ArrowRight':
            x += speed;
            break;
    }
}

// 监听键盘事件
window.addEventListener('keydown', move);

draw();
