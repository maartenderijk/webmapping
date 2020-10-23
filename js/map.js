const serverUrl = 'http://localhost:5500/tiles/{z}/{x}/{y}.pbf'

let map = new mapboxgl.Map({
    container: 'map',
    style: {
        "version": 8,
        "name": "Mapbox",
        "sources": {
            "esri-basemap": {
                'type': 'raster',
                'tiles': [
                    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
                ],
                'tileSize': 256,
                'attribution': 'ESRI ArcGIS Online',
            }
        },
        "glyphs": "http://fonts.openmaptiles.org/{fontstack}/{range}.pbf",

        "layers": [{
            'id': 'basemap',
            'type': 'raster',
            'source': 'esri-basemap',
            'minzoom': 0,
            'maxzoom': 20
        }
        ]

    },
    center: [5.9866112, 51.1829362],
    zoom: 12
});

map.on('load', function () {
    map.addSource('wegvakken', {
        'type': 'vector',
        'tiles': [
            'http://localhost:5500/tiles/{z}/{x}/{y}.pbf'
        ],
        'minzoom': 0,
        'maxzoom': 14
    });

    map.addLayer({
        'id': 'wegvakken_100',
        'type': 'line',
        'source': 'wegvakken',
        'source-layer': 'Prognosejaar',
        "filter": [">", ["get", "FlowVehETM"], 100],
        "minzoom": 10,
        'paint': {
            "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                12,
                3,
                22,
                1
            ],
            "line-color": [
                "interpolate",
                ["linear"],
                ["get", "FlowVehETM"],
                0,
                "hsl(134, 74%, 33%)",
                18706,
                "hsl(46, 89%, 54%)",
                37412.58,
                "hsl(0, 89%, 54%)"
            ]
        },
    });

    map.addLayer({
        'id': 'wegvakken_all',
        'type': 'line',
        'source': 'wegvakken',
        'source-layer': 'Prognosejaar',
        "minzoom": 13,
        "filter": ["<=", ["get", "FlowVehETM"], 100],
        "paint": {
            "line-color": [
                "interpolate",
                ["linear"],
                ["get", "FlowVehETM"],
                0,
                "hsl(134, 74%, 33%)",
                18706,
                "hsl(46, 89%, 54%)",
                37412.58,
                "hsl(0, 89%, 54%)"
            ]
        }
    });

    map.addLayer({
        'id': 'wegvakken_labels',
        'type': 'symbol',
        'source': 'wegvakken',
        'source-layer': 'Prognosejaar',
        "minzoom": 13,
        "filter": ["<=", ["get", "FlowVehETM"], 100],
        "layout": {
            "text-field": [
                "step",
                ["zoom"],
                ["to-string", ["get", "FlowVehETM"]],
                22,
                ["to-string", ["get", "FlowVehETM"]]
            ],
            "symbol-placement": [
                "step",
                ["zoom"],
                "line-center",
                22,
                "line-center"
            ],
            'text-font': ['Open Sans Bold'],
            "text-offset": [0, 0],
            "text-padding": 5,
            "icon-size": 1.5,
            "icon-text-fit": "both",
            "text-anchor": ["step", ["zoom"], "bottom", 22, "bottom"]
        },
        "paint": {
            "text-color": "hsl(40, 47%, 41%)"
        }

    })


})