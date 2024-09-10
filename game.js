const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// 设置颜色
const bgColor1 = 'teal';
const bgColor2 = 'gray';
const textColor = 'white';
const brickColor = 'red'; // 砖块颜色设为红色

// 飞船图像
const shipImage = new Image();
shipImage.src = 'img/xu.bmp'; // 替换为实际的图像路径
const scaleFactor = 0.1;
let shipWidth, shipHeight;
let shipX, shipY; // 飞船的初始位置将在图像加载后设置

// 砖块图像列表
const brickImages = [
    'img/1.png',
    'img/2.png',
    'img/3.png',
    'img/4.png',
    'img/5.png'
];
let loadedBrickImages = [];

// 加载砖块图像
brickImages.forEach((src, index) => {
    const img = new Image();
    img.src = src;
    loadedBrickImages[index] = img;
});

// 初始化子弹和砖块
let bullets = [];
let bulletSpeed = 5;
let bricks = [];
const brickWidth = 200; // 加宽砖块宽度
const brickHeight = 130;
const maxBricksPerRow = Math.floor(canvas.width / (brickWidth + 10)); // 计算每行最多砖块数量
let showMessage = false;

// 生成砖块，并为每个砖块指定不同的图像或默认显示
for (let i = 0; i < 6; i++) { // 假设砖块数量为6
    const row = Math.floor(i / maxBricksPerRow); // 当前行数
    const col = i % maxBricksPerRow; // 当前列数
    bricks.push({
        x: col * (brickWidth + 10) + 50, // 换行逻辑
        y: 50 + row * (brickHeight + 10), // 换行逻辑
        width: brickWidth, 
        height: brickHeight,
        image: loadedBrickImages[i] ? loadedBrickImages[i] : null // 如果没有对应图像，则设置为 null
    });
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

function draw() {
    context.fillStyle = bgColor1;
    context.fillRect(0, 0, canvas.width, canvas.height);

    if (!showMessage) {
        // 绘制砖块
        bricks.forEach(brick => {
            if (brick.image && brick.image.complete) { // 如果有图像并且图像已加载
                context.drawImage(brick.image, brick.x, brick.y, brick.width, brick.height);
            } else {
                // 如果没有图像或图像未加载，使用红色矩形代替
                context.fillStyle = brickColor;
                context.fillRect(brick.x, brick.y, brick.width, brick.height);
            }
        });

        // 更新和绘制子弹
        bullets.forEach((bullet, index) => {
            bullet.y -= bulletSpeed;
            context.fillStyle = 'white';
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

    requestAnimationFrame(draw);
}

// 处理键盘事件
window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') shipX -= 10;
    if (event.key === 'ArrowRight') shipX += 10;
    if (event.key === 'ArrowUp') shipY -= 10;
    if (event.key === 'ArrowDown') shipY += 10;

    // 限制飞船的移动范围在屏幕内部
    if (shipX < 0) shipX = 0;
    if (shipX + shipWidth > canvas.width) shipX = canvas.width - shipWidth;
    if (shipY < 0) shipY = 0;
    if (shipY + shipHeight > canvas.height) shipY = canvas.height - shipHeight;
});

// 添加触摸事件处理
canvas.addEventListener('touchstart', handleTouchMove);
canvas.addEventListener('touchmove', handleTouchMove);

function handleTouchMove(event) {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = canvas.getBoundingClientRect(); // 获取画布相对于视口的大小和位置

    // 计算设备像素比率
    const scaleX = canvas.width / rect.width;    // 计算横向缩放比例
    const scaleY = canvas.height / rect.height;  // 计算纵向缩放比例

    // 计算触控点相对于 canvas 的坐标，考虑到缩放比例
    const touchX = (touch.clientX - rect.left) * scaleX;
    const touchY = (touch.clientY - rect.top) * scaleY;

    // 计算飞船的位置，使其中心点与触控点对齐
    shipX = touchX - shipWidth / 2;
    shipY = touchY - shipHeight / 2;

    // 限制飞船的移动范围在屏幕内部
    if (shipX < 0) {
        shipX = 0;
    } else if (shipX + shipWidth > canvas.width) {
        shipX = canvas.width - shipWidth;
    }

    if (shipY < 0) {
        shipY = 0;
    } else if (shipY + shipHeight > canvas.height) {
        shipY = canvas.height - shipHeight;
    }
}


// 每500毫秒发射子弹
setInterval(() => {
    if (!showMessage) {
        bullets.push({ x: shipX + shipWidth / 2 - 1.5, y: shipY });
    }
}, 500); // 减少时间间隔来增加射击频率

// 等待图像加载完成后启动游戏
shipImage.onload = function () {
    shipWidth = shipImage.width * scaleFactor;
    shipHeight = shipImage.height * scaleFactor;
    
    // 将飞船的初始位置设置为屏幕右下角对齐
    shipX = canvas.width - shipWidth;
    shipY = canvas.height - shipHeight;
    
    draw();
};
