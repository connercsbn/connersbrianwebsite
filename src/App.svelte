<script>
import { onMount } from "svelte";
import { setBrian } from "./lib/brian";

    const X = 0;
    const Y = 1;
    let innerWidth = window.innerWidth;
    let canvas;
    let ctx = {};
    let x, y;
    let brian = new Image;
    let counting = false;
    let comp = '';
    let starting = false;
    let started = false;
    let clicking = false;
    let buttonHovering = false;
    let hasBegun = false;
    let music = new Audio('redboneedited.opus');
    let introLength = 7.5;
    let whenSongBegan = undefined;
    $: ctx.globalCompositeOperation = comp;
    $: innerWidth && resizeCanvas();

    let comps = {
        '1': 'luminosity'               ,
        '2': 'color'                    ,
        '3': 'saturation'               ,
        '4': 'hue'                      ,
        '5': 'exclusion'                ,
        '6': 'difference'               ,
        '7': 'soft-light'               ,
        '8': 'hard-light'               ,
        '9': 'color-burn'               ,
        '0': 'lighten'                  ,
        'q': 'darken'                   ,
        'w': 'overlay'                  ,
        'e': 'multiply'                 ,
        'r': 'xor'                      ,
        't': 'destination-atop'         ,
        'y': 'destination-out'          ,
        'u': 'destination-in'           ,
        'i': 'destination-over'         ,
        'o': 'source-out'               ,
        'p': 'source-in'                ,
        '[': 'source-over'              ,
        // 'space': 'copy'
    };
    let compsValues = Object.values(comps);

    onMount(() => {
        ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        console.log(ctx);
        console.log(canvas);
        brian = setBrian(brian);
    })

    let frame = 0;
    let startpoint = [100, 100];
    let endpoint = [0, 0];
    let curr = [0, 0];
    let totalFrames = 300;
    let fx = (thisFrame) => { return startpoint[X] + (endpoint[X] - startpoint[X]) * (thisFrame / totalFrames); };
    let fy = (thisFrame) => { return startpoint[Y] + (endpoint[Y] - startpoint[Y]) * (thisFrame / totalFrames); };

    let interval;
    function loop() {
        interval = setInterval(() => {
            if (frame == 0) { // new endpoint if frame is 0 (just starting again)
                endpoint = [
                    Math.floor( Math.random() * canvas.width), 
                    Math.floor( Math.random() * canvas.height)
                ];
                // endpoint = [600, 600];
            } 
            curr = [fx(frame), fy(frame)];
            // drawPath(curr[X], curr[Y]);
            draw(curr[X], curr[Y]);
            if (frame == Math.floor(Math.random() * 500)) {
                ctx.globalCompositeOperation = compsValues[Math.floor(Math.random() * compsValues.length)];
            }
            frame++;
            if (frame == totalFrames) {
                startpoint = endpoint;
                frame = 0;
                interval = clearInterval(interval);
                loop();
            }
        // start position x at 0; then increment each draw to calculate position
        }, 10);
    }

    function drawPath(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.stroke(); 
    }
    function draw(x, y) {
        x = canvas.width - x;
        y = canvas.height - y;
        const regular_w = canvas.width * .1;
        const regular_h = regular_w;
        const middle = [canvas.width / 2, canvas.height / 2];
        const distance = [Math.abs(x - middle[X]), Math.abs(y - middle[Y])];
        const distance_percentage = [distance[X] / middle[X], distance[Y] / middle[Y]];
        let w = 200 * ((3.0 * distance_percentage[X]) ** 3) + regular_w;
        let h = 200 * ((3.0 * distance_percentage[Y]) ** 3) + regular_h;
        
        let offset = [w / 2, h / 2];
        ctx.drawImage(brian, x - offset[X], y - offset[Y], w, h);
    }
    function resizeCanvas() {
        if (canvas) {
            console.log('called resizeCanvas')
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }    
    let introTimeOut;
    function handleSoftBegin() {
        buttonHovering = true;
        music = new Audio('redboneedited.opus');
        console.log("playing song")
        music.play();
        whenSongBegan = new Date();
        // start timing since song began
        introTimeOut = setTimeout(() => {
            music.pause();
        }, 7450);
    }
    function handleBegin() {
        console.log("beginning experiencve")
        // get rid of button
        hasBegun = true;
        if (music.paused) {
            music.play();
            loop();
        } else {
            clearTimeout(introTimeOut);
            setTimeout(() => {
                loop();
                music.play();

            }, 7450 - (new Date() - whenSongBegan));
        }
        // wait until music is at a certain point, then loop.
    }
    function handleExit() {
        clearTimeout(introTimeOut);
        buttonHovering = false;
        console.log("not playing song")
        music.pause();
        // stop timing since song began
    }

</script>

<svelte:window bind:innerWidth on:mouseup={() => {clicking = false}} on:mousedown={() => {clicking = true}} />

<main>
    {#if !hasBegun}
    <div class="beginExperienceContainer">
        <button class="beginExperience" on:mouseenter={handleSoftBegin} on:mouseleave={handleExit} on:click={handleBegin}>Begin experience</button>
    </div>
    {/if}
    <canvas 
        bind:this={canvas}
        class="canvas-thing">
    </canvas>
</main>

<style>
    *,main {
        padding:0;margin:0;
    }
    main {
        text-align: center;
        padding: 0em;
        max-width: 240px;
        margin: 0 auto;
    }
    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
    article {
        position:absolute;
        top:0;bottom:0;left:0;right:0;
        color: white;
        text-align: justify;
    }
    section {
        width: 50%;
        padding: 5%;
        margin: 5% auto;
        border-radius: 40px;
    }
    h1 {
        text-align: center;
        margin: 3%;
        background: black;
        color: white;
    }
    p {
        padding: 10px;
    }
    .score {
        position: absolute;
    }
    .beginExperienceContainer {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100vw;
        height: 100vh;
    }
    .beginExperience {
        padding: 10px;
    }
</style>