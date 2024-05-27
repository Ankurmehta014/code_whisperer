var w = c.width = window.innerWidth,
    h = c.height = window.innerHeight,
    ctx = c.getContext('2d'),
    hw = w / 2,
    hh = h / 2,
    opts = {
        strings: ['HAPPY', 'BIRTHDAY', 'Sakshi'],
        charSize: 30,
        charSpacing: 35,
        lineHeight: 40,
        cx: w / 2,
        cy: h / 2,
        fireworkPrevPoints: 10,
        fireworkBaseLineWidth: 5,
        fireworkAddedLineWidth: 8,
        fireworkSpawnTime: 200,
        fireworkBaseReachTime: 30,
        fireworkAddedReachTime: 30,
        fireworkCircleBaseSize: 20,
        fireworkCircleAddedSize: 10,
        fireworkCircleBaseTime: 30,
        fireworkCircleAddedTime: 30,
        fireworkCircleFadeBaseTime: 10,
        fireworkCircleFadeAddedTime: 5,
        fireworkBaseShards: 10,
        fireworkAddedShards: 10,
        fireworkShardPrevPoints: 5,
        fireworkShardBaseVel: 4,
        fireworkShardAddedVel: 2,
        fireworkShardBaseSize: 3,
        fireworkShardAddedSize: 3,
        gravity: 0.1,
        upFlow: -0.1,
        letterContemplatingWaitTime: 360,
        balloonSpawnTime: 20,
        balloonBaseInflateTime: 10,
        balloonAddedInflateTime: 10,
        balloonBaseSize: 20,
        balloonAddedSize: 20,
        balloonBaseVel: 0.4,
        balloonAddedVel: 0.4,
        balloonBaseRadian: -(Math.PI / 2 - 0.5),
        balloonAddedRadian: -1
    },
    calc = {
        totalWidth: opts.charSpacing * Math.max(opts.strings[0].length, opts.strings[1].length)
    },
    Tau = Math.PI * 2,
    TauQuarter = Tau / 4,
    letters = [],
    balloons = [],
    animationComplete = false;

ctx.font = opts.charSize + 'px Verdana';

function Letter(char, x, y) {
    this.char = char;
    this.x = x;
    this.y = y;

    this.dx = -ctx.measureText(char).width / 2;
    this.dy = +opts.charSize / 2;

    this.fireworkDy = this.y - hh;

    var hue = x / calc.totalWidth * 360;

    this.color = `hsl(${hue},80%,50%)`;
    this.lightAlphaColor = `hsla(${hue},80%,light%,alp)`;
    this.lightColor = `hsl(${hue},80%,light%)`;
    this.alphaColor = `hsla(${hue},80%,50%,alp)`;

    this.reset();
}

Letter.prototype.reset = function () {
    this.phase = 'firework';
    this.tick = 0;
    this.spawned = false;
    this.spawningTime = opts.fireworkSpawnTime * Math.random() | 0;
    this.reachTime = opts.fireworkBaseReachTime + opts.fireworkAddedReachTime * Math.random() | 0;
    this.lineWidth = opts.fireworkBaseLineWidth + opts.fireworkAddedLineWidth * Math.random();
    this.prevPoints = [[0, hh, 0]];
}

Letter.prototype.step = function () {
    if (this.phase === 'firework') {
        if (!this.spawned) {
            ++this.tick;
            if (this.tick >= this.spawningTime) {
                this.tick = 0;
                this.spawned = true;
            }
        } else {
            ++this.tick;
            var linearProportion = this.tick / this.reachTime,
                armonicProportion = Math.sin(linearProportion * TauQuarter),
                x = linearProportion * this.x,
                y = hh + armonicProportion * this.fireworkDy;

            if (this.prevPoints.length > opts.fireworkPrevPoints) this.prevPoints.shift();
            this.prevPoints.push([x, y, linearProportion * this.lineWidth]);

            var lineWidthProportion = 1 / (this.prevPoints.length - 1);
            for (var i = 1; i < this.prevPoints.length; ++i) {
                var point = this.prevPoints[i],
                    point2 = this.prevPoints[i - 1];
                ctx.strokeStyle = this.alphaColor.replace('alp', i / this.prevPoints.length);
                ctx.lineWidth = point[2] * lineWidthProportion * i;
                ctx.beginPath();
                ctx.moveTo(point[0], point[1]);
                ctx.lineTo(point2[0], point2[1]);
                ctx.stroke();
            }

            if (this.tick >= this.reachTime) {
                this.phase = 'contemplate';
                this.circleFinalSize = opts.fireworkCircleBaseSize + opts.fireworkCircleAddedSize * Math.random();
                this.circleCompleteTime = opts.fireworkCircleBaseTime + opts.fireworkCircleAddedTime * Math.random() | 0;
                this.circleCreating = true;
                this.circleFading = false;
                this.circleFadeTime = opts.fireworkCircleFadeBaseTime + opts.fireworkCircleFadeAddedTime * Math.random() | 0;
                this.tick = 0;
                this.tick2 = 0;
                this.shards = [];

                var shardCount = opts.fireworkBaseShards + opts.fireworkAddedShards * Math.random() | 0,
                    angle = Tau / shardCount,
                    cos = Math.cos(angle),
                    sin = Math.sin(angle),
                    x = 1,
                    y = 0;

                for (var i = 0; i < shardCount; ++i) {
                    var x1 = x;
                    x = x * cos - y * sin;
                    y = y * cos + x1 * sin;
                    this.shards.push(new Shard(this.x, this.y, x, y, this.alphaColor));
                }
            }
        }
    } else if (this.phase === 'contemplate') {
        ++this.tick;

        if (this.circleCreating) {
            ++this.tick2;
            var proportion = this.tick2 / this.circleCompleteTime,
                armonic = -Math.cos(proportion * Math.PI) / 2 + 0.5;

            ctx.beginPath();
            ctx.fillStyle = this.lightAlphaColor.replace('light', 50 + 50 * proportion).replace('alp', proportion);
            ctx.arc(this.x, this.y, armonic * this.circleFinalSize, 0, Tau);
            ctx.fill();

            if (this.tick2 > this.circleCompleteTime) {
                this.tick2 = 0;
                this.circleCreating = false;
                this.circleFading = true;
            }
        } else if (this.circleFading) {
            ctx.fillStyle = this.lightColor.replace('light', 70);
            ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);

            ++this.tick2;
            var proportion = this.tick2 / this.circleFadeTime,
                armonic = -Math.cos(proportion * Math.PI) / 2 + 0.5;

            ctx.beginPath();
            ctx.fillStyle = this.lightAlphaColor.replace('light', 100).replace('alp', 1 - proportion);
            ctx.arc(this.x, this.y, this.circleFinalSize, 0, Tau);
            ctx.fill();

            if (this.tick2 >= this.circleFadeTime) this.circleFading = false;
        } else {
            ctx.fillStyle = this.lightColor.replace('light', 70);
            ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);
        }

        for (var i = 0; i < this.shards.length; ++i) {
            this.shards[i].step();
        }

        if (this.tick > opts.letterContemplatingWaitTime) {
            this.phase = 'done';
        }
    }
}

function Balloon() {
    this.reset();
}

Balloon.prototype.reset = function () {
    this.x = Math.random() * w;
    this.y = h + Math.random() * h / 2;
    this.r = opts.balloonBaseSize + opts.balloonAddedSize * Math.random();
    this.vel = opts.balloonBaseVel + opts.balloonAddedVel * Math.random();
    this.color = 'hsl(' + Math.random() * 360 + ',100%,50%)';
}

Balloon.prototype.step = function () {
    this.y -= this.vel;
    this.vel += opts.upFlow;

    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.r, 0, Tau);
    ctx.fill();

    if (this.y + this.r < 0) this.reset();
}

function Shard(x, y, vx, vy, color) {
    var vel = opts.fireworkShardBaseVel + opts.fireworkShardAddedVel * Math.random();
    this.vx = vx * vel;
    this.vy = vy * vel;
    this.x = x;
    this.y = y;
    this.prevPoints = [[x, y]];
    this.color = color;
    this.alive = true;
    this.size = opts.fireworkShardBaseSize + opts.fireworkShardAddedSize * Math.random();
}

Shard.prototype.step = function () {
    this.x += this.vx;
    this.y += this.vy += opts.gravity;

    if (this.prevPoints.length > opts.fireworkShardPrevPoints) this.prevPoints.shift();
    this.prevPoints.push([this.x, this.y]);

    var lineWidthProportion = this.size / this.prevPoints.length;
    for (var k = 0; k < this.prevPoints.length - 1; ++k) {
        var point = this.prevPoints[k],
            point2 = this.prevPoints[k + 1];

        ctx.strokeStyle = this.color.replace('alp', k / this.prevPoints.length);
        ctx.lineWidth = k * lineWidthProportion;
        ctx.beginPath();
        ctx.moveTo(point[0], point[1]);
        ctx.lineTo(point2[0], point2[1]);
        ctx.stroke();
    }

    if (this.prevPoints[0][1] > h) this.alive = false;
}

for (var i = 0; i < opts.strings.length; ++i) {
    for (var j = 0; j < opts.strings[i].length; ++j) {
        letters.push(new Letter(opts.strings[i][j],
            w / 2 - opts.strings[i].length * opts.charSpacing / 2 +
            j * opts.charSpacing,
            hh + (i - opts.strings.length / 2) * opts.lineHeight));
    }
}

function anim() {
    window.requestAnimationFrame(anim);

    var gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, 'rgba(0, 10, 20, 1)');
    gradient.addColorStop(1, 'rgba(0, 30, 50, 1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    var completed = true;

    for (var i = 0; i < letters.length; ++i) {
        letters[i].step();
        if (letters[i].phase !== 'done') completed = false;
    }

    if (completed && !animationComplete) {
        animationComplete = true;
        showNote();
    }
}

function showNote() {
    var noteContainer = document.getElementById('note-container');
    noteContainer.style.display = 'block';
}

anim();

window.addEventListener('resize', function () {
    w = c.width = window.innerWidth;
    h = c.height = window.innerHeight;
    hw = w / 2;
    hh = h / 2;

    ctx.font = opts.charSize + 'px Verdana';
    calc.totalWidth = opts.charSpacing * Math.max(opts.strings[0].length, opts.strings[1].length);

    for (var i = 0; i < letters.length; ++i) {
        letters[i].x = w / 2 - opts.strings[letters[i].lineIndex].length * opts.charSpacing / 2 + letters[i].charIndex * opts.charSpacing;
        letters[i].y = hh + (letters[i].lineIndex - opts.strings.length / 2) * opts.lineHeight;
        letters[i].dx = -ctx.measureText(letters[i].char).width / 2;
        letters[i].dy = +opts.charSize / 2;
        letters[i].fireworkDy = letters[i].y - hh;
    }
});
const sparklesContainer = document.getElementById('sparkles');

function createSparkles() {
    const sparklesContainer = document.getElementById('sparkles');
    for (let i = 0; i < 100; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;
        sparkle.style.animationDelay = `${Math.random() * 2}s`;
        sparklesContainer.appendChild(sparkle);
    }

    // Adding sparkles outside the container
    for (let i = 0; i < 200; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;
        sparkle.style.animationDelay = `${Math.random() * 2}s`;
        document.body.appendChild(sparkle);
    }
}

createSparkles();
