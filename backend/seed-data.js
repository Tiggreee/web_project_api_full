const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const Card = require('./models/card');

mongoose.connect('mongodb://localhost:27017/aroundb')
  .then(async () => {
    console.log('Conectado a MongoDB');

    await User.deleteOne({ email: 'demo@around.com' });
    await User.deleteOne({ email: 'renata@example.com' });
    await Card.deleteMany({ name: { $in: ['Valle de Yosemite', 'Lago Louise', 'Montañas Calvas', 'Latemar', 'Parque Nacional de la Vanoise', 'Lago di Braies'] } });

    const demoPassword = await bcrypt.hash('demo123', 10);
    await User.create({
      name: 'Demo User',
      about: 'Test account',
      avatar: 'https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg',
      email: 'demo@around.com',
      password: demoPassword,
    });

    console.log('Usuario demo creado: demo@around.com');

    const renataPassword = await bcrypt.hash('renata123', 10);
    const renata = await User.create({
      name: 'Renata Jasso',
      about: 'Exploradora',
      avatar: 'https://i.ibb.co/zh6mBvnx/renata.jpg',
      email: 'renata@example.com',
      password: renataPassword,
    });

    console.log('Usuario Renata creado: renata@example.com');

    // Crear 6 tarjetas
    const cards = [
      {
        name: 'Valle de Yosemite',
        link: 'https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/yosemite.jpg',
        owner: renata._id,
      },
      {
        name: 'Lago Louise',
        link: 'https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/lake-louise.jpg',
        owner: renata._id,
      },
      {
        name: 'Montañas Calvas',
        link: 'https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/bald-mountains.jpg',
        owner: renata._id,
      },
      {
        name: 'Latemar',
        link: 'https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/latemar.jpg',
        owner: renata._id,
      },
      {
        name: 'Parque Nacional de la Vanoise',
        link: 'https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/vanoise.jpg',
        owner: renata._id,
      },
      {
        name: 'Lago di Braies',
        link: 'https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/lago.jpg',
        owner: renata._id,
      },
    ];

    await Card.insertMany(cards);
    console.log('6 tarjetas creadas para Renata');

    console.log('\nDatos de prueba creados exitosamente');
    console.log('Usuarios disponibles:');
    console.log('- demo@around.com / demo123');
    console.log('- renata@example.com / renata123');

    await mongoose.connection.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
