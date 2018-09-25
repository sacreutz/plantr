const {db} = require('./models');

const {
  vegetable: Vegetable,
  gardener: Gardener,
  plot: Plot,
  vegetable_plot: VegetablePlot,
} = db.models

let vegetables, gardeners, plots

db

  .sync({force: true})

  .then(() => {
    const vegetableData = [
      {
        name: 'carrot',
        color: 'orange'
      }
    ]
    return Vegetable.bulkCreate(vegetableData, {returning: true})

  })
//add entry for next table
    .then(createdVegetables => {
      vegetables = createdVegetables
      const [carrot] = vegetables
      const gardenerData = [
        {name: 'mcgregor',
          age: 60,
          favoriteVegetableId: carrot.id}
      ]
      return Gardener.bulkCreate(gardenerData, {returning: true})
    })
  .then(createdGardeners => {
    gardeners = createdGardeners
    const [mcmgregor] = gardeners
    const plotData = [
      {
        size: 20,
        shaded: false,
        gardenerId: mcgregor.id,
      }
    ]
    return Plot.bulkCreate(plotData, {returning: true})
  })
  .then(createdPlots => {
    plots = createdPlots
    const [mcgregorPlot] = plots
    const [carrot] = vegetables
    const vegetablePlotData = [
      {
        vegetableId: carrot.id,
        plotId: mcgregorPlot.id
      }
    ]
    return VegetablePlot.bulkCreate(vegetablePlotData)
  })
  .catch(err => {
    console.log('Disaster! Something went wrong!');
    console.log(err);

  }).finally(() => {
    db.close()
  })
