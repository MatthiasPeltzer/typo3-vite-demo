<?php
defined('TYPO3') or die('Access denied.');

use MatthiasPeltzer\Typo3ViteDemo\Controller\VueComponentController;
use TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider;
use TYPO3\CMS\Core\Imaging\IconRegistry;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Utility\ExtensionUtility;

/***************
 * Add default RTE configuration
 */
$GLOBALS['TYPO3_CONF_VARS']['RTE']['Presets']['typo3_vite_demo'] = 'EXT:typo3_vite_demo/Configuration/RTE/Default.yaml';

/***************
 * Register Icons
 */
$iconRegistry = GeneralUtility::makeInstance(IconRegistry::class);
$iconRegistry->registerIcon(
    'typo3-vite-demo-todolist',
    SvgIconProvider::class,
    ['source' => 'EXT:typo3_vite_demo/Resources/Public/Icons/TodoList.svg']
);
