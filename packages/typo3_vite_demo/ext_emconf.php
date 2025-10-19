<?php

/**
 * Extension Manager/Repository config file for ext "typo3_vite_demo".
 */
$EM_CONF[$_EXTKEY] = [
    'title' => 'typo3-vite-demo',
    'description' => 'A TYPO3 extension demonstrating the integration of Vite as a frontend build tool.',
    'category' => 'templates',
    'constraints' => [
        'depends' => [
            'typo3' => '13.4.0-13.4.99',
            'fluid_styled_content' => '13.4.0-13.4.99',
            'rte_ckeditor' => '13.4.0-13.4.99',
        ],
        'conflicts' => [
        ],
    ],
    'autoload' => [
        'psr-4' => [
            'MatthiasPeltzer\\Typo3ViteDemo\\' => 'Classes',
        ],
    ],
    'state' => 'stable',
    'uploadfolder' => 0,
    'createDirs' => '',
    'clearCacheOnLoad' => 1,
    'author' => 'Matthias Peltzer',
    'author_email' => 'mail@mpeltzer.de',
    'author_company' => 'Matthias Peltzer',
    'version' => '1.0.0',
];
