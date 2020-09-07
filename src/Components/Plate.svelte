<script>
    import {onMount, createEventDispatcher} from 'svelte'

	const dispatch = createEventDispatcher();

    export let icon;
    export let row_i;
    export let cell_i;
    let current_icon = null;
    let Plate;
    let Icon;
    
    onMount(() => {
        Plate.style.height = Plate.clientWidth+"px"
    })

    const icon_handler = () => {
        dispatch("icon_handler", {
            row_i: row_i,
            cell_i: cell_i
        })
    }

    $: if (Icon !== undefined) {
        Icon.classList.remove(current_icon)
        Icon.classList.add(icon)
        current_icon = icon
    }
</script>

<div class="wide column">
    <diw
        on:click={icon_handler}
        bind:this={Plate}
        class="plate"
    >
        <i bind:this={Icon} class="icon_ big icon"></i>
    </diw>
</div>

<style>
    .plate {
        position: relative;
        display: flex;
        /* align-items: center;
        justify-content: center; */
    }
    .icon_ {
        margin: auto !important;
    }
</style>