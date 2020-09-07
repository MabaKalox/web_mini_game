<script>
	import { onMount } from 'svelte';
  	import { state } from './store';
	import cloneDeep from 'lodash/cloneDeep';

	import Plate from './Components/Plate.svelte'
	
	const icons_list = ["paw", "spider", "dragon", "cat"]
	const field_height = 3
	const field_width = 3
	const get_random_icon = () => {
		const i = Math.floor(Math.random() * (icons_list.length))
		return icons_list[i]
	}

	
	const win_color = "rgba(0, 255, 0, 0.60)"
	const nwin_color = "rgba(255, 0, 0, 0.60)"

	let main_matrix = [];
	let current_target_icon_name = null
	let Icon;
	let FieldWrap;

	const get_random_iсon_matrix = () => {
		return Array(field_height).fill().map(row => {
			return Array(field_width).fill().map(cell => {
				return get_random_icon()
			})
		})
	}

	if (!$state.main_matrix) {
		const state_copy = cloneDeep($state)
		state_copy.main_matrix = get_random_iсon_matrix()
		state.set(state_copy)
	}
	main_matrix = $state.main_matrix

	if(!$state.target_icon_name) {
		const state_copy = cloneDeep($state)
		state_copy.target_icon_name = get_random_icon()
		state.set(state_copy)
	}
	
	
	const get_next_icon = (current_icon) => {
		const current_i = icons_list.indexOf(current_icon)
		if (current_i+1 < icons_list.length) {
			return icons_list[current_i+1]
		} else {
			return icons_list[0]
		}
	}
	const get_right_pos = (row_i, cell_i) => {
		if (cell_i+1 < field_width) {
			return {y:row_i,x:cell_i+1}
		} else {
			return null
		}
	}
	const get_left_pos = (row_i, cell_i) => {
		if (cell_i > 0) {
			return {y:row_i,x:cell_i-1}
		} else {
			return null
		}
	}
	const get_down_pos = (row_i, cell_i) => {
		if (row_i+1 < field_height) {
			return {y:row_i+1,x:cell_i}
		} else {
			return null
		}
	}
	const get_up_pos = (row_i, cell_i) => {
		if (row_i > 0) {
			return {y:row_i-1,x:cell_i}
		} else {
			return null
		}
	}
	const icon_handler = (event) => {
		const state_copy = cloneDeep($state)
		const row_i = event.detail.row_i
		const cell_i = event.detail.cell_i
		
		let current_pos = {y:row_i,x:cell_i}
		const cells_to_switch = [current_pos]

		let isRightDone = false;
		while (isRightDone !== true) {
			current_pos = get_right_pos(current_pos.y, current_pos.x)
			if (current_pos !== null) {
				cells_to_switch.push(current_pos)
			} else {
				current_pos = cells_to_switch[0]
				isRightDone = true
			}
		}

		let isLeftDone = false;
		while (isLeftDone !== true) {
			current_pos = get_left_pos(current_pos.y, current_pos.x)
			if (current_pos !== null) {
				cells_to_switch.push(current_pos)
			} else {
				current_pos = cells_to_switch[0]
				isLeftDone = true
			}
		}

		let isDownDone = false;
		while (isDownDone !== true) {
			current_pos = get_down_pos(current_pos.y, current_pos.x)
			if (current_pos !== null) {
				cells_to_switch.push(current_pos)
			} else {
				current_pos = cells_to_switch[0]
				isDownDone = true
			}
		}

		let isUpDone = false;
		while (isUpDone !== true) {
			current_pos = get_up_pos(current_pos.y, current_pos.x)
			if (current_pos !== null) {
				cells_to_switch.push(current_pos)
			} else {
				current_pos = cells_to_switch[0]
				isUpDone = true
			}
		}
		
		cells_to_switch.forEach(cell => {
			main_matrix[cell.y][cell.x] = get_next_icon(
				main_matrix[cell.y][cell.x]
			)
		})
		state_copy.main_matrix = main_matrix
		state.set(state_copy)
	}
	const reset_handler = () => {
		const state_copy = cloneDeep($state)
		state_copy.main_matrix = get_random_iсon_matrix()
		state_copy.target_icon_name = get_random_icon()
		state.set(state_copy)
		main_matrix = $state.main_matrix
	}
	const check_if_won = () => {
		for (const row of main_matrix) {
			for (const cell of row) {
				if (cell !== $state.target_icon_name) {
					return false
				}
			}
		}
		return true
	}
	$: if ($state.main_matrix && FieldWrap) {
		if (check_if_won($state.main_matrix)) {
			FieldWrap.style.backgroundColor = win_color
		} else {
			FieldWrap.style.backgroundColor = nwin_color
		}
	}
	$: if (Icon) {
		if (current_target_icon_name) {
			Icon.classList.remove(current_target_icon_name)
		}
		Icon.classList.add($state.target_icon_name)
		current_target_icon_name = $state.target_icon_name
	}
	

</script>

<main>
	<div class="container">
		<div class="grid_wrapper" bind:this={FieldWrap}>
			<div class="grid_wrapper-left ui segment">
				<i bind:this={Icon} class="ui target_icon_name big icon"></i>
			</div>
			<div class="grid_wrapper-right ui segment">
				<h4 class="ui text">
					1. You need to make all symbols on deck same as in left top corner<br>
					2. You can reset field & target by button<i class="angle double right icon"></i>
				</h4>
				<button on:click={reset_handler} class="ui red button">Reset</button>
			</div>
			<div class="grid_wrapper-field ui raised very padded segment celled grid">
				{#each main_matrix as row, row_i}
					<div class="three column row">
						{#each row as icon, cell_i}
							<Plate
								row_i={row_i}
								cell_i={cell_i}
								icon={icon}
								on:icon_handler={icon_handler}
							/>
						{/each}
					</div>
				{/each}
			</div>
		</div>
		<p>Made by <span class="ui text green">Maba_Kalox</span></p>
	</div>
</main>

<style type="text/scss">
	$field-border: 10px;

	.grid_wrapper {
		display: grid;
		grid-template-columns: min-content auto;
		grid-gap: $field-border;
		padding: $field-border;
		border-radius: 4px;
		overflow: hidden;
		grid-template-areas: 
		"target reset"
		"field field";
		&-left {
			grid-area: target;
			margin: 0 !important;
			display: flex;
			align-items: center
		}
		&-right {
			margin: 0 !important;
			grid-area: reset;
			display: flex;
			justify-content: space-between;
			&>h4 {
				margin: 0;
			}
		}
		&-field {
			margin: 0 !important;
			grid-area: field;
		}
	}

	main {
		text-align: center;
		padding: 1em;
		max-width: 720px !important;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>