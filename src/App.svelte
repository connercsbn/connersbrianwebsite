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
    $: ctx.globalCompositeOperation = comp;

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
        '[': 'source-over'              
    }

    onMount(() => {
        ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        console.log(ctx);
        console.log(canvas);
        brian = setBrian(brian);
        console.log("looping");
            loop();
    })

    let frame = 0;
    let startpoint = [100, 100];
    let endpoint = [0, 0];
    let curr = [0, 0];
    let totalFrames = 500; //                                    X  ____percentage finished____
    let fx = (thisFrame) => { return startpoint[X] + (endpoint[X] - startpoint[X]) * (thisFrame / totalFrames); };
    let fy = (thisFrame) => { return startpoint[Y] + (endpoint[Y] - startpoint[Y]) * (thisFrame / totalFrames); };

    let interval;
    function loop() {
        interval = setInterval(() => {
            if (frame == 0) { // new endpoint if frame is 0 (just starting again)
                endpoint = [
                    Math.floor(
                        Math.random() * canvas.width
                    ), Math.floor(
                        Math.random() * canvas.height
                    )
                ];
                // endpoint = [600, 600];
            } 
            curr = [fx(frame), fy(frame)];
            if (!(frame % 250)) {
                // console.log(`${startpoint[X]} --> ${curr[X]} --> ${endpoint[X]}`)
                console.log(startpoint, endpoint);
            }
            drawPath(curr[X], curr[Y]);
            draw(curr[X], curr[Y]);
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

    $: innerWidth && resizeCanvas();

    function resizeCanvas() {
        if (canvas) {
            console.log('called resizeCanvas')
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            console.log(brian);
        }
    }    

</script>

<svelte:window bind:innerWidth />

<main>
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
</style>