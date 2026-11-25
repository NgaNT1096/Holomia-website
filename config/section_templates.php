<?php

/*
 * Repeatable items each section template accepts: template => kind => allowed text fields / images.
 * The editor API rejects anything not listed here.
 */
return [
    'pillars' => [
        'card' => ['fields' => ['title', 'description', 'bullet1', 'bullet2', 'bullet3', 'bullet4', 'linkLabel'], 'images' => ['image']],
    ],
    'partners' => [
        'partner' => ['fields' => ['name', 'sub'], 'images' => ['logo']],
        'counter' => ['fields' => ['value', 'suffix', 'label'], 'images' => []],
    ],
    'header' => [
        'menu' => ['fields' => ['label'], 'images' => []],
        'solution' => ['fields' => ['label', 'description'], 'images' => []],
    ],
    'locations' => [
        'location' => ['fields' => ['city', 'name', 'address', 'hours'], 'images' => []],
    ],
    'milestones' => [
        'milestone' => ['fields' => ['year', 'title', 'detail'], 'images' => []],
    ],
    'footprints' => [
        'footprint' => ['fields' => ['area', 'players', 'power', 'throughput', 'idealFor'], 'images' => []],
    ],
    'specs' => [
        'spec' => ['fields' => ['label', 'value'], 'images' => []],
    ],
    'report' => [
        'shift' => ['fields' => ['shift', 'mode', 'sessions', 'guests', 'uptime'], 'images' => []],
    ],
    'videos' => [
        'journey' => ['fields' => ['caption', 'timecode'], 'images' => ['image']],
        'arena' => ['fields' => ['caption', 'timecode'], 'images' => ['image']],
    ],
    'custom' => [
        'card' => ['fields' => ['tag', 'title', 'description'], 'images' => ['image']],
    ],
    'footer' => [
        'link' => ['fields' => ['label'], 'images' => []],
        'location' => ['fields' => ['label'], 'images' => []],
        'channel' => ['fields' => ['label'], 'images' => []],
    ],
];
