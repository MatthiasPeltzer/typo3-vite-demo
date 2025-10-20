<?php
defined('TYPO3') or die('Access denied.');

/***************
 * Add default RTE configuration
 */
$GLOBALS['TYPO3_CONF_VARS']['RTE']['Presets']['typo3_vite_demo'] = 'EXT:typo3_vite_demo/Configuration/RTE/Default.yaml';

/***************
 * Add custom ckeditor styling (built by Vite from ckeditor.scss)
 */
$GLOBALS['TYPO3_CONF_VARS']['BE']['stylesheets']['typo3_vite_demo'] = 'EXT:typo3_vite_demo/Resources/Public/Vite/ckeditor.css';
