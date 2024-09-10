const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// 动态设置 Canvas 的宽高，适应手机屏幕
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // 页面加载时调整一次

// 设置颜色
const bgColor1 = 'teal';
const bgColor2 = 'gray';
const brickColor = 'red';
const textColor = 'white';

// 飞船图像
const shipImage = new Image();
shipImage.src = 'img/xu.bmp'; // 替换为实际的图像路径
const scaleFactor = 0.1;
let shipWidth, shipHeight;
let shipX = canvas.width / 2;
let shipY = canvas.height - 100; // 距离底部一定距离

// 初始化子弹和砖块
let bullets = [];
let bulletSpeed = 2;
let bricks = [];
const brickWidth = 80;
const brickHeight = 30;
let showMessage = false;

// 生成砖块
for (let i = 0; i < 5; i++) {
    bricks.push({ x: i * (brickWidth + 10) + 50, y: 50, width: brickWidth, height: brickHeight });
}

// 显示文本
function displayText(text, color) {
    context.font = "72px sans-serif";
    context.fillStyle = color;
    context.textAlign = "center";
    context.fillText(text, canvas.width / 2, canvas.height / 2);
}

// 绘制烟花效果
function drawFireworks() {
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 3 + 2;
        const color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = color;
        context.fill();
    }
}

// 更新和绘制屏幕内容
function draw() {
    context.fillStyle = bgColor1;
    context.fillRect(0, 0, canvas.width, canvas.height);

    if (!showMessage) {
        // 绘制砖块
        bricks.forEach(brick => {
            context.fillStyle = brickColor;
            context.fillRect(brick.x, brick.y, brick.width, brick.height);
        });

        // 更新和绘制子弹
        bullets.forEach((bullet, index) => {
            bullet.y -= bulletSpeed; // 更新子弹位置
            context.fillStyle = bgColor2;
            context.fillRect(bullet.x, bullet.y, 3, 15);

            // 检查子弹与砖块的碰撞
            bricks.forEach((brick, brickIndex) => {
                if (
                    bullet.x > brick.x &&
                    bullet.x < brick.x + brick.width &&
                    bullet.y > brick.y &&
                    bullet.y < brick.y + brick.height
                ) {
                    bricks.splice(brickIndex, 1); // 击碎砖块
                    bullets.splice(index, 1); // 移除子弹
                }
            });

            // 如果子弹超出屏幕，则将其从列表中移除
            if (bullet.y < 0) {
                bullets.splice(index, 1);
            }
        });

        // 检查是否所有砖块都被击碎
        if (bricks.length === 0) {
            showMessage = true; // 标志设置为 True
        }
    } else {
        // 显示文本和烟花效果
        displayText("你已被老徐击毙", textColor);
        drawFireworks();
    }

    // 绘制飞船
    context.drawImage(shipImage, shipX, shipY, shipWidth, shipHeight);

    requestAnimationFrame(draw); // 使用 requestAnimationFrame 优化重绘
}

// 处理键盘事件
window.addEventListener('keydown', (event) => {
    const speed = canvas.width * 0.01; // 根据 Canvas 的宽度设置飞船移动速度

    if (event.key === 'ArrowLeft') shipX -= speed;
    if (event.key === 'ArrowRight') shipX += speed;
    if (event.key === 'ArrowUp') shipY -= speed;
    if (event.key === 'ArrowDown') shipY += speed;

    // 限制飞船的移动范围在屏幕内部
    if (shipX < 0) shipX = 0;
    if (shipX + shipWidth > canvas.width) shipX = canvas.width - shipWidth;
    if (shipY < 0) shipY = 0;
    if (shipY + shipHeight > canvas.height) shipY = canvas.height - shipHeight;
});

// 支持触摸事件
let isTouching = false;
canvas.addEventListener('touchstart', (event) => {
    isTouching = true;
    handleTouch(event);
});
canvas.addEventListener('touchmove', (event) => {
    if (isTouching) handleTouch(event);
});
canvas.addEventListener('touchend', () => {
    isTouching = false;
});

function handleTouch(event) {
    event.preventDefault(); // 阻止默认的触摸滚动行为
    const touch = event.touches[0];
    const touchX = touch.clientX;
    const touchY = touch.clientY;

    // 直接将飞船移动到触摸位置
    shipX = touchX - shipWidth / 2;
    shipY = touchY - shipHeight / 2;

    // 限制飞船的移动范围在屏幕内部
    if (shipX < 0) shipX = 0;
    if (shipX + shipWidth > canvas.width) shipX = canvas.width - shipWidth;
    if (shipY < 0) shipY = 0;
    if (shipY + shipHeight > canvas.height) shipY = canvas.height - shipHeight;
}

// 每秒发射子弹
setInterval(() => {
    if (!showMessage) {
        bullets.push({ x: shipX + shipWidth / 2 - 1.5, y: shipY });
    }
}, 1000);

// 等待图像加载完成后启动游戏
shipImage.onload = function() {
    shipWidth = shipImage.width * scaleFactor;
    shipHeight = shipImage.height * scaleFactor;
    draw();
};
