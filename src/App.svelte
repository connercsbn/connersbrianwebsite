<script>
import { onMount } from "svelte";
import { setBrian } from "./lib/brian";
import { draggable } from 'svelte-drag';

    const X = 0;
    const Y = 1;
	let innerWidth = window.innerWidth;
    let canvas;
    let ctx = {};
    let x, y;
    let brian = new Image;
    let painting = true;
    let seconds = 0;
    let timer;
    let counting = false;
    let timeInterval;
    let comp = '';
    $: ctx.globalCompositeOperation=comp;

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
        timeInterval = setInterval(() => {
            if (counting) {
                seconds += 1;
            }
        }, 1000);
    })

    function debounce() {
        clearTimeout(timer);
		timer = setTimeout(() => {
            counting = false;
		}, 1000);
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
        // ctx.draw()
        // ctx.beginPath();
        // ctx.arc(x, y, 50, 0, 2 * Math.PI);
        // ctx.stroke(); 
        counting = true;
        debounce();
    }

    function handleMouseMove(e) {
        let begin = new Date();
        let rect = canvas.getBoundingClientRect();
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
        painting && draw(x, y);
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
    const handleMouseUp = () => {
        painting = true; 
        draw(x, y);
    };
    const handleMouseDown = () => {
        painting = false; 
    };
    const handleKeyPress = ({ key }) => {
        comp = comps[key] || 'copy';
        console.log(comp);
    }

</script>

<svelte:window 
    on:mousemove={handleMouseMove} 
    on:mouseup={handleMouseUp} 
    on:mousedown={handleMouseDown} 
    on:keydown={handleKeyPress}
    bind:innerWidth />

<main>
    <h1 class="score">You've been playing for {seconds} second{seconds != 1 ? "s" : ""}<br/>{comp}</h1>
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