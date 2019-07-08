function geojson2postgis(db, tableName, geojson) {
  const features = geojson.features.map(function getRow(feature) {
    return {
      geom: db.raw(`st_setsrid(st_geomfromgeojson('${JSON.stringify(feature.geometry)}'), 4326)`),
      id: feature.id,
      name: feature.properties.name || `Trajectoire ${feature.id}`
    };
  });

  return db.schema.createTableIfNotExists(tableName, function (table) {
    table.integer('id');
    table.string('name');
    table.specificType('geom', 'geometry(GEOMETRY, 4326)').notNullable();
  }).then(function () {
    return db(tableName).insert(features);
  });
}

module.exports = geojson2postgis;
