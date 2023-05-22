// Imports
const express = require('express');
const route = express.Router();

const UserController = require('../controller/UserController')
const JobController = require('../controller/JobController')
const TimerController = require('../controller/TimerController')
const LeadController = require('../controller/LeadController')
const RolesController = require('../controller/RolesController')
const TasksController = require('../controller/TasksController')
const QuickNotesController = require('../controller/QuickNotesController')
const SalesController = require('../controller/SalesController')
const ConstructionController = require('../controller/ConstructionController')

const authMiddleware = require('../middlewares/authMiddleware');
const { addOneChartOfAccounts, getAllChartOfAccounts } = require('../controller/ChartOfAccountsController');
const { getAttendanceSheet } = require('../controller/HrController');
const { GetAllRecurringTasks, AddOneRecurringTasksCategory, AddOneRecurringTasks, CheckOneRecurringTasks, DeleteOneRecurringTasks, DeleteOneTaskCategory } = require('../controller/RecurringTasksController');
const { getDashboardData } = require('../controller/DashboardController');

// Api Routes
route.get('/', (req, res)=>{
    res.send('Hello World');
});


//auth
route.get('/users/get/all', UserController.getUsers )
route.post('/users/add', UserController.createUser )
route.post('/login', UserController.login )
route.get('/users/roles/get', authMiddleware, UserController.getUserRoles )
route.get('/users/get/one/:id', UserController.getOneUser )
route.post('/users/edit/one/:id', UserController.editUser )
route.get('/users/delete/one/:id', UserController.deleteUser )
route.post('/users/one/inactive/:id', UserController.inactiveUser )

//DashBoard
route.post('/admin/dashoard/get', getDashboardData )

//job
route.get('/job/add/predata', JobController.addNewClientPreData )
route.get('/job/get/all', JobController.getJobPlanning )
route.post('/job/client/add', JobController.addNewClient )
route.post('/job/planing/edit', JobController.editJobPlanning )
route.post('/job/planing/edit/many', JobController.editManyJobPlanning )


//Clients
route.get('/clients/get/all', JobController.getAllClients )
route.get('/client/get/one/predata/:id', JobController.getOneClient )
route.post('/client/one/update/:id', JobController.updateOneClient )
route.get('/client/one/delete/:id', JobController.deleteOneClient )
route.post('/client/one/active/inactive/:id', JobController.activeInactive )

//Timer
route.get('/timer/check', authMiddleware, TimerController.getTimerState)
route.post('/timer/start_stop', authMiddleware, TimerController.startStopTimer)
route.get('/timer/report', authMiddleware, TimerController.getTimerReport)
route.post('/timer/add/manual', authMiddleware, TimerController.addManualEntry)
route.get('/timer/delete/one/:id', TimerController.deleteOneEntry)

//Leads
route.get('/leads/get/all', LeadController.getAllLeads)
route.post('/leads/add/edit', LeadController.addUpdateLead)
route.get('/leads/delete/:id', LeadController.deleteOneLead)
route.post('/leads/won/lost/:id', LeadController.WonLost)
route.get('/leads/copy/one/:id', LeadController.CopyOneLead)

//Roles
route.get('/roles/predata/get', RolesController.getRolesPreData)
route.post('/roles/add', RolesController.addNewRole)
route.post('/roles/permissoins/save', RolesController.addPermissions)
route.get('/roles/users/get', RolesController.getUserRoles)
route.post('/roles/users/assign/role', RolesController.assignRoleToUser)

//Tasks
route.post('/tasks/add/project/name', TasksController.addProjectName)
route.get('/tasks/delete/project/name/:id', TasksController.deleteProjectName)
route.get('/tasks/all/get', TasksController.getAllProjects)
route.post('/tasks/add/project', TasksController.AddOneProject)
route.post('/tasks/add/maintask/:id', TasksController.addMainTaskOfProject)
route.post('/tasks/add/subtask/:id', TasksController.addSubTaskofMainTask)
route.post('/tasks/subtask/change/iscompleted/:id', TasksController.updateSubTaskofMainTask)
route.post('/tasks/subtask/delete/one/:id', TasksController.deleteSubTaskofMainTask)
route.post('/tasks/maintask/delete/one/:id', TasksController.deleteMainTaskOfProject)
route.get('/tasks/project/delete/one/:id', TasksController.deleteOneProject)
route.post('/tasks/project/edit/one/:id', TasksController.EditOneProject)
route.get('/tasks/project/copy/one/:id', TasksController.CopyOneProject)

//Quick Notes
route.get('/quick/task/get/all', authMiddleware, QuickNotesController.GetAllQuickNotes)
route.post('/quick/task/add/one', authMiddleware, QuickNotesController.AddOneQuickNote)
route.get('/quick/task/complete/one/:id', authMiddleware, QuickNotesController.CheckOneQuickNote)

//Recurring Tasks
route.get('/recurring/task/get/all', authMiddleware, GetAllRecurringTasks)
route.post('/recurring/task/add/one/category', authMiddleware, AddOneRecurringTasksCategory)
route.post('/recurring/task/add/one/task', authMiddleware, AddOneRecurringTasks)
route.get('/recurring/task/complete/one/:id', authMiddleware, CheckOneRecurringTasks)
route.get('/recurring/task/delete/one/:id', authMiddleware, DeleteOneRecurringTasks)
route.get('/recurring/task/delete/one/category/:id', authMiddleware, DeleteOneTaskCategory)

//Sales
route.get('/sales/get/all', SalesController.getAllSale)
// route.get('/sales/get/one/:id', authMiddleware, SalesController.AddOneQuickNote)
route.post('/sales/add/one', SalesController.addSale)
route.post('/sales/edit/one/:id', SalesController.editSale)
route.get('/sales/delete/one/:id', SalesController.deleteSale)

//Chart Of Accounts
route.get('/chart_of_account/get/all', getAllChartOfAccounts)
route.post('/chart_of_account/add/one', addOneChartOfAccounts)

//HR Attendance
route.get('/hr/attendance/get/all', getAttendanceSheet)


//Construction
route.post('/construction/add/houseno', ConstructionController.addHouseNo)
route.get('/construction/delete/houseno/:id', ConstructionController.deleteHouseNo)
route.get('/construction/all/get', ConstructionController.getAllConstruction)
route.post('/construction/add/one', ConstructionController.AddOneConstruction)
route.get('/construction/task/delete/one/:id', ConstructionController.deleteOneConstruction)
route.post('/construction/task/edit/one/:id', ConstructionController.EditOneConstruction)
route.get('/construction/task/copy/one/:id', ConstructionController.CopyOneConstruction)



module.exports = route