<?php

defined('TYPO3') or die();

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;
use TYPO3\CMS\Extbase\Utility\ExtensionUtility;

/***************
 * Register Vue TodoList Plugin as CType (TYPO3 13+ best practice)
 */
ExtensionUtility::registerPlugin(
    'Typo3ViteDemo',
    'TodoList',
    'LLL:EXT:typo3_vite_demo/Resources/Private/Language/locallang_db.xlf:typo3vitedemo_todolist',
    'typo3-vite-demo-todolist',
    'plugins',
    'LLL:EXT:typo3_vite_demo/Resources/Private/Language/locallang_db.xlf:typo3vitedemo_todolist.description'
);

// Add label for the CType in the columns configuration
$GLOBALS['TCA']['tt_content']['columns']['CType']['config']['items'][] = [
    'label' => 'LLL:EXT:typo3_vite_demo/Resources/Private/Language/locallang_db.xlf:typo3vitedemo_todolist',
    'value' => 'typo3vitedemo_todolist',
    'icon' => 'typo3-vite-demo-todolist',
    'group' => 'plugins',
    'description' => 'LLL:EXT:typo3_vite_demo/Resources/Private/Language/locallang_db.xlf:typo3vitedemo_todolist.description',
];

// Register icon for the CType in list view
$GLOBALS['TCA']['tt_content']['ctrl']['typeicon_classes']['typo3vitedemo_todolist'] = 'typo3-vite-demo-todolist';

// Add FlexForm field to pi_flexform column for this CType
ExtensionManagementUtility::addPiFlexFormValue(
    '*',
    'FILE:EXT:typo3_vite_demo/Configuration/FlexForms/TodoList.xml',
    'typo3vitedemo_todolist'
);

// Define showitem for the plugin CType
$GLOBALS['TCA']['tt_content']['types']['typo3vitedemo_todolist'] = [
    'showitem' => '
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:general,
            --palette--;;general,
            --palette--;;headers,
        --div--;LLL:EXT:typo3_vite_demo/Resources/Private/Language/locallang_db.xlf:flexform.todolist.tab.settings,
            pi_flexform,
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:appearance,
            --palette--;;frames,
            --palette--;;appearanceLinks,
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:language,
            --palette--;;language,
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:access,
            --palette--;;hidden,
            --palette--;;access,
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:notes,
            rowDescription,
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:extended,
    ',
];

