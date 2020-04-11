const Sequelize = require('sequelize')

const db = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/task-manager.db',
})


const Tasks = db.define('Task', {
    taskID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: Sequelize.STRING(30),
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING(100),
    },
    dueDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: new Date().setDate(new Date().getDate() + 1)
    },
    status: {
        type: Sequelize.DataTypes.ENUM('Incomplete', 'Complete'),
        allowNull: false,
        defaultValue: 'Incomplete',
    },
    priority: {
        type: Sequelize.DataTypes.ENUM('Low', 'Medium', 'High'),
        allowNull: false,
        defaultValue: 'Medium',
    }
})


const Notes = db.define('Note', {
    noteID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    noteDescription: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
})

Tasks.hasMany(Notes, {
    onDelete: 'CASCADE',
    hooks: true,
})
Notes.belongsTo(Tasks)


module.exports = {
    db, Tasks, Notes
}