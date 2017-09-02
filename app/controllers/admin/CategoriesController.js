const Category = require('../../models').Category;
// const TodoItem = require('../models').TodoItem;

module.exports = {
    
    // List: list all todos
    // list (req, res) 
    // {
    //     return Todo
    //         .findAll({
    //             include: [{
    //                 model: TodoItem,
    //                 as: 'todoItems',
    //             }],
    //         })
    //         .then((todos) => {
    //             res.render('index', { title: 'Yo yo', message: 'Yo World!'});
    //             //res.status(200).send(todos)
    //         })
    //         .catch(error => res.status(500).send(error));
    // },

    list (req, res) 
    {
        return Category
            .findAll({})
            .then((categories) => {
                res.render('admin/categories/index', { title: 'Categories', categories: categories });
            })
            .catch(error => res.status(500).send(error));
    },

    create (req, res)
    {
        return; 
    }
    // Create: create new todo 
    // create (req, res) 
    // {
    //     return Todo
    //         .create({
    //             title: req.body.title,
    //         })
    //         .then(todo => res.status(201).send(todo))
    //         .catch(error => res.status(500).send(error));
    // },

    // // Retrieve: return a specific todo
    // retrieve (req, res)
    // {
    //     return Todo
    //         .findById(req.params.todoId, {
    //             include: [{
    //                 model: TodoItem,
    //                 as: 'todoItems',
    //             }],
    //         })
    //         .then(todo => {
    //             if (!todo) {
    //                 return res.status(404).send({message: 'Todo Not Found'});
    //             }
    //             return res.status(200).send(todo);
    //         })
    //         .catch(error => res.status(500).send(error));
    // },

    // // Update: update a single todo
    // update (req, res)
    // {
    //     return Todo
    //         .findById(req.params.todoId, {
    //             include: [{
    //                 model: TodoItem,
    //                 as: 'todoItems',
    //             }],
    //         })
    //         .then(todo => {
    //             if (!todo) {
    //                 return res.status(404).send({message: 'Todo Not Found'});
    //             }
    //             return todo
    //                 .update({
    //                     title: req.body.title,
    //                 })
    //                 .then(() => res.status(200).send(todo))
    //                 .catch((error) => res.status(500).send(error));
    //         })
    //         .catch((error) => res.status(500).send(error));
    // },

    // // Destroy: delete a todo
    // destroy (req, res)
    // {
    //     return Todo
    //         .findById(req.params.todoId)
    //         .then(todo => {
    //             if (!todo) {
    //                 return res.status(500).send({message: 'Todo Not Found'});
    //             }
    //             return todo
    //                 .destroy()
    //                 .then(() => res.status(200).send({ message: 'Todo has been deleted'}))
    //                 .catch(error => res.status(500).send(error));
    //         })
    //         .catch(error => res.status(500).send(error));
    // },





    
};