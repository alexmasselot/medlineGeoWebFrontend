

### generating the map
Reoving Antarctic break my hear, but it's not super useful on this map

    ogr2ogr -f GeoJSON -where  "SU_A3 <> 'ATA'" src/components/HexaMap/world-110m.json ne_110m_admin_0_countries.shp 

### License

Copyright © 2014-2015. This source code is licensed under the MIT
license found in the [LICENSE.txt](https://github.com/kriasoft/react-starter-kit/blob/master/LICENSE.txt)
file. The documentation to the project is licensed under the
[CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/) license.

---
Made with ♥ by Alexandre Masselot
