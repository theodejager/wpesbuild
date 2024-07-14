<?php
function enqueue_live_reload() {
	wp_enqueue_script( 'esbuild-reload', THEME_URI . '/wpesbuild/reload.js', array(), '1.0', false );
}
function enqueue_js() {
	if ( file_exists( get_template_directory() . '/wpesbuild/dist/main.js' ) ) {
		$version = filemtime( get_template_directory() . '/wpesbuild/dist/main.js' );
		wp_enqueue_script( 'my-theme-scripts', get_template_directory_uri() . '/wpesbuild/dist/main.js', array(), $version, true );
	}}
function enqueue_styles() {
	if ( file_exists( get_template_directory() . '/wpesbuild/dist/main.css' ) ) {
		$version = filemtime( get_template_directory() . '/wpesbuild/dist/main.css' );
		wp_enqueue_style( 'my-theme-styles', get_template_directory_uri() . '/wpesbuild/dist/main.css', array(), $version, 'all' );
	}
}

add_action( 'wp_enqueue_scripts', 'enqueue_live_reload' );
add_action( 'wp_enqueue_scripts', 'enqueue_js' );
add_action( 'wp_enqueue_scripts', 'enqueue_styles' );
