const express = require('express')
const taskModel = require('../models/tasks')

const appRouter = express.Router()


appRouter.get('/', (req, res) => {
    taskModel.find({ state: 'pending', author: req.user._id })
        .then(tasks => {
            res.render('tasks', { tasks });
        })
        .catch(err => {
            console.log(err);
            res.send(err);
        });
});


appRouter.post('/', (req, res) => {
    const task = req.body;
    task.lastUpdateAt = new Date();
    task.author = req.user._id;

    taskModel.create(task)
        .then(() => {
            res.redirect('/tasks'); 
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
});

appRouter.put('/:id/complete', async(req, res) => {
    const taskId = req.params.id
    const userId = req.user._id

    try{
    const task = await taskModel.findOne({ _id: taskId, author: userId }).exec();
    console.log('task:', task);
    if (!task) {
      return res.status(404).json({ error: 'task not found or you are not the owner.' });
    }

    console.log('Retrieved task:', task);

    task.state = 'completed';
    await task.save();

    res.redirect("/complete");
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to update the state of the task.' });
  }
})


appRouter.delete('/:id', (req, res) => {
    const id = req.params.id
    taskModel.findByIdAndRemove(id)
        .then(task => {
            res.redirect('/tasks')
        }).catch(err => {
            console.log(err)
            res.status(500).send(err)
        })
})


module.exports = appRouter


