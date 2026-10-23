'use strict';

const bgMusic = document.getElementById('bgMusic');
const endingMusic = document.getElementById('endingMusic');
const musicVolume = 0.35;
bgMusic.volume = musicVolume;
endingMusic.volume = 0;

const musicButton =
    document.getElementById('musicButton');

let musicOn = true;

musicButton.onclick = () => {

    if(musicOn){

        bgMusic.pause();
        endingMusic.pause();

        musicOn = false;

        musicButton.textContent =
            'MUSIC OFF';

    }else{

        const activeMusic = screens?.ending?.classList.contains('active')
            ? endingMusic
            : bgMusic;
        activeMusic.play();

        musicOn = true;

        musicButton.textContent =
            'MUSIC ON';
    }
};

function fadeOutMusic(audio, duration){

    const startingVolume = audio.volume;
    const steps = Math.max(1, Math.ceil(duration / 50));
    let step = 0;

    return new Promise(resolve => {
        const fadeTimer = window.setInterval(() => {
            step++;
            audio.volume = Math.max(
                0,
                startingVolume * (1 - step / steps)
            );

            if(step >= steps){
                window.clearInterval(fadeTimer);
                audio.pause();
                audio.currentTime = 0;
                resolve();
            }
        }, 50);
    });
}

function fadeInMusic(audio, duration){

    audio.volume = 0;
    const steps = Math.max(1, Math.ceil(duration / 50));
    let step = 0;

    const fadeTimer = window.setInterval(() => {
        step++;
        audio.volume = Math.min(
            musicVolume,
            musicVolume * (step / steps)
        );

        if(step >= steps){
            window.clearInterval(fadeTimer);
        }
    }, 50);
}

async function startEndingMusic(){

    if(!musicOn){
        return;
    }

    await fadeOutMusic(bgMusic, 900);
    endingMusic.currentTime = 0;
    endingMusic.volume = 0;
    endingMusic.play().catch(() => {});
    fadeInMusic(endingMusic, 900);
}

function stopEndingMusic(){

    endingMusic.pause();
    endingMusic.currentTime = 0;
    endingMusic.volume = 0;
    bgMusic.volume = musicVolume;
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

ctx.imageSmoothingEnabled = false;

/* =========================
   SCREEN
========================= */

const screens = {
    intro: document.getElementById('introScreen'),
    story: document.getElementById('storyScreen'),
    main: document.getElementById('mainMenu'),
    skin: document.getElementById('skinMenu'),
    level: document.getElementById('levelMenu'),
    map: document.getElementById('mapScreen'),
    game: document.getElementById('gameScreen'),
    ending: document.getElementById('endingScreen')
};

const endingScene1 = document.getElementById('endingScene1');
const endingScene2 = document.getElementById('endingScene2');
const endingScene3 = document.getElementById('endingScene3');
const endingScene4 = document.getElementById('endingScene4');
const endingVideo = document.getElementById('endingVideo');
const endingHeroName = document.getElementById('endingHeroName');
const screenTransition = document.getElementById('screenTransition');
const endingSpeaker = document.getElementById('endingSpeaker');
const endingDialogueText = document.getElementById('endingDialogueText');
const ending4Speaker = document.getElementById('ending4Speaker');
const ending4DialogueText = document.getElementById('ending4DialogueText');
const characterNames = {
    knight: 'Cadias Drankevall',
    archer: 'Morgarian Xanthyr',
    mage: 'Grizelda Moonwhisper'
};

function showScreen(name, useTransition = name === 'ending'){

    const activateScreen = () => {
        Object.values(screens).forEach(screen => {
            screen.classList.remove('active');
        });

        screens[name].classList.add('active');
        gameRunning = name === 'game';
    };

    if(useTransition){
        screenTransition.classList.add('visible');

        window.setTimeout(() => {
            activateScreen();
            screenTransition.classList.remove('visible');
        }, 450);

        return;
    }

    activateScreen();
}

/* =========================
   STORY
========================= */

const storyPages = [
    {
        title:'Kerajaan Dalam Bahaya',
        text:'Dahulu kala, sebuah kerajaan bernama North Kingdom yang dipimpin oleh Raja Sylvain Etrama Salvatore yang damai tiba-tiba diserang oleh pasukan monster yang datang dari wilayah selatan.'
    },
    {
        title:'Sang Ksatria',
        text:'Seorang pahlawan kerajaan memutuskan untuk bertarung dan melindungi rakyat dari serangan monster.'
    },
    {
        title:'Perjalanan Dimulai',
        text:'Ia harus melewati hutan, pegunungan dan desa yang telah dikuasai monster sebelum mencapai kastil musuh.'
    },
    {
        title:'Takdir Kerajaan',
        text:'Nasib seluruh kerajaan kini berada di sang Ksatria yang tampan itu. Perjalanan sang pahlawan untuk memusnakan para monster pun dimulai.'
    }
];

let storyIndex = 0;

const storyTitle = document.getElementById('storyTitle');
const storyText = document.getElementById('storyText');
const storyVideo = document.getElementById('storyVideo');
const storyPlaybackRate = 0.75;

document.getElementById('startIntro').onclick = () => {
    bgMusic.play();
    storyIndex = 0;
    showStory();
    storyVideo.currentTime = 0;
    storyVideo.playbackRate = storyPlaybackRate;
    storyVideo.play().catch(() => {});
    showScreen('story', true);
};

document.getElementById('nextStory').onclick = () => {
    storyIndex++;
    if(storyIndex >= storyPages.length){
        storyVideo.pause();
        storyVideo.currentTime = 0;
        showScreen('main', true);
    }else{
        showStory();
    }
};

function showStory(){

    storyTitle.textContent =
        storyPages[storyIndex].title;

    storyText.textContent =
        storyPages[storyIndex].text;
}

/* =========================
   MENU
========================= */

document.getElementById('playButton').onclick = () => {

    updateLevelButtons();

    showScreen('level');
};

document.getElementById('skinButton').onclick = () => {

    showScreen('skin');
};

document.getElementById('backSkin').onclick = () => {

    showScreen('main');
};

document.getElementById('backLevel').onclick = () => {

    showScreen('main');
};

/* =========================
   SKIN
========================= */

let selectedCharacter = 'knight';

const skinCards =
    document.querySelectorAll('.skinCard');

skinCards.forEach(card => {

    card.onclick = () => {

        skinCards.forEach(c =>
            c.classList.remove('selected')
        );

        card.classList.add('selected');

        selectedCharacter =
            card.dataset.skin;
    };
});

/* =========================
   LEVEL
========================= */

let unlockedLevel = 1;

const levelButtons =
    document.querySelectorAll('.levelButton');

levelButtons.forEach(button => {

    button.onclick = () => {

        const level =
            Number(button.dataset.level);

        if(level <= unlockedLevel){

            startGame(level);
        }
    };
});

function updateLevelButtons(){

    levelButtons.forEach(button => {

        const level =
            Number(button.dataset.level);

        const lock =
            button.querySelector('.lockIcon');

        if(level <= unlockedLevel){

            button.classList.remove('locked');

            if(lock){
                lock.style.display = 'none';
            }

        }else{

            button.classList.add('locked');

            if(lock){
                lock.style.display = 'block';
            }
        }
    });
}

/* =========================
   GAME STATE
========================= */

let gameRunning = false;
let currentLevel = 1;
let score = 0;
let maxHP = 5;
let playerHP = maxHP;
let enemies = [];
let particles = [];
let projectiles = [];
let attackEffects = [];
let damageNumbers = [];
let selectedMagePower = 'arcane';
const archerAttackData = {
    range:520,
    speed:10,
    damage:1,
    knockback:11
};
let grassPieces = [];
let flowers = [];
let rocks = [];
let keys = {};
let cameraShake = 0;
let levelCompleted = false;
let bossSpawned = false;
let animationTime = 0;

const levelMapData = {
    1:{name:'FOREST VILLAGE', description:'Desa hutan menjadi garis depan kerajaan.', x:16, y:68},
    2:{name:'DARK FOREST', description:'Hutan gelap menyimpan jejak pasukan monster.', x:36, y:45},
    3:{name:'MOUNTAIN PASS', description:'Jalur pegunungan membawa kita menuju wilayah musuh.', x:56, y:25},
    4:{name:'RUINED VILLAGE', description:'Reruntuhan ini menjadi saksi serangan monster.', x:72, y:57},
    5:{name:'MONSTER CASTLE', description:'Kastil monster adalah tujuan terakhir perjalanan.', x:88, y:30}
};

const mapTitle = document.getElementById('mapTitle');
const mapLevel = document.getElementById('mapLevel');
const mapDescription = document.getElementById('mapDescription');
const playerMapMarker = document.getElementById('playerMapMarker');
const mapLocations = document.querySelectorAll('.mapLocation');
const pauseMenu = document.getElementById('pauseMenu');
const resumeButton = document.getElementById('resumeButton');
const returnMenuButton = document.getElementById('returnMenuButton');
const levelStory = document.getElementById('levelStory');
const levelStorySpeaker = document.getElementById('levelStorySpeaker');
const continueLevelStory = document.getElementById('continueLevelStory');

function showLevelMap(level){

    const location = levelMapData[level];

    mapTitle.textContent = location.name;
    mapLevel.textContent = level;
    mapDescription.textContent = location.description;
    playerMapMarker.style.left = `${location.x}%`;
    playerMapMarker.style.top = `${location.y}%`;

    mapLocations.forEach(mapLocation => {
        mapLocation.classList.toggle(
            'current',
            Number(mapLocation.dataset.mapLevel) === level
        );
    });

    showScreen('map');
}

document.getElementById('beginBattle').onclick = () => {
    showScreen('game');

    if(currentLevel === 1){
        levelStorySpeaker.textContent = characterNames[selectedCharacter];
        levelStory.classList.add('visible');
        levelStory.setAttribute('aria-hidden', 'false');
        gameRunning = false;
        keys = {};
        return;
    }

    gameRunning = true;
};

continueLevelStory.onclick = () => {
    levelStory.classList.remove('visible');
    levelStory.setAttribute('aria-hidden', 'true');
    gameRunning = true;
};

/* =========================
   PLAYER
========================= */

const player = {

    x:480,
    y:355,

    width:34,
    height:54,

    speed:3.2,

    direction:1,

    moving:false,

    attack:false,

    attackTimer:0,

    attackCooldown:0,

    invincible:0,

    stepTime:0
};

const magePowers = {
    arcane: {
        name:'ARCANE BOLT',
        range:520,
        speed:9,
        damage:2,
        cooldown:22,
        knockback:17
    },
    meteor: {
        name:'METEOR BURST',
        range:620,
        speed:4.5,
        damage:3,
        cooldown:42,
        knockback:25,
        splashRadius:72
    }
};

const magePowerPanel = document.getElementById('magePowers');
const powerButtons = document.querySelectorAll('.powerButton');

powerButtons.forEach(button => {
    button.addEventListener('click', event => {
        event.stopPropagation();
        selectedMagePower = button.dataset.power;
        powerButtons.forEach(powerButton => {
            powerButton.classList.toggle(
                'selected',
                powerButton === button
            );
        });
        showCombatMessage(magePowers[selectedMagePower].name + ' dipilih');
    });
});

function updateMagePowerPanel(){
    magePowerPanel.classList.toggle(
        'visible',
        selectedCharacter === 'mage' && screens.game.classList.contains('active')
    );
}

const groundTop = 350;
const playerFootOffset = 26;

/* =========================
   KEYBOARD
========================= */

window.addEventListener('keydown', e => {

    if(e.code === 'Escape' && screens.game.classList.contains('active')){

        e.preventDefault();

        if(pauseMenu.classList.contains('activePause')){
            resumeGame();
        }else if(gameRunning){
            pauseGame();
        }

        return;
    }

    keys[e.key.toLowerCase()] = true;

    if(e.code === 'Space'){

        if(
            gameRunning &&
            levelCompleted
        ){

            finishLevel();
        }
    }
});

function pauseGame(){

    gameRunning = false;
    keys = {};
    pauseMenu.classList.add('activePause');
    pauseMenu.setAttribute('aria-hidden', 'false');
}

function resumeGame(){

    pauseMenu.classList.remove('activePause');
    pauseMenu.setAttribute('aria-hidden', 'true');
    gameRunning = true;
}

resumeButton.onclick = resumeGame;

returnMenuButton.onclick = () => {

    pauseMenu.classList.remove('activePause');
    pauseMenu.setAttribute('aria-hidden', 'true');
    keys = {};
    gameRunning = false;
    showScreen('main');
};

window.addEventListener('keyup', e => {

    keys[e.key.toLowerCase()] = false;
});

/* =========================
   START GAME
========================= */

function startGame(level){

    currentLevel = level;

    score = 0;

    playerHP = maxHP;

    levelCompleted = false;

    bossSpawned = false;

    enemies = [];

    particles = [];

    projectiles = [];

    attackEffects = [];

    damageNumbers = [];

    cameraShake = 0;

    player.x = canvas.width / 2;
    player.y = groundTop - playerFootOffset;

    player.attack = false;
    player.attackTimer = 0;
    player.attackCooldown = 0;
    player.invincible = 0;

    document.getElementById('exitMessage')
        .style.display = 'none';

    createWorld();

    createEnemies();

    updateHUD();

    showLevelMap(level);
}

/* =========================
   WORLD
========================= */

function createWorld(){

    grassPieces = [];

    flowers = [];

    rocks = [];

    for(let i = 0; i < 70; i++){

        grassPieces.push({

            x:Math.random() * canvas.width,

            y:360 + Math.random() * 170
        });
    }

    for(let i = 0; i < 20; i++){

        flowers.push({

            x:Math.random() * canvas.width,

            y:385 + Math.random() * 130,

            type:Math.floor(Math.random() * 3)
        });
    }

    for(let i = 0; i < 10; i++){

        rocks.push({

            x:Math.random() * canvas.width,

            y:390 + Math.random() * 125,

            size:5 + Math.random() * 7
        });
    }
}

/* =========================
   ENEMY
========================= */

const goblinPalettes = [
    {
        green: '#72a82f',
        light: '#8fc43d',
        dark: '#416b29',
        belly: '#63942e',
        foot: '#355522',
        ear: '#527c2c',
        cloth: '#8a542d',
        clothDark: '#583622',
        clothFold: '#6d4026'
    },
    {
        green: '#3f8f5b',
        light: '#62b878',
        dark: '#24613d',
        belly: '#438d5a',
        foot: '#1e4d32',
        ear: '#33754b',
        cloth: '#7653a6',
        clothDark: '#4c326d',
        clothFold: '#60428b'
    },
    {
        green: '#6b62b5',
        light: '#9188d3',
        dark: '#413b78',
        belly: '#7169b4',
        foot: '#302d5d',
        ear: '#554d92',
        cloth: '#bd713e',
        clothDark: '#794126',
        clothFold: '#9d572f'
    },
    {
        green: '#b5573f',
        light: '#d57a55',
        dark: '#773225',
        belly: '#aa4e39',
        foot: '#5d261e',
        ear: '#8f3d2e',
        cloth: '#3b7199',
        clothDark: '#254864',
        clothFold: '#2f5b7e'
    },
    {
        green: '#c29b35',
        light: '#e0c45b',
        dark: '#80641e',
        belly: '#b28b2d',
        foot: '#604a17',
        ear: '#977725',
        cloth: '#a84772',
        clothDark: '#682946',
        clothFold: '#87365d'
    }
];

function createEnemies(){

    const amount =
        2 + currentLevel * 2;

    const goblinColors =
        goblinPalettes[(currentLevel - 1) % goblinPalettes.length];

    for(let i = 0; i < amount; i++){

        let x;

        if(i % 2 === 0){

            x = 80 + Math.random() * 240;

        }else{

            x = 650 + Math.random() * 230;
        }

        enemies.push({

            colors:goblinColors,

            x:x,

            y:370 + Math.random() * 110,

            width:36,
            height:43,

            hp:2 + currentLevel,

            maxHP:2 + currentLevel,

            attackDamage:currentLevel,

            speed:
                0.45 +
                currentLevel * 0.09,

            direction:
                Math.random() < .5 ? -1 : 1,

            wanderTimer:
                Math.random() * 100,

            hitFlash:0,

            hitTimer:0,

            dead:false,

            deathTimer:0,

            attackCooldown:0,

            step:Math.random() * 10
        });
    }
}

function createFinalBoss(){

    bossSpawned = true;

    enemies.push({

        isBoss:true,

        colors:{
            green:'#b51f2e',
            light:'#ed3b45',
            dark:'#681421',
            belly:'#a91e2d',
            foot:'#4d111b',
            ear:'#861827',
            cloth:'#401528',
            clothDark:'#230b16',
            clothFold:'#6f1c35'
        },

        x:canvas.width / 2,
        y:380,

        width:58,
        height:68,

        hp:30,
        maxHP:30,
        attackDamage:3,
        speed:0.72,

        direction:Math.random() < .5 ? -1 : 1,
        wanderTimer:0,
        hitFlash:0,
        hitTimer:0,
        dead:false,
        deathTimer:0,
        attackCooldown:0,
        fireCooldown:45,
        clawTimer:0,
        tentacleTimer:0,
        tentaclesActive:false,
        isChasing:false,
        step:Math.random() * 10
    });

    showCombatMessage('FINAL BOSS MUNCUL! KALAHKAN MONSTER MERAH!');
    updateHUD();
}

function createBossFireball(boss){

    const dx = player.x - boss.x;
    const dy = (player.y - 15) - (boss.y - 24);
    const distance = Math.hypot(dx,dy) || 1;

    projectiles.push({
        type:'fireball',
        x:boss.x,
        y:boss.y - 24,
        target:player,
        speed:3.8,
        damage:1,
        life:180,
        vx:dx / distance,
        vy:dy / distance,
        owner:boss
    });

    createParticles(
        boss.x,
        boss.y - 24,
        8,
        'fire'
    );
}

/* =========================
   UPDATE PLAYER
========================= */

function updatePlayer(){

    player.moving = false;

    let dx = 0;
    let dy = 0;

    if(keys['a']){
        dx -= 1;
    }

    if(keys['d']){
        dx += 1;
    }

    if(keys['w']){
        dy -= 1;
    }

    if(keys['s']){
        dy += 1;
    }

    if(dx !== 0 || dy !== 0){

        player.moving = true;

        const length =
            Math.hypot(dx,dy);

        dx /= length;
        dy /= length;

        if(dx !== 0){

            player.direction =
                dx > 0 ? 1 : -1;
        }

        player.x +=
            dx * player.speed;

        player.y +=
            dy * player.speed;

        player.stepTime += .22;
    }

    player.x = Math.max(
        30,
        Math.min(
            canvas.width - 30,
            player.x
        )
    );

    player.y = Math.max(
        groundTop - playerFootOffset,
        Math.min(
            canvas.height - playerFootOffset,
            player.y
        )
    );

    if(player.attackTimer > 0){

        player.attackTimer--;

    }else{

        player.attack = false;
    }

    if(player.attackCooldown > 0){

        player.attackCooldown--;
    }

    if(player.invincible > 0){

        player.invincible--;
    }
}

/* =========================
   UPDATE ENEMY
========================= */

function updateEnemies(){

    enemies.forEach(enemy => {

        if(enemy.dead){

            enemy.deathTimer--;

            return;
        }

        enemy.step += .08;

        if(enemy.hitFlash > 0){

            enemy.hitFlash--;
        }

        if(enemy.hitTimer > 0){

            enemy.hitTimer--;
        }

        if(enemy.attackCooldown > 0){

            enemy.attackCooldown--;
        }

        if(enemy.fireCooldown > 0){

            enemy.fireCooldown--;
        }

        const dx =
            player.x - enemy.x;

        const dy =
            player.y - enemy.y;

        const distance =
            Math.hypot(dx,dy);

        enemy.isChasing =
            enemy.isBoss && distance < 210;

        if(enemy.isBoss){

            enemy.tentaclesActive = distance < 260;

            if(enemy.tentaclesActive){
                enemy.tentacleTimer++;
            }
        }

        if(enemy.isChasing){
            enemy.clawTimer++;
        }else if(enemy.isBoss){
            enemy.clawTimer = 0;
        }

        /* CHASE */

        if(distance < 210){

            const len =
                distance || 1;

            const moveX =
                dx / len;

            const moveY =
                dy / len;

            enemy.x +=
                moveX * enemy.speed;

            enemy.y +=
                moveY * enemy.speed;

            enemy.direction =
                moveX > 0 ? 1 : -1;

        }

        /* WANDER */

        else{

            enemy.wanderTimer--;

            if(enemy.wanderTimer <= 0){

                enemy.direction =
                    Math.random() < .5
                    ? -1 : 1;

                enemy.wanderTimer =
                    70 + Math.random() * 100;
            }

            enemy.x +=
                enemy.direction *
                enemy.speed *
                .35;
        }

        enemy.x = Math.max(
            20,
            Math.min(
                canvas.width - 20,
                enemy.x
            )
        );

        enemy.y = Math.max(
            315,
            Math.min(
                canvas.height - 30,
                enemy.y
            )
        );

        if(
            enemy.isBoss &&
            distance < 300 &&
            enemy.fireCooldown <= 0
        ){

            createBossFireball(enemy);
            enemy.fireCooldown = 85;
        }

        /* ENEMY ATTACK */

        if(
            distance < 35 &&
            enemy.attackCooldown <= 0 &&
            player.invincible <= 0
        ){

            damagePlayer(enemy);

            enemy.attackCooldown = 50;
        }
    });

    enemies = enemies.filter(enemy => {

        return !(
            enemy.dead &&
            enemy.deathTimer <= 0
        );
    });

    checkEnemies();
}

/* =========================
   PLAYER DAMAGE
========================= */

function damagePlayer(enemy){

    if(player.invincible > 0){
        return;
    }

    playerHP -= 1;

    playerHP = Math.max(0, playerHP);

    player.invincible = 70;

    cameraShake = 8;

    const dx =
        player.x - enemy.x;

    const dy =
        player.y - enemy.y;

    const distance =
        Math.hypot(dx,dy) || 1;

    player.x +=
        (dx / distance) * 18;

    player.y +=
        (dy / distance) * 18;

    createParticles(
        player.x,
        player.y,
        10,
        'damage'
    );

    damageNumbers.push({

        x:player.x,
        y:player.y - 30,

        value:'-1 HP',

        life:45,

        type:'player'
    });

    updateHUD();

    if(playerHP <= 0){

        gameOver();
    }
}

/* =========================
   CLICK ATTACK
========================= */

canvas.addEventListener('click', e => {

    if(
        !gameRunning ||
        levelCompleted ||
        player.attackCooldown > 0
    ){
        return;
    }

    const rect =
        canvas.getBoundingClientRect();

    const mouseX =
        (e.clientX - rect.left) *
        canvas.width /
        rect.width;

    const mouseY =
        (e.clientY - rect.top) *
        canvas.height /
        rect.height;

    let clickedEnemy = null;

    let nearestDistance = Infinity;

    enemies.forEach(enemy => {

        if(enemy.dead){
            return;
        }

        const dx =
            mouseX - enemy.x;

        const dy =
            mouseY - enemy.y;

        const clickDistance =
            Math.hypot(dx,dy);

        if(
            clickDistance < (enemy.isBoss ? 70 : 40) &&
            clickDistance < nearestDistance
        ){

            clickedEnemy = enemy;

            nearestDistance =
                clickDistance;
        }
    });

    if(!clickedEnemy){
        return;
    }

    const distance =
        Math.hypot(
            clickedEnemy.x - player.x,
            clickedEnemy.y - player.y
        );

    const attackRange =
        selectedCharacter === 'knight'
        ? 95
        : selectedCharacter === 'mage'
            ? magePowers[selectedMagePower].range
            : archerAttackData.range;

    if(distance > attackRange){

        showCombatMessage(
            'Musuh terlalu jauh!'
        );

        return;
    }

    performAttack(clickedEnemy);
});

/* =========================
   ATTACK
========================= */

function performAttack(enemy){

    if(
        enemy.dead ||
        player.attackCooldown > 0
    ){
        return;
    }

    player.direction =
        enemy.x >= player.x
        ? 1 : -1;

    player.attack = true;

    player.attackTimer = 12;

    player.attackCooldown = 22;

    if(selectedCharacter === 'knight'){

        knightAttack(enemy);

    }else if(
        selectedCharacter === 'archer'
    ){

        archerAttack(enemy);

    }else{

        mageAttack(enemy);
    }
}

/* =========================
   KNIGHT
========================= */

function knightAttack(enemy){

    attackEffects.push({

        type:'slash',

        x:player.x +
            player.direction * 28,

        y:player.y - 17,

        direction:player.direction,

        life:10,

        maxLife:10
    });

    damageEnemy(
        enemy,
        2,
        20
    );

    createParticles(
        enemy.x,
        enemy.y - 15,
        14,
        'slash'
    );

    cameraShake = 5;
}

/* =========================
   ARCHER
========================= */

function archerAttack(enemy){

    projectiles.push({

        type:'arrow',

        x:player.x +
            player.direction * 20,

        y:player.y - 20,

        target:enemy,

        speed:archerAttackData.speed,

        damage:archerAttackData.damage,

        knockback:archerAttackData.knockback,

        life:80
    });
}

/* =========================
   MAGE
========================= */

function mageAttack(enemy){

    const power =
        magePowers[selectedMagePower];

    projectiles.push({

        type:'magic',

        x:player.x +
            player.direction * 20,

        y:player.y - 22,

        target:enemy,

        speed:power.speed,

        damage:power.damage,

        knockback:power.knockback,

        splashRadius:power.splashRadius || 0,

        life:100
    });

    createParticles(
        player.x +
        player.direction * 22,

        player.y - 20,

        8,
        'magic'
    );
}

/* =========================
   PROJECTILES
========================= */

function updateProjectiles(){

    for(let i =
        projectiles.length - 1;
        i >= 0;
        i--
    ){

        const projectile =
            projectiles[i];

        projectile.life--;

        if(
            projectile.life <= 0 ||
            !projectile.target ||
            projectile.target.dead
        ){

            projectiles.splice(i,1);

            continue;
        }

        const target =
            projectile.target;

        const dx =
            target.x -
            projectile.x;

        const dy =
            (target.y - 15) -
            projectile.y;

        const distance =
            Math.hypot(dx,dy);

        if(distance < (projectile.type === 'fireball' ? 18 : 14)){

            if(projectile.type === 'fireball'){

                damagePlayer(projectile.owner);

                createMagicExplosion(
                    player.x,
                    player.y - 15
                );

                cameraShake = 5;

                projectiles.splice(i,1);

                continue;
            }

            if(projectile.type === 'arrow'){

                damageEnemy(
                    target,
                    projectile.damage,
                    11
                );

                createParticles(
                    target.x,
                    target.y - 15,
                    8,
                    'arrow'
                );

            }else{

                damageEnemy(
                    target,
                    projectile.damage,
                    projectile.knockback
                );

                createMagicExplosion(
                    target.x,
                    target.y - 15
                );

                cameraShake = 4;
            }

            projectiles.splice(i,1);

            continue;
        }

        projectile.x +=
            (projectile.type === 'fireball'
                ? projectile.vx
                : dx / distance) *
            projectile.speed;

        projectile.y +=
            (projectile.type === 'fireball'
                ? projectile.vy
                : dy / distance) *
            projectile.speed;
    }
}

/* =========================
   ENEMY DAMAGE + KNOCKBACK
========================= */

function damageEnemy(
    enemy,
    damage,
    knockback
){

    if(enemy.dead){
        return;
    }

    enemy.hp -= damage;

    enemy.hitFlash = 7;

    enemy.hitTimer = 10;

    damageNumbers.push({

        x:enemy.x,
        y:enemy.y - 40,

        value:'-' + damage,

        life:40,

        type:'enemy'
    });

    /* REAL KNOCKBACK */

    const dx =
        enemy.x - player.x;

    const dy =
        enemy.y - player.y;

    const distance =
        Math.hypot(dx,dy) || 1;

    enemy.x +=
        (dx / distance) *
        knockback;

    enemy.y +=
        (dy / distance) *
        knockback *
        .4;

    if(enemy.hp <= 0){

        killEnemy(enemy);
    }
}

/* =========================
   KILL
========================= */

function killEnemy(enemy){

    if(enemy.dead){
        return;
    }

    enemy.dead = true;

    enemy.deathTimer = 18;

    score +=
        100 * currentLevel;

    createParticles(
        enemy.x,
        enemy.y - 15,
        24,
        'death'
    );

    damageNumbers.push({

        x:enemy.x,
        y:enemy.y - 55,

        value:'+100',

        life:60,

        type:'score'
    });

    cameraShake = 7;

    updateHUD();

    if(enemy.isBoss){

        levelCompleted = true;
        finishLevel();
    }
}

/* =========================
   PARTICLES
========================= */

function createParticles(
    x,
    y,
    amount,
    type
){

    for(let i = 0; i < amount; i++){

        particles.push({

            x:x,
            y:y,

            vx:
                (Math.random() - .5) * 5,

            vy:
                (Math.random() - .5) * 5 - 1,

            size:
                2 + Math.random() * 4,

            life:
                20 + Math.random() * 20,

            type:type
        });
    }
}

function createMagicExplosion(x,y){

    attackEffects.push({

        type:'magicExplosion',

        x:x,
        y:y,

        radius:5,

        life:16,

        maxLife:16
    });

    createParticles(
        x,
        y,
        22,
        'magic'
    );
}

function updateParticles(){

    for(let i =
        particles.length - 1;
        i >= 0;
        i--
    ){

        const p =
            particles[i];

        p.x += p.vx;
        p.y += p.vy;

        p.vy += .12;

        p.life--;

        if(p.life <= 0){

            particles.splice(i,1);
        }
    }
}

/* =========================
   ATTACK EFFECTS
========================= */

function updateAttackEffects(){

    for(let i =
        attackEffects.length - 1;
        i >= 0;
        i--
    ){

        const effect =
            attackEffects[i];

        effect.life--;

        if(effect.type === 'magicExplosion'){

            effect.radius += 3;
        }

        if(effect.life <= 0){

            attackEffects.splice(i,1);
        }
    }
}

/* =========================
   DAMAGE NUMBERS
========================= */

function updateDamageNumbers(){

    for(let i =
        damageNumbers.length - 1;
        i >= 0;
        i--
    ){

        damageNumbers[i].y -= .5;

        damageNumbers[i].life--;

        if(
            damageNumbers[i].life <= 0
        ){

            damageNumbers.splice(i,1);
        }
    }
}

/* =========================
   COMBAT MESSAGE
========================= */

let combatMessageTimer = 0;

function showCombatMessage(text){

    const combatText =
        document.getElementById(
            'combatText'
        );

    combatText.textContent = text;

    combatMessageTimer = 70;
}

function updateCombatMessage(){

    if(combatMessageTimer > 0){

        combatMessageTimer--;

        if(combatMessageTimer === 0){

            document.getElementById(
                'combatText'
            ).textContent = '';
        }
    }
}

/* =========================
   LEVEL CHECK
========================= */

function checkEnemies(){

    const livingEnemies =
        enemies.filter(enemy =>
            !enemy.dead
        );

    document.getElementById(
        'enemyCount'
    ).textContent =
        livingEnemies.length;

    if(
        livingEnemies.length === 0 &&
        !levelCompleted &&
        currentLevel === 5 &&
        !bossSpawned
    ){

        createFinalBoss();

        return;
    }

    if(
        livingEnemies.length === 0 &&
        !levelCompleted &&
        currentLevel < 5
    ){

        levelCompleted = true;

        document.getElementById(
            'exitMessage'
        ).style.display = 'block';
    }
}

/* =========================
   FINISH LEVEL
========================= */

function finishLevel(){

    if(!levelCompleted){
        return;
    }

    gameRunning = false;

    if(currentLevel >= 5){

        startEndingMusic();
        endingHeroName.textContent = characterNames[selectedCharacter];
        endingDialogueIndex = 0;
        endingVideo.pause();
        endingVideo.currentTime = 0;
        showEndingDialogue();
        endingScene1.classList.add('activeEndingScene');
        endingScene2.classList.remove('activeEndingScene');
        endingScene3.classList.remove('activeEndingScene');
        endingScene4.classList.remove('activeEndingScene');

        showScreen('ending');

        return;
    }

    unlockedLevel =
        Math.max(
            unlockedLevel,
            currentLevel + 1
        );

    updateLevelButtons();

    showScreen('level');
}

/* =========================
   GAME OVER
========================= */

function gameOver(){

    gameRunning = false;

    setTimeout(() => {

        alert(
            'GAME OVER\n\nScore: ' +
            score
        );

        updateLevelButtons();

        showScreen('level');

    },100);
}

/* =========================
   HUD
========================= */

function updateHUD(){

    document.getElementById(
        'playerName'
    ).textContent =
        selectedCharacter.toUpperCase();

    document.getElementById(
        'score'
    ).textContent =
        score;

    document.getElementById(
        'levelNumber'
    ).textContent =
        currentLevel;

    let heartHTML = '';

    for(let i = 0; i < maxHP; i++){

        if(i < playerHP){

            heartHTML +=
                '<span class="heart">♥</span>';

        }else{

            heartHTML +=
                '<span class="emptyHeart">♥</span>';
        }
    }

    document.getElementById(
        'hearts'
    ).innerHTML =
        heartHTML;
}

/* =========================================================
   BACKGROUND UTAMA
========================================================= */

function drawBackground(){

    const level =
        typeof currentLevel === "number"
        ? currentLevel
        : 1;

    if(level === 1){

        bgForestVillage();

    }else if(level === 2){

        bgDarkForest();

    }else if(level === 3){

        bgMountainPass();

    }else if(level === 4){

        bgRuinedVillage();

    }else{

        bgMonsterCastle();
    }
}


/* =========================================================
   LEVEL 1
   FOREST VILLAGE
========================================================= */

function bgForestVillage(){

    /* ================= SKY ================= */

    const sky =
        ctx.createLinearGradient(
            0,
            0,
            0,
            350
        );

    sky.addColorStop(
        0,
        "#4f91b8"
    );

    sky.addColorStop(
        0.55,
        "#86b9a0"
    );

    sky.addColorStop(
        1,
        "#c6d39b"
    );

    ctx.fillStyle = sky;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* ================= SUN ================= */

    ctx.fillStyle =
        "#f7dc8b";

    ctx.fillRect(
        765,
        55,
        32,
        32
    );

    ctx.fillRect(
        755,
        65,
        52,
        12
    );


    /* ================= CLOUDS ================= */

    bgCloud(
        100,
        90,
        1
    );

    bgCloud(
        510,
        120,
        0.8
    );


    /* ================= DISTANT TREES ================= */

    for(
        let x = -20;
        x < canvas.width + 50;
        x += 65
    ){

        bgTree(
            x,
            350,
            0.55,
            "#47765a",
            "#315a42"
        );
    }


    /* ================= HOUSES ================= */

    /*
       Semua rumah menggunakan
       bottomY = 350
       sehingga bagian bawah rumah
       tepat berada di tanah.
    */

    bgHouse(
        390,
        350,
        1
    );

    bgHouse(
        560,
        350,
        0.72
    );


    /* ================= LARGE TREES ================= */

    bgTree(
        75,
        350,
        1.35,
        "#315f3d",
        "#244a32"
    );

    bgTree(
        900,
        350,
        1.15,
        "#315f3d",
        "#244a32"
    );


    /* ================= GROUND ================= */

    drawForestGround();
}


/* =========================================================
   LEVEL 2
   DARK FOREST
========================================================= */

function bgDarkForest(){

    /* ================= SKY ================= */

    const sky =
        ctx.createLinearGradient(
            0,
            0,
            0,
            350
        );

    sky.addColorStop(
        0,
        "#101c28"
    );

    sky.addColorStop(
        0.5,
        "#1d3439"
    );

    sky.addColorStop(
        1,
        "#465743"
    );

    ctx.fillStyle = sky;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* ================= MOON ================= */

    ctx.fillStyle =
        "#d7d9b5";

    ctx.fillRect(
        750,
        55,
        38,
        38
    );

    ctx.fillRect(
        742,
        65,
        54,
        18
    );


    /* ================= MOON SHADOW ================= */

    ctx.fillStyle =
        "#17252e";

    ctx.fillRect(
        770,
        50,
        25,
        20
    );

    ctx.fillRect(
        778,
        65,
        18,
        25
    );


    /* ================= BACK FOREST ================= */

    for(
        let x = 20;
        x < canvas.width + 60;
        x += 65
    ){

        bgTree(
            x,
            350,
            0.75,
            "#294b35",
            "#172f27"
        );
    }


    /* ================= LARGE TREES ================= */

    bgTree(
        80,
        350,
        1.55,
        "#294b35",
        "#172c25"
    );

    bgTree(
        900,
        350,
        1.45,
        "#294b35",
        "#172c25"
    );


    /* ================= GROUND ================= */

    drawDarkForestGround();


    /* ================= MUSHROOM ================= */

    bgMushrooms();
}


/* =========================================================
   LEVEL 3
   MOUNTAIN PASS
========================================================= */

function bgMountainPass(){

    /* ================= SKY ================= */

    const sky =
        ctx.createLinearGradient(
            0,
            0,
            0,
            350
        );

    sky.addColorStop(
        0,
        "#527b9c"
    );

    sky.addColorStop(
        0.55,
        "#9eb7c3"
    );

    sky.addColorStop(
        1,
        "#d5d6cd"
    );

    ctx.fillStyle = sky;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* ================= CLOUD ================= */

    bgCloud(
        90,
        100,
        1.2
    );

    bgCloud(
        590,
        125,
        0.9
    );


    /* ================= MOUNTAINS ================= */

    bgMountain(
        0,
        350,
        190,
        135,
        "#718998"
    );

    bgMountain(
        180,
        350,
        430,
        100,
        "#607d8d"
    );

    bgMountain(
        420,
        350,
        680,
        145,
        "#718b98"
    );

    bgMountain(
        650,
        350,
        850,
        125,
        "#5b7483"
    );


    /* ================= SNOW ================= */

    ctx.fillStyle =
        "#e0e3df";

    ctx.beginPath();

    ctx.moveTo(
        150,
        180
    );

    ctx.lineTo(
        190,
        135
    );

    ctx.lineTo(
        230,
        180
    );

    ctx.lineTo(
        210,
        167
    );

    ctx.lineTo(
        190,
        150
    );

    ctx.lineTo(
        172,
        170
    );

    ctx.closePath();

    ctx.fill();


    /* ================= ROCKY GROUND ================= */

    drawMountainGround();
}

/* =========================================================
   LEVEL 4
   RUINED VILLAGE - REVISED
========================================================= */

function bgRuinedVillage(){

    /* =====================================================
       SKY
    ===================================================== */

    const sky =
        ctx.createLinearGradient(
            0,
            0,
            0,
            350
        );

    sky.addColorStop(
        0,
        "#3f4548"
    );

    sky.addColorStop(
        0.45,
        "#75635d"
    );

    sky.addColorStop(
        0.75,
        "#a17c68"
    );

    sky.addColorStop(
        1,
        "#b18b6d"
    );

    ctx.fillStyle =
        sky;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* =====================================================
       SUNSET
    ===================================================== */

    ctx.fillStyle =
        "#d7b083";

    ctx.fillRect(
        755,
        58,
        42,
        42
    );

    ctx.fillRect(
        745,
        68,
        62,
        22
    );


    /* =====================================================
       CLOUDS
    ===================================================== */

    ctx.fillStyle =
        "rgba(82,58,55,.35)";

    ctx.fillRect(
        60,
        100,
        170,
        15
    );

    ctx.fillRect(
        100,
        88,
        95,
        15
    );

    ctx.fillRect(
        470,
        125,
        180,
        17
    );

    ctx.fillRect(
        520,
        110,
        90,
        18
    );

    /* asap dan kabut membuat desa terasa dingin serta ditinggalkan */
    ctx.fillStyle =
        "rgba(44,48,48,.22)";

    ctx.fillRect(
        0,
        285,
        canvas.width,
        38
    );

    ctx.fillStyle =
        "rgba(62,58,52,.5)";

    [185, 426, 710].forEach((x, index) => {
        ctx.fillRect(x, 250 - index * 8, 18, 30);
        ctx.fillRect(x - 10, 230 - index * 8, 38, 22);
        ctx.fillRect(x - 18, 208 - index * 8, 54, 18);
    });

    ctx.fillStyle =
        "rgba(207,195,171,.16)";

    ctx.fillRect(
        0,
        326,
        canvas.width,
        24
    );


    /* =====================================================
       DISTANT VILLAGE SILHOUETTE
    ===================================================== */

    ctx.fillStyle =
        "#69524a";

    ctx.fillRect(
        0,
        315,
        canvas.width,
        35
    );


    /* distant roofs */

    ctx.fillStyle =
        "#54413d";

    bgTinyRoof(
        40,
        315,
        70
    );

    bgTinyRoof(
        280,
        315,
        80
    );

    bgTinyRoof(
        520,
        315,
        90
    );

    bgTinyRoof(
        780,
        315,
        80
    );


    /* =====================================================
       BACKGROUND DEAD TREES
    ===================================================== */

    bgDeadTree(
        35,
        350,
        1.15
    );

    bgDeadTree(
        930,
        350,
        1.15
    );


    /* =====================================================
       BACK ROW HOUSES
       SEMUA BERDASARKAN GROUND Y = 350
    ===================================================== */

    bgRuinedHouse(
        20,
        350,
        0.72,
        0
    );

    bgRuinedHouse(
        145,
        350,
        0.68,
        1
    );

    bgRuinedHouse(
        265,
        350,
        0.78,
        2
    );


    /* =====================================================
       TENGAH
    ===================================================== */

    bgRuinedHouse(
        400,
        350,
        0.95,
        3
    );

    bgRuinedHouse(
        555,
        350,
        0.72,
        4
    );


    /* =====================================================
       KANAN
    ===================================================== */

    bgRuinedHouse(
        680,
        350,
        0.88,
        5
    );

    bgRuinedHouse(
        825,
        350,
        0.72,
        6
    );


    /* =====================================================
       GROUND
    ===================================================== */

    drawRuinedGround();


    /* =====================================================
       PUING DEPAN
    ===================================================== */

    bgRuinedDebris();


    /* =====================================================
       PAGAR RUSAK
    ===================================================== */

    bgBrokenFence(
        115,
        415
    );

    bgBrokenFence(
        730,
        420
    );
}


/* =========================================================
   RUMAH TERBENGKALAI
   groundY = posisi TANAH
========================================================= */

function bgRuinedHouse(
    x,
    groundY,
    scale,
    type
){

    /*
       Safety:
       memastikan bangunan tetap berada
       di dalam area canvas.
    */

    if(
        x < -120 ||
        x > canvas.width + 20
    ){

        return;
    }


    /* =====================================================
       VARIASI WARNA
    ===================================================== */

    let wallColor =
        "#66594c";

    let wallLight =
        "#81705d";

    let darkColor =
        "#443a35";

    let roofColor =
        "#403733";


    if(type === 1){

        wallColor =
            "#5b5148";

        wallLight =
            "#75695b";

        roofColor =
            "#393330";
    }


    if(type === 2){

        wallColor =
            "#71614e";

        wallLight =
            "#8b775e";

        roofColor =
            "#493c35";
    }


    if(type === 3){

        wallColor =
            "#584e49";

        wallLight =
            "#76655b";

        roofColor =
            "#352e2d";
    }


    if(type === 4){

        wallColor =
            "#62574d";

        wallLight =
            "#7e6c5b";

        roofColor =
            "#413733";
    }


    if(type === 5){

        wallColor =
            "#6e5d4e";

        wallLight =
            "#88725d";

        roofColor =
            "#453832";
    }


    if(type === 6){

        wallColor =
            "#594d47";

        wallLight =
            "#73645b";

        roofColor =
            "#322d2b";
    }


    /* =====================================================
       UKURAN
    ===================================================== */

    const width =
        110 * scale;

    const height =
        72 * scale;

    const left =
        x;

    const top =
        groundY - height;


    /* =====================================================
       BAYANGAN BANGUNAN
    ===================================================== */

    ctx.fillStyle =
        "rgba(45,35,30,.25)";

    ctx.fillRect(
        left + 8 * scale,
        groundY - 2 * scale,
        width,
        7 * scale
    );


    /* =====================================================
       DINDING UTAMA
    ===================================================== */

    ctx.fillStyle =
        wallColor;

    ctx.fillRect(
        left,
        top,
        width,
        height
    );


    /* =====================================================
       DINDING TERANG
    ===================================================== */

    ctx.fillStyle =
        wallLight;

    ctx.fillRect(
        left + 6 * scale,
        top + 7 * scale,
        10 * scale,
        height - 15 * scale
    );


    /* =====================================================
       DINDING GELAP BAWAH
    ===================================================== */

    ctx.fillStyle =
        darkColor;

    ctx.fillRect(
        left,
        groundY - 12 * scale,
        width,
        12 * scale
    );


    /* =====================================================
       VARIASI RUMAH
    ===================================================== */

    if(type === 0){

        /* ATAP MIRING RUSAK */

        ctx.fillStyle =
            roofColor;

        ctx.beginPath();

        ctx.moveTo(
            left - 8 * scale,
            top
        );

        ctx.lineTo(
            left + 43 * scale,
            top - 34 * scale
        );

        ctx.lineTo(
            left + width + 8 * scale,
            top - 7 * scale
        );

        ctx.lineTo(
            left + width,
            top + 3 * scale
        );

        ctx.closePath();

        ctx.fill();


        /* LUBANG ATAP */

        ctx.fillStyle =
            "#302a29";

        ctx.fillRect(
            left + 45 * scale,
            top - 20 * scale,
            22 * scale,
            13 * scale
        );
    }


    else if(type === 1){

        /* RUMAH TANPA ATAP */

        ctx.fillStyle =
            roofColor;

        ctx.fillRect(
            left - 5 * scale,
            top - 7 * scale,
            38 * scale,
            8 * scale
        );

        ctx.fillRect(
            left + 48 * scale,
            top - 18 * scale,
            38 * scale,
            8 * scale
        );

        ctx.fillRect(
            left + 92 * scale,
            top - 3 * scale,
            23 * scale,
            7 * scale
        );
    }


    else if(type === 2){

        /* ATAP PECAH */

        ctx.fillStyle =
            roofColor;

        ctx.beginPath();

        ctx.moveTo(
            left - 5 * scale,
            top
        );

        ctx.lineTo(
            left + 30 * scale,
            top - 28 * scale
        );

        ctx.lineTo(
            left + 65 * scale,
            top - 4 * scale
        );

        ctx.lineTo(
            left + 85 * scale,
            top - 32 * scale
        );

        ctx.lineTo(
            left + width + 5 * scale,
            top + 2 * scale
        );

        ctx.closePath();

        ctx.fill();
    }


    else if(type === 3){

        /* BANGUNAN BESAR */

        ctx.fillStyle =
            roofColor;

        ctx.fillRect(
            left - 7 * scale,
            top - 8 * scale,
            width + 14 * scale,
            9 * scale
        );

        /* MENARA KECIL */

        ctx.fillRect(
            left + width - 25 * scale,
            top - 40 * scale,
            23 * scale,
            40 * scale
        );

        ctx.fillRect(
            left + width - 30 * scale,
            top - 44 * scale,
            33 * scale,
            7 * scale
        );
    }


    else if(type === 4){

        /* DINDING RUNTUH */

        ctx.fillStyle =
            wallColor;

        ctx.fillRect(
            left,
            top + 25 * scale,
            32 * scale,
            height - 25 * scale
        );

        ctx.fillRect(
            left + 42 * scale,
            top + 5 * scale,
            22 * scale,
            height - 5 * scale
        );

        ctx.fillRect(
            left + 73 * scale,
            top + 35 * scale,
            30 * scale,
            height - 35 * scale
        );

        /* BALOK ATAS */

        ctx.fillStyle =
            roofColor;

        ctx.fillRect(
            left - 5 * scale,
            top + 20 * scale,
            80 * scale,
            7 * scale
        );
    }


    else if(type === 5){

        /* ATAP HANCUR */

        ctx.fillStyle =
            roofColor;

        ctx.fillRect(
            left - 8 * scale,
            top - 8 * scale,
            42 * scale,
            8 * scale
        );

        ctx.fillRect(
            left + 45 * scale,
            top - 25 * scale,
            35 * scale,
            8 * scale
        );

        ctx.fillRect(
            left + 80 * scale,
            top - 4 * scale,
            38 * scale,
            8 * scale
        );
    }


    else{

        /* RUMAH KECIL RUNTUH */

        ctx.fillStyle =
            roofColor;

        ctx.fillRect(
            left - 5 * scale,
            top - 6 * scale,
            45 * scale,
            8 * scale
        );

        ctx.fillRect(
            left + 57 * scale,
            top - 18 * scale,
            45 * scale,
            8 * scale
        );
    }


    /* =====================================================
       JENDELA GELAP
    ===================================================== */

    ctx.fillStyle =
        "#29292a";

    ctx.fillRect(
        left + 18 * scale,
        top + 24 * scale,
        22 * scale,
        27 * scale
    );


    /* JENDELA PECAH */

    ctx.fillStyle =
        "#382e2a";

    ctx.fillRect(
        left + 19 * scale,
        top + 25 * scale,
        20 * scale,
        3 * scale
    );

    ctx.fillRect(
        left + 28 * scale,
        top + 24 * scale,
        3 * scale,
        27 * scale
    );


    /* =====================================================
       PINTU
    ===================================================== */

    ctx.fillStyle =
        "#40332c";

    ctx.fillRect(
        left + width - 34 * scale,
        groundY - 43 * scale,
        25 * scale,
        43 * scale
    );


    /* PINTU MIRING */

    if(type === 4 || type === 6){

        ctx.fillStyle =
            "#2d2927";

        ctx.fillRect(
            left + width - 32 * scale,
            groundY - 40 * scale,
            22 * scale,
            5 * scale
        );
    }


    /* =====================================================
       RETAKAN DINDING
    ===================================================== */

    ctx.fillStyle =
        "#403a35";

    ctx.fillRect(
        left + 48 * scale,
        top + 18 * scale,
        3 * scale,
        27 * scale
    );

    ctx.fillRect(
        left + 51 * scale,
        top + 38 * scale,
        17 * scale,
        3 * scale
    );


    ctx.fillRect(
        left + 75 * scale,
        top + 12 * scale,
        3 * scale,
        20 * scale
    );


    /* =====================================================
       BATU DI DASAR RUMAH
    ===================================================== */

    ctx.fillStyle =
        "#51473d";

    ctx.fillRect(
        left + 7 * scale,
        groundY - 6 * scale,
        13 * scale,
        6 * scale
    );

    ctx.fillRect(
        left + 45 * scale,
        groundY - 5 * scale,
        9 * scale,
        5 * scale
    );

    ctx.fillRect(
        left + 82 * scale,
        groundY - 7 * scale,
        15 * scale,
        7 * scale
    );
}


/* =========================================================
   MINI ROOF DI BELAKANG
========================================================= */

function bgTinyRoof(
    x,
    y,
    width
){

    ctx.beginPath();

    ctx.moveTo(
        x,
        y
    );

    ctx.lineTo(
        x + width / 2,
        y - 30
    );

    ctx.lineTo(
        x + width,
        y
    );

    ctx.closePath();

    ctx.fill();
}


/* =========================================================
   TANAH LEVEL 4
   AREA TANAH DIPERLUAS
========================================================= */

function drawRuinedGround(){

    const groundY = 350;


    /* =====================================================
       TANAH UTAMA
    ===================================================== */

    ctx.fillStyle =
        "#806b48";

    ctx.fillRect(
        0,
        groundY,
        canvas.width,
        canvas.height - groundY
    );


    /* =====================================================
       LAPISAN TANAH
    ===================================================== */

    ctx.fillStyle =
        "#705d3f";

    ctx.fillRect(
        0,
        groundY + 14,
        canvas.width,
        35
    );


    ctx.fillStyle =
        "#776344";

    ctx.fillRect(
        0,
        groundY + 49,
        canvas.width,
        40
    );


    ctx.fillStyle =
        "#806a47";

    ctx.fillRect(
        0,
        groundY + 89,
        canvas.width,
        canvas.height - groundY - 89
    );


    /* =====================================================
       GRASS EDGE
    ===================================================== */

    ctx.fillStyle =
        "#5c5038";

    ctx.fillRect(
        0,
        groundY,
        canvas.width,
        14
    );


    /* =====================================================
       JALAN
       Dibuat lebih sempit supaya tanah lebih luas
    ===================================================== */

    ctx.fillStyle =
        "#9c825e";

    ctx.fillRect(
        0,
        455,
        canvas.width,
        70
    );

    /* genangan dan noda hangus memecah permukaan tanah yang ditinggalkan */
    ctx.fillStyle =
        "rgba(48,52,48,.28)";

    [
        [145, 438, 58, 9],
        [485, 480, 76, 11],
        [815, 442, 48, 8]
    ].forEach(puddle => {
        ctx.fillRect(
            puddle[0],
            puddle[1],
            puddle[2],
            puddle[3]
        );
    });

    ctx.fillStyle =
        "#493f35";

    [
        [72, 395, 22, 5],
        [435, 400, 34, 6],
        [865, 382, 26, 5]
    ].forEach(ash => {
        ctx.fillRect(
            ash[0],
            ash[1],
            ash[2],
            ash[3]
        );
    });


    /* JALAN TERANG */

    ctx.fillStyle =
        "#b09167";

    ctx.fillRect(
        0,
        455,
        canvas.width,
        5
    );


    /* =====================================================
       RETAKAN TANAH
    ===================================================== */

    ctx.fillStyle =
        "#62523d";

    for(let i = 0; i < 30; i++){

        const x =
            (i * 97) % canvas.width;

        const y =
            370 + ((i * 29) % 75);

        ctx.fillRect(
            x,
            y,
            15,
            3
        );

        ctx.fillRect(
            x + 11,
            y + 3,
            4,
            9
        );
    }


    /* =====================================================
       RUMPUT LIAR
    ===================================================== */

    ctx.fillStyle =
        "#4e5736";

    for(let i = 0; i < 65; i++){

        const x =
            (i * 67) % canvas.width;

        const y =
            370 + ((i * 23) % 75);


        ctx.fillRect(
            x,
            y,
            3,
            13
        );

        ctx.fillRect(
            x - 5,
            y + 5,
            6,
            3
        );

        ctx.fillRect(
            x + 3,
            y + 2,
            5,
            3
        );
    }


    /* =====================================================
       JALAN RETAK
    ===================================================== */

    ctx.fillStyle =
        "#675641";

    for(let i = 0; i < 22; i++){

        const x =
            (i * 113) % canvas.width;

        const y =
            470 + ((i * 17) % 45);

        ctx.fillRect(
            x,
            y,
            18,
            3
        );

        ctx.fillRect(
            x + 14,
            y + 3,
            4,
            9
        );
    }


    /* =====================================================
       BATU KECIL
    ===================================================== */

    for(let i = 0; i < 35; i++){

        const x =
            (i * 83) % canvas.width;

        const y =
            385 + ((i * 31) % 95);


        ctx.fillStyle =
            i % 2 === 0
            ? "#62594d"
            : "#91806a";

        ctx.fillRect(
            x,
            y,
            8,
            5
        );
    }


    /* =====================================================
       BUNGA KERING
    ===================================================== */

    ctx.fillStyle =
        "#766243";

    for(let i = 0; i < 18; i++){

        const x =
            (i * 131) % canvas.width;

        const y =
            390 + ((i * 19) % 65);

        ctx.fillRect(
            x,
            y,
            3,
            12
        );

        ctx.fillRect(
            x - 4,
            y + 2,
            8,
            3
        );
    }
}


/* =========================================================
   PUING DI DEPAN
========================================================= */

function bgRuinedDebris(){

    const debris = [

        [55, 420, 25, 8],
        [100, 445, 18, 7],
        [225, 425, 30, 9],
        [350, 415, 20, 8],
        [370, 450, 30, 7],
        [515, 420, 25, 8],
        [620, 445, 18, 7],
        [770, 415, 27, 8],
        [880, 445, 25, 8]
    ];


    ctx.fillStyle =
        "#54463b";


    debris.forEach(
        d => {

            ctx.fillRect(
                d[0],
                d[1],
                d[2],
                d[3]
            );
        }
    );


    /* BALOK KAYU */

    ctx.fillStyle =
        "#493a30";

    ctx.fillRect(
        280,
        405,
        45,
        7
    );

    ctx.fillRect(
        295,
        412,
        7,
        25
    );

    ctx.fillRect(
        695,
        400,
        42,
        7
    );
}


/* =========================================================
   PAGAR RUSAK
========================================================= */

function bgBrokenFence(
    x,
    y
){

    ctx.fillStyle =
        "#594637";


    /* TIANG */

    ctx.fillRect(
        x,
        y - 35,
        7,
        35
    );

    ctx.fillRect(
        x + 38,
        y - 45,
        7,
        45
    );

    ctx.fillRect(
        x + 76,
        y - 28,
        7,
        28
    );


    /* PALANG */

    ctx.fillRect(
        x + 3,
        y - 28,
        75,
        6
    );

    ctx.fillRect(
        x + 20,
        y - 15,
        55,
        6
    );
}

/* =========================================================
   LEVEL 5
   MONSTER CASTLE
========================================================= */

function bgMonsterCastle(){

    /* ================= NIGHT SKY ================= */

    const sky =
        ctx.createLinearGradient(
            0,
            0,
            0,
            350
        );

    sky.addColorStop(
        0,
        "#111322"
    );

    sky.addColorStop(
        0.5,
        "#28253a"
    );

    sky.addColorStop(
        1,
        "#603941"
    );

    ctx.fillStyle = sky;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* ================= RED MOON ================= */

    ctx.fillStyle =
        "#a44f52";

    ctx.fillRect(
        745,
        55,
        42,
        42
    );

    ctx.fillRect(
        736,
        66,
        60,
        20
    );


    /* ================= CLOUDS ================= */

    ctx.fillStyle =
        "rgba(20,19,30,.8)";

    ctx.fillRect(
        60,
        90,
        180,
        20
    );

    ctx.fillRect(
        110,
        75,
        100,
        20
    );

    ctx.fillRect(
        570,
        115,
        210,
        20
    );


    /* ================= MOUNTAINS ================= */

    bgMountain(
        0,
        350,
        190,
        180,
        "#302d37"
    );

    bgMountain(
        700,
        350,
        870,
        165,
        "#292832"
    );


    /* ================= CASTLE ================= */

    bgCastle();


    /* ================= GROUND ================= */

    drawCastleGround();
}


/* =========================================================
   CLOUD
========================================================= */

function bgCloud(
    x,
    y,
    scale
){

    ctx.fillStyle =
        "rgba(245,245,225,.85)";

    ctx.fillRect(
        x,
        y,
        90 * scale,
        18 * scale
    );

    ctx.fillRect(
        x + 20 * scale,
        y - 15 * scale,
        50 * scale,
        18 * scale
    );

    ctx.fillRect(
        x + 45 * scale,
        y - 25 * scale,
        30 * scale,
        18 * scale
    );
}


/* =========================================================
   TREE
   y = TITIK TANAH
========================================================= */

function bgTree(
    x,
    y,
    scale,
    leafColor,
    darkLeafColor
){

    const trunkGradient = ctx.createLinearGradient(
        x - 12 * scale,
        0,
        x + 12 * scale,
        0
    );

    trunkGradient.addColorStop(0, "#392519");
    trunkGradient.addColorStop(0.3, "#68442b");
    trunkGradient.addColorStop(0.58, "#8a5a35");
    trunkGradient.addColorStop(0.82, "#563521");
    trunkGradient.addColorStop(1, "#2d1d16");

    ctx.fillStyle = trunkGradient;

    ctx.fillRect(
        x - 9 * scale,
        y - 76 * scale,
        18 * scale,
        76 * scale
    );

    ctx.fillRect(
        x - 15 * scale,
        y - 12 * scale,
        30 * scale,
        12 * scale
    );

    /* Several stepped branches keep the silhouette pixelated. */
    ctx.fillRect(x - 34 * scale, y - 88 * scale, 8 * scale, 35 * scale);
    ctx.fillRect(x - 47 * scale, y - 102 * scale, 28 * scale, 8 * scale);
    ctx.fillRect(x + 25 * scale, y - 94 * scale, 8 * scale, 38 * scale);
    ctx.fillRect(x + 27 * scale, y - 108 * scale, 30 * scale, 8 * scale);
    ctx.fillRect(x - 5 * scale, y - 116 * scale, 9 * scale, 48 * scale);
    ctx.fillRect(x - 29 * scale, y - 126 * scale, 8 * scale, 31 * scale);
    ctx.fillRect(x + 20 * scale, y - 130 * scale, 8 * scale, 35 * scale);

    ctx.fillStyle = "#b77a43";
    ctx.fillRect(x - 4 * scale, y - 72 * scale, 4 * scale, 52 * scale);
    ctx.fillRect(x - 31 * scale, y - 86 * scale, 4 * scale, 22 * scale);
    ctx.fillRect(x + 28 * scale, y - 91 * scale, 4 * scale, 25 * scale);

    /* Dark foundation blocks give the crown depth. */
    ctx.fillStyle = darkLeafColor;
    ctx.fillRect(x - 57 * scale, y - 112 * scale, 42 * scale, 43 * scale);
    ctx.fillRect(x - 42 * scale, y - 143 * scale, 48 * scale, 48 * scale);
    ctx.fillRect(x - 22 * scale, y - 168 * scale, 48 * scale, 43 * scale);
    ctx.fillRect(x + 3 * scale, y - 150 * scale, 47 * scale, 48 * scale);
    ctx.fillRect(x + 26 * scale, y - 119 * scale, 42 * scale, 40 * scale);
    ctx.fillRect(x - 67 * scale, y - 91 * scale, 24 * scale, 24 * scale);

    const leafGradient = ctx.createLinearGradient(
        x,
        y - 170 * scale,
        x,
        y - 62 * scale
    );

    leafGradient.addColorStop(0, "#b4d96a");
    leafGradient.addColorStop(0.25, leafColor);
    leafGradient.addColorStop(0.7, leafColor);
    leafGradient.addColorStop(1, darkLeafColor);

    ctx.fillStyle = leafGradient;
    ctx.fillRect(x - 39 * scale, y - 139 * scale, 32 * scale, 25 * scale);
    ctx.fillRect(x - 17 * scale, y - 158 * scale, 29 * scale, 29 * scale);
    ctx.fillRect(x + 9 * scale, y - 135 * scale, 35 * scale, 27 * scale);
    ctx.fillRect(x - 52 * scale, y - 104 * scale, 31 * scale, 22 * scale);
    ctx.fillRect(x + 35 * scale, y - 105 * scale, 25 * scale, 24 * scale);

    /* Small pixel clusters sell the layered, sunlit canopy. */
    ctx.fillStyle = "#d0e47c";
    ctx.fillRect(x - 29 * scale, y - 145 * scale, 10 * scale, 8 * scale);
    ctx.fillRect(x + 5 * scale, y - 157 * scale, 9 * scale, 8 * scale);
    ctx.fillRect(x + 29 * scale, y - 124 * scale, 12 * scale, 8 * scale);

    ctx.fillStyle = "#426d39";
    ctx.fillRect(x - 53 * scale, y - 77 * scale, 16 * scale, 9 * scale);
    ctx.fillRect(x + 43 * scale, y - 82 * scale, 18 * scale, 9 * scale);
    ctx.fillRect(x - 7 * scale, y - 112 * scale, 13 * scale, 8 * scale);
}


/* =========================================================
   HOUSE
   DASAR RUMAH = y
========================================================= */

function bgHouse(
    x,
    y,
    scale
){

    /* WALL */

    ctx.fillStyle =
        "#947252";

    ctx.fillRect(
        x,
        y - 70 * scale,
        105 * scale,
        70 * scale
    );


    /* ROOF */

    ctx.fillStyle =
        "#594035";

    ctx.beginPath();

    ctx.moveTo(
        x - 12 * scale,
        y - 70 * scale
    );

    ctx.lineTo(
        x + 52 * scale,
        y - 115 * scale
    );

    ctx.lineTo(
        x + 117 * scale,
        y - 70 * scale
    );

    ctx.closePath();

    ctx.fill();


    /* ROOF HIGHLIGHT */

    ctx.fillStyle =
        "#785445";

    ctx.fillRect(
        x + 5 * scale,
        y - 75 * scale,
        95 * scale,
        6 * scale
    );


    /* WINDOW */

    ctx.fillStyle =
        "#75a2a2";

    ctx.fillRect(
        x + 18 * scale,
        y - 50 * scale,
        20 * scale,
        22 * scale
    );


    /* WINDOW FRAME */

    ctx.fillStyle =
        "#46372e";

    ctx.fillRect(
        x + 27 * scale,
        y - 50 * scale,
        3 * scale,
        22 * scale
    );

    ctx.fillRect(
        x + 18 * scale,
        y - 41 * scale,
        20 * scale,
        3 * scale
    );


    /* DOOR */

    ctx.fillStyle =
        "#4a352b";

    ctx.fillRect(
        x + 65 * scale,
        y - 40 * scale,
        22 * scale,
        40 * scale
    );


    /* CHIMNEY */

    ctx.fillStyle =
        "#64463b";

    ctx.fillRect(
        x + 72 * scale,
        y - 125 * scale,
        14 * scale,
        20 * scale
    );
}


/* =========================================================
   RUINED HOUSE
   DASAR = y
========================================================= */

function bgRuinedHouse(
    x,
    y,
    scale
){

    /* WALL */

    ctx.fillStyle =
        "#655b4e";

    ctx.fillRect(
        x,
        y - 60 * scale,
        105 * scale,
        60 * scale
    );


    /* WALL HIGHLIGHT */

    ctx.fillStyle =
        "#827561";

    ctx.fillRect(
        x + 8 * scale,
        y - 52 * scale,
        12 * scale,
        43 * scale
    );


    /* BROKEN ROOF */

    ctx.fillStyle =
        "#453a33";

    ctx.fillRect(
        x - 12 * scale,
        y - 75 * scale,
        50 * scale,
        9 * scale
    );

    ctx.fillRect(
        x + 50 * scale,
        y - 64 * scale,
        60 * scale,
        9 * scale
    );


    /* BROKEN WINDOW */

    ctx.fillStyle =
        "#292c2c";

    ctx.fillRect(
        x + 58 * scale,
        y - 43 * scale,
        22 * scale,
        25 * scale
    );


    /* CRACKS */

    ctx.fillStyle =
        "#403b35";

    ctx.fillRect(
        x + 38 * scale,
        y - 56 * scale,
        4 * scale,
        35 * scale
    );

    ctx.fillRect(
        x + 42 * scale,
        y - 31 * scale,
        15 * scale,
        4 * scale
    );
}


/* =========================================================
   DEAD TREE
   DASAR = y
========================================================= */

function bgDeadTree(
    x,
    y,
    scale
){

    ctx.fillStyle =
        "#46382d";


    /* TRUNK */

    ctx.fillRect(
        x - 7 * scale,
        y - 90 * scale,
        14 * scale,
        90 * scale
    );


    /* LEFT BRANCH */

    ctx.fillRect(
        x - 35 * scale,
        y - 75 * scale,
        8 * scale,
        35 * scale
    );

    ctx.fillRect(
        x - 48 * scale,
        y - 92 * scale,
        28 * scale,
        7 * scale
    );


    /* RIGHT BRANCH */

    ctx.fillRect(
        x + 25 * scale,
        y - 85 * scale,
        8 * scale,
        40 * scale
    );

    ctx.fillRect(
        x + 28 * scale,
        y - 105 * scale,
        28 * scale,
        7 * scale
    );
}


/* =========================================================
   MOUNTAIN
========================================================= */

function bgMountain(
    left,
    bottom,
    peak,
    peakY,
    color
){

    ctx.fillStyle =
        color;

    ctx.beginPath();

    ctx.moveTo(
        left,
        bottom
    );

    ctx.lineTo(
        peak,
        peakY
    );

    ctx.lineTo(
        peak + 230,
        bottom
    );

    ctx.closePath();

    ctx.fill();
}


/* =========================================================
   CASTLE
========================================================= */

function bgCastle(){

    const x = 365;
    const groundY = 350;

    const buildingTop = 225;


    /* MAIN BUILDING */

    ctx.fillStyle =
        "#403640";

    ctx.fillRect(
        x,
        buildingTop,
        270,
        groundY - buildingTop
    );


    /* LEFT TOWER */

    ctx.fillRect(
        x - 55,
        buildingTop - 75,
        75,
        200
    );


    /* RIGHT TOWER */

    ctx.fillRect(
        x + 250,
        buildingTop - 75,
        75,
        200
    );


    /* LEFT ROOF */

    ctx.fillStyle =
        "#211d29";

    ctx.beginPath();

    ctx.moveTo(
        x - 70,
        buildingTop - 75
    );

    ctx.lineTo(
        x - 17,
        buildingTop - 125
    );

    ctx.lineTo(
        x + 35,
        buildingTop - 75
    );

    ctx.closePath();

    ctx.fill();


    /* RIGHT ROOF */

    ctx.beginPath();

    ctx.moveTo(
        x + 235,
        buildingTop - 75
    );

    ctx.lineTo(
        x + 287,
        buildingTop - 125
    );

    ctx.lineTo(
        x + 340,
        buildingTop - 75
    );

    ctx.closePath();

    ctx.fill();


    /* CENTER ROOF */

    ctx.beginPath();

    ctx.moveTo(
        x - 20,
        buildingTop
    );

    ctx.lineTo(
        x + 135,
        buildingTop - 80
    );

    ctx.lineTo(
        x + 290,
        buildingTop
    );

    ctx.closePath();

    ctx.fill();


    /* WINDOWS */

    ctx.fillStyle =
        "#b64d4c";

    ctx.fillRect(
        x - 32,
        buildingTop - 45,
        20,
        30
    );

    ctx.fillRect(
        x + 262,
        buildingTop - 45,
        20,
        30
    );


    /* CENTER WINDOWS */

    ctx.fillRect(
        x + 75,
        buildingTop + 35,
        22,
        30
    );

    ctx.fillRect(
        x + 173,
        buildingTop + 35,
        22,
        30
    );


    /* GATE */

    ctx.fillStyle =
        "#201c22";

    ctx.fillRect(
        x + 103,
        groundY - 65,
        64,
        65
    );


    /* GATE LIGHT */

    ctx.fillStyle =
        "#913f3c";

    ctx.fillRect(
        x + 130,
        groundY - 50,
        9,
        50
    );
}


/* =========================================================
   LEVEL 1 GROUND
========================================================= */

function drawForestGround(){

    const groundY = 350;


    /* MAIN GROUND */

    ctx.fillStyle =
        "#60944b";

    ctx.fillRect(
        0,
        groundY,
        canvas.width,
        canvas.height - groundY
    );


    /* GRASS TOP */

    ctx.fillStyle =
        "#426f3b";

    ctx.fillRect(
        0,
        groundY,
        canvas.width,
        13
    );


    /* PATH */

    ctx.fillStyle =
        "#b59a68";

    ctx.fillRect(
        0,
        430,
        canvas.width,
        85
    );


    /* PATH HIGHLIGHT */

    ctx.fillStyle =
        "#c8ae78";

    ctx.fillRect(
        0,
        430,
        canvas.width,
        5
    );


    /* PATH DETAILS */

    ctx.fillStyle =
        "#927b53";

    for(let i = 0; i < 28; i++){

        const x =
            (i * 91) % canvas.width;

        const y =
            445 + ((i * 17) % 55);

        ctx.fillRect(
            x,
            y,
            8,
            4
        );
    }


    /* GRASS */

    bgGrass(
        "#3d7038"
    );


    /* FLOWERS */

    bgFlowers();
}


/* =========================================================
   LEVEL 2 GROUND
========================================================= */

function drawDarkForestGround(){

    const groundY = 350;


    /* MAIN GROUND */

    ctx.fillStyle =
        "#344a35";

    ctx.fillRect(
        0,
        groundY,
        canvas.width,
        canvas.height - groundY
    );


    /* DARK GRASS */

    ctx.fillStyle =
        "#26392d";

    ctx.fillRect(
        0,
        groundY,
        canvas.width,
        15
    );


    /* PATH */

    ctx.fillStyle =
        "#555147";

    ctx.fillRect(
        0,
        435,
        canvas.width,
        80
    );


    /* PATH DARK PART */

    ctx.fillStyle =
        "#45443d";

    ctx.fillRect(
        0,
        500,
        canvas.width,
        15
    );


    /* FOG */

    ctx.fillStyle =
        "rgba(190,210,190,0.10)";

    ctx.fillRect(
        0,
        290,
        canvas.width,
        35
    );


    /* GRASS */

    bgGrass(
        "#294d31"
    );
}


/* =========================================================
   LEVEL 3 GROUND
========================================================= */

function drawMountainGround(){

    const groundY = 350;


    /* ROCK */

    ctx.fillStyle =
        "#777a75";

    ctx.fillRect(
        0,
        groundY,
        canvas.width,
        canvas.height - groundY
    );


    /* DARK EDGE */

    ctx.fillStyle =
        "#5e625f";

    ctx.fillRect(
        0,
        groundY,
        canvas.width,
        13
    );


    /* PATH */

    ctx.fillStyle =
        "#989487";

    ctx.fillRect(
        0,
        430,
        canvas.width,
        85
    );


    /* PATH HIGHLIGHT */

    ctx.fillStyle =
        "#aaa69a";

    ctx.fillRect(
        0,
        430,
        canvas.width,
        5
    );


    /* ROCK DETAILS */

    for(let i = 0; i < 35; i++){

        const x =
            (i * 71) % canvas.width;

        const y =
            365 + ((i * 19) % 60);

        ctx.fillStyle =
            i % 2 === 0
            ? "#62645f"
            : "#999991";

        ctx.fillRect(
            x,
            y,
            8,
            5
        );
    }


    /* PATH CRACKS */

    ctx.fillStyle =
        "#62635f";

    for(let i = 0; i < 18; i++){

        const x =
            (i * 97) % canvas.width;

        const y =
            445 + ((i * 11) % 55);

        ctx.fillRect(
            x,
            y,
            14,
            3
        );

        ctx.fillRect(
            x + 10,
            y + 3,
            4,
            7
        );
    }
}


/* =========================================================
   LEVEL 4 GROUND
========================================================= */

function drawRuinedGround(){

    const groundY = 350;


    /* MAIN GROUND */

    ctx.fillStyle =
        "#806b48";

    ctx.fillRect(
        0,
        groundY,
        canvas.width,
        canvas.height - groundY
    );


    /* DARK GRASS */

    ctx.fillStyle =
        "#615239";

    ctx.fillRect(
        0,
        groundY,
        canvas.width,
        15
    );


    /* ROAD */

    ctx.fillStyle =
        "#9c825e";

    ctx.fillRect(
        0,
        430,
        canvas.width,
        85
    );


    /* ROAD HIGHLIGHT */

    ctx.fillStyle =
        "#b09167";

    ctx.fillRect(
        0,
        430,
        canvas.width,
        5
    );


    /* ROAD CRACKS */

    ctx.fillStyle =
        "#625541";

    for(let i = 0; i < 20; i++){

        const x =
            (i * 103) % canvas.width;

        const y =
            445 + ((i * 13) % 55);

        ctx.fillRect(
            x,
            y,
            18,
            4
        );

        ctx.fillRect(
            x + 13,
            y + 4,
            5,
            9
        );
    }


    /* DEBRIS */

    ctx.fillStyle =
        "#55483b";

    for(let i = 0; i < 25; i++){

        const x =
            (i * 79) % canvas.width;

        const y =
            375 + ((i * 23) % 45);

        ctx.fillRect(
            x,
            y,
            11,
            7
        );
    }


    /* WEEDS */

    ctx.fillStyle =
        "#4e5736";

    for(let i = 0; i < 40; i++){

        const x =
            (i * 67) % canvas.width;

        const y =
            365 + ((i * 17) % 55);

        ctx.fillRect(
            x,
            y,
            3,
            13
        );

        ctx.fillRect(
            x - 4,
            y + 5,
            5,
            3
        );
    }
}


/* =========================================================
   LEVEL 5 GROUND
========================================================= */

function drawCastleGround(){

    const groundY = 350;


    /* STONE GROUND */

    ctx.fillStyle =
        "#47443f";

    ctx.fillRect(
        0,
        groundY,
        canvas.width,
        canvas.height - groundY
    );


    /* DARK TOP EDGE */

    ctx.fillStyle =
        "#302f2d";

    ctx.fillRect(
        0,
        groundY,
        canvas.width,
        15
    );


    /* ROAD */

    ctx.fillStyle =
        "#62564d";

    ctx.fillRect(
        0,
        430,
        canvas.width,
        85
    );


    /* ROAD HIGHLIGHT */

    ctx.fillStyle =
        "#75675b";

    ctx.fillRect(
        0,
        430,
        canvas.width,
        5
    );


    /* ROAD CRACKS */

    ctx.fillStyle =
        "#302d2d";

    for(let i = 0; i < 18; i++){

        const x =
            (i * 127) % canvas.width;

        const y =
            445 + ((i * 17) % 55);

        ctx.fillRect(
            x,
            y,
            20,
            4
        );

        ctx.fillRect(
            x + 15,
            y + 4,
            5,
            10
        );
    }


    /* LAVA */

    ctx.fillStyle =
        "#743b35";

    ctx.fillRect(
        0,
        515,
        canvas.width,
        canvas.height - 515
    );


    ctx.fillStyle =
        "#a64d3c";

    for(let i = 0; i < 15; i++){

        ctx.fillRect(
            i * 75,
            520 + ((i % 2) * 8),
            35,
            5
        );
    }


    /* FLOATING PARTICLES */

    ctx.fillStyle =
        "#b65a50";

    for(let i = 0; i < 25; i++){

        ctx.fillRect(
            (i * 79) % canvas.width,
            150 + ((i * 31) % 170),
            3,
            3
        );
    }
}


/* =========================================================
   GRASS
========================================================= */

function bgGrass(
    color
){

    ctx.fillStyle =
        color;

    for(let i = 0; i < 70; i++){

        const x =
            (i * 83) % canvas.width;

        const y =
            365 + ((i * 19) % 55);

        ctx.fillRect(
            x,
            y,
            3,
            9
        );

        ctx.fillRect(
            x + 4,
            y + 3,
            2,
            6
        );
    }
}


/* =========================================================
   FLOWERS
========================================================= */

function bgFlowers(){

    for(let i = 0; i < 18; i++){

        const x =
            20 + ((i * 127) % 900);

        const y =
            380 + ((i * 17) % 40);


        /* STEM */

        ctx.fillStyle =
            "#397039";

        ctx.fillRect(
            x + 2,
            y + 4,
            2,
            10
        );


        /* FLOWER */

        if(i % 3 === 0){

            ctx.fillStyle =
                "#e9a0a0";

        }else if(i % 3 === 1){

            ctx.fillStyle =
                "#efd45a";

        }else{

            ctx.fillStyle =
                "#a7c9e8";
        }


        ctx.fillRect(
            x,
            y,
            6,
            5
        );

        ctx.fillRect(
            x + 2,
            y - 2,
            2,
            9
        );
    }
}


/* =========================================================
   MUSHROOMS
========================================================= */

function bgMushrooms(){

    for(let i = 0; i < 10; i++){

        const x =
            30 + ((i * 113) % 850);

        const y =
            390 + ((i * 13) % 35);


        ctx.fillStyle =
            "#78444b";

        ctx.fillRect(
            x,
            y,
            13,
            7
        );


        ctx.fillStyle =
            "#d4c59e";

        ctx.fillRect(
            x + 4,
            y + 7,
            5,
            9
        );
    }
}

/* =========================================================
   TREE
========================================================= */

function bgTree(
    x,
    y,
    scale,
    leafColor,
    darkLeafColor
){

    const trunkGradient = ctx.createLinearGradient(
        x - 12 * scale,
        0,
        x + 12 * scale,
        0
    );

    trunkGradient.addColorStop(0, "#392519");
    trunkGradient.addColorStop(0.3, "#68442b");
    trunkGradient.addColorStop(0.58, "#8a5a35");
    trunkGradient.addColorStop(0.82, "#563521");
    trunkGradient.addColorStop(1, "#2d1d16");

    ctx.fillStyle = trunkGradient;

    ctx.fillRect(
        x - 9 * scale,
        y - 76 * scale,
        18 * scale,
        76 * scale
    );

    ctx.fillRect(
        x - 15 * scale,
        y - 12 * scale,
        30 * scale,
        12 * scale
    );

    ctx.fillRect(x - 34 * scale, y - 88 * scale, 8 * scale, 35 * scale);
    ctx.fillRect(x - 47 * scale, y - 102 * scale, 28 * scale, 8 * scale);
    ctx.fillRect(x + 25 * scale, y - 94 * scale, 8 * scale, 38 * scale);
    ctx.fillRect(x + 27 * scale, y - 108 * scale, 30 * scale, 8 * scale);
    ctx.fillRect(x - 5 * scale, y - 116 * scale, 9 * scale, 48 * scale);
    ctx.fillRect(x - 29 * scale, y - 126 * scale, 8 * scale, 31 * scale);
    ctx.fillRect(x + 20 * scale, y - 130 * scale, 8 * scale, 35 * scale);

    ctx.fillStyle = "#b77a43";
    ctx.fillRect(x - 4 * scale, y - 72 * scale, 4 * scale, 52 * scale);
    ctx.fillRect(x - 31 * scale, y - 86 * scale, 4 * scale, 22 * scale);
    ctx.fillRect(x + 28 * scale, y - 91 * scale, 4 * scale, 25 * scale);

    ctx.fillStyle = darkLeafColor;
    ctx.fillRect(x - 57 * scale, y - 112 * scale, 42 * scale, 43 * scale);
    ctx.fillRect(x - 42 * scale, y - 143 * scale, 48 * scale, 48 * scale);
    ctx.fillRect(x - 22 * scale, y - 168 * scale, 48 * scale, 43 * scale);
    ctx.fillRect(x + 3 * scale, y - 150 * scale, 47 * scale, 48 * scale);
    ctx.fillRect(x + 26 * scale, y - 119 * scale, 42 * scale, 40 * scale);
    ctx.fillRect(x - 67 * scale, y - 91 * scale, 24 * scale, 24 * scale);

    const leafGradient = ctx.createLinearGradient(
        x,
        y - 170 * scale,
        x,
        y - 62 * scale
    );

    leafGradient.addColorStop(0, "#b4d96a");
    leafGradient.addColorStop(0.25, leafColor);
    leafGradient.addColorStop(0.7, leafColor);
    leafGradient.addColorStop(1, darkLeafColor);

    ctx.fillStyle = leafGradient;
    ctx.fillRect(x - 39 * scale, y - 139 * scale, 32 * scale, 25 * scale);
    ctx.fillRect(x - 17 * scale, y - 158 * scale, 29 * scale, 29 * scale);
    ctx.fillRect(x + 9 * scale, y - 135 * scale, 35 * scale, 27 * scale);
    ctx.fillRect(x - 52 * scale, y - 104 * scale, 31 * scale, 22 * scale);
    ctx.fillRect(x + 35 * scale, y - 105 * scale, 25 * scale, 24 * scale);

    ctx.fillStyle = "#d0e47c";
    ctx.fillRect(x - 29 * scale, y - 145 * scale, 10 * scale, 8 * scale);
    ctx.fillRect(x + 5 * scale, y - 157 * scale, 9 * scale, 8 * scale);
    ctx.fillRect(x + 29 * scale, y - 124 * scale, 12 * scale, 8 * scale);

    ctx.fillStyle = "#426d39";
    ctx.fillRect(x - 53 * scale, y - 77 * scale, 16 * scale, 9 * scale);
    ctx.fillRect(x + 43 * scale, y - 82 * scale, 18 * scale, 9 * scale);
    ctx.fillRect(x - 7 * scale, y - 112 * scale, 13 * scale, 8 * scale);
}


/* =========================================================
   HOUSE
========================================================= */

function bgHouse(
    x,
    y,
    scale
){

    /* WALL */

    ctx.fillStyle =
        "#947252";

    ctx.fillRect(
        x,
        y,
        105 * scale,
        70 * scale
    );


    /* ROOF */

    ctx.fillStyle =
        "#594035";

    ctx.beginPath();

    ctx.moveTo(
        x - 12 * scale,
        y
    );

    ctx.lineTo(
        x + 52 * scale,
        y - 45 * scale
    );

    ctx.lineTo(
        x + 117 * scale,
        y
    );

    ctx.closePath();

    ctx.fill();


    /* ROOF LIGHT */

    ctx.fillStyle =
        "#785445";

    ctx.fillRect(
        x + 5 * scale,
        y - 5 * scale,
        95 * scale,
        6 * scale
    );


    /* WINDOW */

    ctx.fillStyle =
        "#75a2a2";

    ctx.fillRect(
        x + 18 * scale,
        y + 20 * scale,
        20 * scale,
        22 * scale
    );


    /* WINDOW FRAME */

    ctx.fillStyle =
        "#46372e";

    ctx.fillRect(
        x + 27 * scale,
        y + 20 * scale,
        3 * scale,
        22 * scale
    );

    ctx.fillRect(
        x + 18 * scale,
        y + 29 * scale,
        20 * scale,
        3 * scale
    );


    /* DOOR */

    ctx.fillStyle =
        "#4a352b";

    ctx.fillRect(
        x + 65 * scale,
        y + 30 * scale,
        22 * scale,
        40 * scale
    );


    /* CHIMNEY */

    ctx.fillStyle =
        "#64463b";

    ctx.fillRect(
        x + 72 * scale,
        y - 55 * scale,
        14 * scale,
        20 * scale
    );
}


/* =========================================================
   RUINED HOUSE
========================================================= */

function bgRuinedHouse(
    x,
    y,
    scale
){

    /* WALL */

    ctx.fillStyle =
        "#655b4e";

    ctx.fillRect(
        x,
        y,
        105 * scale,
        60 * scale
    );


    /* WALL HIGHLIGHT */

    ctx.fillStyle =
        "#827561";

    ctx.fillRect(
        x + 8 * scale,
        y + 8 * scale,
        12 * scale,
        43 * scale
    );


    /* BROKEN ROOF */

    ctx.fillStyle =
        "#453a33";

    ctx.fillRect(
        x - 12 * scale,
        y - 15 * scale,
        50 * scale,
        9 * scale
    );

    ctx.fillRect(
        x + 50 * scale,
        y - 4 * scale,
        60 * scale,
        9 * scale
    );


    /* BROKEN WINDOW */

    ctx.fillStyle =
        "#292c2c";

    ctx.fillRect(
        x + 58 * scale,
        y + 17 * scale,
        22 * scale,
        25 * scale
    );


    /* CRACKS */

    ctx.fillStyle =
        "#403b35";

    ctx.fillRect(
        x + 38 * scale,
        y + 4 * scale,
        4 * scale,
        35 * scale
    );

    ctx.fillRect(
        x + 42 * scale,
        y + 25 * scale,
        15 * scale,
        4 * scale
    );
}


/* =========================================================
   DEAD TREE
========================================================= */

function bgDeadTree(
    x,
    y,
    scale
){

    ctx.fillStyle =
        "#46382d";

    /* TRUNK */

    ctx.fillRect(
        x - 7 * scale,
        y - 90 * scale,
        14 * scale,
        95 * scale
    );


    /* LEFT BRANCH */

    ctx.fillRect(
        x - 35 * scale,
        y - 75 * scale,
        8 * scale,
        35 * scale
    );

    ctx.fillRect(
        x - 48 * scale,
        y - 92 * scale,
        28 * scale,
        7 * scale
    );


    /* RIGHT BRANCH */

    ctx.fillRect(
        x + 25 * scale,
        y - 85 * scale,
        8 * scale,
        40 * scale
    );

    ctx.fillRect(
        x + 28 * scale,
        y - 105 * scale,
        28 * scale,
        7 * scale
    );
}


/* =========================================================
   MOUNTAIN
========================================================= */

function bgMountain(
    left,
    bottom,
    peak,
    peakY,
    rightColor
){

    ctx.fillStyle =
        rightColor;

    ctx.beginPath();

    ctx.moveTo(
        left,
        bottom
    );

    ctx.lineTo(
        peak,
        peakY
    );

    ctx.lineTo(
        peak + 230,
        bottom
    );

    ctx.closePath();

    ctx.fill();
}


/* =========================================================
   CASTLE
========================================================= */

function bgCastle(){

    const x = 365;
    const y = 225;


    /* MAIN BUILDING */

    ctx.fillStyle =
        "#403640";

    ctx.fillRect(
        x,
        y,
        270,
        140
    );


    /* LEFT TOWER */

    ctx.fillRect(
        x - 55,
        y - 75,
        75,
        185
    );


    /* RIGHT TOWER */

    ctx.fillRect(
        x + 250,
        y - 75,
        75,
        185
    );


    /* LEFT ROOF */

    ctx.fillStyle =
        "#211d29";

    ctx.beginPath();

    ctx.moveTo(
        x - 70,
        y - 75
    );

    ctx.lineTo(
        x - 17,
        y - 125
    );

    ctx.lineTo(
        x + 35,
        y - 75
    );

    ctx.closePath();

    ctx.fill();


    /* RIGHT ROOF */

    ctx.beginPath();

    ctx.moveTo(
        x + 235,
        y - 75
    );

    ctx.lineTo(
        x + 287,
        y - 125
    );

    ctx.lineTo(
        x + 340,
        y - 75
    );

    ctx.closePath();

    ctx.fill();


    /* CENTER ROOF */

    ctx.beginPath();

    ctx.moveTo(
        x - 20,
        y
    );

    ctx.lineTo(
        x + 135,
        y - 80
    );

    ctx.lineTo(
        x + 290,
        y
    );

    ctx.closePath();

    ctx.fill();


    /* WINDOWS */

    ctx.fillStyle =
        "#b64d4c";

    ctx.fillRect(
        x - 32,
        y - 45,
        20,
        30
    );

    ctx.fillRect(
        x + 262,
        y - 45,
        20,
        30
    );


    /* CENTER WINDOWS */

    ctx.fillRect(
        x + 75,
        y + 35,
        22,
        30
    );

    ctx.fillRect(
        x + 173,
        y + 35,
        22,
        30
    );


    /* GATE */

    ctx.fillStyle =
        "#201c22";

    ctx.fillRect(
        x + 103,
        y + 75,
        64,
        65
    );


    /* GATE LIGHT */

    ctx.fillStyle =
        "#913f3c";

    ctx.fillRect(
        x + 130,
        y + 90,
        9,
        50
    );


    /* SPIKES */

    ctx.fillStyle =
        "#1d1920";

    for(let i = 0; i < 9; i++){

        ctx.fillRect(
            x - 55 + i * 45,
            y - 83,
            6,
            20
        );
    }
}


/* =========================================================
   GRASS
========================================================= */

function bgGrass(
    color
){

    ctx.fillStyle =
        color;

    for(let i = 0; i < 55; i++){

        const x =
            (i * 83) % canvas.width;

        const y =
            365 + ((i * 19) % 50);


        ctx.fillRect(
            x,
            y,
            3,
            9
        );

        ctx.fillRect(
            x + 4,
            y + 3,
            2,
            6
        );
    }
}


/* =========================================================
   FLOWERS
========================================================= */

function bgFlowers(){
    for(let i = 0; i < 14; i++){

        const x =
            20 + ((i * 127) % 900);

        const y =
            380 + ((i * 17) % 40);


        /* STEM */

        ctx.fillStyle =
            "#397039";

        ctx.fillRect(
            x + 2,
            y + 4,
            2,
            10
        );


        /* FLOWER */

        if(i % 3 === 0){

            ctx.fillStyle =
                "#e9a0a0";

        }else if(i % 3 === 1){

            ctx.fillStyle =
                "#efd45a";

        }else{

            ctx.fillStyle =
                "#a7c9e8";
        }


        ctx.fillRect(
            x,
            y,
            6,
            5
        );

        ctx.fillRect(
            x + 2,
            y - 2,
            2,
            9
        );
    }
}

/* =========================
   PLAYER DRAW
========================= */

function drawPlayer(){

    ctx.save();

    if(
        player.invincible > 0 &&
        Math.floor(
            player.invincible / 5
        ) % 2 === 0
    ){

        ctx.globalAlpha = .45;
    }

    ctx.translate(
        Math.round(player.x),
        Math.round(player.y)
    );

    ctx.scale(
        player.direction,
        1
    );

    if(selectedCharacter === 'knight'){

        drawKnight();

    }else if(
        selectedCharacter === 'archer'
    ){

        drawArcher();

    }else{

        drawMage();
    }

    ctx.restore();
}

/* =========================
   SHADOW
========================= */

function drawCharacterShadow(){

    ctx.fillStyle =
        'rgba(30,35,28,.28)';

    ctx.fillRect(
        -19,
        18,
        38,
        7
    );

    ctx.fillRect(
        -13,
        22,
        26,
        4
    );
}

/* =========================
   KNIGHT DRAW
========================= */
function drawKnight() {

    /* =========================
       ANIMASI GERAK
    ========================= */

    const walk = player.moving
        ? Math.round(
            Math.sin(player.stepTime) * 4
        )
        : 0;

    const bob = player.moving
        ? Math.abs(
            Math.sin(player.stepTime)
        ) * 2
        : 0;


    drawCharacterShadow();


    ctx.save();

    ctx.translate(
        0,
        -bob
    );


    /* =========================
       CAPE / JUBAH BELAKANG
    ========================= */

    ctx.fillStyle = "#753c41";

    ctx.fillRect(
        -20,
        -28,
        14,
        38
    );

    ctx.fillRect(
        -18,
        5,
        13,
        9
    );


    /* Ujung cape */

    ctx.fillStyle = "#572c32";

    ctx.fillRect(
        -20,
        8,
        15,
        7
    );


    /* =========================
       KAKI
    ========================= */

    ctx.fillStyle = "#374a55";


    /* Kaki kiri */

    ctx.fillRect(
        -12,
        7,
        9,
        18 + walk
    );


    /* Kaki kanan */

    ctx.fillRect(
        4,
        7,
        9,
        18 - walk
    );


    /* =========================
       SEPATU / BOOTS
    ========================= */

    ctx.fillStyle = "#202e35";


    ctx.fillRect(
        -14,
        19 + walk,
        12,
        7
    );

    ctx.fillRect(
        3,
        19 - walk,
        12,
        7
    );


    /* Detail boots */

    ctx.fillStyle = "#151f24";

    ctx.fillRect(
        -14,
        23 + walk,
        12,
        3
    );

    ctx.fillRect(
        3,
        23 - walk,
        12,
        3
    );


    /* =========================
       BADAN / ARMOR
    ========================= */

    ctx.fillStyle = "#688493";

    ctx.fillRect(
        -16,
        -28,
        32,
        38
    );


    /* Bagian bawah armor */

    ctx.fillStyle = "#405965";

    ctx.fillRect(
        -16,
        1,
        32,
        9
    );


    /* Bagian tengah armor */

    ctx.fillStyle = "#7895a3";

    ctx.fillRect(
        -8,
        -27,
        16,
        28
    );


    /* Garis armor */

    ctx.fillStyle = "#405965";

    ctx.fillRect(
        -2,
        -27,
        4,
        28
    );


    /* =========================
       KANCING ARMOR
    ========================= */

    ctx.fillStyle = "#c59443";

    ctx.fillRect(
        -2,
        -21,
        4,
        4
    );

    ctx.fillRect(
        -2,
        -12,
        4,
        4
    );

    ctx.fillRect(
        -2,
        -3,
        4,
        4
    );


    /* =========================
       SABUK
    ========================= */

    ctx.fillStyle = "#4b3023";

    ctx.fillRect(
        -17,
        -1,
        34,
        5
    );


    /* Gesper */

    ctx.fillStyle = "#c59443";

    ctx.fillRect(
        -4,
        -1,
        8,
        6
    );

    ctx.fillStyle = "#704b28";

    ctx.fillRect(
        -2,
        0,
        4,
        4
    );


    /* =========================
       LEHER
    ========================= */

    ctx.fillStyle = "#d39b6b";

    ctx.fillRect(
        -7,
        -34,
        14,
        8
    );


    /* =========================
       TANGAN KIRI
    ========================= */

    ctx.fillStyle = "#7795a3";

    ctx.fillRect(
        -23,
        -23,
        8,
        26
    );


    /* Sarung tangan */

    ctx.fillStyle = "#202e35";

    ctx.fillRect(
        -23,
        0,
        9,
        7
    );


    /* =========================
       TANGAN KANAN
    ========================= */

    ctx.fillStyle = "#7795a3";

    ctx.fillRect(
        15,
        -23,
        9,
        26
    );


    /* Sarung tangan */

    ctx.fillStyle = "#202e35";

    ctx.fillRect(
        15,
        0,
        9,
        7
    );


    /* =========================
       KEPALA
    ========================= */

    ctx.fillStyle = "#e3ad79";

    ctx.fillRect(
        -13,
        -47,
        26,
        20
    );


    /* Sisi wajah */

    ctx.fillStyle = "#c4865d";

    ctx.fillRect(
        -13,
        -35,
        4,
        8
    );

    ctx.fillRect(
        9,
        -35,
        4,
        8
    );


    /* =========================
       RAMBUT
    ========================= */

    ctx.fillStyle = "#63432c";


    /* Rambut atas */

    ctx.fillRect(
        -14,
        -50,
        28,
        8
    );


    /* Rambut kiri */

    ctx.fillRect(
        -14,
        -44,
        5,
        11
    );


    /* Rambut kanan */

    ctx.fillRect(
        9,
        -44,
        5,
        10
    );


    /* Ujung rambut */

    ctx.fillRect(
        -12,
        -37,
        4,
        5
    );


    /* =========================
       WAJAH
    ========================= */

    /* Mata kiri */

    ctx.fillStyle = "#30231f";

    ctx.fillRect(
        -8,
        -41,
        4,
        4
    );


    /* Mata kanan */

    ctx.fillRect(
        5,
        -41,
        4,
        4
    );


    /* Alis */

    ctx.fillStyle = "#3d2c25";

    ctx.fillRect(
        -9,
        -45,
        6,
        2
    );

    ctx.fillRect(
        4,
        -45,
        6,
        2
    );


    /* Hidung */

    ctx.fillRect(
        1,
        -38,
        3,
        3
    );


    /* Mulut */

    ctx.fillRect(
        -3,
        -32,
        8,
        2
    );


    /* =========================
       HELM
    ========================= */

    ctx.fillStyle = "#a5b1b8";


    /* Bagian atas helm */

    ctx.fillRect(
        -17,
        -59,
        34,
        17
    );


    /* Bagian depan helm */

    ctx.fillRect(
        -18,
        -46,
        36,
        7
    );


    /* Sisi helm */

    ctx.fillStyle = "#687981";

    ctx.fillRect(
        11,
        -52,
        7,
        13
    );


    /* Bayangan helm */

    ctx.fillRect(
        -17,
        -44,
        34,
        5
    );


    /* Highlight helm */

    ctx.fillStyle = "#c5cdd1";

    ctx.fillRect(
        -13,
        -57,
        20,
        4
    );


    /* Baut helm */

    ctx.fillStyle = "#c59443";

    ctx.fillRect(
        12,
        -55,
        4,
        4
    );


    /* =========================
       PEDANG
    ========================= */

    ctx.save();


    let swordRotation = -0.15;


    /* Animasi serangan */

    if (player.attack) {

        const progress =
            1 -
            player.attackTimer / 12;

        swordRotation =
            -1.2 +
            progress * 2;
    }


    ctx.translate(
        20,
        -13
    );


    ctx.rotate(
        swordRotation
    );


    /* =========================
       GAGANG PEDANG
    ========================= */

    ctx.fillStyle = "#6a4327";

    ctx.fillRect(
        -2,
        -4,
        7,
        17
    );


    /* Ujung gagang */

    ctx.fillStyle = "#202020";

    ctx.fillRect(
        -3,
        10,
        9,
        4
    );


    /* =========================
       GUARD PEDANG
    ========================= */

    ctx.fillStyle = "#c59443";

    ctx.fillRect(
        -9,
        -5,
        20,
        4
    );


    /* =========================
       BILAH PEDANG
    ========================= */

    ctx.fillStyle = "#d7e0de";

    ctx.fillRect(
        -1,
        -38,
        5,
        35
    );


    /* Sisi bayangan bilah */

    ctx.fillStyle = "#839296";

    ctx.fillRect(
        3,
        -38,
        2,
        35
    );


    /* Ujung pedang */

    ctx.fillStyle = "#d7e0de";

    ctx.fillRect(
        0,
        -42,
        4,
        4
    );


    /* =========================
       KEMBALI DARI PEDANG
    ========================= */

    ctx.restore();


    /* =========================
       OUTLINE PIXEL
    ========================= */

    ctx.restore();
}

/* =========================
   ARCHER DRAW
========================= */

function drawArcher(){

    /* =========================================
       ANIMASI GERAK
    ========================================= */

    const walk = player.moving
        ? Math.round(Math.sin(player.stepTime) * 3)
        : 0;

    const bob = player.moving
        ? Math.abs(Math.sin(player.stepTime)) * 2
        : 0;


    drawCharacterShadow();

    ctx.save();

    ctx.translate(0, -bob);


    /* =========================================
       WARNA UTAMA
    ========================================= */

    const darkGreen = "#26372c";
    const green = "#394f3b";
    const lightGreen = "#536b50";

    const leather = "#543c2b";
    const leatherDark = "#34271f";
    const leatherLight = "#74543a";

    const skin = "#d49b6d";
    const skinShadow = "#ad704e";

    const hair = "#3b2a21";
    const hairLight = "#624536";

    const metal = "#65716b";
    const metalLight = "#89958e";

    const gold = "#b68a45";


    /* =========================================
       CAPE / JUBAH BELAKANG
    ========================================= */

    ctx.fillStyle = darkGreen;

    ctx.beginPath();

    ctx.moveTo(-19, -25);
    ctx.lineTo(-28, -5);
    ctx.lineTo(-26, 25);
    ctx.lineTo(-13, 12);
    ctx.lineTo(14, 10);
    ctx.lineTo(18, -24);

    ctx.closePath();

    ctx.fill();


    /* Lipatan cape */

    ctx.fillStyle = "#1b2921";

    ctx.fillRect(
        -23,
        -5,
        5,
        29
    );

    ctx.fillRect(
        -18,
        4,
        4,
        18
    );


    ctx.fillStyle = "#465a43";

    ctx.fillRect(
        -20,
        -18,
        3,
        20
    );


    /* =========================================
       QUIVER
    ========================================= */

    ctx.save();

    ctx.translate(14, -27);

    ctx.rotate(0.12);

    /* badan quiver */

    ctx.fillStyle = leatherDark;

    ctx.fillRect(
        0,
        0,
        9,
        31
    );


    /* ujung quiver */

    ctx.fillStyle = leather;

    ctx.fillRect(
        -2,
        27,
        13,
        5
    );


    /* tali quiver */

    ctx.strokeStyle = leatherLight;
    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(1, 5);
    ctx.lineTo(10, 24);

    ctx.stroke();


    /* PANAH */

    for (let i = 0; i < 5; i++) {

        ctx.fillStyle = "#6f5130";

        ctx.fillRect(
            i * 2 - 1,
            -13 - (i % 2) * 3,
            2,
            18
        );

        /* ujung panah */

        ctx.fillStyle = metalLight;

        ctx.fillRect(
            i * 2 - 1,
            -16 - (i % 2) * 3,
            2,
            4
        );
    }

    ctx.restore();


    /* =========================================
       KAKI
    ========================================= */

    ctx.fillStyle = "#303c36";


    /* kaki kiri */

    ctx.fillRect(
        -11,
        7,
        9,
        19 + walk
    );


    /* kaki kanan */

    ctx.fillRect(
        3,
        7,
        9,
        19 - walk
    );


    /* celana */

    ctx.fillStyle = "#202a26";

    ctx.fillRect(
        -13,
        6,
        26,
        9
    );


    /* =========================================
       BOOTS
    ========================================= */

    ctx.fillStyle = leatherDark;

    ctx.fillRect(
        -14,
        20 + walk,
        12,
        7
    );

    ctx.fillRect(
        2,
        20 - walk,
        13,
        7
    );


    /* detail boots */

    ctx.fillStyle = leatherLight;

    ctx.fillRect(
        -13,
        20 + walk,
        10,
        3
    );

    ctx.fillRect(
        3,
        20 - walk,
        10,
        3
    );


    /* =========================================
       BADAN
    ========================================= */

    ctx.fillStyle = green;

    ctx.fillRect(
        -16,
        -29,
        32,
        39
    );


    /* sisi gelap armor */

    ctx.fillStyle = darkGreen;

    ctx.fillRect(
        -16,
        -26,
        5,
        32
    );

    ctx.fillRect(
        11,
        -26,
        5,
        32
    );


    /* bagian dada */

    ctx.fillStyle = "#455c46";

    ctx.fillRect(
        -9,
        -26,
        18,
        27
    );


    /* lipatan pakaian */

    ctx.fillStyle = "#293b30";

    ctx.fillRect(
        -7,
        -20,
        3,
        22
    );

    ctx.fillRect(
        5,
        -22,
        3,
        23
    );


    /* =========================================
       CROSS STRAP
    ========================================= */

    ctx.fillStyle = leatherDark;

    ctx.fillRect(
        -14,
        -24,
        5,
        31
    );


    ctx.save();

    ctx.translate(0, -5);

    ctx.rotate(-0.35);

    ctx.fillRect(
        -2,
        -16,
        5,
        31
    );

    ctx.restore();


    /* =========================================
       SABUK
    ========================================= */

    ctx.fillStyle = leatherDark;

    ctx.fillRect(
        -17,
        -2,
        34,
        7
    );


    ctx.fillStyle = leatherLight;

    ctx.fillRect(
        -15,
        -1,
        30,
        3
    );


    /* gesper */

    ctx.fillStyle = gold;

    ctx.fillRect(
        -4,
        -2,
        8,
        8
    );

    ctx.fillStyle = "#60451f";

    ctx.fillRect(
        -2,
        0,
        4,
        4
    );


    /* =========================================
       TAS / POUCH
    ========================================= */

    ctx.fillStyle = leather;

    ctx.fillRect(
        -19,
        0,
        8,
        10
    );

    ctx.fillRect(
        11,
        1,
        8,
        10
    );


    ctx.fillStyle = leatherLight;

    ctx.fillRect(
        -18,
        0,
        6,
        3
    );

    ctx.fillRect(
        12,
        1,
        6,
        3
    );


    /* =========================================
       LEHER
    ========================================= */

    ctx.fillStyle = skinShadow;

    ctx.fillRect(
        -7,
        -35,
        14,
        9
    );


    /* =========================================
       KEPALA
    ========================================= */

    ctx.fillStyle = skin;

    ctx.fillRect(
        -13,
        -50,
        26,
        23
    );


    /* sisi wajah */

    ctx.fillStyle = skinShadow;

    ctx.fillRect(
        -13,
        -39,
        4,
        10
    );

    ctx.fillRect(
        9,
        -40,
        4,
        10
    );


    /* =========================================
       RAMBUT BELAKANG
    ========================================= */

    ctx.fillStyle = hair;

    ctx.fillRect(
        -15,
        -53,
        30,
        15
    );


    /* rambut kiri */

    ctx.fillRect(
        -17,
        -48,
        7,
        15
    );


    /* rambut kanan */

    ctx.fillRect(
        10,
        -49,
        7,
        16
    );


    /* ujung rambut */

    ctx.fillRect(
        -14,
        -38,
        5,
        7
    );

    ctx.fillRect(
        10,
        -39,
        5,
        8
    );


    /* =========================================
       HEADBAND
    ========================================= */

    ctx.fillStyle = "#4b4029";

    ctx.fillRect(
        -15,
        -51,
        30,
        8
    );


    /* bagian terang headband */

    ctx.fillStyle = "#665738";

    ctx.fillRect(
        -14,
        -50,
        28,
        3
    );


    /* =========================================
       RAMBUT DEPAN
    ========================================= */

    ctx.fillStyle = hair;

    ctx.fillRect(
        -13,
        -48,
        8,
        6
    );

    ctx.fillRect(
        -7,
        -52,
        8,
        8
    );

    ctx.fillRect(
        0,
        -50,
        7,
        7
    );

    ctx.fillRect(
        6,
        -47,
        8,
        6
    );


    /* highlight rambut */

    ctx.fillStyle = hairLight;

    ctx.fillRect(
        -9,
        -51,
        6,
        3
    );

    ctx.fillRect(
        1,
        -53,
        7,
        3
    );


    /* =========================================
       ALIS
    ========================================= */

    ctx.fillStyle = "#34261e";

    ctx.fillRect(
        -9,
        -42,
        7,
        2
    );

    ctx.fillRect(
        3,
        -42,
        7,
        2
    );


    /* =========================================
       MATA
    ========================================= */

    ctx.fillStyle = "#1e241c";

    ctx.fillRect(
        -7,
        -39,
        5,
        3
    );

    ctx.fillRect(
        4,
        -39,
        5,
        3
    );


    /* mata terang */

    ctx.fillStyle = "#87956b";

    ctx.fillRect(
        -6,
        -39,
        2,
        2
    );

    ctx.fillRect(
        5,
        -39,
        2,
        2
    );


    /* =========================================
       HIDUNG
    ========================================= */

    ctx.fillStyle = skinShadow;

    ctx.fillRect(
        0,
        -36,
        4,
        4
    );


    /* =========================================
       MULUT
    ========================================= */

    ctx.fillStyle = "#633e35";

    ctx.fillRect(
        -3,
        -30,
        8,
        2
    );


    /* =========================================
       SCAR / GORESAN WAJAH
    ========================================= */

    ctx.fillStyle = "#825947";

    ctx.fillRect(
        7,
        -37,
        2,
        7
    );

    ctx.fillRect(
        5,
        -34,
        2,
        5
    );


    /* =========================================
       LEHER + SCARF
    ========================================= */

    ctx.fillStyle = "#354635";

    ctx.fillRect(
        -11,
        -32,
        22,
        7
    );


    /* scarf depan */

    ctx.fillStyle = "#4a6045";

    ctx.fillRect(
        -13,
        -30,
        26,
        7
    );


    ctx.fillRect(
        7,
        -27,
        8,
        13
    );


    /* lipatan scarf */

    ctx.fillStyle = "#29382b";

    ctx.fillRect(
        -9,
        -29,
        4,
        5
    );

    ctx.fillRect(
        2,
        -28,
        4,
        5
    );


    /* =========================================
       TANGAN KIRI
    ========================================= */

    ctx.fillStyle = skin;

    ctx.fillRect(
        -23,
        -21,
        8,
        22
    );


    /* pelindung tangan */

    ctx.fillStyle = leatherDark;

    ctx.fillRect(
        -24,
        -5,
        10,
        10
    );


    ctx.fillStyle = leatherLight;

    ctx.fillRect(
        -23,
        -4,
        7,
        3
    );


    /* =========================================
       TANGAN KANAN
    ========================================= */

    ctx.fillStyle = skin;

    ctx.fillRect(
        15,
        -20,
        9,
        23
    );


    /* arm guard */

    ctx.fillStyle = leatherDark;

    ctx.fillRect(
        14,
        -7,
        11,
        12
    );


    ctx.fillStyle = leatherLight;

    ctx.fillRect(
        15,
        -6,
        8,
        3
    );


    /* =========================================
       BUSUR
    ========================================= */

    ctx.save();


    let bowRotation = 0.15;


    /*
       Saat attack:
       busur sedikit ditarik ke belakang
    */

    if (player.attack) {

        const progress =
            1 -
            player.attackTimer / 12;

        bowRotation =
            -0.45 +
            progress * 0.9;
    }


    ctx.translate(
        23,
        -13
    );

    ctx.rotate(
        bowRotation
    );


    /* =========================
       BUSUR UTAMA
    ========================= */

    ctx.strokeStyle = "#5a3c25";
    ctx.lineWidth = 5;

    ctx.beginPath();

    ctx.moveTo(0, -38);

    ctx.quadraticCurveTo(
        18,
        -18,
        0,
        8
    );

    ctx.stroke();


    /* lapisan luar */

    ctx.strokeStyle = "#7b5633";
    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(0, -38);

    ctx.quadraticCurveTo(
        18,
        -18,
        0,
        8
    );

    ctx.stroke();


    /* =========================
       DETAIL BUSUR
    ========================= */

    ctx.fillStyle = "#536b40";

    ctx.fillRect(
        -3,
        -20,
        6,
        12
    );


    ctx.fillStyle = gold;

    ctx.fillRect(
        -3,
        -22,
        6,
        3
    );


    /* =========================
       TALI BUSUR
    ========================= */

    ctx.strokeStyle = "#c8b99b";
    ctx.lineWidth = 1;

    ctx.beginPath();

    ctx.moveTo(
        0,
        -38
    );

    ctx.lineTo(
        0,
        8
    );

    ctx.stroke();


    /* =========================
       PANAH
    ========================= */

    if (player.attack) {

        ctx.fillStyle = "#6b4a2e";

        ctx.fillRect(
            -2,
            -31,
            3,
            31
        );


        /* kepala panah */

        ctx.fillStyle = metalLight;

        ctx.fillRect(
            -3,
            -35,
            5,
            5
        );


        /* ujung */

        ctx.fillRect(
            -2,
            -38,
            3,
            4
        );


        /* bulu panah */

        ctx.fillStyle = "#536b40";

        ctx.fillRect(
            -5,
            -4,
            4,
            6
        );

        ctx.fillRect(
            2,
            -4,
            4,
            6
        );
    }


    ctx.restore();


    /* =========================================
       SARUNG TANGAN / JARI
    ========================================= */

    ctx.fillStyle = leatherDark;

    ctx.fillRect(
        -23,
        1,
        9,
        7
    );

    ctx.fillRect(
        14,
        1,
        11,
        7
    );


    /* jari */

    ctx.fillStyle = skinShadow;

    ctx.fillRect(
        -21,
        3,
        3,
        4
    );

    ctx.fillRect(
        16,
        3,
        3,
        4
    );


    ctx.restore();
}

/* =========================
   MAGE DRAW
========================= */

function drawMage(){


    /* =========================================
       ANIMASI
    ========================================= */

    const walk = player.moving
        ? Math.round(Math.sin(player.stepTime) * 3)
        : 0;

    const bob = player.moving
        ? Math.abs(Math.sin(player.stepTime)) * 2
        : 0;

    drawCharacterShadow();

    ctx.save();

    ctx.translate(0, -bob);


    /* =========================================
       PALET WARNA MAGE
    ========================================= */

    const robeDark = "#211936";
    const robe = "#352653";
    const robeLight = "#513875";

    const purple = "#7048a0";
    const purpleLight = "#9b6bd0";

    const gold = "#b99552";
    const goldLight = "#d5bd78";

    const leather = "#493526";
    const leatherDark = "#2c211c";

    const skin = "#d6a078";
    const skinDark = "#a96f58";

    const hair = "#33234d";
    const hairLight = "#62427d";

    const magic = "#9b55ff";
    const magicLight = "#d9a6ff";


    /* =========================================
       JUBAH BELAKANG
    ========================================= */

    ctx.fillStyle = robeDark;

    ctx.beginPath();

    ctx.moveTo(-18, -27);
    ctx.lineTo(-28, -5);
    ctx.lineTo(-27, 28);
    ctx.lineTo(-13, 19);
    ctx.lineTo(0, 25);
    ctx.lineTo(17, 17);
    ctx.lineTo(20, -25);

    ctx.closePath();

    ctx.fill();


    /* Lipatan jubah */

    ctx.fillStyle = robe;

    ctx.fillRect(
        -24,
        -8,
        6,
        30
    );

    ctx.fillRect(
        -17,
        4,
        5,
        21
    );

    ctx.fillRect(
        12,
        -5,
        6,
        29
    );


    /* Highlight jubah */

    ctx.fillStyle = robeLight;

    ctx.fillRect(
        -20,
        -17,
        3,
        24
    );

    ctx.fillRect(
        13,
        -20,
        3,
        20
    );


    /* =========================================
       KAKI
    ========================================= */

    ctx.fillStyle = "#201c29";

    ctx.fillRect(
        -11,
        7,
        9,
        20 + walk
    );

    ctx.fillRect(
        3,
        7,
        9,
        20 - walk
    );


    /* Celana/jubah bawah */

    ctx.fillStyle = robeDark;

    ctx.fillRect(
        -13,
        7,
        26,
        12
    );


    /* =========================================
       SEPATU
    ========================================= */

    ctx.fillStyle = leatherDark;

    ctx.fillRect(
        -14,
        21 + walk,
        12,
        7
    );

    ctx.fillRect(
        2,
        21 - walk,
        13,
        7
    );


    ctx.fillStyle = leather;

    ctx.fillRect(
        -13,
        21 + walk,
        10,
        3
    );

    ctx.fillRect(
        3,
        21 - walk,
        10,
        3
    );


    /* =========================================
       BADAN
    ========================================= */

    ctx.fillStyle = robe;

    ctx.fillRect(
        -16,
        -30,
        32,
        40
    );


    /* Bagian tengah jubah */

    ctx.fillStyle = robeDark;

    ctx.fillRect(
        -9,
        -27,
        18,
        34
    );


    /* Panel tengah */

    ctx.fillStyle = "#29203e";

    ctx.fillRect(
        -6,
        -25,
        12,
        31
    );


    /* =========================================
       ORNAMEN EMAS DADA
    ========================================= */

    ctx.fillStyle = gold;

    ctx.fillRect(
        -2,
        -26,
        4,
        22
    );

    ctx.fillRect(
        -7,
        -21,
        5,
        3
    );

    ctx.fillRect(
        2,
        -16,
        5,
        3
    );

    ctx.fillRect(
        -7,
        -11,
        5,
        3
    );


    /* Kristal dada */

    ctx.fillStyle = magic;

    ctx.beginPath();

    ctx.moveTo(0, -20);
    ctx.lineTo(5, -16);
    ctx.lineTo(0, -11);
    ctx.lineTo(-5, -16);

    ctx.closePath();

    ctx.fill();


    ctx.fillStyle = magicLight;

    ctx.fillRect(
        -1,
        -18,
        2,
        4
    );


    /* =========================================
       SABUK
    ========================================= */

    ctx.fillStyle = leatherDark;

    ctx.fillRect(
        -17,
        -2,
        34,
        7
    );


    ctx.fillStyle = leather;

    ctx.fillRect(
        -15,
        -1,
        30,
        3
    );


    /* Gesper emas */

    ctx.fillStyle = gold;

    ctx.fillRect(
        -4,
        -2,
        8,
        8
    );

    ctx.fillStyle = leatherDark;

    ctx.fillRect(
        -2,
        0,
        4,
        4
    );


    /* =========================================
       TAS SIHIR
    ========================================= */

    ctx.fillStyle = leatherDark;

    ctx.fillRect(
        -20,
        1,
        8,
        10
    );

    ctx.fillRect(
        12,
        1,
        8,
        10
    );

    ctx.fillStyle = gold;

    ctx.fillRect(
        -19,
        1,
        6,
        2
    );

    ctx.fillRect(
        13,
        1,
        6,
        2
    );


    /* =========================================
       LEHER
    ========================================= */

    ctx.fillStyle = skinDark;

    ctx.fillRect(
        -7,
        -36,
        14,
        9
    );


    /* =========================================
       KEPALA
    ========================================= */

    ctx.fillStyle = skin;

    ctx.fillRect(
        -13,
        -50,
        26,
        23
    );


    /* Sisi wajah */

    ctx.fillStyle = skinDark;

    ctx.fillRect(
        -13,
        -39,
        4,
        10
    );

    ctx.fillRect(
        9,
        -40,
        4,
        10
    );


    /* =========================================
       RAMBUT PANJANG
    ========================================= */

    ctx.fillStyle = hair;
    /* Rambut belakang */

    ctx.fillStyle = hair;

    /* rambut bagian atas */
    ctx.fillRect(
        -16,
        -51,
        32,
        10
    );

    /* rambut kiri */
    ctx.fillRect(
        -18,
        -44,
        7,
        28
    );

    /* rambut kanan */
    ctx.fillRect(
        11,
        -44,
        7,
        29
    );


    /* Rambut panjang kiri */

    ctx.fillRect(
        -21,
        -31,
        7,
        29
    );

    ctx.fillRect(
        -17,
        -10,
        6,
        13
    );


    /* Rambut panjang kanan */

    ctx.fillRect(
        14,
        -31,
        7,
        29
    );

    ctx.fillRect(
        11,
        -10,
        6,
        14
    );


    /* Highlight rambut */

    ctx.fillStyle = hairLight;

    ctx.fillRect(
        -13,
        -47,
        5,
        22
    );

    ctx.fillRect(
        9,
        -46,
        4,
        24
    );

    ctx.fillRect(
        -18,
        -28,
        3,
        17
    );


    /* =========================================
       WAJAH
    ========================================= */

    /* Alis */

    ctx.fillStyle = "#35233b";

    ctx.fillRect(
        -9,
        -42,
        7,
        2
    );

    ctx.fillRect(
        3,
        -42,
        7,
        2
    );


    /* Mata */

    ctx.fillStyle = "#302039";

    ctx.fillRect(
        -7,
        -39,
        5,
        3
    );

    ctx.fillRect(
        4,
        -39,
        5,
        3
    );


    /* Iris ungu */

    ctx.fillStyle = "#9a6ac4";

    ctx.fillRect(
        -6,
        -39,
        2,
        2
    );

    ctx.fillRect(
        5,
        -39,
        2,
        2
    );


    /* Hidung */

    ctx.fillStyle = skinDark;

    ctx.fillRect(
        0,
        -36,
        4,
        4
    );


    /* Mulut */

    ctx.fillStyle = "#603c52";

    ctx.fillRect(
        -3,
        -30,
        8,
        2
    );


    /* =========================================
       TOPI PENYIHIR
    ========================================= */

    /* Pinggiran topi */

    ctx.fillStyle = robeDark;

    ctx.beginPath();

    ctx.moveTo(-27, -49);
    ctx.lineTo(-8, -57);
    ctx.lineTo(16, -52);
    ctx.lineTo(28, -46);
    ctx.lineTo(11, -42);
    ctx.lineTo(-12, -44);

    ctx.closePath();

    ctx.fill();


    /* Badan topi */

    ctx.fillStyle = robe;

    ctx.beginPath();

    ctx.moveTo(-13, -51);
    ctx.lineTo(-10, -68);
    ctx.lineTo(-2, -78);
    ctx.lineTo(9, -72);
    ctx.lineTo(14, -55);
    ctx.closePath();

    ctx.fill();


    /* Ujung topi melengkung */

    ctx.fillStyle = robeDark;

    ctx.fillRect(
        -3,
        -77,
        10,
        6
    );

    ctx.fillRect(
        -8,
        -73,
        7,
        7
    );


    /* Highlight topi */

    ctx.fillStyle = robeLight;

    ctx.fillRect(
        -8,
        -66,
        4,
        13
    );

    ctx.fillRect(
        -3,
        -72,
        6,
        4
    );


    /* =========================================
       TALI TOPI
    ========================================= */

    ctx.fillStyle = gold;

    ctx.fillRect(
        -13,
        -54,
        27,
        3
    );


    /* Gesper topi */

    ctx.fillStyle = gold;

    ctx.fillRect(
        -4,
        -55,
        8,
        8
    );


    ctx.fillStyle = robeDark;

    ctx.fillRect(
        -2,
        -53,
        4,
        4
    );


    /* =========================================
       LENGAN KIRI
    ========================================= */

    ctx.fillStyle = robe;

    ctx.fillRect(
        -24,
        -25,
        9,
        27
    );


    /* Ujung lengan */

    ctx.fillStyle = robeDark;

    ctx.fillRect(
        -25,
        -3,
        11,
        9
    );


    /* Ornamen lengan */

    ctx.fillStyle = gold;

    ctx.fillRect(
        -24,
        -4,
        9,
        2
    );


    /* =========================================
       TANGAN KIRI
    ========================================= */

    ctx.fillStyle = skin;

    ctx.fillRect(
        -23,
        2,
        9,
        9
    );


    /* Sarung tangan */

    ctx.fillStyle = leatherDark;

    ctx.fillRect(
        -24,
        2,
        10,
        7
    );


    /* =========================================
       LENGAN KANAN
    ========================================= */

    ctx.fillStyle = robe;

    ctx.fillRect(
        15,
        -25,
        10,
        29
    );


    /* Ujung lengan */

    ctx.fillStyle = robeDark;

    ctx.fillRect(
        14,
        -2,
        12,
        9
    );


    ctx.fillStyle = gold;

    ctx.fillRect(
        15,
        -4,
        9,
        2
    );


    /* =========================================
       TANGAN MEMEGANG TONGKAT
    ========================================= */

    ctx.fillStyle = skin;

    ctx.fillRect(
        17,
        1,
        9,
        11
    );


    ctx.fillStyle = leatherDark;

    ctx.fillRect(
        16,
        1,
        11,
        8
    );


    /* Jari */

    ctx.fillStyle = skinDark;

    ctx.fillRect(
        19,
        6,
        3,
        5
    );


    /* =========================================
       TONGKAT ATLANTEA VOID
    ========================================= */

    ctx.save();


    let staffRotation = 0;


    /* Gerakan saat menyerang */

    if (player.attack) {

        const progress =
            1 -
            player.attackTimer / 12;

        staffRotation =
            -0.25 +
            progress * 0.5;
    }


    ctx.translate(
        25,
        7
    );

    ctx.rotate(
        staffRotation
    );


    /* =========================================
       BATANG TONGKAT
    ========================================= */

    ctx.fillStyle = "#33251f";

    ctx.fillRect(
        -2,
        -57,
        5,
        65
    );


    /* Highlight batang */

    ctx.fillStyle = "#654531";

    ctx.fillRect(
        1,
        -55,
        2,
        61
    );


    /* =========================================
       ORNAMEN TONGKAT
    ========================================= */

    ctx.fillStyle = "#4b3760";

    ctx.fillRect(
        -5,
        -47,
        11,
        7
    );

    ctx.fillRect(
        -6,
        -11,
        13,
        7
    );


    /* Ornamen emas */

    ctx.fillStyle = gold;

    ctx.fillRect(
        -5,
        -45,
        10,
        3
    );

    ctx.fillRect(
        -6,
        -10,
        12,
        3
    );


    /* =========================================
       INTI MAGIS
    ========================================= */

    /* aura */

    ctx.fillStyle = "#4c2375";

    ctx.fillRect(
        -11,
        -71,
        22,
        22
    );


    ctx.fillStyle = "#6f31a5";

    ctx.fillRect(
        -8,
        -68,
        16,
        16
    );


    /* inti */

    ctx.fillStyle = magic;

    ctx.beginPath();

    ctx.arc(
        0,
        -60,
        8,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* pusat inti */

    ctx.fillStyle = magicLight;

    ctx.fillRect(
        -3,
        -63,
        6,
        6
    );


    /* =========================================
       CINCIN SIHIR
    ========================================= */

    ctx.strokeStyle = magic;
    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.arc(
        0,
        -60,
        12,
        0,
        Math.PI * 2
    );

    ctx.stroke();


    ctx.strokeStyle = purpleLight;
    ctx.lineWidth = 1;

    ctx.beginPath();

    ctx.arc(
        0,
        -60,
        16,
        0,
        Math.PI * 2
    );

    ctx.stroke();


    /* =========================================
       BATANG KRISTAL
    ========================================= */

    ctx.fillStyle = magic;

    ctx.fillRect(
        -2,
        -43,
        4,
        6
    );


    /* Kristal bawah */

    ctx.beginPath();

    ctx.moveTo(
        0,
        10
    );

    ctx.lineTo(
        5,
        4
    );

    ctx.lineTo(
        0,
        -2
    );

    ctx.lineTo(
        -5,
        4
    );

    ctx.closePath();

    ctx.fill();


    /* =========================================
       PARTIKEL SIHIR
    ========================================= */

    if (player.attack) {

        ctx.fillStyle = magicLight;

        ctx.fillRect(
            -17,
            -69,
            3,
            3
        );

        ctx.fillRect(
            15,
            -57,
            3,
            3
        );

        ctx.fillRect(
            -12,
            -47,
            2,
            2
        );

        ctx.fillRect(
            12,
            -73,
            3,
            3
        );

        ctx.fillRect(
            -20,
            -55,
            2,
            2
        );
    }


    ctx.restore();


    /* =========================================
       AURA TAMBAHAN SAAT ATTACK
    ========================================= */

    if (player.attack) {

        ctx.globalAlpha = 0.25;

        ctx.fillStyle = magic;

        ctx.beginPath();

        ctx.arc(
            25,
            -53,
            22,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.globalAlpha = 1;
    }


    ctx.restore();
}

/* =========================
   ENEMY DRAW
========================= */

function drawEnemies(){

    enemies.forEach(enemy => {

        if(enemy.dead){

            drawEnemyDeath(enemy);

            return;
        }

        drawEnemy(enemy);
    });
}


function drawEnemy(enemy){

    ctx.save();

    ctx.translate(
        Math.round(enemy.x),
        Math.round(enemy.y)
    );

    ctx.scale(
        enemy.direction,
        1
    );

    if(enemy.isBoss){

        ctx.scale(1.45, 1.45);
    }


    /* =====================================
       ANIMASI JALAN
    ===================================== */

    const walk =
        Math.sin(
            enemy.step * 2
        ) * 2;


    const bob =
        Math.abs(
            Math.sin(
                enemy.step * 2
            )
        ) * 1;


    ctx.translate(
        0,
        -bob
    );


    /* =====================================
       WARNA GOBLIN
    ===================================== */

    const goblinColors =
        enemy.colors || goblinPalettes[0];

    const goblinGreen =
        goblinColors.green;

    const goblinLight =
        goblinColors.light;

    const goblinDark =
        goblinColors.dark;

    const outline =
        '#241c2c';

    const cloth =
        goblinColors.cloth;

    const clothDark =
        goblinColors.clothDark;

    if(enemy.isBoss && enemy.tentaclesActive){

        drawBossTentacles(enemy);
    }


    /* =====================================
       SHADOW
    ===================================== */

    ctx.fillStyle =
        'rgba(20,30,20,.30)';

    ctx.fillRect(
        -19,
        18,
        38,
        7
    );


    /* =====================================
       BADAN
    ===================================== */

    if(enemy.hitFlash > 0){

        ctx.fillStyle =
            '#f6e5c5';

    }else{

        ctx.fillStyle =
            goblinGreen;
    }


    /* OUTLINE BADAN */

    ctx.fillRect(
        -19,
        -25,
        38,
        37
    );


    /* BADAN UTAMA */

    if(enemy.hitFlash > 0){

        ctx.fillStyle =
            '#f6e5c5';

    }else{

        ctx.fillStyle =
            goblinLight;
    }

    ctx.fillRect(
        -14,
        -22,
        28,
        30
    );


    /* SISI BADAN */

    if(enemy.hitFlash <= 0){

        ctx.fillStyle =
            goblinDark;

        ctx.fillRect(
            -17,
            -20,
            5,
            28
        );

        ctx.fillRect(
            12,
            -20,
            5,
            28
        );
    }


    /* =====================================
       PERUT
    ===================================== */

    if(enemy.hitFlash <= 0){

        ctx.fillStyle =
            goblinColors.belly;

        ctx.fillRect(
            -9,
            -7,
            18,
            15
        );

        ctx.fillRect(
            -6,
            -4,
            12,
            4
        );
    }


    /* =====================================
       TANGAN KIRI
    ===================================== */

    if(enemy.hitFlash > 0){

        ctx.fillStyle =
            '#f6e5c5';

    }else{

        ctx.fillStyle =
            goblinGreen;
    }


    ctx.fillRect(
        -25,
        -20,
        9,
        25
    );


    /* Tangan */

    ctx.fillRect(
        -27,
        1,
        11,
        9
    );


    /* Jari */

    if(enemy.hitFlash <= 0){

        ctx.fillStyle =
            goblinDark;

        ctx.fillRect(
            -27,
            7,
            4,
            5
        );

        ctx.fillRect(
            -22,
            7,
            4,
            5
        );
    }


    /* =====================================
       TANGAN KANAN
    ===================================== */

    if(enemy.hitFlash > 0){

        ctx.fillStyle =
            '#f6e5c5';

    }else{

        ctx.fillStyle =
            goblinGreen;
    }


    ctx.fillRect(
        16,
        -20,
        9,
        25
    );


    /* Tangan besar */

    ctx.fillRect(
        16,
        1,
        11,
        9
    );


    /* Jari */

    if(enemy.hitFlash <= 0){

        ctx.fillStyle =
            goblinDark;

        ctx.fillRect(
            17,
            7,
            4,
            5
        );

        ctx.fillRect(
            22,
            7,
            4,
            5
        );
    }


    /* =====================================
       KAKI
    ===================================== */

    if(enemy.hitFlash > 0){

        ctx.fillStyle =
            '#f6e5c5';

    }else{

        ctx.fillStyle =
            goblinDark;
    }


    /* Kaki kiri */

    ctx.fillRect(
        -14,
        7,
        10,
        16 + walk
    );


    /* Kaki kanan */

    ctx.fillRect(
        4,
        7,
        10,
        16 - walk
    );


    /* =====================================
       TELAPAK / KAKI GOBLIN
    ===================================== */

    if(enemy.hitFlash > 0){

        ctx.fillStyle =
            '#f6e5c5';

    }else{

        ctx.fillStyle =
            goblinColors.foot;
    }


    ctx.fillRect(
        -17,
        20 + walk,
        13,
        6
    );

    ctx.fillRect(
        3,
        20 - walk,
        14,
        6
    );


    /* =====================================
       CELANA / CAWAT
    ===================================== */

    ctx.fillStyle =
        clothDark;

    ctx.fillRect(
        -14,
        2,
        28,
        10
    );


    ctx.fillStyle =
        cloth;

    ctx.fillRect(
        -11,
        3,
        22,
        7
    );


    /* Lipatan kain */

    ctx.fillStyle =
        goblinColors.clothFold;

    ctx.fillRect(
        -8,
        5,
        4,
        7
    );

    ctx.fillRect(
        4,
        4,
        4,
        8
    );


    /* =====================================
       LEHER
    ===================================== */

    if(enemy.hitFlash > 0){

        ctx.fillStyle =
            '#f6e5c5';

    }else{

        ctx.fillStyle =
            goblinDark;
    }


    ctx.fillRect(
        -8,
        -31,
        16,
        9
    );


    /* =====================================
       KEPALA
    ===================================== */

    if(enemy.hitFlash > 0){

        ctx.fillStyle =
            '#f6e5c5';

    }else{

        ctx.fillStyle =
            goblinGreen;
    }


    /* Outline kepala */

    ctx.fillRect(
        -16,
        -47,
        32,
        27
    );


    /* Wajah */

    if(enemy.hitFlash > 0){

        ctx.fillStyle =
            '#f6e5c5';

    }else{

        ctx.fillStyle =
            goblinLight;
    }


    ctx.fillRect(
        -12,
        -44,
        24,
        22
    );


    /* =====================================
       TELINGA KIRI
    ===================================== */

    if(enemy.hitFlash > 0){

        ctx.fillStyle =
            '#f6e5c5';

    }else{

        ctx.fillStyle =
            goblinGreen;
    }


    ctx.fillRect(
        -24,
        -40,
        10,
        13
    );


    ctx.fillRect(
        -29,
        -36,
        8,
        7
    );


    /* Dalam telinga */

    if(enemy.hitFlash <= 0){

        ctx.fillStyle =
            goblinColors.ear;

        ctx.fillRect(
            -25,
            -37,
            7,
            5
        );
    }


    /* =====================================
       TELINGA KANAN
    ===================================== */

    if(enemy.hitFlash > 0){

        ctx.fillStyle =
            '#f6e5c5';

    }else{

        ctx.fillStyle =
            goblinGreen;
    }


    ctx.fillRect(
        14,
        -40,
        10,
        13
    );

    ctx.fillRect(
        21,
        -36,
        8,
        7
    );


    /* Dalam telinga */

    if(enemy.hitFlash <= 0){

        ctx.fillStyle =
            goblinColors.ear;

        ctx.fillRect(
            18,
            -37,
            7,
            5
        );
    }


    /* =====================================
       RAMBUT / BAGIAN ATAS KEPALA
    ===================================== */

    if(enemy.hitFlash <= 0){

        ctx.fillStyle =
            goblinDark;

        ctx.fillRect(
            -12,
            -48,
            24,
            7
        );

        ctx.fillRect(
            -7,
            -51,
            14,
            5
        );
    }


    /* =====================================
       ALIS
    ===================================== */

    if(enemy.hitFlash <= 0){

        ctx.fillStyle =
            goblinColors.dark;

        ctx.fillRect(
            -9,
            -38,
            7,
            3
        );

        ctx.fillRect(
            3,
            -38,
            7,
            3
        );
    }


    /* =====================================
       MATA KIRI
    ===================================== */

    if(enemy.hitFlash <= 0){

        ctx.fillStyle =
            '#241c2c';

        ctx.fillRect(
            -8,
            -35,
            8,
            5
        );


        ctx.fillStyle =
            '#e84d4d';

        ctx.fillRect(
            -5,
            -35,
            4,
            4
        );


        ctx.fillStyle =
            '#ff9a45';

        ctx.fillRect(
            -4,
            -35,
            2,
            2
        );
    }


    /* =====================================
       MATA KANAN
    ===================================== */

    if(enemy.hitFlash <= 0){

        ctx.fillStyle =
            '#241c2c';

        ctx.fillRect(
            2,
            -35,
            8,
            5
        );


        ctx.fillStyle =
            '#e84d4d';

        ctx.fillRect(
            5,
            -35,
            4,
            4
        );


        ctx.fillStyle =
            '#ff9a45';

        ctx.fillRect(
            6,
            -35,
            2,
            2
        );
    }


    /* =====================================
       HIDUNG
    ===================================== */

    if(enemy.hitFlash <= 0){

        ctx.fillStyle =
            goblinDark;

        ctx.fillRect(
            0,
            -31,
            6,
            5
        );

        ctx.fillRect(
            4,
            -29,
            4,
            3
        );
    }


    /* =====================================
       MULUT
    ===================================== */

    if(enemy.hitFlash <= 0){

        ctx.fillStyle =
            '#241c2c';

        ctx.fillRect(
            -6,
            -25,
            14,
            6
        );


        /* Gigi */

        ctx.fillStyle =
            '#e6dfb9';

        ctx.fillRect(
            -3,
            -25,
            4,
            3
        );

        ctx.fillRect(
            3,
            -25,
            4,
            3
        );
    }


    /* =====================================
       DETAIL WAJAH
    ===================================== */

    if(enemy.hitFlash <= 0){

        ctx.fillStyle =
            goblinColors.ear;

        /* pipi kiri */

        ctx.fillRect(
            -12,
            -28,
            4,
            5
        );

        /* pipi kanan */

        ctx.fillRect(
            9,
            -28,
            4,
            5
        );
    }


    /* =====================================
       TULANG / AKSESORIS KEPALA
    ===================================== */

    if(enemy.hitFlash <= 0){

        ctx.fillStyle =
            '#dbc793';

        ctx.fillRect(
            -7,
            -49,
            4,
            4
        );

        ctx.fillRect(
            4,
            -49,
            4,
            4
        );
    }

    if(enemy.isBoss && enemy.isChasing){

        drawBossClaws(
            enemy,
            goblinGreen,
            goblinDark
        );
    }


    ctx.restore();


    /* =====================================
       HP BAR
    ===================================== */

    drawEnemyHP(enemy);
}

function drawBossClaws(enemy, skinColor, clawColor){

    const cycle = enemy.clawTimer % 32;
    const firstReach = cycle < 16 ? 18 : 5;
    const secondReach = cycle < 16 ? 5 : 18;

    const drawClaw = (startX, startY, reach) => {

        ctx.save();
        ctx.translate(startX, startY);

        ctx.fillStyle = clawColor;
        ctx.fillRect(-3, -3, 25 + reach, 9);

        ctx.fillStyle = skinColor;
        ctx.fillRect(0, -1, 22 + reach, 5);
        ctx.fillRect(18 + reach, -5, 9, 13);

        ctx.fillStyle = clawColor;
        ctx.fillRect(23 + reach, -7, 5, 7);
        ctx.fillRect(27 + reach, -4, 5, 7);
        ctx.fillRect(23 + reach, 8, 5, 7);

        ctx.restore();
    };

    drawClaw(10, -20, firstReach);
    drawClaw(5, -7, secondReach);
}

function drawBossTentacles(enemy){

    const tentacles = [
        {x:-18, y:5, length:42, sway:-15, phase:0},
        {x:-8, y:10, length:54, sway:12, phase:1.4},
        {x:8, y:10, length:52, sway:-13, phase:2.7},
        {x:19, y:5, length:43, sway:16, phase:4.1}
    ];

    tentacles.forEach(tentacle => {

        const wave =
            Math.sin(enemy.tentacleTimer * .12 + tentacle.phase);

        const reach =
            tentacle.length +
            Math.sin(enemy.tentacleTimer * .08 + tentacle.phase) * 8;

        const sway =
            tentacle.sway * wave;

        ctx.save();

        ctx.lineCap = 'square';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(tentacle.x, tentacle.y);
        ctx.quadraticCurveTo(
            tentacle.x + sway,
            tentacle.y - reach * .45,
            tentacle.x + sway * .55,
            tentacle.y - reach
        );

        ctx.strokeStyle = '#4d101d';
        ctx.lineWidth = 10;
        ctx.stroke();

        ctx.strokeStyle = '#c52438';
        ctx.lineWidth = 6;
        ctx.stroke();

        ctx.strokeStyle = '#f24b57';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#8f1728';
        ctx.fillRect(
            tentacle.x + sway * .55 - 4,
            tentacle.y - reach - 3,
            8,
            7
        );

        ctx.restore();
    });
}

/* =========================
   ENEMY HP
========================= */

function drawEnemyHP(enemy){

    const width = enemy.isBoss ? 92 : 38;

    const hpPercentage =
        Math.max(
            0,
            enemy.hp /
            enemy.maxHP
        );

    ctx.fillStyle =
        '#2c2018';

    ctx.fillRect(
        enemy.x - width / 2 - 2,
        enemy.y - 62,
        width + 4,
        8
    );

    ctx.fillStyle =
        '#b84444';

    ctx.fillRect(
        enemy.x - width / 2,
        enemy.y - 60,
        width * hpPercentage,
        4
    );

    if(enemy.isBoss){

        ctx.fillStyle = '#ff5360';
        ctx.font = 'bold 13px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('FINAL BOSS', enemy.x, enemy.y - 68);
    }
}

/* =========================
   ENEMY DEATH
========================= */

function drawEnemyDeath(enemy){

    const progress =
        enemy.deathTimer / 18;

    ctx.save();

    ctx.globalAlpha =
        progress;

    ctx.translate(
        enemy.x,
        enemy.y
    );

    ctx.scale(
        1 + (1-progress) * .4,
        progress
    );

    ctx.fillStyle =
        '#526f45';

    ctx.fillRect(
        -18,
        -30,
        36,
        43
    );

    ctx.restore();
}

/* =========================
   PROJECTILE DRAW
========================= */

function drawProjectiles(){

    projectiles.forEach(p => {

        if(p.type === 'fireball'){

            const pulse =
                1 + Math.sin(animationTime * .35) * .15;

            ctx.save();

            ctx.translate(p.x,p.y);
            ctx.scale(pulse,pulse);

            ctx.fillStyle =
                'rgba(255,91,35,.25)';

            ctx.fillRect(-14,-14,28,28);

            ctx.fillStyle =
                '#d83b24';

            ctx.fillRect(-8,-8,16,16);

            ctx.fillStyle =
                '#ffb52e';

            ctx.fillRect(-4,-6,8,12);

            ctx.fillStyle =
                '#fff0a8';

            ctx.fillRect(-2,-3,4,7);

            ctx.restore();

        }else if(p.type === 'arrow'){

            const target = p.target;

            let angle = 0;

            if(target){

                angle =
                    Math.atan2(
                        target.y - p.y,
                        target.x - p.x
                    );
            }

            ctx.save();

            ctx.translate(
                p.x,
                p.y
            );

            ctx.rotate(
                angle
            );

            ctx.fillStyle =
                '#d9c18a';

            ctx.fillRect(
                -10,
                -1,
                20,
                3
            );

            ctx.fillStyle =
                '#767b72';

            ctx.beginPath();

            ctx.moveTo(
                10,
                -4
            );

            ctx.lineTo(
                16,
                1
            );

            ctx.lineTo(
                10,
                5
            );

            ctx.fill();

            ctx.restore();

        }else{

            ctx.fillStyle =
                'rgba(110,217,255,.25)';

            ctx.fillRect(
                p.x - 10,
                p.y - 10,
                20,
                20
            );

            ctx.fillStyle =
                '#66238d';

            ctx.fillRect(
                p.x - 6,
                p.y - 6,
                12,
                12
            );

            ctx.fillStyle =
                '#b17ef4';

            ctx.fillRect(
                p.x - 2,
                p.y - 2,
                4,
                4
            );
        }
    });
}

/* =========================
   PARTICLE DRAW
========================= */

function drawParticles(){

    particles.forEach(p => {

        if(p.type === 'slash'){

            ctx.fillStyle =
                '#f5edc8';

        }else if(
            p.type === 'magic'
        ){

            ctx.fillStyle =
                '#642283';

        }else if(
            p.type === 'death'
        ){

            ctx.fillStyle =
                '#d7a34f';

        }else if(
            p.type === 'arrow'
        ){

            ctx.fillStyle =
                '#ddd0a8';

        }else{

            ctx.fillStyle =
                '#e76b64';
        }

        ctx.globalAlpha =
            Math.min(
                1,
                p.life / 15
            );

        ctx.fillRect(
            p.x,
            p.y,
            p.size,
            p.size
        );

        ctx.globalAlpha = 1;
    });
}

/* =========================
   EFFECT DRAW
========================= */

function drawAttackEffects(){

    attackEffects.forEach(effect => {

        if(effect.type === 'slash'){

            const alpha =
                effect.life /
                effect.maxLife;

            ctx.save();

            ctx.translate(
                effect.x,
                effect.y
            );

            ctx.scale(
                effect.direction,
                1
            );

            ctx.strokeStyle =
                `rgba(255,245,192,${alpha})`;

            ctx.lineWidth = 7;

            ctx.beginPath();

            ctx.arc(
                0,
                0,
                35,
                -1.2,
                .8
            );

            ctx.stroke();

            ctx.strokeStyle =
                `rgba(238,188,76,${alpha})`;

            ctx.lineWidth = 3;

            ctx.beginPath();

            ctx.arc(
                0,
                0,
                29,
                -1.2,
                .8
            );

            ctx.stroke();

            ctx.restore();

        }else if(
            effect.type ===
            'magicExplosion'
        ){

            const alpha =
                effect.life /
                effect.maxLife;

            ctx.strokeStyle =
                `rgba(105,220,255,${alpha})`;

            ctx.lineWidth = 5;

            ctx.beginPath();

            ctx.arc(
                effect.x,
                effect.y,
                effect.radius,
                0,
                Math.PI * 2
            );

            ctx.stroke();

            ctx.fillStyle =
                `rgba(134,104,238,${alpha*.35})`;

            ctx.beginPath();

            ctx.arc(
                effect.x,
                effect.y,
                effect.radius * .7,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }
    });
}

/* =========================
   DAMAGE NUMBER DRAW
========================= */

function drawDamageNumbers(){

    ctx.textAlign = 'center';

    damageNumbers.forEach(d => {

        if(d.type === 'score'){

            ctx.fillStyle =
                '#f5cf61';

        }else if(
            d.type === 'player'
        ){

            ctx.fillStyle =
                '#ff7770';

        }else{

            ctx.fillStyle =
                '#fff1d2';
        }

        ctx.font =
            'bold 15px Courier New';

        ctx.fillText(
            d.value,
            d.x,
            d.y
        );
    });

    ctx.textAlign = 'left';
}

/* =========================
   DRAW
========================= */

function draw(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.save();

    if(cameraShake > 0){

        const shakeX =
            (Math.random() - .5) *
            cameraShake;

        const shakeY =
            (Math.random() - .5) *
            cameraShake;

        ctx.translate(
            shakeX,
            shakeY
        );
    }

    drawBackground();

    /*
    SORTING MEMBERI EFEK
    DEPTH 2D RPG.
    */

    const drawable = [];

    drawable.push({
        y:player.y,
        type:'player',
        object:player
    });

    enemies.forEach(enemy => {

        drawable.push({
            y:enemy.y,
            type:'enemy',
            object:enemy
        });
    });

    drawable.sort(
        (a,b) => a.y - b.y
    );

    drawable.forEach(item => {

        if(item.type === 'player'){

            drawPlayer();

        }else{

            if(item.object.dead){

                drawEnemyDeath(
                    item.object
                );

            }else{

                drawEnemy(
                    item.object
                );
            }
        }
    });

    drawProjectiles();

    drawAttackEffects();

    drawParticles();

    drawDamageNumbers();

    ctx.restore();

    if(cameraShake > 0){

        cameraShake *= .82;

        if(cameraShake < .2){

            cameraShake = 0;
        }
    }
}

/* =========================
   UPDATE
========================= */

function update(){

    if(!gameRunning){
        return;
    }

    animationTime++;

    updatePlayer();

    updateEnemies();

    updateProjectiles();

    updateParticles();

    updateAttackEffects();

    updateDamageNumbers();

    updateCombatMessage();
}

/* =========================
   GAME LOOP
========================= */

function gameLoop(){

    requestAnimationFrame(
        gameLoop
    );

    if(gameRunning){

        update();

        draw();
    }
}

gameLoop();

/* =========================
   ENDING
========================= */

const endingDialogues = [
    {
        speaker:'Putri Elnora Etrama Salvatore',
        text:'"Kau sudah kembali... Aku sangat mengkhawatirkanmu. Terima kasih telah menyelamatkan kerajaan kami, HERO."'
    },
    {
        speaker:'Sang Pahlawan',
        text:'"Aku hanya melakukan apa yang harus kulakukan, Elnora. Melihatmu dan seluruh rakyat selamat adalah hadiah terbesar bagiku."'
    },
    {
        speaker:'Putri Elnora Etrama Salvatore',
        text:'"Keberanianmu membawa harapan bagi kami semua. Maukah kau tinggal di kerajaan ini dan menemaniku membangun masa depan yang damai?"'
    },
    {
        speaker:'Sang Pahlawan',
        text:'"Dengan senang hati, Elnora. Selama kau di sisiku, aku akan selalu melindungi kerajaan ini."'
    }
];

let endingDialogueIndex = 0;

function showEndingDialogue(){

    const dialogue = endingDialogues[endingDialogueIndex];

    endingSpeaker.textContent = dialogue.speaker === 'Sang Pahlawan'
        ? characterNames[selectedCharacter]
        : dialogue.speaker;
    endingDialogueText.textContent = dialogue.text.replace(
        'HERO',
        characterNames[selectedCharacter]
    );
    document.getElementById('nextEnding').textContent =
        endingDialogueIndex === endingDialogues.length - 1
            ? 'LANJUT KE PERNIKAHAN'
            : 'DIALOG BERIKUTNYA';
}

document.getElementById(
    'nextEnding'
).onclick = () => {

    if(endingDialogueIndex < endingDialogues.length - 1){
        endingDialogueIndex++;
        showEndingDialogue();
        return;
    }

    screenTransition.classList.add('visible');

    window.setTimeout(() => {
        endingScene1.classList.remove('activeEndingScene');
        endingScene2.classList.add('activeEndingScene');
        endingVideo.currentTime = 0;
        endingVideo.load();
        endingVideo.play().catch(() => {});
        screenTransition.classList.remove('visible');
    }, 450);
};

document.getElementById(
    'nextEnding3'
).onclick = () => {

    showEndingScene(endingScene2, endingScene3);
};

document.getElementById(
    'nextEnding4'
).onclick = () => {

    ending4DialogueIndex = 0;
    showEndingDialogue4();
    showEndingScene(endingScene3, endingScene4);
};

document.getElementById(
    'nextEnding4Dialogue'
).onclick = () => {

    if(ending4DialogueIndex < ending4Dialogues.length - 1){
        ending4DialogueIndex++;
        showEndingDialogue4();
        return;
    }

    returnToMenuFromEnding();
};

function showEndingScene(currentScene, nextScene){

    screenTransition.classList.add('visible');

    window.setTimeout(() => {
        currentScene.classList.remove('activeEndingScene');
        nextScene.classList.add('activeEndingScene');
        nextScene.classList.add('endingSceneFadeIn');
        screenTransition.classList.remove('visible');
    }, 450);
}

const ending4Dialogues = [
    {
        speaker:'Gavriel Etrama Salvatore',
        text:'"...aaa..mhmaa..haaa..mama.."'
    },
    {
        speaker:'Putri Elnora Etrama Salvatore',
        text:'"Lihatlah putra kita, suamiku.. Setelah semua yang kita lalui, rasanya damai ini seperti mimpi."'
    },
    {
        speaker:'Sang Pahlawan',
        text:'"Putra kita, Gavriel, akan tumbuh dengan kasih sayang, Elnora. Aku berjanji akan menjaga kalian berdua dan kerajaan ini."'
    },
    {
        speaker:'Putri Elnora Etrama Salvatore',
        text:'"Aku percaya padamu, suamiku.. Bersamamu, aku yakin masa depan North Kingdom akan selalu memiliki harapan."'
    },
    {
        speaker:'Sang Pahlawan',
        text:'"Selama kita bersama, keluarga kita akan menjadi cahaya bagi seluruh kerajaan."'
    }
];

let ending4DialogueIndex = 0;

function showEndingDialogue4(){

    const dialogue = ending4Dialogues[ending4DialogueIndex];

    ending4Speaker.textContent = dialogue.speaker === 'Sang Pahlawan'
        ? characterNames[selectedCharacter]
        : dialogue.speaker;
    ending4DialogueText.textContent = dialogue.text;
    document.getElementById('nextEnding4Dialogue').textContent =
        ending4DialogueIndex === ending4Dialogues.length - 1
            ? 'KEMBALI KE MENU'
            : 'DIALOG BERIKUTNYA';
}

function returnToMenuFromEnding(){

    endingVideo.pause();
    endingVideo.currentTime = 0;
    stopEndingMusic();

    unlockedLevel = 1;

    currentLevel = 1;

    score = 0;

    playerHP = maxHP;

    updateLevelButtons();

    showScreen('main');

    if(musicOn){
        bgMusic.play().catch(() => {});
    }
};

/* =========================
   INITIALIZATION
========================= */

updateLevelButtons();

updateHUD();

showScreen('intro');