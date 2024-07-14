<?php
function enqueue_live_reload() {
	wp_enqueue_script( 'esbuild-reload', 'reload.js' );
}

add_action( 'wp_enqueue_scripts', 'enqueue_live_reload' );
